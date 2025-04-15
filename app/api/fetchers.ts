import { otomsDatabaseContractAbi } from '@/generated';
import { DATABASE_ADDRESS } from '@/lib/addresses';
import { alchemy, rpcClient } from '@/lib/clients';
import { config } from '@/lib/config';
import { moleculeIdToTokenId, solidityMoleculeToMolecule } from '@/lib/otoms';
import { NftOrdering, OwnedNftsResponse } from 'alchemy-sdk';
import { Address } from 'viem';

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
          address: DATABASE_ADDRESS[config.chainId] as Address,
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
        tokenId: String(moleculeIdToTokenId(molecule.identifier)),
        molecule,
      };
    });

  return results;
}
