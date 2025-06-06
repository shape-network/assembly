import { assemblyCoreContractAbi, assemblyTrackingContractAbi } from '@/generated';
import { assemblyCore, assemblyItems, assemblyTracking } from '@/lib/addresses';
import { alchemy, rpcClient } from '@/lib/clients';
import { config } from '@/lib/config';
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
    contractAddresses: [assemblyItems[config.chain.id]],
  });

  const items: (OwnedItem | null)[] = await Promise.all(
    nfts.ownedNfts.map(async (nft) => {
      try {
        const nftTokenId = BigInt(nft.tokenId);

        const rpc = rpcClient();
        const itemId = await rpc.readContract({
          abi: assemblyCoreContractAbi,
          address: assemblyCore[config.chain.id],
          functionName: 'getItemIdForToken',
          args: [nftTokenId],
        });

        if (itemId === null || typeof itemId === 'undefined') {
          console.warn(`Could not get itemId for token ${nft.tokenId}`);
          return null;
        }

        const [itemResponse, tierResponse, traitsResponse, supplyResponse] = await rpc.multicall({
          contracts: [
            {
              abi: assemblyCoreContractAbi,
              address: assemblyCore[config.chain.id],
              functionName: 'getItemByItemId',
              args: [itemId],
            },
            {
              abi: assemblyCoreContractAbi,
              address: assemblyCore[config.chain.id],
              functionName: 'nonFungibleTokenToTier',
              args: [nftTokenId],
            },
            {
              abi: assemblyCoreContractAbi,
              address: assemblyCore[config.chain.id],
              functionName: 'getTokenTraits',
              args: [nftTokenId],
            },
            {
              abi: assemblyTrackingContractAbi,
              address: assemblyTracking[config.chain.id],
              functionName: 'getItemSupply',
              args: [itemId],
            },
          ],
          allowFailure: true,
        });

        const itemResult = itemResponse.status === 'success' ? itemResponse.result : null;
        const tierResult = tierResponse.status === 'success' ? tierResponse.result : null;
        const traitsResult = traitsResponse.status === 'success' ? traitsResponse.result : null;
        const supplyResult = supplyResponse.status === 'success' ? supplyResponse.result : null;

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
        const supply = supplyResult ? Number(supplyResult) : 0;

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
          supply,
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
