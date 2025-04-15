'use client';

import { paths } from '@/lib/paths';
import { CraftableItem, CraftableMolecule, InventoryResponse } from '@/lib/types';
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
  return useQuery<CraftableItem[]>({
    queryKey: ['craftable-items'],
    queryFn: async () => {
      return MOCK_ITEMS;
    },
  });
}

const MOCK_ITEMS: CraftableItem[] = [
  {
    id: 'item-1',
    name: 'Diamond Pickaxe',
    description: 'An extremely hard and durable pickaxe for mining operations',
    properties: [
      {
        'activation-energy': 14.75,
        radius: 1.29,
        'bond-type': 'covalent',
        'bond-strength': 42.9,
        'giving-atoms': ['C', 'Ti'],
        'receiving-atoms': ['C', 'Ti', 'N'],
        'electrical-conductivity': 0.1,
        'thermal-conductivity': 0.89,
        toughness: 1.82,
        hardness: 3.65,
        ductility: 0.02,
      },
    ],
    recipe: ['C₃', 'TiN', 'TiC'],
  },
  {
    id: 'item-2',
    name: 'Tungsten Blade',
    description: 'A sharp blade with high thermal conductivity',
    properties: [
      {
        'activation-energy': 11.181,
        radius: 1.766,
        'bond-type': 'covalent',
        'bond-strength': 36.815,
        'giving-atoms': ['W', 'Af'],
        'receiving-atoms': ['Af'],
        'electrical-conductivity': 0.0,
        'thermal-conductivity': 0.727,
        toughness: 0.95,
        hardness: 1.83,
        ductility: 0,
      },
    ],
    recipe: ['WAf₂', 'Fe₃C'],
  },
  {
    id: 'item-3',
    name: 'Crystal Shield',
    description: 'A transparent shield with high durability',
    properties: [
      {
        'activation-energy': 8.45,
        radius: 2.11,
        'bond-type': 'ionic',
        'bond-strength': 28.9,
        'giving-atoms': ['Si', 'O'],
        'receiving-atoms': ['O', 'Al'],
        'electrical-conductivity': 0.12,
        'thermal-conductivity': 0.33,
        toughness: 1.25,
        hardness: 2.75,
        ductility: 0,
      },
    ],
    recipe: ['SiO₂', 'Al₂O₃'],
  },
  {
    id: 'item-4',
    name: 'Conductive Wire',
    description: 'A flexible wire with excellent electrical conductivity',
    properties: [
      {
        'activation-energy': 5.62,
        radius: 1.38,
        'bond-type': 'metallic',
        'bond-strength': 22.3,
        'giving-atoms': ['Cu', 'Ag'],
        'receiving-atoms': ['Cu'],
        'electrical-conductivity': 0.95,
        'thermal-conductivity': 0.85,
        toughness: 0.75,
        hardness: 0.65,
        ductility: 0.9,
      },
    ],
    recipe: ['Cu', 'Ag', 'CuAg'],
  },
];
