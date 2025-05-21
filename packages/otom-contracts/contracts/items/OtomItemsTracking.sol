// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {IOtomItemsCore, ItemType, Item} from "../interfaces/IOtomItemsCore.sol";
import {IOtomItems} from "../interfaces/IOtomItems.sol";
import {IOtomItemsTracking} from "../interfaces/IOtomItemsTracking.sol";
import {Ownable2StepUpgradeable} from "@openzeppelin/contracts-upgradeable/access/Ownable2StepUpgradeable.sol";

contract OtomItemsTracking is Initializable, Ownable2StepUpgradeable, IOtomItemsTracking {
    IOtomItemsCore public core;
    IOtomItems public otomItems;

    // Mapping from non-fungible item ID to its supply
    mapping(uint256 => uint256) private nonFungibleItemSupply;

    // Mapping from non-fungible item ID to an array of token IDs
    mapping(uint256 => uint256[]) private nonFungibleItemTokenIds;

    // Mapping from non-fungible item ID to its index in the item token ids array
    mapping(uint256 => uint256) private nonFungibleItemTokenIdIndex;

    // Mapping from non-fungible item id to mapping of owner address to an array of token ids they own from this item
    mapping(uint256 => mapping(address => uint256[])) private nonFungibleItemOwnerTokenIds;

    // Mapping from non-fungible item id to its index in the item owned token ids array
    mapping(uint256 => uint256) private nonFungibleItemOwnerTokenIdIndex;

    // Mapping from non-fungible token id to its owner
    mapping(uint256 => address) private nonFungibleTokenOwner;

    modifier onlyOtomItems() {
        if (msg.sender != address(otomItems)) revert NotOtomItems();
        _;
    }

    function initialize(address _coreAddress) external initializer {
        __Ownable_init(msg.sender);
        __Ownable2Step_init();

        core = IOtomItemsCore(_coreAddress);
    }

    /**
     * @dev Gets the owner of a non-fungible token
     * @param _tokenId The token ID
     * @return The owner of the token
     */
    function getNonFungibleTokenOwner(uint256 _tokenId) external view override returns (address) {
        if (core.isFungibleTokenId(_tokenId)) revert InvalidItem();
        return nonFungibleTokenOwner[_tokenId];
    }

    /**
     * @dev Gets a paginated list of token IDs for a non-fungible item
     * @param _itemId The non-fungible item ID
     * @param _offset The starting index in the token ID array
     * @param _limit The maximum number of token IDs to return
     * @return A paginated array of token IDs
     */
    function getNonFungibleItemTokenIdsPaginated(
        uint256 _itemId,
        uint256 _offset,
        uint256 _limit
    ) external view override returns (uint256[] memory) {
        if (_itemId >= core.nextItemId()) revert InvalidItem();
        if (core.getItemByItemId(_itemId).itemType != ItemType.NON_FUNGIBLE) revert InvalidItem();

        uint256[] storage allTokenIds = nonFungibleItemTokenIds[_itemId];
        uint256 totalTokens = allTokenIds.length;

        // Check if offset is valid
        if (_offset >= totalTokens) {
            return new uint256[](0);
        }

        // Calculate how many tokens we can actually return
        uint256 returnSize = (_offset + _limit > totalTokens) ? totalTokens - _offset : _limit;

        uint256[] memory result = new uint256[](returnSize);

        for (uint256 i = 0; i < returnSize; i++) {
            result[i] = allTokenIds[_offset + i];
        }

        return result;
    }

    /**
     * @dev Gets a paginated list of token IDs for a non-fungible item owned by a specific address
     * @param _owner The address to get token IDs for
     * @param _itemId The non-fungible item ID
     * @param _offset The starting index in the token ID array
     * @param _limit The maximum number of token IDs to return
     * @return A paginated array of token IDs
     */
    function getNonFungibleItemOwnerTokenIdsPaginated(
        address _owner,
        uint256 _itemId,
        uint256 _offset,
        uint256 _limit
    ) external view override returns (uint256[] memory) {
        if (_itemId >= core.nextItemId()) revert InvalidItem();
        if (core.getItemByItemId(_itemId).itemType != ItemType.NON_FUNGIBLE) revert InvalidItem();

        uint256[] storage allTokenIds = nonFungibleItemOwnerTokenIds[_itemId][_owner];
        uint256 totalTokens = allTokenIds.length;

        // Check if offset is valid
        if (_offset >= totalTokens) {
            return new uint256[](0);
        }

        // Calculate how many tokens we can actually return
        uint256 returnSize = (_offset + _limit > totalTokens) ? totalTokens - _offset : _limit;

        uint256[] memory result = new uint256[](returnSize);

        for (uint256 i = 0; i < returnSize; i++) {
            result[i] = allTokenIds[_offset + i];
        }

        return result;
    }

    /**
     * @dev Gets the supply of an item
     * @param _itemId The item ID
     * @return The supply of the item
     */
    function getItemSupply(uint256 _itemId) external view override returns (uint256) {
        if (_itemId >= core.nextItemId()) revert InvalidItem();

        if (core.getItemByItemId(_itemId).itemType == ItemType.NON_FUNGIBLE) {
            return nonFungibleItemSupply[_itemId];
        } else {
            return otomItems.totalSupply(_itemId);
        }
    }

    /**
     * @dev Handles updates to the item supply and token IDs. Called on every token transfer
     * @notice Keeps track of fungible tokens that exist for given items to make it easier to find non-fungible item ownership data off-chain
     * @param from The address that initiated the update
     * @param to The address that will receive the updated tokens
     * @param ids The IDs of the items being updated
     * @param values The amounts of items being added or removed
     */
    function onUpdate(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values
    ) external override onlyOtomItems {
        for (uint256 i = 0; i < ids.length; i++) {
            if (!core.isFungibleTokenId(ids[i])) {
                // Set new owner
                nonFungibleTokenOwner[ids[i]] = to;

                uint256 itemId = core.getItemIdForToken(ids[i]);
                uint256 tokenId = ids[i];
                uint256 amount = values[i];

                if (from == address(0)) {
                    // Increase supply count for the item
                    nonFungibleItemSupply[itemId] += amount;

                    // Add the token ID to the item's token ID array
                    nonFungibleItemTokenIds[itemId].push(tokenId);
                    nonFungibleItemTokenIdIndex[tokenId] =
                        nonFungibleItemTokenIds[itemId].length -
                        1;

                    // Add the token ID to the owner's token ID array
                    nonFungibleItemOwnerTokenIds[itemId][to].push(tokenId);
                } else {
                    // Decrease supply count for the item
                    nonFungibleItemSupply[itemId] -= amount;

                    // Remove the token ID from the item's token ID array
                    uint256 tokenIdAllIndex = nonFungibleItemTokenIdIndex[tokenId];
                    uint256 lastIndexAllTokenIds = nonFungibleItemTokenIds[itemId].length - 1;
                    nonFungibleItemTokenIds[itemId][tokenIdAllIndex] = nonFungibleItemTokenIds[
                        itemId
                    ][lastIndexAllTokenIds];
                    nonFungibleItemTokenIds[itemId].pop();
                    delete nonFungibleItemTokenIdIndex[tokenId];

                    // Remove the token ID from the owner's token ID array
                    uint256 tokenIdOwnerIndex = nonFungibleItemOwnerTokenIdIndex[tokenId];
                    uint256 lastIndexOwnerTokenIds = nonFungibleItemOwnerTokenIds[itemId][from]
                        .length - 1;
                    nonFungibleItemOwnerTokenIds[itemId][from][
                        tokenIdOwnerIndex
                    ] = nonFungibleItemOwnerTokenIds[itemId][from][lastIndexOwnerTokenIds];
                    nonFungibleItemOwnerTokenIds[itemId][from].pop();
                    delete nonFungibleItemOwnerTokenIdIndex[tokenId];
                }
            }
        }
    }

    function setOtomItems(address _otomItemsAddress) external onlyOwner {
        otomItems = IOtomItems(_otomItemsAddress);
        emit OtomItemsSet(_otomItemsAddress);
    }

    function setCore(address _coreAddress) external onlyOwner {
        core = IOtomItemsCore(_coreAddress);
        emit CoreSet(_coreAddress);
    }

    /**
     * @dev Gets a paginated list of all items
     * @param _offset The starting index (0-based)
     * @param _limit The maximum number of items to return
     * @return A paginated array of items
     */
    function getAllItemsPaginated(
        uint256 _offset,
        uint256 _limit
    ) external view override returns (Item[] memory) {
        uint256 nextItemId = core.nextItemId();

        // Item IDs start at 1, but offset is 0-based
        // So the actual first item ID is 1, but offset 0 points to it
        if (_offset >= nextItemId - 1) {
            return new Item[](0);
        }

        // Calculate how many items we can actually return
        uint256 returnSize = (_offset + _limit > nextItemId - 1)
            ? (nextItemId - 1 - _offset)
            : _limit;

        Item[] memory result = new Item[](returnSize);

        for (uint256 i = 0; i < returnSize; i++) {
            // Item IDs start at 1, so we add 1 to the offset + index
            result[i] = core.getItemByItemId(_offset + i + 1);
        }

        return result;
    }
}
