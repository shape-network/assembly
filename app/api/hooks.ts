'use client';

import { getMoleculesByIds } from '@/app/api/fetchers';
import { paths } from '@/lib/paths';
import { Item, Molecule, OtomItem, OwnedItem } from '@/lib/types';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import superjson from 'superjson';
import { useAccount } from 'wagmi';

export function useGetOtomItemsForUser() {
  const { address } = useAccount();

  return useInfiniteQuery<{ items: OtomItem[]; nextPageKey: string | undefined }>({
    queryKey: ['otom-items', address],
    queryFn: async ({ pageParam }) => {
      const response = await fetch(paths.api.ownedOtomItems, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, pageKey: pageParam }),
      });
      const data = await response.json();
      return { items: data.elements, nextPageKey: data.nextPageKey };
    },
    getNextPageParam: (lastPage) => lastPage.nextPageKey,
    enabled: !!address,
    initialPageParam: undefined,
  });
}

export function useGetCraftableItems() {
  return useQuery<Item[]>({
    queryKey: ['craftable-items'],
    queryFn: async () => {
      const response = await fetch(paths.api.craftableItems);
      const data = await response.json();
      return superjson.parse(data);
    },
    staleTime: 60 * 10 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

export function useGetItemsForUser() {
  const { address } = useAccount();

  return useQuery<OwnedItem[]>({
    queryKey: ['items', address],
    queryFn: async () => {
      const response = await fetch(paths.api.ownedItems, {
        method: 'POST',
        body: JSON.stringify({ address }),
      });
      const data = await response.json();
      return superjson.parse(data);
    },
    enabled: !!address,
  });
}

export function useGetMoleculesFromOtomTokenId({
  otomTokenId,
  enabled,
}: {
  otomTokenId: string;
  enabled: boolean;
}) {
  return useQuery<Molecule>({
    queryKey: ['molecules', otomTokenId],
    queryFn: async () => {
      const response = await getMoleculesByIds([otomTokenId]);
      return response[0].molecule;
    },
    enabled,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}
