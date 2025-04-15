'use client';

import { MOCKED_ITEMS } from '@/data';
import { paths } from '@/lib/paths';
import { BlueprintComponent, CraftableMolecule, InventoryResponse } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';

export function useGetMoleculesForUser() {
  const { address } = useAccount();

  // TODO: add pagination
  return useQuery<CraftableMolecule[]>({
    queryKey: ['molecules', address],
    queryFn: async () => {
      if (!address) return [];

      const response = await fetch(paths.api.inventory, {
        method: 'POST',
        body: JSON.stringify({ address }),
      });

      const data = (await response.json()) as InventoryResponse;
      return data.molecules || [];
    },
  });
}

export function useGetCraftableItems() {
  return useQuery<BlueprintComponent[]>({
    queryKey: ['craftable-items'],
    queryFn: async () => {
      return MOCKED_ITEMS;
    },
  });
}
