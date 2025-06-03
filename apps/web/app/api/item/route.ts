import { assemblyCoreContractAbi } from '@/generated';
import { assemblyCore } from '@/lib/addresses';
import { rpcClient } from '@/lib/clients';
import { config } from '@/lib/config';
import { ItemType, OwnedItem } from '@/lib/types';
import { unstable_cache } from 'next/cache';
import { NextResponse } from 'next/server';
import superjson from 'superjson';

import { z } from 'zod';

const schema = z.object({
  itemTokenId: z.coerce.bigint(),
  itemId: z.coerce.bigint(),
});

async function getItem(itemTokenId: bigint, itemId: bigint): Promise<string> {
  const rpc = rpcClient();

  const [itemResponse, tierResponse, traitsResponse, mintCountResponse] = await rpc.multicall({
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
        args: [itemTokenId],
      },
      {
        abi: assemblyCoreContractAbi,
        address: assemblyCore[config.chain.id],
        functionName: 'getTokenTraits',
        args: [itemTokenId],
      },
      {
        abi: assemblyCoreContractAbi,
        address: assemblyCore[config.chain.id],
        functionName: 'itemMintCount',
        args: [itemId],
      },
    ],
    allowFailure: true,
  });

  const itemResult = itemResponse.status === 'success' ? itemResponse.result : null;
  const tierResult = tierResponse.status === 'success' ? tierResponse.result : null;
  const traitsResult = traitsResponse.status === 'success' ? traitsResponse.result : null;
  const mintCountResult = mintCountResponse.status === 'success' ? mintCountResponse.result : null;

  if (!itemResult) {
    throw new Error(`Item ${itemId} not found or could not be retrieved`);
  }

  const tier = Number(tierResult);
  const usagesTrait = traitsResult?.find((trait) => trait.typeName === 'Usages Remaining');
  const usagesRemaining = usagesTrait ? Number(usagesTrait.valueNumber) : null;
  const mintCount = mintCountResult ? Number(mintCountResult) : 0;

  const item: OwnedItem = {
    ...itemResult,
    blueprint: [],
    itemType: itemResult.itemType as ItemType,
    tokenId: itemTokenId.toString(),
    tier,
    usagesRemaining,
    initialTraits: traitsResult
      ? traitsResult?.map((t) => ({
          name: t.typeName,
          value: t.valueString ?? t.valueNumber.toString(),
        }))
      : [],
    mintCount,
  };

  return superjson.stringify(item);
}

function getCachedItem(itemTokenId: bigint, itemId: bigint) {
  return unstable_cache(
    () => getItem(itemTokenId, itemId),
    ['item', `item-${itemId}`, `token-${itemTokenId}`],
    {
      revalidate: 5 * 60,
      tags: ['item', `item-${itemId}`, `token-${itemTokenId}`],
    }
  )();
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = schema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const { itemTokenId, itemId } = result.data;

  try {
    const item = await getCachedItem(itemTokenId, itemId);
    return new NextResponse(item, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'An error occurred while fetching item' }, { status: 500 });
  }
}
