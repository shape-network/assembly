// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IEnergy is IERC20 {
    error NotAuthorized();

    // @dev Transforms Atoms and Molecules into Energy.
    function transform(address to, uint256 amount) external;

    // @dev Consumes Energy in Reactions.
    function consume(address from, uint256 amount) external;

    // @dev Toggles an Operator.
    function toggleOperator(address _operator) external;

    // @dev Returns the decimals of the Energy token.
    function decimals() external pure returns (uint8);
}
