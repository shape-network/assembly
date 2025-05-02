'use client';

import { paths } from '@/lib/paths';
import { Item, OtomItem } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import superjson from 'superjson';
import { useAccount } from 'wagmi';

export function useGetOtomItemsForUser() {
  const { address } = useAccount();

  return useQuery<OtomItem[]>({
    queryKey: ['otom-items', address],
    queryFn: async () => {
      if (!address) return [];

      const response = await fetch(paths.api.ownedOtomItems, {
        method: 'POST',
        body: JSON.stringify({ address }),
      });

      const data = await response.json();
      return data.elements || [];
    },
    enabled: !!address,
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
  });
}

export function useGetItemsForUser() {
  const { address } = useAccount();

  return useQuery<Item[]>({
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
