// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {ReentrancyGuardUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {EnumerableSet} from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import {IOtomsV2} from "../interfaces/IOtomsV2.sol";
import {IOtomItemsCore, BlueprintComponent, ComponentType, Item, ItemType, Trait, ActualBlueprintComponent} from "../interfaces/IOtomItemsCore.sol";
import {IOtomItemMutator} from "../interfaces/IOtomItemMutator.sol";
import {IOtomItems} from "../interfaces/IOtomItems.sol";
import {IOtomItemsRenderer} from "../interfaces/IOtomItemsRenderer.sol";
import {IOtomItemsValidator} from "../interfaces/IOtomItemsValidator.sol";

/**
 * @title OtomItemsCore
 * @dev ERC1155 contract for items that can be minted using blueprints of Otoms tokens and other items
 */
contract OtomItemsCore is
    Initializable,
    OwnableUpgradeable,
    ReentrancyGuardUpgradeable,
    IOtomItemsCore
{
    using EnumerableSet for EnumerableSet.Bytes32Set;

    // Interface to interact with the Otoms contract
    IOtomsV2 private _otoms;

    // Interface to interact with the OtomItems contract
    IOtomItems private _otomItems;

    // Interface to interact with the OtomItemsValidator contract
    IOtomItemsValidator private _validator;

    // Renderer for items
    IOtomItemsRenderer private _renderer;

    // Mapping from item ID to its data
    mapping(uint256 => Item) private _items;

    // Mapping to track frozen items (cannot be updated)
    mapping(uint256 => bool) public frozenItems;

    // Mapping from token ID to its item ID (for non-fungible items)
    mapping(uint256 => uint256) private _nonFungibleTokenToItemId;

    // Mapping from non-fungible token ID to its actual blueprint components
    mapping(uint256 => ActualBlueprintComponent[]) private _nonFungibleTokenToActualBlueprint;

    // Mapping from token ID to its trait keys (for both fungible and non-fungible)
    mapping(uint256 => EnumerableSet.Bytes32Set) private _tokenTraitKeys;

    // Mapping from token ID to trait key to its trait details
    mapping(uint256 => mapping(bytes32 => Trait)) private _tokenTraitDetails;

    // Mapping of non fungible token ID to its tier
    mapping(uint256 => uint256) public nonFungibleTokenToTier;

    // Counter for item IDs
    uint256 public nextItemId;

    // Mapping to track mint count per item ID for non-fungible items
    mapping(uint256 => uint256) public itemMintCount;

    // Whether creation is enabled
    bool public creationEnabled;

    // Mapping to track approvals per item ID
    mapping(address => mapping(uint256 => mapping(address => bool))) private _itemApprovals; // owner => itemId => operator => approved

    // Mapping to track approvals per token ID
    mapping(address => mapping(uint256 => mapping(address => bool))) private _tokenApprovals; // owner => tokenId => operator => approved

    /**
     * @notice This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[1_000] private __gap;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @dev Initializes the contract with the Otoms contract address
     * @param _otomsAddress Address of the Otoms contract
     */
    function initialize(address _otomsAddress, address _otomsValidationAddress) public initializer {
        __Ownable_init(msg.sender);
        __ReentrancyGuard_init();

        _otoms = IOtomsV2(_otomsAddress);
        _validator = IOtomItemsValidator(_otomsValidationAddress);
        nextItemId = 1;
    }

    /**
     * @dev Modifier to check if an item is not frozen
     */
    modifier notFrozen(uint256 _itemId) {
        if (frozenItems[_itemId]) revert ItemIsFrozen(_itemId);
        _;
    }

    ////////////////////////////////// ERC1155 ////////////////////////////////

    function getTokenUri(uint256 tokenId) external view override returns (string memory) {
        return _renderer.getMetadata(tokenId);
    }

    ////////////////////////////////// PUBLIC CORE ////////////////////////////////

    /**
     * @dev Creates a new fungible item type
     * @param _name Name of the item
     * @param _description Description of the item
     * @param _defaultImageUri URI for the item's image
     * @param _blueprint Array of components required to craft this item
     * @param _traits Array of traits for the item
     * @param _ethCostInWei Cost in Wei to craft the item (0 for no cost)
     * @param _feeRecipient Address that receives the payment (address(0) for no recipient)
     * @return ID of the created item
     */
    function createFungibleItem(
        string calldata _name,
        string calldata _description,
        string calldata _defaultImageUri,
        BlueprintComponent[] calldata _blueprint,
        Trait[] calldata _traits,
        uint256 _ethCostInWei,
        address _feeRecipient
    ) external override returns (uint256) {
        if (!creationEnabled && msg.sender != owner()) revert CreationDisabled();
        if (bytes(_name).length == 0) revert InvalidName();
        if (_ethCostInWei > 0 && _feeRecipient == address(0)) revert InvalidFeeRecipient();

        // Validate that variable components are not used in fungible items
        for (uint256 i = 0; i < _blueprint.length; i++) {
            if (
                _blueprint[i].componentType == ComponentType.VARIABLE_OTOM ||
                _blueprint[i].componentType == ComponentType.NON_FUNGIBLE_ITEM
            ) {
                revert InvalidItem();
            }
        }

        uint256 itemId = nextItemId++;
        Item storage item = _items[itemId];

        item.id = itemId;
        item.name = _name;
        item.description = _description;
        item.defaultImageUri = _defaultImageUri;
        item.creator = msg.sender;
        item.admin = msg.sender;
        item.ethCostInWei = _ethCostInWei;
        item.feeRecipient = _feeRecipient;

        item.itemType = ItemType.FUNGIBLE;

        for (uint256 i = 0; i < _blueprint.length; i++) {
            item.blueprint.push(_blueprint[i]);
        }

        // For fungible items, traits are stored directly with the itemId as the key
        _setItemTraits(itemId, _traits);

        emit ItemCreated(msg.sender, itemId, _name);
        return itemId;
    }

    /**
     * @dev Creates a new non-fungible item type
     * @param _name Name of the item
     * @param _description Description of the item
     * @param _defaultImageUri URI for the item's default image
     * @param _defaultTierImageUris Default URIs for each tier (1-7)
     * @param _blueprint Array of components required to craft this item
     * @param _traits Default traits for the item type
     * @param _mutatorContract Address of the mutator contract
     * @param _ethCostInWei Cost in Wei to craft the item (0 for no cost)
     * @param _feeRecipient Address that receives the payment (address(0) for no recipient)
     * @return ID of the created item
     */
    function createNonFungibleItem(
        string calldata _name,
        string calldata _description,
        string calldata _defaultImageUri,
        string[7] calldata _defaultTierImageUris,
        BlueprintComponent[] calldata _blueprint,
        Trait[] calldata _traits,
        address _mutatorContract,
        uint256 _ethCostInWei,
        address _feeRecipient
    ) external override returns (uint256) {
        if (!creationEnabled && msg.sender != owner()) revert CreationDisabled();
        if (bytes(_name).length == 0) revert InvalidName();
        if (_ethCostInWei > 0 && _feeRecipient == address(0)) revert InvalidFeeRecipient();

        // Validate that variable components have amount=1
        for (uint256 i = 0; i < _blueprint.length; i++) {
            if (
                (_blueprint[i].componentType == ComponentType.VARIABLE_OTOM ||
                    _blueprint[i].componentType == ComponentType.NON_FUNGIBLE_ITEM) &&
                _blueprint[i].amount != 1
            ) {
                revert InvalidBlueprintComponent();
            }
        }

        uint256 itemId = nextItemId++;
        Item storage item = _items[itemId];

        item.id = itemId;
        item.name = _name;
        item.description = _description;
        item.defaultImageUri = _defaultImageUri;
        item.creator = msg.sender;
        item.admin = msg.sender;
        item.ethCostInWei = _ethCostInWei;
        item.feeRecipient = _feeRecipient;

        // Store default tier-specific image URIs
        for (uint256 i = 0; i < 7; i++) {
            item.defaultTierImageUris[i] = _defaultTierImageUris[i];
        }

        item.itemType = ItemType.NON_FUNGIBLE;
        item.mutatorContract = _mutatorContract;

        for (uint256 i = 0; i < _blueprint.length; i++) {
            item.blueprint.push(_blueprint[i]);
        }

        // For non-fungible items, traits will be initialized per token during minting
        // Store the default traits with the itemId as the key for later use during minting
        _setItemTraits(itemId, _traits);

        emit ItemCreated(msg.sender, itemId, _name);
        return itemId;
    }

    /**
     * @dev Updates an existing fungible item type
     * @param _itemId ID of the item to update
     * @param _name New name for the item
     * @param _description New description for the item
     * @param _blueprint New blueprint array
     * @param _traits New traits
     * @param _ethCostInWei New cost in Wei to craft the item (0 for no cost)
     * @param _feeRecipient New address that receives the payment (address(0) for no recipient)
     */
    function updateFungibleItem(
        uint256 _itemId,
        string calldata _name,
        string calldata _description,
        BlueprintComponent[] calldata _blueprint,
        Trait[] calldata _traits,
        uint256 _ethCostInWei,
        address _feeRecipient
    ) external override notFrozen(_itemId) {
        if (_itemId >= nextItemId) revert ItemDoesNotExist();
        if (_items[_itemId].admin != msg.sender) revert NotAdmin();
        if (_items[_itemId].itemType != ItemType.FUNGIBLE) revert InvalidItem();
        if (bytes(_name).length == 0) revert InvalidName();
        if (_ethCostInWei > 0 && _feeRecipient == address(0)) revert InvalidFeeRecipient();

        // Validate that variable components are not used in fungible items
        for (uint256 i = 0; i < _blueprint.length; i++) {
            if (
                _blueprint[i].componentType == ComponentType.VARIABLE_OTOM ||
                _blueprint[i].componentType == ComponentType.NON_FUNGIBLE_ITEM
            ) {
                revert InvalidBlueprintComponent();
            }
        }

        // Update basic item properties
        Item storage item = _items[_itemId];
        item.name = _name;
        item.description = _description;
        item.ethCostInWei = _ethCostInWei;
        item.feeRecipient = _feeRecipient;

        // Clear existing blueprint
        delete item.blueprint;

        // Add new blueprint components
        for (uint256 i = 0; i < _blueprint.length; i++) {
            item.blueprint.push(_blueprint[i]);
        }

        // Update traits
        _setItemTraits(_itemId, _traits);

        _otomItems.emitMetadataUpdate(_itemId);

        emit ItemUpdated(_itemId);
    }

    /**
     * @dev Updates an existing non-fungible item type
     * @param _itemId ID of the item to update
     * @param _name New name for the item
     * @param _description New description for the item
     * @param _defaultImageUri New default image URI
     * @param _defaultTierImageUris New default URIs for each tier (1-7)
     * @param _blueprint New blueprint array
     * @param _traits New default traits
     * @param _mutatorContract New mutator contract address
     * @param _ethCostInWei New cost in Wei to craft the item (0 for no cost)
     * @param _feeRecipient New address that receives the payment (address(0) for no recipient)
     */
    function updateNonFungibleItem(
        uint256 _itemId,
        string calldata _name,
        string calldata _description,
        string calldata _defaultImageUri,
        string[7] calldata _defaultTierImageUris,
        BlueprintComponent[] calldata _blueprint,
        Trait[] calldata _traits,
        address _mutatorContract,
        uint256 _ethCostInWei,
        address _feeRecipient
    ) external override notFrozen(_itemId) {
        if (_itemId >= nextItemId) revert ItemDoesNotExist();
        if (_items[_itemId].admin != msg.sender) revert NotAdmin();
        if (_items[_itemId].itemType != ItemType.NON_FUNGIBLE) revert InvalidItem();
        if (bytes(_name).length == 0) revert InvalidName();
        if (_ethCostInWei > 0 && _feeRecipient == address(0)) revert InvalidFeeRecipient();

        // Validate that variable components have amount=1
        for (uint256 i = 0; i < _blueprint.length; i++) {
            if (
                (_blueprint[i].componentType == ComponentType.VARIABLE_OTOM ||
                    _blueprint[i].componentType == ComponentType.NON_FUNGIBLE_ITEM) &&
                _blueprint[i].amount != 1
            ) {
                revert InvalidBlueprintComponent();
            }
        }

        // Update basic item properties
        Item storage item = _items[_itemId];
        item.name = _name;
        item.description = _description;
        item.defaultImageUri = _defaultImageUri;
        item.mutatorContract = _mutatorContract;
        item.ethCostInWei = _ethCostInWei;
        item.feeRecipient = _feeRecipient;

        // Update default tier image URIs
        for (uint256 i = 0; i < 7; i++) {
            item.defaultTierImageUris[i] = _defaultTierImageUris[i];
        }

        // Clear existing blueprint
        delete item.blueprint;

        // Add new blueprint components
        for (uint256 i = 0; i < _blueprint.length; i++) {
            item.blueprint.push(_blueprint[i]);
        }

        // Update default traits
        _setItemTraits(_itemId, _traits);

        emit ItemUpdated(_itemId);
    }

    /**
     * @dev Set a new admin for an item
     * @param _itemId The item ID
     * @param _admin The new admin address
     */
    function setItemAdmin(uint256 _itemId, address _admin) external notFrozen(_itemId) {
        if (_itemId >= nextItemId) revert ItemDoesNotExist();
        if (_items[_itemId].admin != msg.sender) revert NotAdmin();
        _items[_itemId].admin = _admin;
    }

    /**
     * @dev Approves an operator to use all tokens of specific item types owned by the caller
     * @param _operator Address to approve
     * @param _itemIds Array of item IDs to approve for
     * @param _approved Whether the operator is approved
     */
    function setApprovalForItemIds(
        address _operator,
        uint256[] calldata _itemIds,
        bool _approved
    ) external {
        for (uint256 i = 0; i < _itemIds.length; i++) {
            uint256 itemId = _itemIds[i];
            _itemApprovals[msg.sender][itemId][_operator] = _approved;
        }
        emit ItemsApprovalForAll(msg.sender, _itemIds, _operator, _approved);
    }

    /**
     * @dev Approves an operator to use specific tokens owned by the caller
     * @param _operator Address to approve
     * @param _tokenIds Array of token IDs to approve for
     * @param _approved Whether the operator is approved
     */
    function setApprovalForTokenIds(
        address _operator,
        uint256[] calldata _tokenIds,
        bool _approved
    ) external {
        for (uint256 i = 0; i < _tokenIds.length; i++) {
            uint256 tokenId = _tokenIds[i];
            _tokenApprovals[msg.sender][tokenId][_operator] = _approved;
        }
        emit TokensApprovalForAll(msg.sender, _tokenIds, _operator, _approved);
    }

    /**
     * @dev Freezes an item permanently, preventing any future updates to its configuration
     * This is a one-way operation and cannot be reversed
     * @param _itemId The ID of the item to freeze
     */
    function freezeItem(uint256 _itemId) external {
        if (_itemId >= nextItemId) revert ItemDoesNotExist();

        // Only the item admin can freeze an item
        if (_items[_itemId].admin != msg.sender) revert NotAdmin();

        // Prevent freezing twice
        if (frozenItems[_itemId]) revert ItemAlreadyFrozen();

        frozenItems[_itemId] = true;
        emit ItemFrozen(_itemId);
    }

    /**
     * @dev Crafts an item using its blueprint
     * @param _itemId ID of the item to craft
     * @param _amount Amount of items to craft
     * @param _variableOtomIds Array of token IDs to use for VARIABLE_OTOM components
     * @param _nonFungibleTokenIds Array of token IDs to use for NON_FUNGIBLE_ITEM components
     * @param _data Additional data for the crafting process
     */
    function craftItem(
        uint256 _itemId,
        uint256 _amount,
        uint256[] calldata _variableOtomIds,
        uint256[] calldata _nonFungibleTokenIds,
        bytes calldata _data
    ) external payable override nonReentrant {
        if (_itemId >= nextItemId) revert ItemDoesNotExist();
        if (_amount == 0) revert InvalidCraftAmount();

        Item storage item = _items[_itemId];

        bool requiresItemsOrOtoms = true;

        if (item.mutatorContract != address(0)) {
            try
                IOtomItemMutator(item.mutatorContract).onCraft(
                    msg.sender,
                    _itemId,
                    _amount,
                    _variableOtomIds,
                    _nonFungibleTokenIds,
                    _data
                )
            returns (bool _allowed, bool _requiresItemsOrOtoms) {
                if (!_allowed) revert CraftBlocked();
                requiresItemsOrOtoms = _requiresItemsOrOtoms;
            } catch {
                revert MutatorFailed();
            }
        }

        if (item.itemType == ItemType.NON_FUNGIBLE && _amount != 1) revert InvalidCraftAmount();

        uint256 actualPayment = _processPayment(item, _amount);

        if (requiresItemsOrOtoms) {
            _validateComponents(item, _amount, _variableOtomIds, _nonFungibleTokenIds);
        }

        ActualBlueprintComponent[] memory actualComponents = _consumeComponents(
            item,
            _amount,
            _variableOtomIds,
            _nonFungibleTokenIds
        );

        if (item.itemType == ItemType.FUNGIBLE) {
            _mintFungibleItem(item.id, _amount);
        } else {
            uint256 mintCount = itemMintCount[item.id]++;

            _mintNonFungibleItem(
                item,
                _itemId,
                actualComponents,
                _variableOtomIds,
                _nonFungibleTokenIds,
                getNonFungibleTokenId(item.id, mintCount),
                actualPayment
            );
        }
    }

    /**
     * @dev Processes payment for crafting
     * @param item The item being crafted
     * @param amount Amount of items being crafted
     * @return The actual payment amount (relevant for non-fungible items)
     */
    function _processPayment(Item storage item, uint256 amount) private returns (uint256) {
        uint256 totalCost = item.ethCostInWei * amount;

        // If no payment needed
        if (totalCost == 0 && msg.value == 0) {
            return 0;
        }

        // Check if sufficient payment was provided
        if (totalCost > 0 && msg.value < totalCost) {
            revert InsufficientPayment(totalCost, msg.value);
        }

        if (item.itemType == ItemType.FUNGIBLE) {
            // For fungible items, only send the exact cost
            if (totalCost > 0) {
                (bool success, ) = item.feeRecipient.call{value: totalCost}("");
                if (!success) revert PaymentFailed();
            }

            // Return any excess payment
            if (msg.value > totalCost) {
                (bool refundSuccess, ) = msg.sender.call{value: msg.value - totalCost}("");
                if (!refundSuccess) revert RefundFailed();
            }

            return totalCost; // Return actual cost paid
        } else {
            // For non-fungible items, send the entire payment (can affect tier)
            if (msg.value > 0) {
                (bool success, ) = item.feeRecipient.call{value: msg.value}("");
                if (!success) revert PaymentFailed();
            }

            return msg.value; // Return full payment amount
        }
    }

    /**
     * @dev Validates components required for crafting
     * @param item The item being crafted
     * @param amount Amount of items being crafted
     * @param variableOtomIds Array of token IDs to use for VARIABLE_OTOM components
     * @param nonFungibleTokenIds Array of token IDs to use for NON_FUNGIBLE_ITEM components
     */
    function _validateComponents(
        Item storage item,
        uint256 amount,
        uint256[] calldata variableOtomIds,
        uint256[] calldata nonFungibleTokenIds
    ) private view {
        // Count required variable components
        (uint256 requiredVariableOtoms, uint256 requiredVariableItems) = _countVariableComponents(
            item,
            amount
        );

        // Validate array lengths
        if (variableOtomIds.length != requiredVariableOtoms) {
            revert InsufficientMatchingOtoms(requiredVariableOtoms, variableOtomIds.length);
        }
        if (nonFungibleTokenIds.length != requiredVariableItems) {
            revert InsufficientMatchingItems(requiredVariableItems, nonFungibleTokenIds.length);
        }

        // Validate component balances
        _validateComponentBalances(item, amount, variableOtomIds, nonFungibleTokenIds);
    }

    /**
     * @dev Counts the number of variable components needed
     */
    function _countVariableComponents(
        Item storage item,
        uint256 amount
    ) private view returns (uint256 variableOtomCount, uint256 variableItemCount) {
        for (uint256 i = 0; i < item.blueprint.length; i++) {
            if (item.blueprint[i].componentType == ComponentType.VARIABLE_OTOM) {
                variableOtomCount += item.blueprint[i].amount * amount;
            } else if (item.blueprint[i].componentType == ComponentType.NON_FUNGIBLE_ITEM) {
                variableItemCount += item.blueprint[i].amount * amount;
            }
        }
        return (variableOtomCount, variableItemCount);
    }

    /**
     * @dev Validates that the user has sufficient balance of all required components
     */
    function _validateComponentBalances(
        Item storage item,
        uint256 amount,
        uint256[] calldata variableOtomIds,
        uint256[] calldata nonFungibleTokenIds
    ) private view {
        uint256 variableOtomIndex = 0;
        uint256 nonFungibleItemIndex = 0;

        for (uint256 i = 0; i < item.blueprint.length; i++) {
            BlueprintComponent memory component = item.blueprint[i];
            uint256 requiredAmount = component.amount * amount;

            if (component.componentType == ComponentType.OTOM) {
                // Check if the user has enough Otoms
                if (_otoms.balanceOf(msg.sender, component.itemIdOrOtomTokenId) < requiredAmount) {
                    revert InsufficientOtomBalance();
                }
            } else if (component.componentType == ComponentType.VARIABLE_OTOM) {
                // Validate variable _otoms
                for (uint256 j = 0; j < requiredAmount; j++) {
                    uint256 tokenId = variableOtomIds[variableOtomIndex + j];

                    // Verify ownership
                    if (_otoms.balanceOf(msg.sender, tokenId) < 1) {
                        revert InsufficientOtomBalance();
                    }

                    // Verify token meets criteria
                    if (!_validator.meetsCriteria(tokenId, component.criteria)) {
                        revert CriteriaNotMet();
                    }
                }

                variableOtomIndex += requiredAmount;
            } else if (component.componentType == ComponentType.FUNGIBLE_ITEM) {
                // Check if the user has enough of the required fungible item
                if (
                    _otomItems.balanceOf(msg.sender, component.itemIdOrOtomTokenId) < requiredAmount
                ) {
                    revert InsufficientItemBalance();
                }
            } else if (component.componentType == ComponentType.NON_FUNGIBLE_ITEM) {
                // Validate non-fungible items
                for (uint256 j = 0; j < requiredAmount; j++) {
                    uint256 tokenId = nonFungibleTokenIds[nonFungibleItemIndex + j];

                    // Verify ownership
                    if (_otomItems.balanceOf(msg.sender, tokenId) < 1) {
                        revert InsufficientItemBalance();
                    }

                    // Check if token is a non-fungible item
                    if (isFungibleTokenId(tokenId)) {
                        revert OnlyNonFungible();
                    }

                    // Get the item ID and verify it matches the expected item type
                    uint256 itemId = _nonFungibleTokenToItemId[tokenId];
                    if (itemId == 0) {
                        revert OnlyNonFungible();
                    }

                    // If the component has a minimum tier requirement, check it
                    if (component.criteria.length > 0) {
                        uint256 tokenTier = nonFungibleTokenToTier[tokenId];
                        uint256 minTier = component.criteria[0].minValue;

                        if (tokenTier < minTier) {
                            revert InsufficientItemTier(tokenId, tokenTier, minTier);
                        }
                    }
                }

                nonFungibleItemIndex += requiredAmount;
            }
        }
    }

    /**
     * @dev Consumes the components used for crafting
     * @return actualComponents The actual components used (for non-fungible items)
     */
    function _consumeComponents(
        Item storage item,
        uint256 amount,
        uint256[] calldata variableOtomIds,
        uint256[] calldata nonFungibleTokenIds
    ) private returns (ActualBlueprintComponent[] memory) {
        // Process components by type and get burn data
        (
            uint256[] memory standardOtomIds,
            uint256[] memory standardOtomAmounts,
            uint256[] memory standardItemIds,
            uint256[] memory standardItemAmounts,
            ActualBlueprintComponent[] memory actualComponents
        ) = _processComponents(item, amount, variableOtomIds, nonFungibleTokenIds);

        // Burn standard components in batches
        if (standardOtomIds.length > 0) {
            _otoms.burnBatch(msg.sender, standardOtomIds, standardOtomAmounts);
        }

        if (standardItemIds.length > 0) {
            _otomItems.burnBatch(msg.sender, standardItemIds, standardItemAmounts);
        }

        return actualComponents;
    }

    /**
     * @dev Process all components and return structured data for burning
     * @return standardOtomIds IDs of standard _otoms to burn
     * @return standardOtomAmounts Amounts of standard _otoms to burn
     * @return standardItemIds IDs of standard items to burn
     * @return standardItemAmounts Amounts of standard items to burn
     * @return actualComponents The actual components used (for non-fungible items)
     */
    function _processComponents(
        Item storage item,
        uint256 amount,
        uint256[] calldata variableOtomIds,
        uint256[] calldata nonFungibleTokenIds
    )
        private
        returns (
            uint256[] memory, // standardOtomIds
            uint256[] memory, // standardOtomAmounts
            uint256[] memory, // standardItemIds
            uint256[] memory, // standardItemAmounts
            ActualBlueprintComponent[] memory // actualComponents
        )
    {
        // Count standard components to size arrays
        (uint256 otomCount, uint256 itemCount) = _countStandardComponents(item);

        // Create arrays for standard components
        uint256[] memory standardOtomIds = new uint256[](otomCount);
        uint256[] memory standardOtomAmounts = new uint256[](otomCount);
        uint256[] memory standardItemIds = new uint256[](itemCount);
        uint256[] memory standardItemAmounts = new uint256[](itemCount);

        // For non-fungible items, create array for actual components
        ActualBlueprintComponent[] memory actualComponents = new ActualBlueprintComponent[](
            item.itemType == ItemType.NON_FUNGIBLE ? item.blueprint.length : 0
        );

        // Process each component type separately
        uint256 standardOtomIndex = 0;
        uint256 standardItemIndex = 0;
        uint256 variableOtomIndex = 0;
        uint256 nonFungibleItemIndex = 0;

        for (uint256 i = 0; i < item.blueprint.length; i++) {
            BlueprintComponent memory component = item.blueprint[i];
            uint256 requiredAmount = component.amount * amount;

            if (component.componentType == ComponentType.OTOM) {
                // Process standard _otoms
                standardOtomIds[standardOtomIndex] = component.itemIdOrOtomTokenId;
                standardOtomAmounts[standardOtomIndex] = requiredAmount;
                standardOtomIndex++;

                // Record for non-fungible items
                if (item.itemType == ItemType.NON_FUNGIBLE) {
                    actualComponents[i] = ActualBlueprintComponent({
                        componentType: component.componentType,
                        itemIdOrOtomTokenId: component.itemIdOrOtomTokenId,
                        amount: component.amount,
                        criteria: component.criteria
                    });
                }
            } else if (component.componentType == ComponentType.VARIABLE_OTOM) {
                // Process variable _otoms
                uint256 firstOtomId = variableOtomIds[variableOtomIndex];

                // Record for non-fungible items
                if (item.itemType == ItemType.NON_FUNGIBLE) {
                    actualComponents[i] = ActualBlueprintComponent({
                        componentType: component.componentType,
                        itemIdOrOtomTokenId: firstOtomId,
                        amount: component.amount,
                        criteria: component.criteria
                    });
                }

                // Burn each variable otom individually
                for (uint256 j = 0; j < requiredAmount; j++) {
                    uint256 tokenId = variableOtomIds[variableOtomIndex + j];
                    uint256[] memory ids = new uint256[](1);
                    uint256[] memory amounts = new uint256[](1);
                    ids[0] = tokenId;
                    amounts[0] = 1;
                    _otoms.burnBatch(msg.sender, ids, amounts);
                }

                variableOtomIndex += requiredAmount;
            } else if (component.componentType == ComponentType.FUNGIBLE_ITEM) {
                // Process standard fungible items
                standardItemIds[standardItemIndex] = component.itemIdOrOtomTokenId;
                standardItemAmounts[standardItemIndex] = requiredAmount;
                standardItemIndex++;

                // Record for non-fungible items
                if (item.itemType == ItemType.NON_FUNGIBLE) {
                    actualComponents[i] = ActualBlueprintComponent({
                        componentType: component.componentType,
                        itemIdOrOtomTokenId: component.itemIdOrOtomTokenId,
                        amount: component.amount,
                        criteria: component.criteria
                    });
                }
            } else if (component.componentType == ComponentType.NON_FUNGIBLE_ITEM) {
                // Process non-fungible items
                uint256 firstItemId = nonFungibleTokenIds[nonFungibleItemIndex];

                // Record for non-fungible items
                if (item.itemType == ItemType.NON_FUNGIBLE) {
                    actualComponents[i] = ActualBlueprintComponent({
                        componentType: component.componentType,
                        itemIdOrOtomTokenId: firstItemId,
                        amount: component.amount,
                        criteria: component.criteria
                    });
                }

                // Burn each non-fungible item individually
                for (uint256 j = 0; j < requiredAmount; j++) {
                    uint256 tokenId = nonFungibleTokenIds[nonFungibleItemIndex + j];
                    uint256[] memory ids = new uint256[](1);
                    uint256[] memory amounts = new uint256[](1);
                    ids[0] = tokenId;
                    amounts[0] = 1;
                    _otomItems.burnBatch(msg.sender, ids, amounts);
                }

                nonFungibleItemIndex += requiredAmount;
            }
        }

        return (
            standardOtomIds,
            standardOtomAmounts,
            standardItemIds,
            standardItemAmounts,
            actualComponents
        );
    }

    /**
     * @dev Counts standard (non-variable) components in the blueprint
     */
    function _countStandardComponents(
        Item storage item
    ) private view returns (uint256 otomCount, uint256 itemCount) {
        for (uint256 i = 0; i < item.blueprint.length; i++) {
            BlueprintComponent memory component = item.blueprint[i];
            if (component.componentType == ComponentType.OTOM) {
                otomCount++;
            } else if (component.componentType == ComponentType.FUNGIBLE_ITEM) {
                itemCount++;
            }
        }
        return (otomCount, itemCount);
    }

    /**
     * @dev Mints a fungible item
     */
    function _mintFungibleItem(uint256 itemId, uint256 amount) private {
        _otomItems.mint(msg.sender, itemId, amount, "");

        // Emit the original ItemCrafted event for fungible items
        emit ItemCrafted(msg.sender, itemId, amount, itemId, new ActualBlueprintComponent[](0));
    }

    /**
     * @dev Mints a non-fungible item with traits based on components and payment
     */
    function _mintNonFungibleItem(
        Item storage item,
        uint256 itemId,
        ActualBlueprintComponent[] memory actualComponents,
        uint256[] calldata variableOtomIds,
        uint256[] calldata nonFungibleTokenIds,
        uint256 tokenId,
        uint256 actualPayment
    ) private {
        _nonFungibleTokenToItemId[tokenId] = itemId;

        // Store the actual blueprint for this token
        _nonFungibleTokenToActualBlueprint[tokenId] = actualComponents;

        // Get base traits for this item
        Trait[] memory baseTraits = getTokenTraits(itemId);

        // Apply traits and tier based on mutator contract (if any)
        _applyTraitsAndTier(
            item,
            itemId,
            tokenId,
            variableOtomIds,
            nonFungibleTokenIds,
            baseTraits,
            actualPayment
        );

        // Mint the token
        _otomItems.mint(msg.sender, tokenId, 1, "");

        // Emit the updated ItemCrafted event with the actual blueprint
        emit ItemCrafted(msg.sender, itemId, 1, tokenId, actualComponents);
    }

    /**
     * @dev Applies traits and tier to a non-fungible item
     */
    function _applyTraitsAndTier(
        Item storage item,
        uint256 itemId,
        uint256 tokenId,
        uint256[] calldata variableOtomIds,
        uint256[] calldata nonFungibleTokenIds,
        Trait[] memory baseTraits,
        uint256 actualPayment
    ) private {
        if (item.mutatorContract != address(0)) {
            (bool success, bytes memory calculateTierResult) = _staticcallMutator(
                item.mutatorContract,
                abi.encodeWithSelector(
                    IOtomItemMutator.calculateTier.selector,
                    itemId,
                    variableOtomIds,
                    nonFungibleTokenIds,
                    baseTraits,
                    actualPayment
                )
            );
            if (!success) {
                // Fallback to default traits if the tier calculation fails
                _setDefaultItemTraitsOnToken(itemId, tokenId);
            } else {
                (uint256 tierLevel, Trait[] memory updatedTraits) = abi.decode(
                    calculateTierResult,
                    (uint256, Trait[])
                );

                _setTokenTraits(tokenId, updatedTraits);

                if (tierLevel > 7) revert InvalidTier(tierLevel);

                nonFungibleTokenToTier[tokenId] = tierLevel;
            }
        } else {
            // No mutator, just use default traits
            _setDefaultItemTraitsOnToken(itemId, tokenId);
        }
    }

    /**
     * @dev Uses a non-fungible item by calling its mutator (if any).
     *      Requires the caller to be either the owner or approved to manage the token.
     *      The mutator can update traits and determine if the item should be destroyed.
     * @param _tokenId The ID of the token to use
     * @param _owner The owner of the token (must own at least 1)
     * @param _data Arbitrary data to pass to the mutator
     */
    function useItem(
        uint256 _tokenId,
        address _owner,
        bytes calldata _data
    ) external override nonReentrant {
        if (isFungibleTokenId(_tokenId)) revert OnlyNonFungible(); // Must be a non-fungible token

        // Verify the provided owner actually owns the token
        if (_otomItems.balanceOf(_owner, _tokenId) < 1) revert NotOwner(_owner, _tokenId);

        // Check if caller is the owner or approved
        if (msg.sender != _owner && !isApprovedForToken(_owner, msg.sender, _tokenId)) {
            revert NotOwner(msg.sender, _tokenId);
        }

        uint256 itemId = _nonFungibleTokenToItemId[_tokenId];
        if (itemId == 0) revert OnlyNonFungible();

        Item storage item = _items[itemId];

        // Ensure this is a non-fungible item
        if (item.itemType != ItemType.NON_FUNGIBLE) revert OnlyNonFungible();

        // Get current traits to pass to the mutator
        Trait[] memory currentTraits = getTokenTraits(_tokenId);

        bool shouldDestroy = false;

        // If mutator is defined
        if (item.mutatorContract != address(0)) {
            try
                IOtomItemMutator(item.mutatorContract).onItemUse(
                    _tokenId,
                    _owner,
                    currentTraits,
                    _data
                )
            returns (Trait[] memory updatedTraits, bool destroy) {
                // Update traits
                _setTokenTraits(_tokenId, updatedTraits);

                // Set destruction flag based on mutator response
                shouldDestroy = destroy;
            } catch {
                revert MutatorFailed();
            }
        }

        // Emit ItemUsed event
        emit ItemUsed(_owner, itemId, _tokenId);
        _otomItems.emitMetadataUpdate(_tokenId);

        // Check if item should be destroyed
        if (shouldDestroy) {
            emit ItemDestroyed(_owner, itemId, _tokenId);
            _otomItems.burn(_owner, _tokenId, 1);
        }
    }

    /**
     * @dev Consumes fungible items (burns them)
     * @param _itemId The ID of the fungible item
     * @param _amount The amount to consume
     * @param _owner The owner of the tokens
     */
    function consumeItem(
        uint256 _itemId,
        uint256 _amount,
        address _owner
    ) external override nonReentrant {
        if (!isFungibleTokenId(_itemId)) revert OnlyFungible(); // Must be a fungible item ID
        if (_itemId >= nextItemId) revert ItemDoesNotExist();

        // Verify the provided owner actually owns enough tokens
        if (_otomItems.balanceOf(_owner, _itemId) < _amount) revert NotOwner(_owner, _itemId);

        // Check if caller is the owner or approved
        if (msg.sender != _owner && !isApprovedForItem(_owner, msg.sender, _itemId)) {
            revert NotOwner(msg.sender, _itemId);
        }

        Item storage item = _items[_itemId];

        // Ensure this is a fungible item
        if (item.itemType != ItemType.FUNGIBLE) revert OnlyFungible();

        // Burn the items
        _otomItems.burn(_owner, _itemId, _amount);

        // Emit ItemUsed event
        emit ItemUsed(_owner, _itemId, _itemId);
    }

    function onUpdate(
        address _from,
        address _to,
        uint256[] memory _ids,
        uint256[] memory _values
    ) external {
        bool allowTransfer = true;

        for (uint256 i = 0; i < _ids.length; i++) {
            uint256 _tokenId = _ids[i];
            if (!isFungibleTokenId(_tokenId) && _otomItems.exists(_tokenId)) {
                uint256 itemId = _nonFungibleTokenToItemId[_tokenId];
                if (itemId == 0) revert MissingItemId();

                Item storage item = _items[itemId];

                // Ensure this is a non-fungible item
                if (item.itemType != ItemType.NON_FUNGIBLE) revert MissmatchItemType();

                // Get current traits to pass to the mutator
                Trait[] memory currentTraits = getTokenTraits(_tokenId);

                // If mutator is defined
                if (item.mutatorContract != address(0)) {
                    try
                        IOtomItemMutator(item.mutatorContract).onTransfer(
                            _tokenId,
                            _from,
                            _to,
                            _values[i],
                            currentTraits
                        )
                    returns (bool allowed) {
                        allowTransfer = allowed;
                    } catch {
                        revert MutatorFailed();
                    }
                }
            }

            if (!allowTransfer) revert MutatorBlockedTransfer();
        }
    }

    ////////////////////////////////// PUBLIC UTILS ////////////////////////////////

    /**
     * @dev Gets an item type by its ID
     * @param _itemId ID of the item
     * @return Item struct
     */
    function getItemByItemId(uint256 _itemId) external view override returns (Item memory) {
        if (_itemId >= nextItemId) revert ItemDoesNotExist();
        return _items[_itemId];
    }

    /**
     * @dev Gets the item type ID for a token
     * @param _tokenId The token ID
     * @return The item type ID
     */
    function getItemIdForToken(uint256 _tokenId) public view override returns (uint256) {
        if (isFungibleTokenId(_tokenId)) {
            // For fungible items, the token ID is the item ID
            if (_tokenId >= nextItemId) revert ItemDoesNotExist();
            if (_items[_tokenId].itemType != ItemType.FUNGIBLE) revert InvalidItem();
            return _tokenId;
        } else {
            // For non-fungible items, lookup the mapping
            uint256 itemId = _nonFungibleTokenToItemId[_tokenId];
            if (itemId == 0) revert InvalidItem();
            return itemId;
        }
    }

    /**
     * @dev Gets all traits for a token
     * @param _tokenId The token ID to get traits for
     * @return Array of all traits for the token
     */
    function getTokenTraits(uint256 _tokenId) public view override returns (Trait[] memory) {
        if (_tokenId >= nextItemId && !_otomItems.exists(_tokenId)) revert ItemDoesNotExist();
        // For fungible items, _tokenId is the itemId
        // For non-fungible items, traits are stored directly with the tokenId

        EnumerableSet.Bytes32Set storage traitKeys = _tokenTraitKeys[_tokenId];
        uint256 traitCount = traitKeys.length();

        Trait[] memory traits = new Trait[](traitCount);

        for (uint256 i = 0; i < traitCount; i++) {
            bytes32 key = traitKeys.at(i);
            traits[i] = _tokenTraitDetails[_tokenId][key];
        }

        return traits;
    }

    /**
     * @dev Finds a specific trait for a token by trait name
     * @param _tokenId The token ID to get the trait for
     * @param _traitName The name of the trait to find
     * @return The found trait
     */
    function getTokenTrait(
        uint256 _tokenId,
        string memory _traitName
    ) external view returns (Trait memory) {
        bytes32 traitKey = _stringToBytes32(_traitName);

        if (!_tokenTraitKeys[_tokenId].contains(traitKey)) {
            revert TraitNotFound();
        }

        return _tokenTraitDetails[_tokenId][traitKey];
    }

    /**
     * @dev Checks if a token ID represents a fungible or non-fungible token
     * @param _tokenId The token ID to check
     * @return True if the token is a fungible token, false if it's a non-fungible token
     */
    function isFungibleTokenId(uint256 _tokenId) public pure returns (bool) {
        return _tokenId < 2 ** 128;
    }

    /**
     * @dev Calculate the token ID for a non-fungible item
     * @param itemId The item type ID
     * @param mintIndex The mint index/count for this item type
     * @return The calculated token ID
     */
    function getNonFungibleTokenId(
        uint256 itemId,
        uint256 mintIndex
    ) public pure returns (uint256) {
        return (uint256(keccak256(abi.encode(itemId, mintIndex))) % 2 ** 128) + 2 ** 128;
    }

    /**
     * @dev Gets the actual blueprint for a non-fungible token
     * @param _tokenId The token ID
     * @return The actual blueprint components
     */
    function nonFungibleTokenToActualBlueprint(
        uint256 _tokenId
    ) external view returns (ActualBlueprintComponent[] memory) {
        return _nonFungibleTokenToActualBlueprint[_tokenId];
    }

    /**
     * @dev Gets the appropriate image URI for a token based on its tier
     * @param _tokenId The token ID
     * @return The image URI
     */
    function getTokenDefaultImageUri(uint256 _tokenId) external view returns (string memory) {
        if (isFungibleTokenId(_tokenId)) {
            // For fungible tokens, return the default image URI
            uint256 itemId = getItemIdForToken(_tokenId);
            return _items[itemId].defaultImageUri;
        } else {
            // For non-fungible tokens, get the tier and return the appropriate image URI
            uint256 itemId = _nonFungibleTokenToItemId[_tokenId];
            if (itemId == 0) revert InvalidItem();

            uint256 tier = nonFungibleTokenToTier[_tokenId];

            // If tier is 0 or the tier image URI is empty, return the default image URI
            if (tier == 0 || bytes(_items[itemId].defaultTierImageUris[tier - 1]).length == 0) {
                return _items[itemId].defaultImageUri;
            }

            // Otherwise, return the tier-specific default image URI
            return _items[itemId].defaultTierImageUris[tier - 1];
        }
    }

    /**
     * @dev Checks if an address is approved for a specific item ID
     * @param _owner The token owner
     * @param _operator The potential operator address
     * @param _itemId The item ID to check
     * @return True if the operator is approved for the item
     */
    function isApprovedForItem(
        address _owner,
        address _operator,
        uint256 _itemId
    ) public view returns (bool) {
        return
            _owner == _operator ||
            _otomItems.isApprovedForAll(_owner, _operator) ||
            _itemApprovals[_owner][_itemId][_operator] ||
            _tokenApprovals[_owner][_itemId][_operator]; // For fungible items, token ID = item ID
    }

    /**
     * @dev Checks if an address is approved for a specific token ID
     * @param _owner The token owner
     * @param _operator The potential operator address
     * @param _tokenId The token ID to check
     * @return True if the operator is approved for the token
     */
    function isApprovedForToken(
        address _owner,
        address _operator,
        uint256 _tokenId
    ) public view returns (bool) {
        uint256 itemId = isFungibleTokenId(_tokenId)
            ? _tokenId
            : _nonFungibleTokenToItemId[_tokenId];

        return
            _owner == _operator ||
            _otomItems.isApprovedForAll(_owner, _operator) ||
            _itemApprovals[_owner][itemId][_operator] ||
            _tokenApprovals[_owner][_tokenId][_operator];
    }

    ////////////////////////////////// ADMIN UTILS ////////////////////////////////

    /**
     * @dev Set the _renderer contract address
     * @param _rendererAddress Address of the _renderer contract
     */
    function setRenderer(address _rendererAddress) external onlyOwner {
        _renderer = IOtomItemsRenderer(_rendererAddress);
        emit RendererSet(_rendererAddress);
    }

    /**
     * @dev Set the OtomItems contract address
     * @param _otomItemsAddress Address of the OtomItems contract
     */
    function setOtomItems(address _otomItemsAddress) external onlyOwner {
        _otomItems = IOtomItems(_otomItemsAddress);
        emit OtomItemsSet(_otomItemsAddress);
    }

    /**
     * @dev Set creation enabled
     * @param isEnabled Whether creation is enabled
     */
    function setCreationEnabled(bool isEnabled) external onlyOwner {
        creationEnabled = isEnabled;
        emit CreationEnabledSet(isEnabled);
    }

    /**
     * @dev Set the _validator contract address
     * @param _validatorAddress Address of the _validator contract
     */
    function setValidator(address _validatorAddress) external onlyOwner {
        _validator = IOtomItemsValidator(_validatorAddress);
        emit ValidatorSet(_validatorAddress);
    }

    ////////////////////////////////// INTERNAL UTILS ////////////////////////////////

    function _stringToBytes32(string memory _string) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(_string));
    }

    /**
     * @dev Helper function to update item traits
     */
    function _setItemTraits(uint256 _itemId, Trait[] memory _traits) internal {
        // Validate traits
        if (!_validator.validateTraits(_traits)) revert InvalidTraits();

        // Clear existing traits keys
        _clearItemTraits(_itemId);

        // Add new traits
        for (uint256 i = 0; i < _traits.length; i++) {
            bytes32 traitKey = _stringToBytes32(_traits[i].typeName);
            _tokenTraitKeys[_itemId].add(traitKey);
            _tokenTraitDetails[_itemId][traitKey] = _traits[i];
        }
    }

    /**
     * @dev Helper function to clear item traits
     */
    function _clearItemTraits(uint256 _itemId) internal {
        EnumerableSet.Bytes32Set storage traits = _tokenTraitKeys[_itemId];
        uint256 traitCount = traits.length();
        for (uint256 i = 0; i < traitCount; i++) {
            bytes32 key = traits.at(0); // Always get the first element as we're removing them
            // Remove from trait details
            delete _tokenTraitDetails[_itemId][key];
            // Remove from item traits
            traits.remove(key);
        }
    }

    /**
     * @dev Updates traits for a token
     * @param _tokenId The token ID to update traits for
     * @param _traits The new traits to set
     */
    function _setTokenTraits(uint256 _tokenId, Trait[] memory _traits) internal {
        for (uint256 i = 0; i < _traits.length; i++) {
            bytes32 traitKey = _stringToBytes32(_traits[i].typeName);

            // Add trait key if it doesn't exist
            if (!_tokenTraitKeys[_tokenId].contains(traitKey)) {
                _tokenTraitKeys[_tokenId].add(traitKey);
            }

            // Update trait details
            _tokenTraitDetails[_tokenId][traitKey] = _traits[i];
        }

        emit TraitsUpdated(_tokenId, _traits);
    }

    function _setDefaultItemTraitsOnToken(uint256 _itemId, uint256 _tokenId) internal {
        EnumerableSet.Bytes32Set storage itemTraits = _tokenTraitKeys[_itemId];
        uint256 traitCount = itemTraits.length();

        for (uint256 i = 0; i < traitCount; i++) {
            bytes32 key = itemTraits.at(i);
            Trait memory trait = _tokenTraitDetails[_itemId][key];
            _tokenTraitKeys[_tokenId].add(key);
            _tokenTraitDetails[_tokenId][key] = trait;
        }
    }

    /**
     * @dev Static call to a mutator contract
     * @param _mutator The mutator contract address
     * @param data The data to pass to the mutator
     * @return The result and success status
     */
    function _staticcallMutator(
        address _mutator,
        bytes memory data
    ) private view returns (bool, bytes memory) {
        (bool success, bytes memory result) = _mutator.staticcall(data);
        return (success, result);
    }
}
