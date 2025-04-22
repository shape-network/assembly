import { getMoleculesByIds, getPagedNftsForOwner, getUniverses } from '@/app/api/fetchers';
import { OTOMS_ADDRESS } from '@/lib/addresses';
import { config } from '@/lib/config';
import { paths } from '@/lib/paths';
import { InventoryResponse, Molecule } from '@/lib/types';
import { universeHashToSeed } from '@/lib/utils';
import { OwnedNftsResponse } from 'alchemy-sdk';
import { NextResponse } from 'next/server';
import { z } from 'zod';

type GetInventoryInput = {
  address: string;
  cursor?: string;
};

async function getNftsForUser({ address, cursor }: GetInventoryInput): Promise<OwnedNftsResponse> {
  try {
    const response = await getPagedNftsForOwner({
      owner: address,
      contractAddresses: [OTOMS_ADDRESS[config.chainId]],
      cursor,
    });

    return response;
  } catch (error) {
    console.error('Error fetching NFTs for user:', error);
    throw new Error(`Failed to fetch NFTs for user: ${(error as Error).message || String(error)}`);
  }
}

async function getMolecules({ tokenIds }: { tokenIds: string[] }): Promise<
  {
    tokenId: string;
    image: string;
    molecule: Molecule;
  }[]
> {
  try {
    const moleculeResults = await getMoleculesByIds(tokenIds);

    return moleculeResults.map((result) => ({
      ...result,
      image: paths.images(result.molecule.identifier).chip,
    }));
  } catch (error) {
    console.error('Error fetching molecule data:', error);
    throw new Error(`Failed to fetch molecule data: ${(error as Error).message || String(error)}`);
  }
}

const GetInventoryInputSchema = z.object({
  address: z.string(),
  cursor: z.string().optional(),
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

    const { address, cursor } = result.data;

    const nfts = await getNftsForUser({ address, cursor });
    const tokenIds = nfts.ownedNfts.map((nft) => nft.tokenId);

    if (tokenIds.length === 0) {
      return NextResponse.json({
        molecules: [],
        cursor: nfts.pageKey,
      });
    }

    const elements = await getMolecules({ tokenIds });

    const universes = await getUniverses();
    const universeMap = new Map(universes.map((u) => [universeHashToSeed(u.hash), u.name]));

    const tokenIdToUniverse = new Map<string, string>();
    for (const element of elements) {
      const universeSeed = element.molecule.giving_atoms[0].structure.universe_seed;
      const universeName = universeMap.get(universeSeed) || 'Unknown';
      tokenIdToUniverse.set(element.tokenId, universeName);
    }

    const moleculesWithUniverse = nfts.ownedNfts.flatMap((nft) => {
      const universeName = tokenIdToUniverse.get(nft.tokenId) || 'Unknown';
      const moleculeData = elements.find((m) => m.tokenId === nft.tokenId);

      if (!moleculeData) return [];

      const balance = nft.balance ? Number(nft.balance) : 1;
      return Array.from({ length: balance }, (_, i) => ({
        universe: universeName,
        molecule: {
          id: `${nft.tokenId}-${i}`,
          name: moleculeData.molecule.name ?? '?',
          description: nft.description,
          traits: [],
          blueprint: [],
        },
      }));
    });

    const inventory: InventoryResponse = {
      molecules: moleculesWithUniverse
        .sort((a, b) => b.universe.localeCompare(a.universe))
        .map((item) => item.molecule),
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
