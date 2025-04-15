import { BlueprintComponent } from '@/lib/types';

const MOCKED_MOLECULES: BlueprintComponent[] = [
  {
    id: 'ing-1',
    name: 'Ju₃',
    description: 'Pure carbon in crystalline form',
    properties: [{ power: 20.5, toughness: 3.0, speed: 0.2 }],
    blueprint: [],
  },
  {
    id: 'ing-2',
    name: 'TiN',
    description: 'Titanium nitride compound',
    properties: [{ power: 18.2, toughness: 2.1, speed: 0.4 }],
    blueprint: [],
  },
  {
    id: 'ing-3',
    name: 'TiC',
    description: 'Titanium carbide material',
    properties: [{ power: 17.8, toughness: 2.3, speed: 0.3 }],
    blueprint: [],
  },
  {
    id: 'ing-4',
    name: 'WAf₂',
    description: 'Tungsten-based compound',
    properties: [{ power: 19.1, 'electrical-conductivity': 0.2, speed: 0.5 }],
    blueprint: [],
  },
  {
    id: 'ing-5',
    name: 'Fe₃C',
    description: 'Iron carbide structure',
    properties: [{ power: 16.4, 'electrical-conductivity': 0.6, speed: 0.8 }],
    blueprint: [],
  },
  {
    id: 'ing-6',
    name: 'SiO₂',
    description: 'Silicon dioxide crystal',
    properties: [{ power: 15.0, 'electrical-conductivity': 0.05, speed: 0.3 }],
    blueprint: [],
  },
  {
    id: 'ing-7',
    name: 'Al₂O₃',
    description: 'Aluminum oxide material',
    properties: [{ power: 16.7, 'electrical-conductivity': 0.1, speed: 0.4 }],
    blueprint: [],
  },
  {
    id: 'ing-8',
    name: 'Cu',
    description: 'Pure copper element',
    properties: [{ power: 12.5, 'electrical-conductivity': 0.9, speed: 0.7 }],
    blueprint: [],
  },
  {
    id: 'ing-9',
    name: 'Ag',
    description: 'Pure silver element',
    properties: [{ power: 14.2, 'electrical-conductivity': 0.95, speed: 0.6 }],
    blueprint: [],
  },
  {
    id: 'ing-10',
    name: 'CuAg',
    description: 'Copper-silver alloy',
    properties: [{ power: 13.8, 'electrical-conductivity': 0.93, speed: 0.65 }],
    blueprint: [],
  },
];

export const MOCKED_ITEMS: BlueprintComponent[] = [
  {
    id: 'item-1',
    name: 'Diamond Pickaxe',
    description: 'An extremely hard and durable pickaxe',
    properties: [
      {
        power: 42.9,
        'electrical-conductivity': 0.1,
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
    properties: [
      {
        power: 36.815,
        'electrical-conductivity': 0.0,
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
    properties: [
      {
        power: 28.9,
        'electrical-conductivity': 0.12,
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
    properties: [
      {
        power: 22.3,
        'electrical-conductivity': 0.95,
        toughness: 0.75,
        speed: 0.8,
      },
    ],
    blueprint: [MOCKED_MOLECULES[7], MOCKED_MOLECULES[8], MOCKED_MOLECULES[9]],
  },
];
