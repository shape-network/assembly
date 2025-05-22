// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Trait} from "./IOtomItemsCore.sol";

/**
 * @title IOtomItemMutator
 * @dev Interface for item mutators
 */
interface IOtomItemMutator {
    /**
     * @dev Tier calculation function
     * @param itemId The ID of the item
     * @param variableOtomIds An array of variable otom IDs
     * @param nonFungibleTokenIds An array of non-fungible token IDs
     * @param baseTraits An array of base traits
     * @param paymentAmount The amount paid by the user for crafting
     * @return tierLevel The calculated tier level (1-7)
     * @return updatedTraits The modified traits based on the tier
     */
    function calculateTier(
        uint256 itemId,
        uint256[] memory variableOtomIds,
        uint256[] memory nonFungibleTokenIds,
        Trait[] memory baseTraits,
        uint256 paymentAmount
    )
        external
        view
        returns (
            uint256 tierLevel, // Limited to 1-7
            Trait[] memory updatedTraits
        );

    /**
     * @dev Called when an item is used
     * @param tokenId The token ID of the item being used
     * @param owner The owner of the item
     * @param currentTraits The current dynamic traits of the item
     * @param data Arbitrary data passed by the user when using the item
     * @return updatedTraits The new traits to set for the item
     * @return destroy Whether the item should be destroyed
     */
    function onItemUse(
        uint256 tokenId,
        address owner,
        Trait[] calldata currentTraits,
        bytes calldata data
    ) external returns (Trait[] memory updatedTraits, bool destroy);

    /**
     * @dev Called when an item is transferred
     * @param tokenId The token ID of the item being transferred
     * @param from The sender of the item
     * @param to The recipient of the item
     * @param value The amount of the item being transferred
     * @param currentTraits The current dynamic traits of the item
     * @return allowed Whether the transfer is allowed
     */
    function onTransfer(
        uint256 tokenId,
        address from,
        address to,
        uint256 value,
        Trait[] calldata currentTraits
    ) external returns (bool allowed);

    /**
     * @dev Called when an item is crafted
     * @param _crafter The address of the crafter
     * @param _itemId The ID of the item to craft
     * @param _amount The amount of items to craft
     * @param _variableOtomIds Array of token IDs to use for VARIABLE_OTOM components
     * @param _nonFungibleTokenIds Array of token IDs to use for NON_FUNGIBLE_ITEM components
     * @param _data Additional data for the crafting process
     * @return allowed Whether the crafter can craft the item
     * @return requiresItemsOrOtoms Whether the crafting requires items or otoms
     */
    function onCraft(
        address _crafter,
        uint256 _itemId,
        uint256 _amount,
        uint256[] calldata _variableOtomIds,
        uint256[] calldata _nonFungibleTokenIds,
        bytes calldata _data
    ) external returns (bool allowed, bool requiresItemsOrOtoms);
}
