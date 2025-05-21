// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {IOtomItemMutator} from "../../interfaces/IOtomItemMutator.sol";
import {Trait, TraitType} from "../../interfaces/IOtomItemsCore.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {IOtomsDatabase, Molecule} from "../../interfaces/IOtomsDatabase.sol";

/**
 * @title GenericMutator
 */
contract GenericMutator is IOtomItemMutator {
    using Strings for uint256;

    IOtomsDatabase public immutable OTOMS_DATABASE;

    constructor(address _otomsDatabase) {
        OTOMS_DATABASE = IOtomsDatabase(_otomsDatabase);
    }

    function calculateTier(
        uint256,
        uint256[] memory variableOtomIds,
        uint256[] memory,
        Trait[] memory baseTraits,
        uint256 paymentAmount
    ) external view override returns (uint256 tierLevel, Trait[] memory modifiedTraits) {
        if (paymentAmount == 0 && variableOtomIds.length == 0) {
            return (0, baseTraits);
        }

        // Calculate a score based on the variable components
        uint256 totalMass = 0;

        // Example: Sum the hardness values of all variable otoms
        for (uint256 i = 0; i < variableOtomIds.length; i++) {
            uint256 totalMassOfMolecule = 0;
            Molecule memory molecule = OTOMS_DATABASE.getMoleculeByTokenId(variableOtomIds[i]);

            for (uint256 j = 0; j < molecule.givingAtoms.length; j++) {
                totalMassOfMolecule += molecule.givingAtoms[j].mass;
            }

            for (uint256 j = 0; j < molecule.receivingAtoms.length; j++) {
                totalMassOfMolecule += molecule.receivingAtoms[j].mass;
            }

            totalMass += totalMassOfMolecule;
        }

        // Determine tier based on score (1-7)
        if (totalMass > 300 * 1e18) {
            tierLevel = 7;
        } else if (totalMass > 250 * 1e18) {
            tierLevel = 6;
        } else if (totalMass > 200 * 1e18) {
            tierLevel = 5;
        } else if (totalMass > 150 * 1e18) {
            tierLevel = 4;
        } else if (totalMass > 100 * 1e18) {
            tierLevel = 3;
        } else if (totalMass > 50 * 1e18) {
            tierLevel = 2;
        } else {
            tierLevel = 1;
        }

        // Create modified traits with scaling based on tier
        modifiedTraits = new Trait[](baseTraits.length);

        // Copy and modify base traits
        for (uint256 i = 0; i < baseTraits.length; i++) {
            modifiedTraits[i] = baseTraits[i];

            if (Strings.equal(baseTraits[i].typeName, "Tier")) {
                uint256 tier = tierLevel;
                modifiedTraits[i].valueNumber = tier;
                modifiedTraits[i].valueString = tier.toString();
                modifiedTraits[i].traitType = TraitType.NUMBER;
            }
        }

        return (tierLevel, modifiedTraits);
    }

    function onItemUse(
        uint256,
        address,
        Trait[] calldata currentTraits,
        bytes calldata
    ) external pure override returns (Trait[] memory updatedTraits, bool shouldDestroy) {
        shouldDestroy = false;

        updatedTraits = currentTraits;

        // Find trait called "Tier" and decrement it by 1
        for (uint256 i = 0; i < currentTraits.length; i++) {
            if (Strings.equal(currentTraits[i].typeName, "Tier")) {
                updatedTraits[i].valueNumber--;
                updatedTraits[i].valueString = updatedTraits[i].valueNumber.toString();

                if (updatedTraits[i].valueNumber == 0) {
                    shouldDestroy = true;
                }
            } else {
                updatedTraits[i] = currentTraits[i];
            }
        }

        return (updatedTraits, shouldDestroy);
    }

    function onTransfer(
        uint256,
        address from,
        address to,
        uint256,
        Trait[] calldata
    ) external pure override returns (bool allowed) {
        // Only allow transfers from or to the zero address
        allowed = from == address(0) || to == address(0);
    }

    function onCraft(
        address _crafter,
        uint256,
        uint256 _amount,
        uint256[] calldata,
        uint256[] calldata,
        bytes calldata
    ) external pure override returns (bool allowed, bool requiresItemsOrOtoms) {
        // Only allow crafting from a valid address
        allowed = _crafter != address(0);
        // Only allow crafting 1 item at a time
        requiresItemsOrOtoms = _amount == 1;
    }
}
