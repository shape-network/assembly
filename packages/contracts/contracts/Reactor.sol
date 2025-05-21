// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {ReentrancyGuardUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {Ownable2StepUpgradeable} from "@openzeppelin/contracts-upgradeable/access/Ownable2StepUpgradeable.sol";
import {MessageHashUtils} from "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {IERC1155Receiver} from "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";

import {IOtoms} from "./interfaces/IOtoms.sol";
import {IEnergy} from "./interfaces/IEnergy.sol";
import {Molecule} from "./interfaces/IOtomsDatabase.sol";
import {IReactor, ReactionResult, MoleculeWithUri} from "./interfaces/IReactor.sol";
import {IOtomsEncoder} from "./interfaces/IOtomsEncoder.sol";
import {IReactionOutputs, ReactionOutputData} from "./interfaces/IReactionOutputs.sol";

contract Reactor is
    Initializable,
    Ownable2StepUpgradeable,
    ReentrancyGuardUpgradeable,
    IERC1155Receiver,
    IReactor
{
    address private _signer;

    IOtomsEncoder public encoder;

    IOtoms public otoms;

    IEnergy public energy;

    IReactionOutputs public reactionOutputs;

    mapping(bytes32 => bool) public usedSignature;

    uint256 public reactionLengthLimit;

    /**
     * @notice This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[1_000] private __gap;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        address signer,
        address _encoder,
        address _reactionOutputs,
        uint256 _reactionLengthLimit
    ) public initializer {
        __Ownable_init(msg.sender);
        __ReentrancyGuard_init();
        __Ownable2Step_init();

        _signer = signer;
        encoder = IOtomsEncoder(_encoder);
        reactionOutputs = IReactionOutputs(_reactionOutputs);
        reactionLengthLimit = _reactionLengthLimit;
    }

    //////////////////////////////////  PUBLIC CORE ////////////////////////////////

    function initiateReaction(
        uint256[] memory atomIds,
        uint256 energyAmount
    ) external nonReentrant returns (uint256) {
        if (energy.balanceOf(msg.sender) < energyAmount) revert InsufficientEnergy();
        if (atomIds.length == 0) revert NoAtoms();
        if (atomIds.length > reactionLengthLimit) revert ReactionLengthLimitExceeded();

        bytes32[] memory universeHashes = new bytes32[](atomIds.length);

        for (uint256 i = 0; i < atomIds.length; i++) {
            if (otoms.balanceOf(msg.sender, atomIds[i]) == 0)
                revert InsufficientBalance(atomIds[i]);

            Molecule memory molecule = otoms.database().getMoleculeByTokenId(atomIds[i]);

            if (!otoms.moleculeIsAtom(molecule)) revert NotAnAtom(atomIds[i]);
            universeHashes[i] = molecule.universeHash;

            otoms.safeTransferFrom(msg.sender, address(this), atomIds[i], 1, "");
        }

        for (uint256 i = 1; i < universeHashes.length; i++) {
            if (universeHashes[i] != universeHashes[0]) revert InvalidUniverseHash();
        }

        uint256 newOutputId = reactionOutputs.mint(
            msg.sender,
            ReactionOutputData({
                universeHash: universeHashes[0],
                reactionBlock: block.number,
                chemist: msg.sender,
                atomIds: atomIds,
                energyAmount: energyAmount
            })
        );

        energy.consume(msg.sender, energyAmount);

        emit ReactionInitiated(universeHashes[0], newOutputId, msg.sender, atomIds, energyAmount);

        return newOutputId;
    }

    function analyseReactions(
        ReactionResult[] memory reactionResults,
        uint256 expiry,
        bytes memory signature
    ) external nonReentrant {
        _requireValidSignature(reactionResults, expiry, signature);
        for (uint256 i = 0; i < reactionResults.length; i++) {
            ReactionResult memory result = reactionResults[i];

            address reactionOutputOwner = reactionOutputs.ownerOf(result.reactionOutputId);

            if (reactionOutputOwner != msg.sender) revert NotReactionOutputOwner();

            ReactionOutputData memory reactionOutputData = reactionOutputs.getReactionOutputData(
                result.reactionOutputId
            );

            if (reactionOutputData.reactionBlock >= block.number) revert CannotAnalyseYet();

            for (uint256 j = 0; j < reactionOutputData.atomIds.length; j++) {
                if (reactionOutputData.atomIds[j] != result.inputAtomIds[j]) revert InvalidAtomId();
            }

            otoms.handleReactionResult(result, msg.sender);

            energy.transform(msg.sender, result.remainingEnergy);

            reactionOutputs.consume(result.reactionOutputId);

            emit ReactionAnalysed(result.reactionOutputId, msg.sender, result);
        }
    }

    //////////////////////////////////  PUBLIC UTILITY ////////////////////////////////

    function getAnalyseReactionsMessageHash(
        ReactionResult[] memory reactionResults,
        uint256 expiry,
        address sender
    ) public view returns (bytes32) {
        return
            keccak256(
                abi.encode(address(this), _encodeReactionResults(reactionResults), expiry, sender)
            );
    }

    function onERC1155Received(
        address,
        address,
        uint256,
        uint256,
        bytes calldata
    ) external pure returns (bytes4) {
        return IERC1155Receiver.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address,
        address,
        uint256[] calldata,
        uint256[] calldata,
        bytes calldata
    ) external pure returns (bytes4) {
        return IERC1155Receiver.onERC1155BatchReceived.selector;
    }

    function supportsInterface(bytes4 interfaceId) external pure returns (bool) {
        return interfaceId == type(IERC1155Receiver).interfaceId;
    }

    ////////////////////////////////// ADMIN ////////////////////////////////

    function setReactionLengthLimit(uint256 newLimit) external onlyOwner {
        reactionLengthLimit = newLimit;
        emit NewReactionLengthLimit(newLimit);
    }

    function setEncoder(address _encoder) external onlyOwner {
        encoder = IOtomsEncoder(_encoder);
        emit NewEncoder(_encoder);
    }

    function setOtoms(address _otoms) external onlyOwner {
        otoms = IOtoms(_otoms);
        emit NewOtoms(_otoms);
    }

    function setEnergy(address _energy) external onlyOwner {
        energy = IEnergy(_energy);
        emit NewEnergy(_energy);
    }

    function setSigner(address newSigner) external onlyOwner {
        _signer = newSigner;
        emit NewSigner(newSigner);
    }

    //////////////////////////////////  INTERNAL UTILITY ////////////////////////////////

    function _requireValidSignature(
        ReactionResult[] memory reactions,
        uint256 expiry,
        bytes memory signature
    ) private {
        if (expiry < block.timestamp) revert SignatureExpired();
        bytes32 messageHash = getAnalyseReactionsMessageHash(reactions, expiry, msg.sender);

        if (usedSignature[messageHash]) revert UsedSignature();

        if (!_verify(messageHash, signature, _signer)) revert InvalidSignature();

        usedSignature[messageHash] = true;
    }

    function _encodeReactionResults(
        ReactionResult[] memory reactionResults
    ) private view returns (bytes32) {
        bytes32[] memory encodedReactionResults = new bytes32[](reactionResults.length);
        for (uint256 i = 0; i < reactionResults.length; i++) {
            encodedReactionResults[i] = _encodeReactionResult(reactionResults[i]);
        }
        return keccak256(abi.encodePacked(encodedReactionResults));
    }

    function _encodeReactionResult(ReactionResult memory reaction) private view returns (bytes32) {
        return
            keccak256(
                abi.encode(
                    reaction.universeHash,
                    _encodeMoleculeWithUriArray(reaction.outputMolecules),
                    reaction.remainingEnergy,
                    keccak256(abi.encodePacked(reaction.inputAtomIds)),
                    keccak256(abi.encode(reaction.reactionTypes)),
                    reaction.success
                )
            );
    }

    function _encodeMoleculeWithUri(
        MoleculeWithUri memory moleculeWithUri
    ) private view returns (bytes32) {
        return
            keccak256(
                abi.encode(
                    encoder.encodeMolecule(moleculeWithUri.molecule),
                    moleculeWithUri.tokenUri
                )
            );
    }

    function _encodeMoleculeWithUriArray(
        MoleculeWithUri[] memory moleculeWithUris
    ) private view returns (bytes32) {
        bytes32[] memory encodedMoleculeWithUris = new bytes32[](moleculeWithUris.length);
        for (uint256 i = 0; i < moleculeWithUris.length; i++) {
            encodedMoleculeWithUris[i] = _encodeMoleculeWithUri(moleculeWithUris[i]);
        }
        return keccak256(abi.encodePacked(encodedMoleculeWithUris));
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
}
