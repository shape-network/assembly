import { otomItemsCoreContractAbi } from '@/generated';
import { otomItems, otomItemsCore } from '@/lib/addresses';
import { alchemy, rpcClient } from '@/lib/clients';
import { config } from '@/lib/config';
import { fetchItemCraftCount } from '@/lib/subgraph';
import { ItemType, OwnedItem } from '@/lib/types';
import { isNotNullish } from '@/lib/utils';
import { NextResponse } from 'next/server';
import superjson from 'superjson';
import { isAddress } from 'viem';
import { z } from 'zod';

const schema = z.object({
  address: z.string().refine(isAddress, { message: 'Invalid address' }),
});

export async function POST(request: Request) {
  const body = await request.json();
  const result = schema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const { address } = result.data;

  const nfts = await alchemy.nft.getNftsForOwner(address, {
    contractAddresses: [otomItems[config.chain.id]],
  });

  const items: (OwnedItem | null)[] = await Promise.all(
    nfts.ownedNfts.map(async (nft) => {
      try {
        const nftTokenId = BigInt(nft.tokenId);

        const rpc = rpcClient();
        const itemId = await rpc.readContract({
          abi: otomItemsCoreContractAbi,
          address: otomItemsCore[config.chain.id],
          functionName: 'getItemIdForToken',
          args: [nftTokenId],
        });

        if (itemId === null || typeof itemId === 'undefined') {
          console.warn(`Could not get itemId for token ${nft.tokenId}`);
          return null;
        }

        const [itemResponse, tierResponse, traitsResponse] = await rpc.multicall({
          contracts: [
            {
              abi: otomItemsCoreContractAbi,
              address: otomItemsCore[config.chain.id],
              functionName: 'getItemByItemId',
              args: [itemId],
            },
            {
              abi: otomItemsCoreContractAbi,
              address: otomItemsCore[config.chain.id],
              functionName: 'nonFungibleTokenToTier',
              args: [nftTokenId],
            },
            {
              abi: otomItemsCoreContractAbi,
              address: otomItemsCore[config.chain.id],
              functionName: 'getTokenTraits',
              args: [nftTokenId],
            },
          ],
          allowFailure: true,
        });

        // Fetch craft count from subgraph
        const craftCount = await fetchItemCraftCount(itemId);

        const itemResult = itemResponse.status === 'success' ? itemResponse.result : null;
        const tierResult = tierResponse.status === 'success' ? tierResponse.result : null;
        const traitsResult = traitsResponse.status === 'success' ? traitsResponse.result : null;

        if (itemResult === null) {
          console.error(
            `An error occurred while fetching item ${nft.tokenId}:`,
            itemResponse.error
          );
          return null;
        }

        const tier = Number(tierResult);
        const usagesTrait = traitsResult?.find((trait) => trait.typeName === 'Usages Remaining');
        const usagesRemaining = usagesTrait ? Number(usagesTrait.valueNumber) : null;

        return {
          ...itemResult,
          blueprint: [],
          itemType: itemResult.itemType as ItemType,
          tokenId: nft.tokenId,
          tier,
          usagesRemaining,
          initialTraits: traitsResult
            ? traitsResult?.map((t) => ({
                name: t.typeName,
                value: t.valueString ?? t.valueNumber.toString(),
              }))
            : [],
          supply: craftCount,
          balance: Number(nft.balance),
        };
      } catch (e) {
        console.error(e);
        return null;
      }
    })
  );

  const response = items.filter(isNotNullish);

  return new NextResponse(superjson.stringify(response));
}
