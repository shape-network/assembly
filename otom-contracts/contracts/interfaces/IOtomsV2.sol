// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import {ReactionResult} from "./IReactor.sol";
import {Molecule, Atom, AtomStructure, Nucleus, UniverseInformation, IOtomsDatabase} from "./IOtomsDatabase.sol";

struct MiningPayload {
    Molecule minedMolecule;
    bytes32 miningHash;
    string tokenUri;
    bytes32 universeHash;
    uint256 expiry;
    bytes signature;
}

interface IOtomsV2 is IERC1155 {
    event OperatorToggled(address indexed operator, bool indexed isActive);
    event SignerSet(address indexed signer);
    event MinesDepletedSet(bytes32 indexed universeHash, bool indexed minesDepleted);
    event OtomMined(
        address indexed minedBy,
        bytes32 indexed universeHash,
        uint256 indexed atomId,
        bytes32 creationHash
    );
    event EncoderUpdated(address indexed encoder);
    event MiningLimitSet(uint256 indexed miningLimit);
    event MiningPausedSet(bool indexed miningPaused);
    event OtomItemsCoreSet(address indexed otomItemsCore);
    event AllowedItemIdSet(uint256 indexed itemId, bool indexed allowed);

    error NotSeeded();
    error MiningPaused();
    error InvalidMiningHash();
    error InvalidUniverseHash();
    error NotOperator();
    error UsedSignature();
    error InvalidSignature();
    error NotAnAtom();
    error MinesDepleted();
    error MiningLimitExceeded();
    error SignatureExpired();
    error ItemNotEnabled();
    error NoItemProvided();

    function seedUniverse(
        UniverseInformation memory _universeInformation,
        uint256 expiry,
        bytes memory signature
    ) external returns (bytes32);

    function getMiningNonce(
        bytes32 _universeHash,
        address _chemist
    ) external view returns (uint256);

    function mine(MiningPayload[] calldata payloads) external returns (uint256[] memory);

    function mineWithItem(
        MiningPayload[] calldata payloads,
        uint256 _itemTokenId
    ) external returns (uint256[] memory);

    function handleReactionResult(ReactionResult memory _reactionResult, address _chemist) external;

    function toggleOperator(address _operator) external;

    function setOtomItemsCore(address _otomItemsCore) external;

    function database() external view returns (IOtomsDatabase);

    function annihilate(uint256 _atomId, address _chemist) external;

    function moleculeIsAtom(Molecule memory _molecule) external pure returns (bool);

    function burnBatch(address _from, uint256[] memory _ids, uint256[] memory _values) external;
}
