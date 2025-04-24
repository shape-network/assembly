import { itemsCoreContractAbi } from '@/generated';
import { itemsCore } from '@/lib/addresses';
import { rpcClient } from '@/lib/clients';
import { config } from '@/lib/config';
import { Item, Trait } from '@/lib/types';
import { NextResponse } from 'next/server';
import superjson from 'superjson';

async function getCraftItems(): Promise<Item[]> {
  const rpc = rpcClient();

  const nextItemId = await rpc.readContract({
    abi: itemsCoreContractAbi,
    address: itemsCore[config.chainId],
    functionName: 'getNextItemId',
    args: [],
  });

  const itemsLength = Number(nextItemId - BigInt(1));

  const responses = await Promise.all(
    Array.from({ length: itemsLength }, async (_, i) => {
      const result = await rpc.readContract({
        abi: itemsCoreContractAbi,
        address: itemsCore[config.chainId],
        functionName: 'items',
        args: [BigInt(i + 1)],
      });

      return { result, id: BigInt(i + 1) };
    })
  );

  return responses.map((r) => ({
    id: r.id,
    name: r.result[0],
    description: r.result[1],
    creator: r.result[2],
    defaultImageUri: r.result[4],
    traits: [],
    blueprint: [],
  }));
}

async function getTraitsForItem(itemId: bigint): Promise<Trait[]> {
  const rpc = rpcClient();
  const traits = await rpc.readContract({
    abi: itemsCoreContractAbi,
    address: itemsCore[config.chainId],
    functionName: 'getTokenTraits',
    args: [itemId],
  });

  return traits.map((t) => ({
    name: t.typeName,
    value: t.valueString ?? t.valueNumber.toString(),
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
