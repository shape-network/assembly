import { getMoleculesByIds, getPagedNftsForOwner } from '@/app/api/fetchers';
import { otomsCore } from '@/lib/addresses';
import { config } from '@/lib/config';
import { Molecule, OtomItem } from '@/lib/types';
import { isNotNullish, universeSeedToHash } from '@/lib/utils';
import { OwnedNftsResponse } from 'alchemy-sdk';
import { NextResponse } from 'next/server';
import { isAddress } from 'viem';
import { z } from 'zod';

async function getNftsForUser({
  address,
  pageKey,
}: z.infer<typeof GetInventoryInputSchema>): Promise<OwnedNftsResponse> {
  try {
    const response = await getPagedNftsForOwner({
      owner: address,
      contractAddresses: [otomsCore[config.chain.id]],
      cursor: pageKey,
    });

    return response;
  } catch (error) {
    console.error('Error fetching NFTs for user:', error);
    throw new Error(`Failed to fetch NFTs for user: ${(error as Error).message || String(error)}`);
  }
}

async function getMolecules({
  tokenIds,
}: {
  tokenIds: string[];
}): Promise<{ tokenId: string; molecule: Molecule }[]> {
  try {
    const moleculeResults = await getMoleculesByIds(tokenIds);

    return moleculeResults;
  } catch (error) {
    console.error('Error fetching molecule data:', error);
    throw new Error(`Failed to fetch molecule data: ${(error as Error).message || String(error)}`);
  }
}

const GetInventoryInputSchema = z.object({
  address: z.string().refine(isAddress, { message: 'Invalid address' }),
  pageKey: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = GetInventoryInputSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.errors },
        { status: 400 }
      );
    }

    const { address, pageKey } = result.data;

    const nfts = await getNftsForUser({ address, pageKey });
    const tokenIds = nfts.ownedNfts.map((nft) => nft.tokenId);

    if (tokenIds.length === 0) {
      return NextResponse.json({
        molecules: [],
        cursor: nfts.pageKey,
      });
    }

    const elements = await getMolecules({ tokenIds });

    const otomItems = nfts.ownedNfts.flatMap((nft) => {
      const moleculeData = elements.find((m) => m.tokenId === nft.tokenId);

      if (!moleculeData) {
        console.warn(`No molecule data found for tokenId: ${nft.tokenId}`);
        return [];
      }

      try {
        const balance = nft.balance ? Number(nft.balance) : 1;
        return Array.from({ length: balance }, (_, i) => ({
          ...moleculeData.molecule,
          id: `${nft.tokenId}-${i}`,
          tokenId: nft.tokenId,
          name: moleculeData.molecule.name,
          universeHash: universeSeedToHash(
            moleculeData.molecule.giving_atoms[0].structure.universe_seed
          ),
        }));
      } catch (error) {
        console.error(`Error processing otom item for tokenId ${nft.tokenId}:`, error);
        return [];
      }
    });

    const inventory: { elements: OtomItem[]; cursor?: string } = {
      elements: otomItems.filter(isNotNullish),
      cursor: nfts.pageKey,
    };

    return NextResponse.json(inventory);
  } catch (error) {
    console.error('Error in inventory route:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: (error as Error).message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}
