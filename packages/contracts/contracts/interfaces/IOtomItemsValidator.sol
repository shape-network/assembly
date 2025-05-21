// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Trait, PropertyCriterion} from "./IOtomItemsCore.sol";

interface IOtomItemsValidator {
    function validateTraits(Trait[] memory _traits) external view returns (bool);
    function meetsCriteria(
        uint256 otomTokenId,
        PropertyCriterion[] memory criteria
    ) external view returns (bool);
}
