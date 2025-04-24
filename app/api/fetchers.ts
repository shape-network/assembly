import { itemsCoreContractAbi, otomsDatabaseContractAbi } from '@/generated';
import { itemsCore, otomsDatabase } from '@/lib/addresses';
import { alchemy, rpcClient } from '@/lib/clients';
import { config } from '@/lib/config';
import { moleculeIdToTokenId, solidityMoleculeToMolecule } from '@/lib/otoms';
import { Trait, UniverseInfo } from '@/lib/types';
import { NftOrdering, OwnedNftsResponse } from 'alchemy-sdk';
import { unstable_cache } from 'next/cache';
import { readContract } from 'viem/actions';

export async function getPagedNftsForOwner({
  owner,
  contractAddresses,
  cursor,
  orderBy = NftOrdering.TRANSFERTIME,
}: {
  owner: string;
  contractAddresses?: string[];
  cursor?: string;
  orderBy?: NftOrdering;
}) {
  const resp: OwnedNftsResponse = await alchemy.nft.getNftsForOwner(owner, {
    contractAddresses,
    pageKey: cursor,
    orderBy,
  });

  return resp;
}

export async function getMoleculesByIds(tokenIds: string[]) {
  if (tokenIds.length === 0) {
    return [];
  }

  const rpc = rpcClient();
  const elements = await rpc.multicall({
    contracts: tokenIds.map(
      (tokenId) =>
        ({
          address: otomsDatabase[config.chainId],
          abi: otomsDatabaseContractAbi,
          functionName: 'getMoleculeByTokenId',
          args: [tokenId],
        }) as const
    ),
  });

  const anyErrors = elements.some((r) => r.error);

  if (anyErrors) {
    console.error(
      'Errors fetching molecules for tokenIds:',
      elements.map((r) => r.error)
    );
  }

  const results = elements
    .filter((r) => r.result && r.result.givingAtoms.length + r.result.receivingAtoms.length > 1) // Only keep elements that are molecules
    .map((r) => {
      const molecule = solidityMoleculeToMolecule(r.result!);
      return {
        tokenId: String(moleculeIdToTokenId(molecule.id)),
        molecule,
      };
    });

  return results;
}

async function _getUniverses(): Promise<UniverseInfo[]> {
  const rpc = rpcClient();
  const universeHashes = await readContract(rpc, {
    abi: otomsDatabaseContractAbi,
    address: otomsDatabase[config.chainId],
    functionName: 'activeUniverses',
    args: [],
  });

  const universes: UniverseInfo[] = await Promise.all(
    universeHashes.map(async (hash) => {
      const universeInfo = await readContract(rpc, {
        abi: otomsDatabaseContractAbi,
        address: otomsDatabase[config.chainId],
        functionName: 'universeInformation',
        args: [hash],
      });

      return {
        name: universeInfo[3],
        hash: universeInfo[2],
      };
    })
  );

  return universes;
}

export const getUniverses = unstable_cache(
  _getUniverses,
  ['otoms-universes', String(config.chainId)],
  { tags: ['universes'], revalidate: 60 * 60 * 24 }
);

export async function getTraitsForItem(itemId: bigint): Promise<Trait[]> {
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
