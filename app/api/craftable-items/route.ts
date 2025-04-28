import { getTraitsForItem } from '@/app/api/fetchers';
import { assemblyTrackingContractAbi } from '@/generated';
import { assemblyTracking } from '@/lib/addresses';
import { rpcClient } from '@/lib/clients';
import { config } from '@/lib/config';
import { ComponentType, Item, ItemType } from '@/lib/types';
import { NextResponse } from 'next/server';
import superjson from 'superjson';

async function getCraftItems(): Promise<Item[]> {
  const rpc = rpcClient();

  const items = await rpc.readContract({
    abi: assemblyTrackingContractAbi,
    address: assemblyTracking[config.chainId],
    functionName: 'getAllItemsPaginated',
    args: [BigInt(0), BigInt(100)],
  });

  return items.map((r) => ({
    id: r.id,
    name: r.name,
    description: r.description,
    creator: r.creator,
    itemType: r.itemType as ItemType,
    defaultImageUri: r.defaultImageUri,
    ethCostInWei: r.ethCostInWei,
    blueprint: r.blueprint.map((b) => ({
      componentType: b.componentType as ComponentType,
      itemIdOrOtomTokenId: b.itemIdOrOtomTokenId,
      amount: Number(b.amount),
      criteria: b.criteria.map((c) => ({
        propertyType: c.propertyType,
        minValue: Number(c.minValue),
        maxValue: Number(c.maxValue),
        boolValue: c.boolValue,
        checkBoolValue: c.checkBoolValue,
        stringValue: c.stringValue,
        checkStringValue: c.checkStringValue,
      })),
    })),
    initialTraits: [],
  }));
}

export async function GET() {
  const items = await getCraftItems();

  const itemsWithTraits = await Promise.all(
    items.map(async (item) => {
      const traits = await getTraitsForItem(item.id);
      return { ...item, traits };
    })
  );

  const serialized = superjson.stringify(itemsWithTraits);
  return NextResponse.json(serialized);
}
