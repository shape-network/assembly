// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

interface IOtomItems is IERC1155 {
    function burn(address from, uint256 id, uint256 amount) external;
    function burnBatch(address from, uint256[] memory ids, uint256[] memory amounts) external;
    function mint(address to, uint256 id, uint256 amount, bytes memory data) external;
    function exists(uint256 id) external view returns (bool);
    function totalSupply(uint256 id) external view returns (uint256);
    function emitMetadataUpdate(uint256 id) external;
}
