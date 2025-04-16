import { Hex } from 'viem';

// Assembly-related types

export type Trait = {
  power?: number;
  toughness?: number;
  conductivity?: number;
  speed?: number;
};

export type BlueprintComponent = {
  id: string;
  name: string;
  description?: string;
  traits: Trait[];
  blueprint: BlueprintComponent[];
};

export type InventoryResponse = {
  molecules: BlueprintComponent[];
  cursor?: string;
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
  name: string;
  identifier: string;
  giving_atoms: Atom[];
  receiving_atoms: Atom[];
  bond: Bond;
  activation_energy: number;
  radius: number;
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
