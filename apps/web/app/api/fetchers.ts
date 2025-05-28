import { assemblyCoreContractAbi, otomsDatabaseContractAbi } from '@/generated';
import { assemblyCore, otomsDatabase } from '@/lib/addresses';
import { alchemy, rpcClient } from '@/lib/clients';
import { config } from '@/lib/config';
import { moleculeIdToTokenId, solidityMoleculeToMolecule } from '@/lib/otoms';
import { retryWithBackoff } from '@/lib/retry';
import { Trait, UniverseInfo } from '@/lib/types';
import { isNotNullish } from '@/lib/utils';
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
  return retryWithBackoff(
    async () => {
      const resp: OwnedNftsResponse = await alchemy.nft.getNftsForOwner(owner, {
        contractAddresses,
        pageKey: cursor,
        orderBy,
      });

      return resp;
    },
    { maxRetries: 3, baseDelay: 1000, maxDelay: 5000 }
  );
}

export async function getMoleculesByIds(tokenIds: string[]) {
  if (tokenIds.length === 0) {
    return [];
  }

  const elements = await retryWithBackoff(
    async () => {
      const rpc = rpcClient();
      return rpc.multicall({
        contracts: tokenIds.map(
          (tokenId) =>
            ({
              address: otomsDatabase[config.chain.id],
              abi: otomsDatabaseContractAbi,
              functionName: 'getMoleculeByTokenId',
              args: [tokenId],
            }) as const
        ),
      });
    },
    { maxRetries: 2, baseDelay: 500, maxDelay: 2000 }
  );

  const results = elements
    .map((r, index) => {
      if (r.error) {
        console.error(`Error fetching molecule for tokenId ${tokenIds[index]}:`, r.error);
        return null;
      }

      if (!r.result) {
        console.warn(`No result for tokenId ${tokenIds[index]}`);
        return null;
      }

      try {
        const molecule = solidityMoleculeToMolecule(r.result);
        return {
          tokenId: String(moleculeIdToTokenId(molecule.id)),
          molecule,
        };
      } catch (error) {
        console.error(`Error processing molecule for tokenId ${tokenIds[index]}:`, error);
        return null;
      }
    })
    .filter(isNotNullish);

  return results;
}

async function _getUniverses(): Promise<UniverseInfo[]> {
  const rpc = rpcClient();
  const universeHashes = await readContract(rpc, {
    abi: otomsDatabaseContractAbi,
    address: otomsDatabase[config.chain.id],
    functionName: 'activeUniverses',
    args: [],
  });

  const universes: UniverseInfo[] = await Promise.all(
    universeHashes.map(async (hash) => {
      const universeInfo = await readContract(rpc, {
        abi: otomsDatabaseContractAbi,
        address: otomsDatabase[config.chain.id],
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
  ['otoms-universes', String(config.chain.id)],
  { tags: ['universes'], revalidate: 60 * 60 * 24 }
);

export async function getTraitsForItem(itemId: bigint): Promise<Trait[]> {
  const rpc = rpcClient();
  const traits = await rpc.readContract({
    abi: assemblyCoreContractAbi,
    address: assemblyCore[config.chain.id],
    functionName: 'getTokenTraits',
    args: [itemId],
  });

  return traits.map((t) => ({
    name: t.typeName,
    value: t.valueString ?? t.valueNumber.toString(),
  }));
}
