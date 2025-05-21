// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {ReentrancyGuardUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {Ownable2StepUpgradeable} from "@openzeppelin/contracts-upgradeable/access/Ownable2StepUpgradeable.sol";

import {IOtomsEncoder} from "./interfaces/IOtomsEncoder.sol";
import {IOtomsDatabaseV2, Molecule, UniverseInformation} from "./interfaces/IOtomsDatabaseV2.sol";

contract OtomsDatabaseV2 is
    Initializable,
    Ownable2StepUpgradeable,
    ReentrancyGuardUpgradeable,
    IOtomsDatabaseV2
{
    IOtomsEncoder public encoder;

    mapping(uint256 => string) private _tokenIdToTokenURI;

    mapping(uint256 => Molecule) private _tokenIdToMolecule;

    bytes32[] public knownUniverses;

    mapping(address => bool) public operators;

    mapping(bytes32 => UniverseInformation) public universeInformation;

    mapping(string => bool) public takenUniverseNames;

    mapping(bytes32 => uint256[]) public moleculesDiscovered; // UniverseHash => TokenId[]

    mapping(uint256 => address) public moleculeDiscoveredBy; // Token id => Discoverer

    /**
     * @notice This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[1_000] private __gap;

    modifier onlyOperator() {
        if (!operators[msg.sender]) revert NotOperator();
        _;
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address[] memory _operators, address encoderAddress) public initializer {
        __Ownable_init(msg.sender);
        __ReentrancyGuard_init();
        __Ownable2Step_init();

        for (uint256 i = 0; i < _operators.length; i++) {
            operators[_operators[i]] = true;
        }

        encoder = IOtomsEncoder(encoderAddress);
    }

    ////////////////////////////////// PUBLIC CORE ////////////////////////////////

    function tokenURI(uint256 tokenId) public view returns (string memory) {
        return _tokenIdToTokenURI[tokenId];
    }

    function idToTokenId(string memory id) public pure returns (uint256) {
        return uint256(keccak256(abi.encode(id)));
    }

    function getMoleculeByMoleculeId(
        string memory moleculeId
    ) public view returns (Molecule memory) {
        return _tokenIdToMolecule[idToTokenId(moleculeId)];
    }

    function getMoleculeByTokenId(uint256 tokenId) public view returns (Molecule memory) {
        return _tokenIdToMolecule[tokenId];
    }

    function activeUniverses() public view returns (bytes32[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < knownUniverses.length; i++) {
            if (universeInformation[knownUniverses[i]].active) {
                count++;
            }
        }

        bytes32[] memory result = new bytes32[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < knownUniverses.length; i++) {
            if (universeInformation[knownUniverses[i]].active) {
                result[index] = knownUniverses[i];
                index++;
            }
        }
        return result;
    }

    function getUniverseInformation(
        bytes32 universeHash
    ) public view returns (UniverseInformation memory) {
        return universeInformation[universeHash];
    }

    function getMoleculesDiscovered(bytes32 universeHash) public view returns (Molecule[] memory) {
        uint256[] memory moleculeTokenIds = moleculesDiscovered[universeHash];
        Molecule[] memory molecules = new Molecule[](moleculeTokenIds.length);

        for (uint256 i = 0; i < moleculeTokenIds.length; i++) {
            molecules[i] = _tokenIdToMolecule[moleculeTokenIds[i]];
        }

        return molecules;
    }

    function getMoleculesDiscoveredPaginated(
        bytes32 universeHash,
        uint256 offset,
        uint256 limit
    ) public view returns (Molecule[] memory molecules, uint256 total) {
        uint256[] memory moleculeTokenIds = moleculesDiscovered[universeHash];
        total = moleculeTokenIds.length;

        if (offset >= total) {
            return (new Molecule[](0), total);
        }

        uint256 remaining = total - offset;
        uint256 actualLimit = remaining < limit ? remaining : limit;

        molecules = new Molecule[](actualLimit);

        for (uint256 i = 0; i < actualLimit; i++) {
            molecules[i] = _tokenIdToMolecule[moleculeTokenIds[offset + i]];
        }

        return (molecules, total);
    }

    ////////////////////////////////// ADMIN CORE ////////////////////////////////

    function setUniverseInformation(
        UniverseInformation memory _universeInformation
    ) external onlyOperator returns (bytes32) {
        bytes32 universeHash = _universeInformation.seedHash;

        if (universeHash == bytes32(0)) revert InvalidUniverseSeed();
        if (bytes(_universeInformation.name).length == 0) revert InvalidUniverseName();
        if (universeInformation[universeHash].seedHash != bytes32(0)) revert AlreadySeeded();
        if (takenUniverseNames[_universeInformation.name]) revert UniverseNameTaken();

        takenUniverseNames[_universeInformation.name] = true;

        universeInformation[universeHash].active = true;
        universeInformation[universeHash].energyFactorBps = _universeInformation.energyFactorBps;
        universeInformation[universeHash].seedHash = _universeInformation.seedHash;
        universeInformation[universeHash].name = _universeInformation.name;

        knownUniverses.push(universeHash);

        return universeHash;
    }

    function maybeMarkMoleculeAsDiscovered(
        Molecule memory _molecule,
        string memory tokenUri,
        address _discoveredBy
    ) external onlyOperator {
        uint256 tokenId = idToTokenId(_molecule.id);

        if (moleculeDiscoveredBy[tokenId] != address(0)) {
            return;
        }

        bytes32 universeHash = _molecule.universeHash;

        moleculesDiscovered[universeHash].push(tokenId);
        moleculeDiscoveredBy[tokenId] = _discoveredBy;
        _tokenIdToTokenURI[tokenId] = tokenUri;

        _storeMolecule(_molecule);

        emit MoleculeDiscovered(universeHash, tokenId, _discoveredBy);
    }

    ////////////////////////////////// ADMIN UTILS ////////////////////////////////

    function setEncoder(address _newEncoder) external onlyOwner {
        encoder = IOtomsEncoder(_newEncoder);
        emit EncoderUpdated(_newEncoder);
    }

    function toggleOperator(address _operator) external onlyOwner {
        operators[_operator] = !operators[_operator];
        emit OperatorToggled(_operator, operators[_operator]);
    }

    function toggleUniverseActive(bytes32 _universeHash) external onlyOwner {
        universeInformation[_universeHash].active = !universeInformation[_universeHash].active;
        emit UniverseActiveToggled(_universeHash, universeInformation[_universeHash].active);
    }

    function updateMolecule(
        Molecule memory _molecule,
        string memory _tokenUri
    ) external onlyOperator {
        _tokenIdToTokenURI[idToTokenId(_molecule.id)] = _tokenUri;
        _storeMolecule(_molecule);
        emit MetadataUpdate(idToTokenId(_molecule.id));
    }

    function updateTokenURI(uint256 tokenId, string memory _tokenUri) external onlyOperator {
        _tokenIdToTokenURI[tokenId] = _tokenUri;
        emit MetadataUpdate(tokenId);
    }

    ////////////////////////////////// INTERNAL ////////////////////////////////

    function _storeMolecule(Molecule memory _molecule) internal {
        uint256 tokenId = idToTokenId(_molecule.id);

        if (moleculeDiscoveredBy[tokenId] == address(0)) {
            revert MoleculeNotDiscovered();
        }

        _tokenIdToMolecule[tokenId].id = _molecule.id;
        _tokenIdToMolecule[tokenId].universeHash = _molecule.universeHash;
        _tokenIdToMolecule[tokenId].activationEnergy = _molecule.activationEnergy;
        _tokenIdToMolecule[tokenId].radius = _molecule.radius;
        _tokenIdToMolecule[tokenId].name = _molecule.name;
        _tokenIdToMolecule[tokenId].bond = _molecule.bond;
        _tokenIdToMolecule[tokenId].electricalConductivity = _molecule.electricalConductivity;
        _tokenIdToMolecule[tokenId].thermalConductivity = _molecule.thermalConductivity;
        _tokenIdToMolecule[tokenId].toughness = _molecule.toughness;
        _tokenIdToMolecule[tokenId].hardness = _molecule.hardness;
        _tokenIdToMolecule[tokenId].ductility = _molecule.ductility;

        delete _tokenIdToMolecule[tokenId].givingAtoms;
        delete _tokenIdToMolecule[tokenId].receivingAtoms;

        for (uint256 i = 0; i < _molecule.givingAtoms.length; i++) {
            _tokenIdToMolecule[tokenId].givingAtoms.push(_molecule.givingAtoms[i]);
        }

        for (uint256 j = 0; j < _molecule.receivingAtoms.length; j++) {
            _tokenIdToMolecule[tokenId].receivingAtoms.push(_molecule.receivingAtoms[j]);
        }
    }
}
