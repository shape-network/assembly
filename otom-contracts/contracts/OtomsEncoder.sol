// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import {Atom, Molecule, UniverseInformation, AtomStructure, Nucleus} from "./interfaces/IOtoms.sol";
import {IOtomsEncoder} from "./interfaces/IOtomsEncoder.sol";

contract OtomsEncoder is IOtomsEncoder, Ownable {
    constructor() Ownable(msg.sender) {}

    function encodeMolecule(Molecule memory _newMolecule) public pure returns (bytes32) {
        bytes32[] memory encodedGivingAtoms = new bytes32[](_newMolecule.givingAtoms.length);
        for (uint256 i = 0; i < _newMolecule.givingAtoms.length; i++) {
            encodedGivingAtoms[i] = encodeAtom(_newMolecule.givingAtoms[i]);
        }

        bytes32[] memory encodedReceivingAtoms = new bytes32[](_newMolecule.receivingAtoms.length);
        for (uint256 i = 0; i < _newMolecule.receivingAtoms.length; i++) {
            encodedReceivingAtoms[i] = encodeAtom(_newMolecule.receivingAtoms[i]);
        }

        bytes32 encodedBond = keccak256(
            abi.encode(_newMolecule.bond.strength, _newMolecule.bond.bondType)
        );

        return
            _encodeMoleculeData(
                _newMolecule,
                encodedBond,
                encodedGivingAtoms,
                encodedReceivingAtoms
            );
    }

    // Done in parts to prevent stack-too-deep error
    function _encodeMoleculeData(
        Molecule memory _molecule,
        bytes32 _encodedBond,
        bytes32[] memory _encodedGivingAtoms,
        bytes32[] memory _encodedReceivingAtoms
    ) internal pure returns (bytes32) {
        bytes32 firstPart = _encodeMoleculeDataPart1(_molecule);
        bytes32 secondPart = _encodeMoleculeDataPart2(
            _molecule,
            _encodedBond,
            _encodedGivingAtoms,
            _encodedReceivingAtoms
        );
        return keccak256(abi.encode(firstPart, secondPart));
    }

    function _encodeMoleculeDataPart1(Molecule memory _molecule) internal pure returns (bytes32) {
        return
            keccak256(
                abi.encode(
                    _molecule.id,
                    _molecule.universeHash,
                    _molecule.activationEnergy,
                    _molecule.radius,
                    _molecule.name,
                    _molecule.electricalConductivity
                )
            );
    }

    function _encodeMoleculeDataPart2(
        Molecule memory _molecule,
        bytes32 _encodedBond,
        bytes32[] memory _encodedGivingAtoms,
        bytes32[] memory _encodedReceivingAtoms
    ) internal pure returns (bytes32) {
        return
            keccak256(
                abi.encode(
                    _molecule.thermalConductivity,
                    _molecule.toughness,
                    _molecule.hardness,
                    _molecule.ductility,
                    _encodedBond,
                    keccak256(abi.encodePacked(_encodedGivingAtoms)),
                    keccak256(abi.encodePacked(_encodedReceivingAtoms))
                )
            );
    }

    function encodeAtom(Atom memory _newAtom) public pure returns (bytes32) {
        return
            keccak256(
                abi.encode(
                    _newAtom.radius,
                    _newAtom.volume,
                    _newAtom.mass,
                    _newAtom.density,
                    _newAtom.electronegativity,
                    _newAtom.name,
                    _newAtom.series,
                    _newAtom.metallic,
                    _newAtom.periodicTableX,
                    _newAtom.periodicTableY,
                    encodeStructure(_newAtom.structure),
                    encodeNucleus(_newAtom.nucleus)
                )
            );
    }

    function encodeStructure(AtomStructure memory _structure) public pure returns (bytes32) {
        return
            keccak256(
                abi.encode(
                    _structure.universeHash,
                    _structure.depth,
                    _structure.distance,
                    _structure.distanceIndex,
                    _structure.shell,
                    keccak256(abi.encodePacked(_structure.totalInOuter)),
                    keccak256(abi.encodePacked(_structure.emptyInOuter)),
                    keccak256(abi.encodePacked(_structure.filledInOuter)),
                    keccak256(abi.encodePacked(_structure.ancestors))
                )
            );
    }

    function encodeNucleus(Nucleus memory _nucleus) public pure returns (bytes32) {
        return
            keccak256(
                abi.encode(
                    _nucleus.protons,
                    _nucleus.neutrons,
                    _nucleus.nucleons,
                    _nucleus.stability,
                    _nucleus.decayType
                )
            );
    }

    function encodeUniverseInformation(
        UniverseInformation memory _universeInformation
    ) public pure returns (bytes32) {
        return
            keccak256(
                abi.encode(
                    _universeInformation.energyFactorBps,
                    _universeInformation.active,
                    _universeInformation.seedHash,
                    _universeInformation.name
                )
            );
    }

    function getSeedUniverseMessageHash(
        UniverseInformation memory _universeInformation,
        uint256 expiry,
        address sender
    ) public pure returns (bytes32) {
        return
            keccak256(abi.encode(encodeUniverseInformation(_universeInformation), expiry, sender));
    }

    function getMiningMessageHash(
        Molecule memory _newAtom,
        bytes32 _miningHash,
        string memory _tokenUri,
        bytes32 _universeHash,
        uint256 expiry,
        address sender
    ) public pure returns (bytes32) {
        return
            keccak256(
                abi.encode(
                    encodeMolecule(_newAtom),
                    _miningHash,
                    _tokenUri,
                    _universeHash,
                    expiry,
                    sender
                )
            );
    }

    function getMiningHash(
        address _chemist,
        bytes32 _universeHash,
        uint256 _nonce
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_chemist, _universeHash, _nonce));
    }

    function getMultipleMiningHashes(
        address _chemist,
        bytes32 _universeHash,
        uint256 _startingNonce,
        uint256 _count
    ) public pure returns (bytes32[] memory) {
        bytes32[] memory hashes = new bytes32[](_count);
        for (uint256 i = 0; i < _count; i++) {
            hashes[i] = getMiningHash(_chemist, _universeHash, _startingNonce + i);
        }
        return hashes;
    }
}
