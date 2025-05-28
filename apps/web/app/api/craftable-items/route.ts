import { getTraitsForItem } from '@/app/api/fetchers';
import { assemblyTrackingContractAbi } from '@/generated';
import { assemblyTracking } from '@/lib/addresses';
import { rpcClient } from '@/lib/clients';
import { config } from '@/lib/config';
import { getBlueprintForItem } from '@/lib/items';
import { Item, ItemType } from '@/lib/types';
import { NextResponse } from 'next/server';
import superjson from 'superjson';

async function getCraftItems(): Promise<Item[]> {
  const rpc = rpcClient();
  const results = await rpc.readContract({
    abi: assemblyTrackingContractAbi,
    address: assemblyTracking[config.chain.id],
    functionName: 'getAllItemsPaginated',
    args: [BigInt(0), BigInt(50)], // TODO: add proper pagination
  });

  const filteredResults = config.chain.testnet
    ? results
    : results.filter((r) => r.id === BigInt(2));

  const items = await Promise.all(
    filteredResults.map(async (r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      creator: r.creator,
      itemType: r.itemType as ItemType,
      defaultImageUri: r.defaultImageUri,
      ethCostInWei: r.ethCostInWei,
      blueprint: await Promise.all(r.blueprint.map(getBlueprintForItem)),
      initialTraits: await getTraitsForItem(r.id),
    }))
  );

  return items;
}

export async function GET() {
  const items = await getCraftItems();
  const serialized = superjson.stringify(items);
  return NextResponse.json(serialized);
}
