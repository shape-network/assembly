// SPDX-License-Identifier: MIT

pragma solidity ^0.8.26;

import {Molecule, Atom, AtomStructure, Nucleus, UniverseInformation} from "./IOtoms.sol";

interface IOtomsEncoder {
    function encodeMolecule(Molecule memory _newMolecule) external pure returns (bytes32);
    function encodeAtom(Atom memory _newAtom) external pure returns (bytes32);
    function encodeStructure(AtomStructure memory _newStructure) external pure returns (bytes32);
    function encodeNucleus(Nucleus memory _newNucleus) external pure returns (bytes32);
    function encodeUniverseInformation(
        UniverseInformation memory _universeInformation
    ) external pure returns (bytes32);

    function getSeedUniverseMessageHash(
        UniverseInformation memory _universeInformation,
        uint256 expiry,
        address sender
    ) external view returns (bytes32);

    function getMiningMessageHash(
        Molecule memory _newAtom,
        bytes32 _miningHash,
        string memory _tokenUri,
        bytes32 _universeHash,
        uint256 expiry,
        address sender
    ) external view returns (bytes32);

    function getMiningHash(
        address _chemist,
        bytes32 _universeHash,
        uint256 _nonce
    ) external pure returns (bytes32);

    function getMultipleMiningHashes(
        address _chemist,
        bytes32 _universeHash,
        uint256 _startingNonce,
        uint256 _count
    ) external pure returns (bytes32[] memory);
}
