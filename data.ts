import { BlueprintComponent } from '@/lib/types';

const MOCKED_MOLECULES: BlueprintComponent[] = [
  {
    id: 'ing-1',
    name: 'Ju₃',
    description: 'Pure carbon in crystalline form',
    traits: [],
    blueprint: [],
  },
  {
    id: 'ing-2',
    name: 'TiN',
    description: 'Titanium nitride compound',
    traits: [],
    blueprint: [],
  },
  {
    id: 'ing-3',
    name: 'TiC',
    description: 'Titanium carbide material',
    traits: [],
    blueprint: [],
  },
  {
    id: 'ing-4',
    name: 'WAf₂',
    description: 'Tungsten-based compound',
    traits: [],
    blueprint: [],
  },
  {
    id: 'ing-5',
    name: 'Fe₃C',
    description: 'Iron carbide structure',
    traits: [],
    blueprint: [],
  },
  {
    id: 'ing-6',
    name: 'SiO₂',
    description: 'Silicon dioxide crystal',
    traits: [],
    blueprint: [],
  },
  {
    id: 'ing-7',
    name: 'Al₂O₃',
    description: 'Aluminum oxide material',
    traits: [],
    blueprint: [],
  },
  {
    id: 'ing-8',
    name: 'Cu',
    description: 'Pure copper element',
    traits: [],
    blueprint: [],
  },
  {
    id: 'ing-9',
    name: 'Ag',
    description: 'Pure silver element',
    traits: [],
    blueprint: [],
  },
  {
    id: 'ing-10',
    name: 'CuAg',
    description: 'Copper-silver alloy',
    traits: [],
    blueprint: [],
  },
];

export const MOCKED_CRAFTABLE_ITEMS: BlueprintComponent[] = [
  {
    id: 'item-1',
    name: 'Diamond Pickaxe',
    description: 'An extremely hard and durable pickaxe',
    traits: [
      {
        power: 42.9,
        conductivity: 0.1,
        toughness: 1.82,
        speed: 0.5,
      },
    ],
    blueprint: [MOCKED_MOLECULES[0], MOCKED_MOLECULES[1], MOCKED_MOLECULES[2]],
  },
  {
    id: 'item-2',
    name: 'Tungsten Blade',
    description: 'A sharp blade with high thermal conductivity',
    traits: [
      {
        power: 36.815,
        conductivity: 0.0,
        toughness: 0.95,
        speed: 1.2,
      },
    ],
    blueprint: [MOCKED_MOLECULES[3], MOCKED_MOLECULES[4]],
  },
  {
    id: 'item-3',
    name: 'Crystal Shield',
    description: 'A transparent shield with high durability',
    traits: [
      {
        power: 28.9,
        conductivity: 0.12,
        toughness: 1.25,
        speed: 0.3,
      },
    ],
    blueprint: [MOCKED_MOLECULES[5], MOCKED_MOLECULES[6]],
  },
  {
    id: 'item-4',
    name: 'Conductive Wire',
    description: 'A flexible wire with excellent electrical conductivity',
    traits: [
      {
        power: 22.3,
        conductivity: 0.95,
        toughness: 0.75,
        speed: 0.8,
      },
    ],
    blueprint: [MOCKED_MOLECULES[7], MOCKED_MOLECULES[8], MOCKED_MOLECULES[9]],
  },
];

export const MOCKED_OWNED_ITEMS: BlueprintComponent[] = [
  {
    id: 'item-1',
    name: 'Diamond Pickaxe',
    description: 'An extremely hard and durable pickaxe',
    traits: [
      {
        power: 42.9,
        conductivity: 0.1,
        toughness: 1.82,
        speed: 0.5,
      },
    ],
    blueprint: [MOCKED_MOLECULES[0], MOCKED_MOLECULES[1], MOCKED_MOLECULES[2]],
  },
];
