// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

interface IOtomItemsRenderer {
    error InvalidTraitType();

    function getMetadata(uint256 tokenId) external view returns (string memory);
}
