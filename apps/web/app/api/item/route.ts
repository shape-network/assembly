import { assemblyCoreContractAbi } from '@/generated';
import { assemblyCore } from '@/lib/addresses';
import { rpcClient } from '@/lib/clients';
import { config } from '@/lib/config';
import { ItemType, OwnedItem } from '@/lib/types';
import { NextResponse } from 'next/server';
import superjson from 'superjson';

import { z } from 'zod';

const schema = z.object({
  itemTokenId: z.coerce.bigint(),
  itemId: z.coerce.bigint(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const result = schema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const { itemTokenId, itemId } = result.data;

  const rpc = rpcClient();

  try {
    const [itemResponse, tierResponse, traitsResponse] = await rpc.multicall({
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
      ],
      allowFailure: true,
    });

    const itemResult = itemResponse.status === 'success' ? itemResponse.result : null;
    const tierResult = tierResponse.status === 'success' ? tierResponse.result : null;
    const traitsResult = traitsResponse.status === 'success' ? traitsResponse.result : null;

    if (!itemResult) {
      console.error(`An error occurred while fetching item ${itemId}:`, itemResponse.error);
      return NextResponse.json(
        { error: `Item ${itemId} not found or could not be retrieved` },
        { status: 404 }
      );
    }

    const tier = Number(tierResult);
    const usagesTrait = traitsResult?.find((trait) => trait.typeName === 'Usages Remaining');
    const usagesRemaining = usagesTrait ? Number(usagesTrait.valueNumber) : null;

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
    };

    return new NextResponse(superjson.stringify(item));
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'An error occurred while fetching item' }, { status: 500 });
  }
}
