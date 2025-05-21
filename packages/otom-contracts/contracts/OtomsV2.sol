// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {ERC1155SupplyUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155SupplyUpgradeable.sol";
import {ERC1155Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import {ReentrancyGuardUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {Ownable2StepUpgradeable} from "@openzeppelin/contracts-upgradeable/access/Ownable2StepUpgradeable.sol";

import {MessageHashUtils} from "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {IERC165} from "@openzeppelin/contracts/interfaces/IERC165.sol";

import {IOtomsV2, Molecule, UniverseInformation, MiningPayload} from "./interfaces/IOtomsV2.sol";
import {IOtomsEncoder} from "./interfaces/IOtomsEncoder.sol";
import {ReactionResult} from "./interfaces/IReactor.sol";
import {IOtomsDatabase} from "./interfaces/IOtomsDatabase.sol";
import {IOtomItemsCore, Trait} from "./interfaces/IOtomItemsCore.sol";

contract OtomsV2 is
    Initializable,
    ERC1155SupplyUpgradeable,
    Ownable2StepUpgradeable,
    ReentrancyGuardUpgradeable,
    IOtomsV2
{
    string public constant name = "OTOM";

    IOtomsEncoder public encoder;

    IOtomsDatabase public database;

    address private _signer;

    mapping(address => bool) public operators;

    mapping(bytes32 => mapping(address => uint256)) private _miningNonce;

    mapping(bytes32 => bool) private _usedSignature;

    bool public miningPaused;

    mapping(bytes32 => bool) public universeMinesDepleted;

    uint256 public miningLimit;

    mapping(uint256 => bool) public allowedItemIds;

    IOtomItemsCore public otomItemsCore;

    /**
     * @notice This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[998] private __gap;

    modifier onlyOperator() {
        if (!operators[msg.sender]) revert NotOperator();
        _;
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        address[] memory _operators,
        address signerAddress,
        address encoderAddress,
        address databaseAddress
    ) public initializer {
        __ERC1155_init("");
        __Ownable_init(msg.sender);
        __ReentrancyGuard_init();
        __Ownable2Step_init();

        for (uint256 i = 0; i < _operators.length; i++) {
            operators[_operators[i]] = true;
        }

        _signer = signerAddress;
        encoder = IOtomsEncoder(encoderAddress);
        database = IOtomsDatabase(databaseAddress);
        miningLimit = 5;
        miningPaused = true;
    }

    function uri(uint256 tokenId) public view override(ERC1155Upgradeable) returns (string memory) {
        return database.tokenURI(tokenId);
    }

    ////////////////////////////////// PUBLIC CORE ////////////////////////////////

    function seedUniverse(
        UniverseInformation memory _universeInformation,
        uint256 expiry,
        bytes memory signature
    ) public returns (bytes32) {
        _requireValidSignature(_universeInformation, expiry, signature);

        return database.setUniverseInformation(_universeInformation);
    }

    function mine(
        MiningPayload[] calldata _payloads
    ) external nonReentrant returns (uint256[] memory) {
        if (_payloads.length > miningLimit) revert MiningLimitExceeded();

        uint256[] memory atomIds = new uint256[](_payloads.length);

        for (uint256 i = 0; i < _payloads.length; i++) {
            atomIds[i] = _mine(_payloads[i]);
        }

        return atomIds;
    }

    function mineWithItem(
        MiningPayload[] calldata _payloads,
        uint256 _itemTokenId
    ) external nonReentrant returns (uint256[] memory) {
        uint256 effectiveMiningLimit = miningLimit;

        if (_itemTokenId == 0) revert NoItemProvided();

        uint256 itemId = otomItemsCore.getItemIdForToken(_itemTokenId);

        if (itemId == 0 || !allowedItemIds[itemId]) revert ItemNotEnabled();

        Trait memory miningTrait = otomItemsCore.getTokenTrait(_itemTokenId, "Mining Power");

        uint256 miningPower = miningTrait.valueNumber;

        otomItemsCore.useItem(_itemTokenId, msg.sender, "");

        effectiveMiningLimit = miningPower;

        if (_payloads.length > effectiveMiningLimit) revert MiningLimitExceeded();

        uint256[] memory atomIds = new uint256[](_payloads.length);

        for (uint256 i = 0; i < _payloads.length; i++) {
            atomIds[i] = _mine(_payloads[i]);
        }

        return atomIds;
    }

    function _mine(MiningPayload calldata _payload) internal returns (uint256) {
        if (!database.getUniverseInformation(_payload.universeHash).active) revert NotSeeded();
        if (!moleculeIsAtom(_payload.minedMolecule)) revert NotAnAtom();
        if (_payload.minedMolecule.universeHash != _payload.universeHash)
            revert InvalidUniverseHash();
        if (universeMinesDepleted[_payload.universeHash]) revert MinesDepleted();
        if (miningPaused) revert MiningPaused();

        _requireValidSignature(
            _payload.minedMolecule,
            _payload.miningHash,
            _payload.tokenUri,
            _payload.universeHash,
            _payload.expiry,
            _payload.signature
        );

        bytes32 miningHash = encoder.getMiningHash(
            msg.sender,
            _payload.universeHash,
            _miningNonce[_payload.universeHash][msg.sender]++
        );

        if (miningHash != _payload.miningHash) revert InvalidMiningHash();

        uint256 atomId = _mintMolecule(_payload.minedMolecule, _payload.tokenUri, msg.sender);

        emit OtomMined(msg.sender, _payload.universeHash, atomId, miningHash);

        return atomId;
    }

    ////////////////////////////////// PUBLIC UTILS ////////////////////////////////

    function getMiningNonce(bytes32 _universeHash, address _chemist) public view returns (uint256) {
        return _miningNonce[_universeHash][_chemist];
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC1155Upgradeable, IERC165) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function moleculeIsAtom(Molecule memory _molecule) public pure returns (bool) {
        return (_molecule.givingAtoms.length + _molecule.receivingAtoms.length) == 1;
    }

    ////////////////////////////////// ADMIN CORE ////////////////////////////////

    function annihilate(uint256 _atomId, address _chemist) external onlyOperator {
        _burn(_chemist, _atomId, 1);
    }

    function handleReactionResult(
        ReactionResult memory _reactionResult,
        address _chemist
    ) external onlyOperator {
        for (uint256 i = 0; i < _reactionResult.inputAtomIds.length; i++) {
            _burn(msg.sender, _reactionResult.inputAtomIds[i], 1);
        }

        for (uint256 i = 0; i < _reactionResult.outputMolecules.length; i++) {
            _mintMolecule(
                _reactionResult.outputMolecules[i].molecule,
                _reactionResult.outputMolecules[i].tokenUri,
                _chemist
            );
        }
    }

    function burnBatch(
        address _from,
        uint256[] memory _ids,
        uint256[] memory _values
    ) external onlyOperator {
        _burnBatch(_from, _ids, _values);
    }

    ////////////////////////////////// ADMIN UTILS ////////////////////////////////

    function setEncoder(address _newEncoder) external onlyOwner {
        encoder = IOtomsEncoder(_newEncoder);
        emit EncoderUpdated(_newEncoder);
    }

    function setMiningPaused(bool _miningPaused) external onlyOwner {
        miningPaused = _miningPaused;
        emit MiningPausedSet(_miningPaused);
    }

    function toggleOperator(address _operator) external onlyOwner {
        operators[_operator] = !operators[_operator];
        emit OperatorToggled(_operator, operators[_operator]);
    }

    function setSigner(address newSigner) external onlyOwner {
        _signer = newSigner;
        emit SignerSet(newSigner);
    }

    function setMinesDepleted(bytes32 _universeHash, bool _minesDepleted) external onlyOwner {
        universeMinesDepleted[_universeHash] = _minesDepleted;
        emit MinesDepletedSet(_universeHash, _minesDepleted);
    }

    function setMiningLimit(uint256 _miningLimit) external onlyOwner {
        miningLimit = _miningLimit;
        emit MiningLimitSet(_miningLimit);
    }

    function setOtomItemsCore(address _otomItemsCore) external onlyOwner {
        otomItemsCore = IOtomItemsCore(_otomItemsCore);
        emit OtomItemsCoreSet(_otomItemsCore);
    }

    function setAllowedItemId(uint256 _itemId, bool _allowed) external onlyOwner {
        allowedItemIds[_itemId] = _allowed;
        emit AllowedItemIdSet(_itemId, _allowed);
    }

    ////////////////////////////////// PRIVATE ////////////////////////////////

    function _requireValidSignature(
        Molecule memory _newMolecule,
        bytes32 _miningHash,
        string memory _representation,
        bytes32 _universeHash,
        uint256 expiry,
        bytes memory signature
    ) private {
        if (expiry < block.timestamp) revert SignatureExpired();
        bytes32 messageHash = encoder.getMiningMessageHash(
            _newMolecule,
            _miningHash,
            _representation,
            _universeHash,
            expiry,
            msg.sender
        );

        if (_usedSignature[messageHash]) revert UsedSignature();

        if (!_verify(messageHash, signature, _signer)) revert InvalidSignature();

        _usedSignature[messageHash] = true;
    }

    function _requireValidSignature(
        UniverseInformation memory _universeInformation,
        uint256 expiry,
        bytes memory signature
    ) private {
        if (expiry < block.timestamp) revert SignatureExpired();
        bytes32 messageHash = encoder.getSeedUniverseMessageHash(
            _universeInformation,
            expiry,
            msg.sender
        );

        if (_usedSignature[messageHash]) revert UsedSignature();

        if (!_verify(messageHash, signature, _signer)) revert InvalidSignature();

        _usedSignature[messageHash] = true;
    }

    function _verify(
        bytes32 messageHash,
        bytes memory signature,
        address signer
    ) private pure returns (bool) {
        return
            signer ==
            ECDSA.recover(MessageHashUtils.toEthSignedMessageHash(messageHash), signature);
    }

    function _mintMolecule(
        Molecule memory _molecule,
        string memory _tokenUri,
        address to
    ) private returns (uint256) {
        uint256 tokenId = database.idToTokenId(_molecule.id);

        database.maybeMarkMoleculeAsDiscovered(_molecule, _tokenUri, to);

        _mint(to, tokenId, 1, "");

        return tokenId;
    }
}
