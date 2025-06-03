import { getTraitsForItem } from '@/app/api/fetchers';
import { assemblyCoreContractAbi, assemblyTrackingContractAbi } from '@/generated';
import { assemblyCore, assemblyTracking } from '@/lib/addresses';
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

  const mintCountResponses = await rpc.multicall({
    contracts: filteredResults.map((r) => ({
      abi: assemblyCoreContractAbi,
      address: assemblyCore[config.chain.id],
      functionName: 'itemMintCount' as const,
      args: [r.id],
    })),
    allowFailure: true,
  });

  const items = await Promise.all(
    filteredResults.map(async (r, index) => {
      const mintCountResponse = mintCountResponses[index];
      const mintCount =
        mintCountResponse.status === 'success' ? Number(mintCountResponse.result) : 0;

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
        mintCount,
      };
    })
  );

  return items.sort((a, b) => b.mintCount - a.mintCount);
}

export async function GET() {
  const items = await getCraftItems();
  const serialized = superjson.stringify(items);
  return NextResponse.json(serialized);
}
