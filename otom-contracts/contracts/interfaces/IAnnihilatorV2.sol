// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

interface IAnnihilatorV2 {
    event Annihilated(address indexed annihilatedBy, uint256[] atomIds, uint256 energyAmount);

    error NoAtoms();
    error InputTooLarge();
    error NegativeResult();
    error InsufficientBalance(uint256 tokenId);
    error InvalidUniverseHash();
    error InvalidBPS();
    error NoItemProvided();
    error ItemNotEnabled();
    error AnnihilationLimitExceeded();

    event OtomsSet(address indexed otoms);
    event EnergySet(address indexed energy);
    event NucleonsExponentSet(int256 indexed exponentWad);
    event MaxNucleonsSet(uint256 indexed maxNucleons);
    event OtomItemsCoreSet(address indexed otomItemsCore);
    event AllowedItemIdSet(uint256 indexed itemId, bool indexed allowed);
    event AnnihilationLimitSet(uint256 indexed annihilationLimit);

    function annihilate(uint256[] memory atomIds) external returns (uint256);

    function raiseToNucleonsExponent(uint256 x) external view returns (uint256);

    function setEnergy(address _energy) external;

    function setOtoms(address _otoms) external;

    function setNucleonsExponent(int256 _exponentWad) external;
}
