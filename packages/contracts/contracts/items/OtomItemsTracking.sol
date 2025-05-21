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
                    // Mint case - tokens are created
                    // Increase supply count for the item
                    nonFungibleItemSupply[itemId] += amount;

                    // Add the token ID to the item's token ID array
                    nonFungibleItemTokenIds[itemId].push(tokenId);
                    nonFungibleItemTokenIdIndex[tokenId] =
                        nonFungibleItemTokenIds[itemId].length -
                        1;

                    // Add the token ID to the owner's token ID array
                    nonFungibleItemOwnerTokenIds[itemId][to].push(tokenId);
                    nonFungibleItemOwnerTokenIdIndex[tokenId] =
                        nonFungibleItemOwnerTokenIds[itemId][to].length -
                        1;
                } else if (to == address(0)) {
                    // Burn case - tokens are destroyed
                    // Decrease supply count for the item
                    nonFungibleItemSupply[itemId] -= amount;

                    // Remove the token ID from the item's token ID array
                    uint256 tokenIdAllIndex = nonFungibleItemTokenIdIndex[tokenId];
                    uint256 lastIndexAllTokenIds = nonFungibleItemTokenIds[itemId].length - 1;
                    nonFungibleItemTokenIds[itemId][tokenIdAllIndex] = nonFungibleItemTokenIds[
                        itemId
                    ][lastIndexAllTokenIds];
                    // Update index for the swapped token
                    if (tokenIdAllIndex != lastIndexAllTokenIds) {
                        uint256 swappedTokenId = nonFungibleItemTokenIds[itemId][tokenIdAllIndex];
                        nonFungibleItemTokenIdIndex[swappedTokenId] = tokenIdAllIndex;
                    }
                    nonFungibleItemTokenIds[itemId].pop();
                    delete nonFungibleItemTokenIdIndex[tokenId];

                    // Remove the token ID from the owner's token ID array
                    uint256 tokenIdOwnerIndex = nonFungibleItemOwnerTokenIdIndex[tokenId];
                    uint256 lastIndexOwnerTokenIds = nonFungibleItemOwnerTokenIds[itemId][from]
                        .length - 1;
                    nonFungibleItemOwnerTokenIds[itemId][from][
                        tokenIdOwnerIndex
                    ] = nonFungibleItemOwnerTokenIds[itemId][from][lastIndexOwnerTokenIds];
                    // Update index for the swapped token
                    if (tokenIdOwnerIndex != lastIndexOwnerTokenIds) {
                        uint256 swappedTokenId = nonFungibleItemOwnerTokenIds[itemId][from][
                            tokenIdOwnerIndex
                        ];
                        nonFungibleItemOwnerTokenIdIndex[swappedTokenId] = tokenIdOwnerIndex;
                    }
                    nonFungibleItemOwnerTokenIds[itemId][from].pop();
                    delete nonFungibleItemOwnerTokenIdIndex[tokenId];
                } else {
                    // Transfer case - tokens are moved between accounts

                    // Remove the token ID from the previous owner's token ID array
                    uint256 tokenIdOwnerIndex = nonFungibleItemOwnerTokenIdIndex[tokenId];
                    uint256 lastIndexOwnerTokenIds = nonFungibleItemOwnerTokenIds[itemId][from]
                        .length - 1;
                    nonFungibleItemOwnerTokenIds[itemId][from][
                        tokenIdOwnerIndex
                    ] = nonFungibleItemOwnerTokenIds[itemId][from][lastIndexOwnerTokenIds];
                    // Update index for the swapped token
                    if (tokenIdOwnerIndex != lastIndexOwnerTokenIds) {
                        uint256 swappedTokenId = nonFungibleItemOwnerTokenIds[itemId][from][
                            tokenIdOwnerIndex
                        ];
                        nonFungibleItemOwnerTokenIdIndex[swappedTokenId] = tokenIdOwnerIndex;
                    }
                    nonFungibleItemOwnerTokenIds[itemId][from].pop();

                    // Add the token ID to the new owner's token ID array
                    nonFungibleItemOwnerTokenIds[itemId][to].push(tokenId);
                    nonFungibleItemOwnerTokenIdIndex[tokenId] =
                        nonFungibleItemOwnerTokenIds[itemId][to].length -
                        1;
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

    /**
     * @dev Updates the ownership tracking for a single non-fungible token
     * @notice Used to fix ownership tracking after contract upgrade
     * @param _tokenId The token ID to update
     * @param _currentOwner The current owner of the token (should match actual ownership on OtomItems)
     */
    function _updateNonFungibleTokenOwnership(uint256 _tokenId, address _currentOwner) internal {
        if (core.isFungibleTokenId(_tokenId)) revert InvalidItem();

        uint256 itemId = core.getItemIdForToken(_tokenId);
        address oldOwner = nonFungibleTokenOwner[_tokenId];

        // Verify the new owner has the token
        uint256 balance = otomItems.balanceOf(_currentOwner, _tokenId);
        if (balance == 0) revert InvalidInput();

        // Check if the token is already in the owner's token list
        bool tokenInOwnerList = false;
        uint256 ownerTokenCount = nonFungibleItemOwnerTokenIds[itemId][_currentOwner].length;
        for (uint256 i = 0; i < ownerTokenCount; i++) {
            if (nonFungibleItemOwnerTokenIds[itemId][_currentOwner][i] == _tokenId) {
                tokenInOwnerList = true;
                break;
            }
        }

        // If the token is not in the current owner's list, add it
        if (!tokenInOwnerList) {
            // First remove from any old owner's list if needed
            if (oldOwner != address(0) && oldOwner != _currentOwner) {
                // Try to find and remove the token from the old owner's list
                uint256 oldOwnerTokenCount = nonFungibleItemOwnerTokenIds[itemId][oldOwner].length;
                for (uint256 i = 0; i < oldOwnerTokenCount; i++) {
                    if (nonFungibleItemOwnerTokenIds[itemId][oldOwner][i] == _tokenId) {
                        // Found the token, remove it by swapping with the last element
                        uint256 lastIndex = oldOwnerTokenCount - 1;
                        if (i != lastIndex) {
                            uint256 lastTokenId = nonFungibleItemOwnerTokenIds[itemId][oldOwner][
                                lastIndex
                            ];
                            nonFungibleItemOwnerTokenIds[itemId][oldOwner][i] = lastTokenId;
                            nonFungibleItemOwnerTokenIdIndex[lastTokenId] = i;
                        }
                        nonFungibleItemOwnerTokenIds[itemId][oldOwner].pop();
                        delete nonFungibleItemOwnerTokenIdIndex[_tokenId];
                        break;
                    }
                }
            }

            // Add to current owner's list
            nonFungibleItemOwnerTokenIds[itemId][_currentOwner].push(_tokenId);
            nonFungibleItemOwnerTokenIdIndex[_tokenId] =
                nonFungibleItemOwnerTokenIds[itemId][_currentOwner].length -
                1;
        }

        // Only update the owner mapping if it's different
        if (oldOwner != _currentOwner) {
            nonFungibleTokenOwner[_tokenId] = _currentOwner;
        }
    }

    /**
     * @dev Fix a token's presence in the global token ID list for an item
     * @param _tokenId The token ID to fix
     */
    function _fixTokenInGlobalList(uint256 _tokenId) internal {
        if (core.isFungibleTokenId(_tokenId)) revert InvalidItem();

        uint256 itemId = core.getItemIdForToken(_tokenId);

        // Check if token is already in the global list
        bool tokenInGlobalList = false;
        uint256 globalCount = nonFungibleItemTokenIds[itemId].length;

        for (uint256 i = 0; i < globalCount; i++) {
            if (nonFungibleItemTokenIds[itemId][i] == _tokenId) {
                tokenInGlobalList = true;
                break;
            }
        }

        // If not in global list, add it
        if (!tokenInGlobalList) {
            nonFungibleItemTokenIds[itemId].push(_tokenId);
            nonFungibleItemTokenIdIndex[_tokenId] = nonFungibleItemTokenIds[itemId].length - 1;

            // Update supply if needed
            nonFungibleItemSupply[itemId] += 1;
        }
    }

    /**
     * @dev Full reconciliation of a token's tracking data
     * @param _tokenId The token ID to reconcile
     * @param _currentOwner The actual owner of the token
     */
    function reconcileToken(uint256 _tokenId, address _currentOwner) external onlyOwner {
        _updateNonFungibleTokenOwnership(_tokenId, _currentOwner);
        _fixTokenInGlobalList(_tokenId);
    }

    /**
     * @dev Gets all addresses that own tokens from a specific item
     * @param _itemId The item ID to get owners for
     * @return Array of owner addresses
     */
    function _getItemOwners(uint256 _itemId) internal view returns (address[] memory) {
        if (_itemId >= core.nextItemId()) revert InvalidItem();
        if (core.getItemByItemId(_itemId).itemType != ItemType.NON_FUNGIBLE) revert InvalidItem();

        uint256[] storage allTokenIds = nonFungibleItemTokenIds[_itemId];
        uint256 tokenCount = allTokenIds.length;

        // First pass: count unique owners
        address[] memory tempOwners = new address[](tokenCount);
        uint256 ownerCount = 0;

        for (uint256 i = 0; i < tokenCount; i++) {
            uint256 tokenId = allTokenIds[i];
            address owner = nonFungibleTokenOwner[tokenId];

            if (owner != address(0)) {
                bool isNew = true;
                for (uint256 j = 0; j < ownerCount; j++) {
                    if (tempOwners[j] == owner) {
                        isNew = false;
                        break;
                    }
                }

                if (isNew) {
                    tempOwners[ownerCount] = owner;
                    ownerCount++;
                }
            }
        }

        // Second pass: create properly sized array
        address[] memory owners = new address[](ownerCount);
        for (uint256 i = 0; i < ownerCount; i++) {
            owners[i] = tempOwners[i];
        }

        return owners;
    }

    /**
     * @dev Mass reconciliation function to fix multiple tokens at once
     * @param _tokenIds Array of token IDs to reconcile
     * @param _currentOwners Array of current owners corresponding to each token
     */
    function batchReconcileTokens(
        uint256[] calldata _tokenIds,
        address[] calldata _currentOwners
    ) external onlyOwner {
        if (_tokenIds.length != _currentOwners.length) revert InvalidInput();

        for (uint256 i = 0; i < _tokenIds.length; i++) {
            _updateNonFungibleTokenOwnership(_tokenIds[i], _currentOwners[i]);
            _fixTokenInGlobalList(_tokenIds[i]);
        }
    }

    /**
     * @dev Directly update global token list for an item
     * @param _itemId The item ID to update
     * @param _tokenIds Array of token IDs for this item
     */
    function updateGlobalTokenList(
        uint256 _itemId,
        uint256[] calldata _tokenIds
    ) external onlyOwner {
        // Clear existing global token list
        delete nonFungibleItemTokenIds[_itemId];

        // Rebuild the global token list
        for (uint256 i = 0; i < _tokenIds.length; i++) {
            nonFungibleItemTokenIds[_itemId].push(_tokenIds[i]);
            nonFungibleItemTokenIdIndex[_tokenIds[i]] = i;
        }

        // Update the supply count
        nonFungibleItemSupply[_itemId] = _tokenIds.length;
    }

    /**
     * @dev Update owner token lists for an item
     * @param _itemId The item ID to update
     * @param _owners Array of owner addresses
     * @param _ownerTokenIds Array of arrays containing token IDs owned by each owner
     */
    function updateOwnerTokenLists(
        uint256 _itemId,
        address[] calldata _owners,
        uint256[][] calldata _ownerTokenIds
    ) external onlyOwner {
        if (_owners.length != _ownerTokenIds.length) revert InvalidInput();

        for (uint256 i = 0; i < _owners.length; i++) {
            address owner = _owners[i];
            uint256[] calldata tokenIds = _ownerTokenIds[i];

            // Clear existing data for this owner
            delete nonFungibleItemOwnerTokenIds[_itemId][owner];

            // Rebuild owner token list
            for (uint256 j = 0; j < tokenIds.length; j++) {
                nonFungibleItemOwnerTokenIds[_itemId][owner].push(tokenIds[j]);
                nonFungibleItemOwnerTokenIdIndex[tokenIds[j]] = j;
            }
        }
    }
}
