// SPDX-License-Identifier: MIT

pragma solidity ^0.8.26;

import {IOtomsDatabase, Molecule, UniverseInformation, Atom, AtomStructure, Nucleus} from "./IOtomsDatabase.sol";

interface IOtomsDatabaseV2 is IOtomsDatabase {
    function getMoleculesDiscoveredPaginated(
        bytes32 universeHash,
        uint256 offset,
        uint256 limit
    ) external view returns (Molecule[] memory molecules, uint256 total);
}
