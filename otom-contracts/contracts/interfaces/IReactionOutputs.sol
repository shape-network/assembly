// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

struct ReactionOutputData {
    bytes32 universeHash;
    uint256 reactionBlock;
    address chemist;
    uint256[] atomIds;
    uint256 energyAmount;
}

enum TraitType {
    NUMBER,
    STRING
}

struct Trait {
    string typeName;
    string valueName;
    TraitType traitType;
}

interface IReactionOutputs is IERC721 {
    error NotReactor();
    error CannotTransferReactionOutput();

    function tokenURI(uint256 _tokenId) external view returns (string memory);
    function mint(address _to, ReactionOutputData memory data) external returns (uint256);
    function burn(uint256 _tokenId) external;
    function consume(uint256 _tokenId) external;
    function setReactor(address _reactor, bool _isReactor) external;
    function setDatabase(address _database) external;
    function getReactionOutputData(
        uint256 tokenId
    ) external view returns (ReactionOutputData memory);
}
