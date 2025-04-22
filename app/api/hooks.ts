'use client';

import { MOCKED_CRAFTABLE_ITEMS, MOCKED_OWNED_ITEMS } from '@/data';
import { paths } from '@/lib/paths';
import { InventoryResponse, Item, Molecule } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';

export function useGetMoleculesForUser() {
  const { address } = useAccount();

  // TODO: add pagination, sort by universe
  return useQuery<Molecule[]>({
    queryKey: ['molecules', address],
    queryFn: async () => {
      if (!address) return [];

      const response = await fetch(paths.api.ownedMolecules, {
        method: 'POST',
        body: JSON.stringify({ address }),
      });

      const data = (await response.json()) as InventoryResponse;
      return data.molecules || [];
    },
    enabled: !!address,
  });
}

export function useGetCraftableItems() {
  return useQuery<Item[]>({
    queryKey: ['craftable-items'],
    queryFn: async () => {
      return MOCKED_CRAFTABLE_ITEMS;
    },
  });
}

export function useGetItemsForUser() {
  const { address } = useAccount();

  return useQuery<Item[]>({
    queryKey: ['items', address],
    queryFn: async () => {
      return MOCKED_OWNED_ITEMS;
    },
    enabled: !!address,
  });
}
