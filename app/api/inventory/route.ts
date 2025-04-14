import { getMoleculesByIds, getPagedNftsForOwner } from '@/app/api/fetchers';
import { OTOMS_ADDRESS } from '@/lib/addresses';
import { config } from '@/lib/config';
import { paths } from '@/lib/paths';
import { InventoryResponse, Molecule } from '@/lib/types';
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

    const filteredNfts = nfts.ownedNfts.filter(
      (nft) => nft.contract.address.toLowerCase() === OTOMS_ADDRESS[config.chainId].toLowerCase()
    );

    const tokenIds = filteredNfts.map((nft) => nft.tokenId);

    if (tokenIds.length === 0) {
      return NextResponse.json({
        molecules: [],
        cursor: nfts.pageKey,
      });
    }

    const molecules = await getMolecules({ tokenIds });

    const inventory: InventoryResponse = {
      molecules: filteredNfts
        .filter((nft) => molecules.some((molecule) => molecule.tokenId === nft.tokenId))
        .flatMap((nft) => {
          const balance = Number(nft.balance);
          return Array.from({ length: balance }, (_, i) => {
            const moleculeData = molecules.find((m) => m.tokenId === nft.tokenId);

            return {
              id: `${nft.tokenId}-${i}`,
              nft,
              molecule: moleculeData
                ? {
                    ...moleculeData.molecule,
                    image: moleculeData.image,
                    tokenId: moleculeData.tokenId,
                  }
                : null,
            };
          });
        }),
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
