// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Molecule} from "./IOtomsDatabase.sol";

struct MoleculeWithUri {
    Molecule molecule;
    string tokenUri;
}

struct ReactionResult {
    bytes32 universeHash;
    uint256 reactionOutputId;
    MoleculeWithUri[] outputMolecules;
    uint256[] inputAtomIds;
    uint256 remainingEnergy;
    string[] reactionTypes;
    bool success;
}

interface IReactor {
    event ReactionInitiated(
        bytes32 indexed universeHash,
        uint256 indexed resultId,
        address indexed labTechnician,
        uint256[] atomIds,
        uint256 energyAmount
    );
    event ReactionAnalysed(
        uint256 indexed moleculeId,
        address indexed labTechnician,
        ReactionResult reactionResult
    );

    event NewSigner(address indexed signer);
    event NewEncoder(address indexed encoder);
    event NewOtoms(address indexed otoms);
    event NewEnergy(address indexed energy);
    event NewReactionLengthLimit(uint256 newLimit);

    error InsufficientBalance(uint256 tokenId);
    error NoAtoms();
    error InsufficientEnergy();
    error CannotAnalyseYet();
    error InvalidUniverseHash();
    error InvalidAtomId();
    error InvalidSignature();
    error UsedSignature();
    error NotReactionOutputOwner();
    error ReactionLengthLimitExceeded();
    error NotAnAtom(uint256 tokenId);
    error SignatureExpired();

    function initiateReaction(
        uint256[] memory atomIds,
        uint256 energyAmount
    ) external returns (uint256);

    function analyseReactions(
        ReactionResult[] memory reactionResults,
        uint256 expiry,
        bytes memory signature
    ) external;
}
