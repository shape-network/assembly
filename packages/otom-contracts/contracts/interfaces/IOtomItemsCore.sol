// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

enum ComponentType {
    OTOM,
    VARIABLE_OTOM,
    FUNGIBLE_ITEM,
    NON_FUNGIBLE_ITEM
}

enum PropertyType {
    // Universe properties
    UNIVERSE_HASH,
    // Molecule properties
    MOLECULE_NAME,
    ACTIVATION_ENERGY,
    MOLECULE_RADIUS,
    ELECTRICAL_CONDUCTIVITY,
    THERMAL_CONDUCTIVITY,
    TOUGHNESS,
    HARDNESS,
    DUCTILITY,
    // Atom properties
    ATOM_RADIUS,
    VOLUME,
    MASS,
    DENSITY,
    ELECTRONEGATIVITY,
    METALLIC, // Boolean
    // Nuclear properties
    PROTONS,
    NEUTRONS,
    NUCLEONS,
    STABILITY,
    DECAY_TYPE
}

struct PropertyCriterion {
    PropertyType propertyType;
    uint256 minValue; // Minimum value required (0 if no minimum)
    uint256 maxValue; // Maximum value allowed (type(uint256).max if no maximum)
    bool boolValue; // For boolean properties like "metallic"
    bool checkBoolValue; // Whether to check the boolean value
    string stringValue; // For string properties like "decay_type"
    bool checkStringValue; // Whether to check the string value
    bytes32 bytes32Value; // For bytes32 properties like "universe_hash"
    bool checkBytes32Value; // Whether to check the bytes32 value
}

struct BlueprintComponent {
    ComponentType componentType;
    uint256 itemIdOrOtomTokenId; // Set to 0 for VARIABLE_OTOM
    uint256 amount;
    PropertyCriterion[] criteria;
}

enum ItemType {
    FUNGIBLE,
    NON_FUNGIBLE
}

struct Item {
    uint256 id;
    string name;
    string description;
    address creator;
    address admin;
    string defaultImageUri;
    ItemType itemType;
    BlueprintComponent[] blueprint;
    address mutatorContract;
    uint256 ethCostInWei;
    address feeRecipient;
    string[7] defaultTierImageUris; // Default URIs for tiers 1-7 (index 0 = tier 1)
}

enum TraitType {
    NUMBER,
    STRING
}

struct Trait {
    string typeName;
    string valueString;
    uint256 valueNumber;
    TraitType traitType;
}

struct ActualBlueprintComponent {
    ComponentType componentType;
    uint256 itemIdOrOtomTokenId;
    uint256 amount;
    PropertyCriterion[] criteria;
}

/**
 * @title IOtomItemsCore
 * @dev Interface for the IOtomItemsCore contract
 */
interface IOtomItemsCore {
    event ItemCreated(address indexed creator, uint256 indexed itemId, string name);
    event ItemUpdated(uint256 indexed itemId);
    event ItemCrafted(
        address indexed crafter,
        uint256 indexed itemId,
        uint256 amount,
        uint256 tokenId,
        ActualBlueprintComponent[] actualComponents
    );
    event CreationEnabledSet(bool indexed isEnabled);
    event ItemUsed(address indexed user, uint256 indexed itemId, uint256 indexed tokenId);
    event ItemDestroyed(address indexed user, uint256 indexed itemId, uint256 indexed tokenId);
    event RendererSet(address indexed renderer);
    event OtomItemsSet(address indexed otomItems);
    event TraitsUpdated(uint256 indexed tokenId, Trait[] traits);
    event ItemFrozen(uint256 indexed itemId);
    event ValidatorSet(address indexed validator);
    event ItemsApprovalForAll(
        address indexed owner,
        uint256[] indexed itemIds,
        address indexed operator,
        bool approved
    );
    event TokensApprovalForAll(
        address indexed owner,
        uint256[] indexed tokenIds,
        address indexed operator,
        bool approved
    );

