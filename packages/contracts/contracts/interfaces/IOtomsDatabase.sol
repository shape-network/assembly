// SPDX-License-Identifier: MIT

pragma solidity ^0.8.26;

struct UniverseInformation {
    uint256 energyFactorBps;
    bool active;
    bytes32 seedHash;
    string name;
}

struct Molecule {
    string id;
    string name;
    bytes32 universeHash;
    uint256 activationEnergy;
    uint256 radius;
    Bond bond;
    Atom[] givingAtoms;
    Atom[] receivingAtoms;
    uint256 electricalConductivity;
    uint256 thermalConductivity;
    uint256 toughness;
    uint256 hardness;
    uint256 ductility;
}

struct Bond {
    uint256 strength;
    string bondType;
}

struct Atom {
    uint256 radius;
    uint256 volume;
    uint256 mass;
    uint256 density;
    uint256 electronegativity;
    bool metallic;
    string name;
    string series;
    uint256 periodicTableX;
    uint256 periodicTableY;
    AtomStructure structure;
    Nucleus nucleus;
}

struct AtomStructure {
    bytes32 universeHash;
    uint256 depth;
    uint256 distance;
    uint256 distanceIndex;
    uint256 shell;
    uint256[] totalInOuter;
    uint256[] emptyInOuter;
    uint256[] filledInOuter;
    uint256[] ancestors;
}

struct Nucleus {
    uint256 protons;
    uint256 neutrons;
    uint256 nucleons;
    uint256 stability;
    string decayType;
}

interface IOtomsDatabase {
    error TokenUriNotSet();
    error NotOperator();
    error AlreadySeeded();
    error MoleculeNotDiscovered();
    error InvalidUniverseSeed();
    error InvalidUniverseName();
    error UniverseNameTaken();
    event MoleculeDiscovered(
        bytes32 indexed universeHash,
        uint256 indexed tokenId,
        address indexed discoveredBy
    );
    event EncoderUpdated(address indexed newEncoder);
    event OperatorToggled(address indexed operator, bool enabled);
    event UniverseActiveToggled(bytes32 indexed universeHash, bool active);
    event MetadataUpdate(uint256 indexed tokenId);

    function initialize(address[] memory _operators, address encoderAddress) external;
    function tokenURI(uint256 tokenId) external view returns (string memory);
    function idToTokenId(string memory id) external view returns (uint256);
    function getMoleculeByTokenId(uint256 tokenId) external view returns (Molecule memory);
    function getUniverseInformation(
        bytes32 universeHash
    ) external view returns (UniverseInformation memory);
    function getMoleculesDiscovered(bytes32 universeHash) external view returns (Molecule[] memory);
    function setEncoder(address _newEncoder) external;
    function toggleOperator(address _operator) external;
    function toggleUniverseActive(bytes32 _universeHash) external;
    function setUniverseInformation(
        UniverseInformation memory _universeInformation
    ) external returns (bytes32);
    function maybeMarkMoleculeAsDiscovered(
        Molecule memory _molecule,
        string memory tokenUri,
        address _discoveredBy
    ) external;
    function activeUniverses() external view returns (bytes32[] memory);
    function updateMolecule(Molecule memory _molecule, string memory _tokenUri) external;
    function updateTokenURI(uint256 tokenId, string memory _tokenUri) external;
}
