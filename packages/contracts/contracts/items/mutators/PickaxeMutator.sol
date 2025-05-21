// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Ownable2Step, Ownable} from "@openzeppelin/contracts/access/Ownable2Step.sol";
import {IOtomItemMutator} from "../../interfaces/IOtomItemMutator.sol";
import {Trait, TraitType} from "../../interfaces/IOtomItemsCore.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {IOtomsDatabase, Molecule} from "../../interfaces/IOtomsDatabase.sol";

error MissingTiers();
error UsagesRemainingIsZero();

/**
 * @title PickaxeMutator
 * @dev A mutator to be used with the pickaxe item on otom.xyz
 */
contract PickaxeMutator is IOtomItemMutator, Ownable2Step {
    using Strings for uint256;

    mapping(uint256 => uint256) public tierToUsesRemaining;

    IOtomsDatabase public immutable OTOMS_DATABASE;

    constructor(
        address _otomsDatabase,
        uint256[] memory _tierToUsesRemaining
    ) Ownable(msg.sender) {
        if (_tierToUsesRemaining.length != 5) revert MissingTiers();

        OTOMS_DATABASE = IOtomsDatabase(_otomsDatabase);

        for (uint256 i = 0; i < _tierToUsesRemaining.length; i++) {
            tierToUsesRemaining[i + 1] = _tierToUsesRemaining[i];
        }
    }

    function setTierToUsesRemaining(
        uint256[] memory _tierToUsesRemaining
    ) external onlyOwner {
        if (_tierToUsesRemaining.length != 5) revert MissingTiers();

        for (uint256 i = 0; i < _tierToUsesRemaining.length; i++) {
            tierToUsesRemaining[i + 1] = _tierToUsesRemaining[i];
        }
    }

    function calculateTier(
        uint256,
        uint256[] memory variableOtomIds,
        uint256[] memory,
        Trait[] memory baseTraits,
        uint256 paymentAmount
    )
        external
        view
        override
        returns (uint256 tierLevel, Trait[] memory modifiedTraits)
    {
        if (paymentAmount == 0 && variableOtomIds.length == 0) {
            return (0, baseTraits);
        }

        // Calculate a score based on the variable components
        uint256 totalMass = 0;

        // Example: Sum the hardness values of all variable otoms
        for (uint256 i = 0; i < variableOtomIds.length; i++) {
            uint256 totalMassOfMolecule = 0;
            Molecule memory molecule = OTOMS_DATABASE.getMoleculeByTokenId(
                variableOtomIds[i]
            );

            for (uint256 j = 0; j < molecule.givingAtoms.length; j++) {
                totalMassOfMolecule += molecule.givingAtoms[j].mass;
            }

            for (uint256 j = 0; j < molecule.receivingAtoms.length; j++) {
                totalMassOfMolecule += molecule.receivingAtoms[j].mass;
            }

            totalMass += totalMassOfMolecule;
        }

        // Determine tier based on score (1-6)
        if (totalMass >= 251 * 1e18) {
            tierLevel = 5;
        } else if (totalMass >= 209 * 1e18) {
            tierLevel = 4;
        } else if (totalMass >= 101 * 1e18) {
            tierLevel = 3;
        } else if (totalMass >= 51 * 1e18) {
            tierLevel = 2;
        } else {
            tierLevel = 1;
        }

        // Create modified traits with scaling based on tier
        modifiedTraits = new Trait[](baseTraits.length);

        // Copy and modify base traits
        for (uint256 i = 0; i < baseTraits.length; i++) {
            modifiedTraits[i] = baseTraits[i];

            if (Strings.equal(baseTraits[i].typeName, "Mining Power")) {
                uint256 miningPower = modifiedTraits[i].valueNumber * tierLevel;
                modifiedTraits[i].valueNumber = miningPower;
                modifiedTraits[i].valueString = miningPower.toString();
                modifiedTraits[i].traitType = TraitType.NUMBER;
            }

            if (Strings.equal(baseTraits[i].typeName, "Usages Remaining")) {
                uint256 usesRemaining = tierToUsesRemaining[tierLevel];
                modifiedTraits[i].valueNumber = usesRemaining;
                modifiedTraits[i].valueString = usesRemaining.toString();
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
    ) external pure override returns (Trait[] memory, bool) {
        bool shouldDestroy = false;

        Trait[] memory updatedTraits = currentTraits;

        // Find trait called "Usages Remaining" and decrement it
        for (uint256 i = 0; i < currentTraits.length; i++) {
            if (Strings.equal(currentTraits[i].typeName, "Usages Remaining")) {
                if (updatedTraits[i].valueNumber == 0) {
                    revert UsagesRemainingIsZero();
                }

                updatedTraits[i].valueNumber--;
                updatedTraits[i].valueString = updatedTraits[i]
                    .valueNumber
                    .toString();

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
        address,
        address,
        uint256,
        Trait[] calldata
    ) external pure override returns (bool) {
        return true;
    }

    function onCraft(
        address,
        uint256,
        uint256,
        uint256[] calldata,
        uint256[] calldata,
        bytes calldata
    ) external pure override returns (bool, bool) {
        return (true, true);
    }
}