    error NotOwner(address msgSender, uint256 tokenId);
    error InsufficientOtomBalance();
    error InsufficientItemBalance();
    error InvalidItem();
    error InvalidCraftAmount();
    error NotAdmin();
    error CreationDisabled();
    error MutatorFailed();
    error ItemIsFrozen(uint256 itemId);
    error InsufficientPayment(uint256 required, uint256 provided);
    error PaymentFailed();
    error RefundFailed();
    error InsufficientMatchingOtoms(uint256 required, uint256 available);
    error InsufficientMatchingItems(uint256 required, uint256 available);
    error InsufficientItemTier(uint256 tokenId, uint256 currentTier, uint256 requiredTier);
    error InvalidTraits();
    error InvalidName();
    error InvalidFeeRecipient();
    error InvalidBlueprintComponent();
    error ItemDoesNotExist();
    error CriteriaNotMet();
    error OnlyNonFungible();
    error OnlyFungible();
    error TraitNotFound();
    error InvalidTier(uint256 tier);
    error MutatorBlockedTransfer();
    error MissingItemId();
    error MissmatchItemType();
    error CraftBlocked();
    error ItemAlreadyFrozen();
    error InvalidTraitType();

    function createFungibleItem(
        string memory _name,
        string memory _description,
        string memory _defaultImageUri,
        BlueprintComponent[] memory _blueprint,
        Trait[] memory _traits,
        uint256 _ethCostInWei,
        address _feeRecipient
    ) external returns (uint256);

    function createNonFungibleItem(
        string memory _name,
        string memory _description,
        string memory _defaultImageUri,
        string[7] memory _defaultTierImageUris,
        BlueprintComponent[] memory _blueprint,
        Trait[] memory _traits,
        address _mutatorContract,
        uint256 _ethCostInWei,
        address _feeRecipient
    ) external returns (uint256);

    function updateFungibleItem(
        uint256 _itemId,
        string memory _name,
        string memory _description,
        BlueprintComponent[] memory _blueprint,
        Trait[] memory _traits,
        uint256 _ethCostInWei,
        address _feeRecipient
    ) external;

    function updateNonFungibleItem(
        uint256 _itemId,
        string memory _name,
        string memory _description,
        string memory _defaultImageUri,
        string[7] memory _defaultTierImageUris,
        BlueprintComponent[] memory _blueprint,
        Trait[] memory _traits,
        address _mutatorContract,
        uint256 _ethCostInWei,
        address _feeRecipient
    ) external;

    function craftItem(
        uint256 _itemId,
        uint256 _amount,
        uint256[] calldata _variableOtomIds,
        uint256[] calldata _nonFungibleTokenIds,
        bytes calldata _data
    ) external payable;

    function useItem(uint256 _tokenId, address _owner, bytes calldata _data) external;

    function consumeItem(uint256 _tokenId, uint256 _amount, address _owner) external;

    function onUpdate(
        address _from,
        address _to,
        uint256[] memory _ids,
        uint256[] memory _values
    ) external;

    function getItemIdForToken(uint256 _tokenId) external view returns (uint256);

    function nextItemId() external view returns (uint256);

    function getTokenTraits(uint256 _tokenId) external view returns (Trait[] memory);

    function getTokenTrait(
        uint256 _tokenId,
        string memory _traitName
    ) external view returns (Trait memory);

    function getItemByItemId(uint256 _itemId) external view returns (Item memory);

    function getTokenUri(uint256 _tokenId) external view returns (string memory);

    function getTokenDefaultImageUri(uint256 _tokenId) external view returns (string memory);

    function isFungibleTokenId(uint256 _tokenId) external view returns (bool);

    function nonFungibleTokenToTier(uint256 _tokenId) external view returns (uint256);

    function nonFungibleTokenToActualBlueprint(
        uint256 _tokenId
    ) external view returns (ActualBlueprintComponent[] memory);
}
