import { getTraitsForItem } from '@/app/api/fetchers';
import { assemblyTrackingContractAbi } from '@/generated';
import { assemblyTracking } from '@/lib/addresses';
import { rpcClient } from '@/lib/clients';
import { config } from '@/lib/config';
import { getBlueprintForItem, HIDDEN_ITEMS } from '@/lib/items';
import { Item, ItemType } from '@/lib/types';
import { unstable_cache } from 'next/cache';
import { NextResponse } from 'next/server';
import superjson from 'superjson';

async function getCraftItems(): Promise<string> {
  const rpc = rpcClient();
  const results = await rpc.readContract({
    abi: assemblyTrackingContractAbi,
    address: assemblyTracking[config.chain.id],
    functionName: 'getAllItemsPaginated',
    args: [BigInt(0), BigInt(100)], // TODO: add proper pagination
  });

  const filteredResults = config.chain.testnet
    ? results
    : results.filter((r) => !HIDDEN_ITEMS.includes(r.id));

  const supplyResponses = await rpc.multicall({
    contracts: filteredResults.map((r) => ({
      abi: assemblyTrackingContractAbi,
      address: assemblyTracking[config.chain.id],
      functionName: 'getItemSupply',
      args: [r.id],
    })),
    allowFailure: true,
  });

  const items: Item[] = await Promise.all(
    filteredResults.map(async (r, index) => {
      const supplyResponse = supplyResponses[index];
      const supply = supplyResponse.status === 'success' ? Number(supplyResponse.result) : 0;

      return {
        id: r.id,
        name: r.name,
        description: r.description,
        creator: r.creator,
        itemType: r.itemType as ItemType,
        defaultImageUri: r.defaultImageUri,
        ethCostInWei: r.ethCostInWei,
        blueprint: await Promise.all(r.blueprint.map(getBlueprintForItem)),
        initialTraits: await getTraitsForItem(r.id),
        supply,
      };
    })
  );

  return superjson.stringify(items.sort((a, b) => b.supply - a.supply));
}

const getCachedCraftItems = unstable_cache(getCraftItems, ['craftable-items'], {
  revalidate: 5 * 60,
  tags: ['craftable-items'],
});

export async function GET() {
  const items = await getCachedCraftItems();

  return NextResponse.json(items, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  });
}
