import { assemblyCoreContractAbi } from '@/generated';
import { assemblyCore, assemblyItems } from '@/lib/addresses';
import { alchemy, rpcClient } from '@/lib/clients';
import { config } from '@/lib/config';
import { NextResponse } from 'next/server';
import superjson from 'superjson';
import { isAddress } from 'viem';
import { z } from 'zod';

const schema = z.object({
  address: z.string().refine(isAddress, {
    message: 'Invalid address',
  }),
});

export async function POST(request: Request) {
  const body = await request.json();
  const result = schema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: 'Invalid address' }, { status: 400 });
  }

  const { address } = result.data;

  const nfts = await alchemy.nft.getNftsForOwner(address, {
    contractAddresses: [assemblyItems[config.chainId]],
  });

  const rpc = rpcClient();
  const itemIds = await Promise.all(
    nfts.ownedNfts.map(async (nft) => {
      const itemId = await rpc.readContract({
        abi: assemblyCoreContractAbi,
        address: assemblyCore[config.chainId],
        functionName: 'getItemIdForToken',
        args: [BigInt(nft.tokenId)],
      });

      return itemId;
    })
  );

  const items = await Promise.all(
    itemIds.map(async (itemId) => {
      const item = await rpc.readContract({
        abi: assemblyCoreContractAbi,
        address: assemblyCore[config.chainId],
        functionName: 'getItemByItemId',
        args: [itemId],
      });

      return { ...item, initialTraits: [] };
    })
  );

  const serialized = superjson.stringify(items);

  return NextResponse.json(serialized);
}
