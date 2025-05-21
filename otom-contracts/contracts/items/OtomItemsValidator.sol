// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {ItemType, Trait, TraitType, PropertyCriterion, PropertyType} from "../interfaces/IOtomItemsCore.sol";
import {IOtomsDatabaseV2, Molecule} from "../interfaces/IOtomsDatabaseV2.sol";
import {IOtomItemsValidator} from "../interfaces/IOtomItemsValidator.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title OtomItemsValidator
 * @dev Helper functions for validating items
 */
contract OtomItemsValidator is IOtomItemsValidator {
    using Strings for uint256;
    using Strings for uint256;

    IOtomsDatabaseV2 public otomsDatabase;

    constructor(address _otomsDatabase) {
        otomsDatabase = IOtomsDatabaseV2(_otomsDatabase);
    }

    function stringToBytes32(string memory _string) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(_string));
    }

    /**
     * @dev Helper function to validate trait names don't conflict with reserved traits
     */
    function validateTraits(Trait[] memory _traits) external pure returns (bool) {
        for (uint256 i = 0; i < _traits.length; i++) {
            // Check for reserved trait names used in the uri function
            if (
                stringToBytes32(_traits[i].typeName) == stringToBytes32("Item ID") ||
                stringToBytes32(_traits[i].typeName) == stringToBytes32("Creator") ||
                stringToBytes32(_traits[i].typeName) == stringToBytes32("Stackable") ||
                stringToBytes32(_traits[i].typeName) == stringToBytes32("Tier")
            ) {
                return false;
            }
        }
        return true;
    }

    function meetsCriteria(
        uint256 otomTokenId,
        PropertyCriterion[] memory criteria
    ) external view returns (bool) {
        Molecule memory molecule = otomsDatabase.getMoleculeByTokenId(otomTokenId);

        for (uint256 i = 0; i < criteria.length; i++) {
            PropertyCriterion memory criterion = criteria[i];

            // Universe properties
            if (criterion.propertyType == PropertyType.UNIVERSE_HASH) {
                if (
                    criterion.checkBytes32Value && molecule.universeHash != criterion.bytes32Value
                ) {
                    return false;
                }
            }
            // Molecule properties
            else if (criterion.propertyType == PropertyType.MOLECULE_NAME) {
                if (criterion.checkStringValue) {
                    bytes32 moleculeName = keccak256(abi.encodePacked(molecule.name));

                    bytes32 stringHash = keccak256(abi.encodePacked(criterion.stringValue));

                    if (moleculeName != stringHash) {
                        return false;
                    }
                }
            } else if (criterion.propertyType == PropertyType.HARDNESS) {
                if (
                    molecule.hardness < criterion.minValue || molecule.hardness > criterion.maxValue
                ) {
                    return false;
                }
            } else if (criterion.propertyType == PropertyType.ACTIVATION_ENERGY) {
                if (
                    molecule.activationEnergy < criterion.minValue ||
                    molecule.activationEnergy > criterion.maxValue
                ) {
                    return false;
                }
            } else if (criterion.propertyType == PropertyType.MOLECULE_RADIUS) {
                if (molecule.radius < criterion.minValue || molecule.radius > criterion.maxValue) {
                    return false;
                }
            } else if (criterion.propertyType == PropertyType.ELECTRICAL_CONDUCTIVITY) {
                if (
                    molecule.electricalConductivity < criterion.minValue ||
                    molecule.electricalConductivity > criterion.maxValue
                ) {
                    return false;
                }
            } else if (criterion.propertyType == PropertyType.THERMAL_CONDUCTIVITY) {
                if (
                    molecule.thermalConductivity < criterion.minValue ||
                    molecule.thermalConductivity > criterion.maxValue
                ) {
                    return false;
                }
            } else if (criterion.propertyType == PropertyType.TOUGHNESS) {
                if (
                    molecule.toughness < criterion.minValue ||
                    molecule.toughness > criterion.maxValue
                ) {
                    return false;
                }
            } else if (criterion.propertyType == PropertyType.DUCTILITY) {
                if (
                    molecule.ductility < criterion.minValue ||
                    molecule.ductility > criterion.maxValue
                ) {
                    return false;
                }
            }
            // Atom properties (using first giving atom)
            else if (criterion.propertyType == PropertyType.METALLIC) {
                if (
                    criterion.checkBoolValue &&
                    molecule.givingAtoms[0].metallic != criterion.boolValue
                ) {
                    return false;
                }
            } else if (criterion.propertyType == PropertyType.ATOM_RADIUS) {
                if (
                    molecule.givingAtoms[0].radius < criterion.minValue ||
                    molecule.givingAtoms[0].radius > criterion.maxValue
                ) {
                    return false;
                }
            } else if (criterion.propertyType == PropertyType.VOLUME) {
                if (
                    molecule.givingAtoms[0].volume < criterion.minValue ||
                    molecule.givingAtoms[0].volume > criterion.maxValue
                ) {
                    return false;
                }
            } else if (criterion.propertyType == PropertyType.MASS) {
                if (
                    molecule.givingAtoms[0].mass < criterion.minValue ||
                    molecule.givingAtoms[0].mass > criterion.maxValue
                ) {
                    return false;
                }
            } else if (criterion.propertyType == PropertyType.DENSITY) {
                if (
                    molecule.givingAtoms[0].density < criterion.minValue ||
                    molecule.givingAtoms[0].density > criterion.maxValue
                ) {
                    return false;
                }
            } else if (criterion.propertyType == PropertyType.ELECTRONEGATIVITY) {
                if (
                    molecule.givingAtoms[0].electronegativity < criterion.minValue ||
                    molecule.givingAtoms[0].electronegativity > criterion.maxValue
                ) {
                    return false;
                }
            }
            // Nuclear properties
            else if (criterion.propertyType == PropertyType.PROTONS) {
                if (
                    molecule.givingAtoms[0].nucleus.protons < criterion.minValue ||
                    molecule.givingAtoms[0].nucleus.protons > criterion.maxValue
                ) {
                    return false;
                }
            } else if (criterion.propertyType == PropertyType.NEUTRONS) {
                if (
                    molecule.givingAtoms[0].nucleus.neutrons < criterion.minValue ||
                    molecule.givingAtoms[0].nucleus.neutrons > criterion.maxValue
                ) {
                    return false;
                }
            } else if (criterion.propertyType == PropertyType.NUCLEONS) {
                if (
                    molecule.givingAtoms[0].nucleus.nucleons < criterion.minValue ||
                    molecule.givingAtoms[0].nucleus.nucleons > criterion.maxValue
                ) {
                    return false;
                }
            } else if (criterion.propertyType == PropertyType.STABILITY) {
                if (
                    molecule.givingAtoms[0].nucleus.stability < criterion.minValue ||
                    molecule.givingAtoms[0].nucleus.stability > criterion.maxValue
                ) {
                    return false;
                }
            } else if (criterion.propertyType == PropertyType.DECAY_TYPE) {
                // This is a string comparison, but since we can't do numeric comparisons on strings,
                // we'll use keccak256 to compare the hashes
                if (criterion.checkStringValue) {
                    bytes32 decayTypeHash = keccak256(
                        abi.encodePacked(molecule.givingAtoms[0].nucleus.decayType)
                    );
                    bytes32 criterionHash = keccak256(abi.encodePacked(criterion.stringValue));

                    if (decayTypeHash != criterionHash) {
                        return false;
                    }
                }
            }
        }

        return true;
    }
}
