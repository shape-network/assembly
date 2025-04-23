import { Atom, Molecule, SolidityCompatibleAtom, SolidityCompatibleMolecule } from '@/lib/types';
import { encodeAbiParameters, formatUnits, keccak256, parseAbiParameters } from 'viem';

export function moleculeIdToTokenId(moleculeId: string) {
  return BigInt(keccak256(encodeAbiParameters(parseAbiParameters('string'), [moleculeId])));
}

export const fromWad = (n: bigint) => Number(formatUnits(n, 18));

export function solidityMoleculeToMolecule(molecule: SolidityCompatibleMolecule): Molecule {
  return {
    id: molecule.id,
    name: molecule.name,
    giving_atoms: molecule.givingAtoms.map(solidityAtomToAtom),
    electrical_conductivity: fromWad(molecule.electricalConductivity),
    thermal_conductivity: fromWad(molecule.thermalConductivity),
    toughness: fromWad(molecule.toughness),
    hardness: fromWad(molecule.hardness),
    ductility: fromWad(molecule.ductility),
  };
}

function solidityAtomToAtom(a: SolidityCompatibleAtom): Atom {
  return {
    name: a.name,
    series: a.series,
    structure: {
      universe_seed: a.structure.universeHash.startsWith('0x')
        ? a.structure.universeHash.slice(2)
        : a.structure.universeHash,
      depth: fromWad(a.structure.depth),
      distance: fromWad(a.structure.distance),
      distance_index: fromWad(a.structure.distanceIndex),
      shell: fromWad(a.structure.shell),
      total_in_outer: a.structure.totalInOuter.map(fromWad),
      empty_in_outer: a.structure.emptyInOuter.map(fromWad),
      filled_in_outer: a.structure.filledInOuter.map(fromWad),
      ancestors: a.structure.ancestors.map(fromWad),
    },
    nucleus: {
      protons: fromWad(a.nucleus.protons),
      neutrons: fromWad(a.nucleus.neutrons),
      nucleons: fromWad(a.nucleus.nucleons),
      stability: fromWad(a.nucleus.stability),
      decay_type: a.nucleus.decayType,
    },
    radius: fromWad(a.radius),
    volume: fromWad(a.volume),
    mass: fromWad(a.mass),
    density: fromWad(a.density),
    electronegativity: fromWad(a.electronegativity),
    metallic: a.metallic,
    pt_pos: [fromWad(a.periodicTableX), fromWad(a.periodicTableY)],
  };
}
