import { Address, Hex } from 'viem';

// Assembly-related types

export type ComponentType = 'otom' | 'variable_otom' | 'fungible_item' | 'non_fungible_item';

export type Criteria = {
  propertyType: number;
  minValue?: number;
  maxValue?: number;
  boolValue?: boolean;
  checkBoolValue?: boolean;
  stringValue?: string;
  checkStringValue?: boolean;
};

type RawCriteria = {
  propertyType: number;
  minValue?: bigint;
  maxValue?: bigint;
  boolValue?: boolean;
  checkBoolValue?: boolean;
  stringValue?: string;
  checkStringValue?: boolean;
};

export type BlueprintComponent = {
  itemIdOrOtomTokenId: bigint;
  amount: number;
  componentType: ComponentType;
  name: string;
  criteria: Criteria[];
};

export type RawBlueprintComponent = {
  componentType: number;
  itemIdOrOtomTokenId: bigint;
  amount: bigint;
  criteria: readonly RawCriteria[];
};

/** 0: FUNGIBLE, 1: NON_FUNGIBLE */
export type ItemType = 0 | 1;

export type Item = {
  id: bigint;
  name: string;
  description: string;
  creator: Address;
  itemType: ItemType;
  blueprint: BlueprintComponent[];
  initialTraits: Trait[];
  ethCostInWei: bigint;
  defaultImageUri: string;
  supply: number;
  mutatorContract?: Address;
  frozen?: boolean;
};

export type OwnedItem = Item & {
  tokenId: string;
  tier: number | null;
  usagesRemaining: number | null;
};

export type Trait = { name: string; value: string | number };

export type OtomItem = Molecule & {
  universeHash: Hex;
  tokenId: string;
};

// Otom-related types

type SolidityCompatibleBond = {
  strength: bigint;
  bondType: string;
};

export type SolidityCompatibleAtom = {
  name: string;
  series: string;
  structure: {
    universeHash: Hex;
    depth: bigint;
    distance: bigint;
    distanceIndex: bigint;
    shell: bigint;
    totalInOuter: readonly bigint[];
    emptyInOuter: readonly bigint[];
    filledInOuter: readonly bigint[];
    ancestors: readonly bigint[];
  };
  nucleus: {
    protons: bigint;
    neutrons: bigint;
    nucleons: bigint;
    stability: bigint;
    decayType: string;
  };
  radius: bigint;
  volume: bigint;
  mass: bigint;
  density: bigint;
  electronegativity: bigint;
  metallic: boolean;
  periodicTableX: bigint;
  periodicTableY: bigint;
};

export type SolidityCompatibleMolecule = {
  id: string;
  universeHash: Hex;
  name: string;
  givingAtoms: readonly SolidityCompatibleAtom[];
  receivingAtoms: readonly SolidityCompatibleAtom[];
  bond: SolidityCompatibleBond;
  activationEnergy: bigint;
  radius: bigint;
  electricalConductivity: bigint;
  thermalConductivity: bigint;
  toughness: bigint;
  hardness: bigint;
  ductility: bigint;
};

export type Nucleus = {
  protons: number;
  neutrons: number;
  nucleons: number;
  stability: number;
  decay_type: string;
};

export interface TNodeData {
  universe_seed: string;
  depth: number;
  distance: number;
  distance_index: number;
  shell: number;
  total_in_outer: number[];
  empty_in_outer: number[];
  filled_in_outer: number[];
  ancestors: number[];
}

export type Atom = {
  name: string;
  series: string;
  structure: TNodeData;
  nucleus: Nucleus;
  radius: number;
  volume: number;
  mass: number;
  density: number;
  electronegativity: number;
  metallic: boolean;
  pt_pos: number[]; // vector
};

export type Bond = {
  strength: number;
  type: string;
};

export type Molecule = {
  id: string;
  name: string;
  giving_atoms: Atom[];
  receiving_atoms: Atom[];
  electrical_conductivity: number;
  thermal_conductivity: number;
  toughness: number;
  hardness: number;
  ductility: number;
};

export type BareMolecule = {
  identifier: string;
  name: string;
  giving_atoms: Atom[];
  receiving_atoms: Atom[];
  bond: Bond;
  activation_energy: number;
  radius: number;
  tokenId: string;
  electrical_conductivity: number;
  thermal_conductivity: number;
  toughness: number;
  hardness: number;
  ductility: number;
};

export type UniverseInfo = {
  name: string;
  hash: Hex;
};
