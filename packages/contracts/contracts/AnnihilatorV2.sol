// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Ownable2Step, Ownable} from "@openzeppelin/contracts/access/Ownable2Step.sol";

import {FixedPointMathLib} from "solady/src/utils/FixedPointMathLib.sol";

import {IOtoms} from "./interfaces/IOtoms.sol";
import {Atom, Molecule} from "./interfaces/IOtomsDatabase.sol";

import {IEnergy} from "./interfaces/IEnergy.sol";
import {IAnnihilatorV2} from "./interfaces/IAnnihilatorV2.sol";

import {IOtomItemsCore, Trait} from "./interfaces/IOtomItemsCore.sol";

contract AnnihilatorV2 is IAnnihilatorV2, Ownable2Step, ReentrancyGuard {
    IOtoms public otoms;

    IEnergy public energy;

    int256 public exponentWad;

    uint256 public maxNucleons;

    uint256 public annihilationLimit;

    IOtomItemsCore public otomItemsCore;

    mapping(uint256 => bool) public allowedItemIds;

    constructor() Ownable(msg.sender) {
        exponentWad = 1_200_000_000_000_000_000;
        maxNucleons = 1000 * 1e18;
        annihilationLimit = 5;
    }

    ////////////////////////////////// PUBLIC CORE ////////////////////////////////

    function annihilate(uint256[] memory _atomIds) external nonReentrant returns (uint256) {
        if (_atomIds.length == 0) revert NoAtoms();
        if (_atomIds.length > annihilationLimit) revert AnnihilationLimitExceeded();
        return _annihilate(_atomIds);
    }

    function annihilateWithItem(
        uint256[] memory _atomIds,
        uint256 _itemTokenId
    ) external nonReentrant returns (uint256) {
        if (_atomIds.length == 0) revert NoAtoms();
        if (_itemTokenId == 0) revert NoItemProvided();

        uint256 effectiveAnnihilationLimit = annihilationLimit;

        uint256 itemId = otomItemsCore.getItemIdForToken(_itemTokenId);

        if (itemId == 0 || !allowedItemIds[itemId]) revert ItemNotEnabled();

        Trait memory annihilationTrait = otomItemsCore.getTokenTrait(
            _itemTokenId,
            "Annihilation Power"
        );

        uint256 annihilationPower = annihilationTrait.valueNumber;

        otomItemsCore.consumeItem(_itemTokenId, 1, msg.sender);

        effectiveAnnihilationLimit = annihilationPower;

        if (_atomIds.length > effectiveAnnihilationLimit) revert AnnihilationLimitExceeded();

        return _annihilate(_atomIds);
    }

    ////////////////////////////////// PUBLIC UTILS ////////////////////////////////

    /// @notice this function raises a number to the power of the nucleons exponent
    /// @dev this function assumes that nucleonCount is an 18 decimal number (wad)
    /// @param nucleonCount the number to raise to the power of the nucleons exponent
    /// @return the result of the exponentiation
    function raiseToNucleonsExponent(uint256 nucleonCount) public view returns (uint256) {
        if (nucleonCount == 0) return 0;

        if (nucleonCount > maxNucleons) revert InputTooLarge();

        // nucleonCount^exponentWad
        int256 resultWad = FixedPointMathLib.powWad(int256(nucleonCount), exponentWad);

        // Check for negative result
        if (resultWad < 0) revert NegativeResult();

        // Convert back to uint256
        return uint256(resultWad);
    }

    ////////////////////////////////// ADMIN CORE ////////////////////////////////

    function setOtoms(address _otoms) external onlyOwner {
        otoms = IOtoms(_otoms);
        emit OtomsSet(_otoms);
    }

    function setEnergy(address _energy) external onlyOwner {
        energy = IEnergy(_energy);
        emit EnergySet(_energy);
    }

    function setNucleonsExponent(int256 _exponentWad) external onlyOwner {
        exponentWad = _exponentWad;
        emit NucleonsExponentSet(_exponentWad);
    }

    function setMaxNucleons(uint256 _maxNucleons) external onlyOwner {
        maxNucleons = _maxNucleons;
        emit MaxNucleonsSet(_maxNucleons);
    }

    function setOtomItemsCore(address _otomItemsCore) external onlyOwner {
        otomItemsCore = IOtomItemsCore(_otomItemsCore);
        emit OtomItemsCoreSet(_otomItemsCore);
    }

    function setAllowedItemId(uint256 _itemId, bool _allowed) external onlyOwner {
        allowedItemIds[_itemId] = _allowed;
        emit AllowedItemIdSet(_itemId, _allowed);
    }

    function setAnnihilationLimit(uint256 _annihilationLimit) external onlyOwner {
        annihilationLimit = _annihilationLimit;
        emit AnnihilationLimitSet(_annihilationLimit);
    }

    ////////////////////////////////// PRIVATE CORE ////////////////////////////////

    function _annihilate(uint256[] memory _atomIds) private returns (uint256) {
        uint256 energyAmount = _measureNucleonsAndAnnihilate(_atomIds);

        energy.transform(msg.sender, energyAmount);

        emit Annihilated(msg.sender, _atomIds, energyAmount);

        return energyAmount;
    }

    function _measureNucleonsAndAnnihilate(uint256[] memory _atomIds) private returns (uint256) {
        uint256 energyAmount = 0;

        bytes32 _universeHash = otoms.database().getMoleculeByTokenId(_atomIds[0]).universeHash;

        uint256 energyFactorBps = otoms
            .database()
            .getUniverseInformation(_universeHash)
            .energyFactorBps;

        for (uint256 i = 0; i < _atomIds.length; i++) {
            if (otoms.balanceOf(msg.sender, _atomIds[i]) == 0)
                revert InsufficientBalance(_atomIds[i]);

            Molecule memory molecule = otoms.database().getMoleculeByTokenId(_atomIds[i]);

            if (molecule.universeHash != _universeHash) revert InvalidUniverseHash();

            uint256 receivingAtomNucleons = _getAtomsNucleons(molecule.receivingAtoms);

            uint256 givingAtomNucleons = _getAtomsNucleons(molecule.givingAtoms);

            energyAmount += (
                decreaseByBps(
                    raiseToNucleonsExponent(receivingAtomNucleons + givingAtomNucleons),
                    energyFactorBps
                )
            );

            otoms.annihilate(_atomIds[i], msg.sender);
        }

        return energyAmount;
    }

    function _getAtomsNucleons(Atom[] memory _atoms) private pure returns (uint256) {
        uint256 nucleons = 0;
        for (uint256 i = 0; i < _atoms.length; i++) {
            nucleons += _atoms[i].nucleus.nucleons;
        }
        return nucleons;
    }

    /// @notice Decreases a number by a specified percentage using basis points
    /// @param amount The number to decrease
    /// @param bps The basis points to decrease by (1 bps = 0.01%, 10000 bps = 100%)
    /// @return The amount after applying the percentage decrease
    function decreaseByBps(uint256 amount, uint256 bps) private pure returns (uint256) {
        if (bps >= 10000) revert InvalidBPS();
        return (amount * (10000 - bps)) / 10000;
    }
}
