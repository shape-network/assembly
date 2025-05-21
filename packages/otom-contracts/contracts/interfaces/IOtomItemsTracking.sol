// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {IOtomItemsCore, Item} from "./IOtomItemsCore.sol";

/**
 * @title IOtomItemsTracking
 * @dev Interface for the IOtomItemsTracking contract
 */
interface IOtomItemsTracking {
    event OtomItemsSet(address indexed otomItemsAddress);
    event CoreSet(address indexed coreAddress);

    error InvalidItem();
    error NotOtomItems();

    function getNonFungibleTokenOwner(uint256 _tokenId) external view returns (address);

    function getNonFungibleItemTokenIdsPaginated(
        uint256 _itemId,
        uint256 _offset,
        uint256 _limit
    ) external view returns (uint256[] memory);

    function getNonFungibleItemOwnerTokenIdsPaginated(
        address _owner,
        uint256 _itemId,
        uint256 _offset,
        uint256 _limit
    ) external view returns (uint256[] memory);

    function onUpdate(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values
    ) external;

    function getItemSupply(uint256 _itemId) external view returns (uint256);

    /**
     * @dev Gets a paginated list of all items
     * @param _offset The starting index (0-based)
     * @param _limit The maximum number of items to return
     * @return A paginated array of items
     */
    function getAllItemsPaginated(
        uint256 _offset,
        uint256 _limit
    ) external view returns (Item[] memory);
}
