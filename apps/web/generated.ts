import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen';

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AssemblyCoreContract
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const assemblyCoreContractAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  { type: 'error', inputs: [], name: 'CraftBlocked' },
  { type: 'error', inputs: [], name: 'CreationDisabled' },
  { type: 'error', inputs: [], name: 'CriteriaNotMet' },
  { type: 'error', inputs: [], name: 'InsufficientItemBalance' },
  {
    type: 'error',
    inputs: [
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'currentTier', internalType: 'uint256', type: 'uint256' },
      { name: 'requiredTier', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InsufficientItemTier',
  },
  {
    type: 'error',
    inputs: [
      { name: 'required', internalType: 'uint256', type: 'uint256' },
      { name: 'available', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InsufficientMatchingItems',
  },
  {
    type: 'error',
    inputs: [
      { name: 'required', internalType: 'uint256', type: 'uint256' },
      { name: 'available', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InsufficientMatchingOtoms',
  },
  { type: 'error', inputs: [], name: 'InsufficientOtomBalance' },
  {
    type: 'error',
    inputs: [
      { name: 'required', internalType: 'uint256', type: 'uint256' },
      { name: 'provided', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InsufficientPayment',
  },
  { type: 'error', inputs: [], name: 'InvalidBlueprintComponent' },
  { type: 'error', inputs: [], name: 'InvalidCraftAmount' },
  { type: 'error', inputs: [], name: 'InvalidFeeRecipient' },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'InvalidItem' },
  { type: 'error', inputs: [], name: 'InvalidName' },
  {
    type: 'error',
    inputs: [{ name: 'tier', internalType: 'uint256', type: 'uint256' }],
    name: 'InvalidTier',
  },
  { type: 'error', inputs: [], name: 'InvalidTraitType' },
  { type: 'error', inputs: [], name: 'InvalidTraits' },
  { type: 'error', inputs: [], name: 'ItemAlreadyFrozen' },
  { type: 'error', inputs: [], name: 'ItemDoesNotExist' },
  {
    type: 'error',
    inputs: [{ name: 'itemId', internalType: 'uint256', type: 'uint256' }],
    name: 'ItemIsFrozen',
  },
  { type: 'error', inputs: [], name: 'MissingItemId' },
  { type: 'error', inputs: [], name: 'MutatorBlockedTransfer' },
  { type: 'error', inputs: [], name: 'MutatorFailed' },
  { type: 'error', inputs: [], name: 'NotAdmin' },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  {
    type: 'error',
    inputs: [
      { name: 'msgSender', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'NotOwner',
  },
  { type: 'error', inputs: [], name: 'OnlyFungible' },
  { type: 'error', inputs: [], name: 'OnlyNonFungible' },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  { type: 'error', inputs: [], name: 'PaymentFailed' },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
  { type: 'error', inputs: [], name: 'RefundFailed' },
  { type: 'error', inputs: [], name: 'TraitNotFound' },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'isEnabled', internalType: 'bool', type: 'bool', indexed: true }],
    name: 'CreationEnabledSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'version', internalType: 'uint64', type: 'uint64', indexed: false }],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'crafter', internalType: 'address', type: 'address', indexed: true },
      { name: 'itemId', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'amount', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256', indexed: false },
      {
        name: 'actualComponents',
        internalType: 'struct ActualBlueprintComponent[]',
        type: 'tuple[]',
        components: [
          { name: 'componentType', internalType: 'enum ComponentType', type: 'uint8' },
          { name: 'itemIdOrOtomTokenId', internalType: 'uint256', type: 'uint256' },
          { name: 'amount', internalType: 'uint256', type: 'uint256' },
          {
            name: 'criteria',
            internalType: 'struct PropertyCriterion[]',
            type: 'tuple[]',
            components: [
              { name: 'propertyType', internalType: 'enum PropertyType', type: 'uint8' },
              { name: 'minValue', internalType: 'uint256', type: 'uint256' },
              { name: 'maxValue', internalType: 'uint256', type: 'uint256' },
              { name: 'boolValue', internalType: 'bool', type: 'bool' },
              { name: 'checkBoolValue', internalType: 'bool', type: 'bool' },
              { name: 'stringValue', internalType: 'string', type: 'string' },
              { name: 'checkStringValue', internalType: 'bool', type: 'bool' },
              { name: 'bytes32Value', internalType: 'bytes32', type: 'bytes32' },
              { name: 'checkBytes32Value', internalType: 'bool', type: 'bool' },
            ],
          },
        ],
        indexed: false,
      },
    ],
    name: 'ItemCrafted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'creator', internalType: 'address', type: 'address', indexed: true },
      { name: 'itemId', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'name', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'ItemCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      { name: 'itemId', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256', indexed: true },
    ],
    name: 'ItemDestroyed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'itemId', internalType: 'uint256', type: 'uint256', indexed: true }],
    name: 'ItemFrozen',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'itemId', internalType: 'uint256', type: 'uint256', indexed: true }],
    name: 'ItemUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      { name: 'itemId', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256', indexed: true },
    ],
    name: 'ItemUsed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address', indexed: true },
      { name: 'itemIds', internalType: 'uint256[]', type: 'uint256[]', indexed: true },
      { name: 'operator', internalType: 'address', type: 'address', indexed: true },
      { name: 'approved', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'ItemsApprovalForAll',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'otomItems', internalType: 'address', type: 'address', indexed: true }],
    name: 'OtomItemsSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousOwner', internalType: 'address', type: 'address', indexed: true },
      { name: 'newOwner', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'renderer', internalType: 'address', type: 'address', indexed: true }],
    name: 'RendererSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address', indexed: true },
      { name: 'tokenIds', internalType: 'uint256[]', type: 'uint256[]', indexed: true },
      { name: 'operator', internalType: 'address', type: 'address', indexed: true },
      { name: 'approved', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'TokensApprovalForAll',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'tokenId', internalType: 'uint256', type: 'uint256', indexed: true },
      {
        name: 'traits',
        internalType: 'struct Trait[]',
        type: 'tuple[]',
        components: [
          { name: 'typeName', internalType: 'string', type: 'string' },
          { name: 'valueString', internalType: 'string', type: 'string' },
          { name: 'valueNumber', internalType: 'uint256', type: 'uint256' },
          { name: 'traitType', internalType: 'enum TraitType', type: 'uint8' },
        ],
        indexed: false,
      },
    ],
    name: 'TraitsUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'validator', internalType: 'address', type: 'address', indexed: true }],
    name: 'ValidatorSet',
  },
  {
    type: 'function',
    inputs: [
      { name: '_itemId', internalType: 'uint256', type: 'uint256' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
      { name: '_owner', internalType: 'address', type: 'address' },
    ],
    name: 'consumeItem',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_itemId', internalType: 'uint256', type: 'uint256' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
      { name: '_variableOtomIds', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '_nonFungibleTokenIds', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '_data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'craftItem',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_name', internalType: 'string', type: 'string' },
      { name: '_description', internalType: 'string', type: 'string' },
      { name: '_defaultImageUri', internalType: 'string', type: 'string' },
      {
        name: '_blueprint',
        internalType: 'struct BlueprintComponent[]',
        type: 'tuple[]',
        components: [
          { name: 'componentType', internalType: 'enum ComponentType', type: 'uint8' },
          { name: 'itemIdOrOtomTokenId', internalType: 'uint256', type: 'uint256' },
          { name: 'amount', internalType: 'uint256', type: 'uint256' },
          {
            name: 'criteria',
            internalType: 'struct PropertyCriterion[]',
            type: 'tuple[]',
            components: [
              { name: 'propertyType', internalType: 'enum PropertyType', type: 'uint8' },
              { name: 'minValue', internalType: 'uint256', type: 'uint256' },
              { name: 'maxValue', internalType: 'uint256', type: 'uint256' },
              { name: 'boolValue', internalType: 'bool', type: 'bool' },
              { name: 'checkBoolValue', internalType: 'bool', type: 'bool' },
              { name: 'stringValue', internalType: 'string', type: 'string' },
              { name: 'checkStringValue', internalType: 'bool', type: 'bool' },
              { name: 'bytes32Value', internalType: 'bytes32', type: 'bytes32' },
              { name: 'checkBytes32Value', internalType: 'bool', type: 'bool' },
            ],
          },
        ],
      },
      {
        name: '_traits',
        internalType: 'struct Trait[]',
        type: 'tuple[]',
        components: [
          { name: 'typeName', internalType: 'string', type: 'string' },
          { name: 'valueString', internalType: 'string', type: 'string' },
          { name: 'valueNumber', internalType: 'uint256', type: 'uint256' },
          { name: 'traitType', internalType: 'enum TraitType', type: 'uint8' },
        ],
      },
      { name: '_ethCostInWei', internalType: 'uint256', type: 'uint256' },
      { name: '_feeRecipient', internalType: 'address', type: 'address' },
      { name: '_defaultCraftAmount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'createFungibleItem',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_name', internalType: 'string', type: 'string' },
      { name: '_description', internalType: 'string', type: 'string' },
      { name: '_defaultImageUri', internalType: 'string', type: 'string' },
      { name: '_defaultTierImageUris', internalType: 'string[7]', type: 'string[7]' },
      {
        name: '_blueprint',
        internalType: 'struct BlueprintComponent[]',
        type: 'tuple[]',
        components: [
          { name: 'componentType', internalType: 'enum ComponentType', type: 'uint8' },
          { name: 'itemIdOrOtomTokenId', internalType: 'uint256', type: 'uint256' },
          { name: 'amount', internalType: 'uint256', type: 'uint256' },
          {
            name: 'criteria',
            internalType: 'struct PropertyCriterion[]',
            type: 'tuple[]',
            components: [
              { name: 'propertyType', internalType: 'enum PropertyType', type: 'uint8' },
              { name: 'minValue', internalType: 'uint256', type: 'uint256' },
              { name: 'maxValue', internalType: 'uint256', type: 'uint256' },
              { name: 'boolValue', internalType: 'bool', type: 'bool' },
              { name: 'checkBoolValue', internalType: 'bool', type: 'bool' },
              { name: 'stringValue', internalType: 'string', type: 'string' },
              { name: 'checkStringValue', internalType: 'bool', type: 'bool' },
              { name: 'bytes32Value', internalType: 'bytes32', type: 'bytes32' },
              { name: 'checkBytes32Value', internalType: 'bool', type: 'bool' },
            ],
          },
        ],
      },
      {
        name: '_traits',
        internalType: 'struct Trait[]',
        type: 'tuple[]',
        components: [
          { name: 'typeName', internalType: 'string', type: 'string' },
          { name: 'valueString', internalType: 'string', type: 'string' },
          { name: 'valueNumber', internalType: 'uint256', type: 'uint256' },
          { name: 'traitType', internalType: 'enum TraitType', type: 'uint8' },
        ],
      },
      { name: '_mutatorContract', internalType: 'address', type: 'address' },
      { name: '_ethCostInWei', internalType: 'uint256', type: 'uint256' },
      { name: '_feeRecipient', internalType: 'address', type: 'address' },
    ],
    name: 'createNonFungibleItem',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'creationEnabled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_itemId', internalType: 'uint256', type: 'uint256' }],
    name: 'freezeItem',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'frozenItems',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_itemId', internalType: 'uint256', type: 'uint256' }],
    name: 'getItemByItemId',
    outputs: [
      {
        name: '',
        internalType: 'struct Item',
        type: 'tuple',
        components: [
          { name: 'id', internalType: 'uint256', type: 'uint256' },
          { name: 'name', internalType: 'string', type: 'string' },
          { name: 'description', internalType: 'string', type: 'string' },
          { name: 'creator', internalType: 'address', type: 'address' },
          { name: 'admin', internalType: 'address', type: 'address' },
          { name: 'defaultImageUri', internalType: 'string', type: 'string' },
          { name: 'itemType', internalType: 'enum ItemType', type: 'uint8' },
          {
            name: 'blueprint',
            internalType: 'struct BlueprintComponent[]',
            type: 'tuple[]',
            components: [
              { name: 'componentType', internalType: 'enum ComponentType', type: 'uint8' },
              { name: 'itemIdOrOtomTokenId', internalType: 'uint256', type: 'uint256' },
              { name: 'amount', internalType: 'uint256', type: 'uint256' },
              {
                name: 'criteria',
                internalType: 'struct PropertyCriterion[]',
                type: 'tuple[]',
                components: [
                  { name: 'propertyType', internalType: 'enum PropertyType', type: 'uint8' },
                  { name: 'minValue', internalType: 'uint256', type: 'uint256' },
                  { name: 'maxValue', internalType: 'uint256', type: 'uint256' },
                  { name: 'boolValue', internalType: 'bool', type: 'bool' },
                  { name: 'checkBoolValue', internalType: 'bool', type: 'bool' },
                  { name: 'stringValue', internalType: 'string', type: 'string' },
                  { name: 'checkStringValue', internalType: 'bool', type: 'bool' },
                  { name: 'bytes32Value', internalType: 'bytes32', type: 'bytes32' },
                  { name: 'checkBytes32Value', internalType: 'bool', type: 'bool' },
                ],
              },
            ],
          },
          { name: 'mutatorContract', internalType: 'address', type: 'address' },
          { name: 'ethCostInWei', internalType: 'uint256', type: 'uint256' },
          { name: 'feeRecipient', internalType: 'address', type: 'address' },
          { name: 'defaultTierImageUris', internalType: 'string[7]', type: 'string[7]' },
          { name: 'defaultCraftAmount', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'getItemIdForToken',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'itemId', internalType: 'uint256', type: 'uint256' },
      { name: 'mintIndex', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getNonFungibleTokenId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: '_tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'getTokenDefaultImageUri',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_tokenId', internalType: 'uint256', type: 'uint256' },
      { name: '_traitName', internalType: 'string', type: 'string' },
    ],
    name: 'getTokenTrait',
    outputs: [
      {
        name: '',
        internalType: 'struct Trait',
        type: 'tuple',
        components: [
          { name: 'typeName', internalType: 'string', type: 'string' },
          { name: 'valueString', internalType: 'string', type: 'string' },
          { name: 'valueNumber', internalType: 'uint256', type: 'uint256' },
          { name: 'traitType', internalType: 'enum TraitType', type: 'uint8' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'getTokenTraits',
    outputs: [
      {
        name: '',
        internalType: 'struct Trait[]',
        type: 'tuple[]',
        components: [
          { name: 'typeName', internalType: 'string', type: 'string' },
          { name: 'valueString', internalType: 'string', type: 'string' },
          { name: 'valueNumber', internalType: 'uint256', type: 'uint256' },
          { name: 'traitType', internalType: 'enum TraitType', type: 'uint8' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'getTokenUri',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_otomsAddress', internalType: 'address', type: 'address' },
      { name: '_otomsValidationAddress', internalType: 'address', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_owner', internalType: 'address', type: 'address' },
      { name: '_operator', internalType: 'address', type: 'address' },
      { name: '_itemId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'isApprovedForItem',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_owner', internalType: 'address', type: 'address' },
      { name: '_operator', internalType: 'address', type: 'address' },
      { name: '_tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'isApprovedForToken',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'isFungibleTokenId',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'itemMintCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'nextItemId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'nonFungibleTokenToActualBlueprint',
    outputs: [
      {
        name: '',
        internalType: 'struct ActualBlueprintComponent[]',
        type: 'tuple[]',
        components: [
          { name: 'componentType', internalType: 'enum ComponentType', type: 'uint8' },
          { name: 'itemIdOrOtomTokenId', internalType: 'uint256', type: 'uint256' },
          { name: 'amount', internalType: 'uint256', type: 'uint256' },
          {
            name: 'criteria',
            internalType: 'struct PropertyCriterion[]',
            type: 'tuple[]',
            components: [
              { name: 'propertyType', internalType: 'enum PropertyType', type: 'uint8' },
              { name: 'minValue', internalType: 'uint256', type: 'uint256' },
              { name: 'maxValue', internalType: 'uint256', type: 'uint256' },
              { name: 'boolValue', internalType: 'bool', type: 'bool' },
              { name: 'checkBoolValue', internalType: 'bool', type: 'bool' },
              { name: 'stringValue', internalType: 'string', type: 'string' },
              { name: 'checkStringValue', internalType: 'bool', type: 'bool' },
              { name: 'bytes32Value', internalType: 'bytes32', type: 'bytes32' },
              { name: 'checkBytes32Value', internalType: 'bool', type: 'bool' },
            ],
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'nonFungibleTokenToTier',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_from', internalType: 'address', type: 'address' },
      { name: '_to', internalType: 'address', type: 'address' },
      { name: '_ids', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '_values', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'onUpdate',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_operator', internalType: 'address', type: 'address' },
      { name: '_itemIds', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '_approved', internalType: 'bool', type: 'bool' },
    ],
    name: 'setApprovalForItemIds',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_operator', internalType: 'address', type: 'address' },
      { name: '_tokenIds', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '_approved', internalType: 'bool', type: 'bool' },
    ],
    name: 'setApprovalForTokenIds',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'isEnabled', internalType: 'bool', type: 'bool' }],
    name: 'setCreationEnabled',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_itemId', internalType: 'uint256', type: 'uint256' },
      { name: '_admin', internalType: 'address', type: 'address' },
    ],
    name: 'setItemAdmin',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_otomItemsAddress', internalType: 'address', type: 'address' }],
    name: 'setOtomItems',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_rendererAddress', internalType: 'address', type: 'address' }],
    name: 'setRenderer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_validatorAddress', internalType: 'address', type: 'address' }],
    name: 'setValidator',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_itemId', internalType: 'uint256', type: 'uint256' },
      { name: '_name', internalType: 'string', type: 'string' },
      { name: '_description', internalType: 'string', type: 'string' },
      {
        name: '_blueprint',
        internalType: 'struct BlueprintComponent[]',
        type: 'tuple[]',
        components: [
          { name: 'componentType', internalType: 'enum ComponentType', type: 'uint8' },
          { name: 'itemIdOrOtomTokenId', internalType: 'uint256', type: 'uint256' },
          { name: 'amount', internalType: 'uint256', type: 'uint256' },
          {
            name: 'criteria',
            internalType: 'struct PropertyCriterion[]',
            type: 'tuple[]',
            components: [
              { name: 'propertyType', internalType: 'enum PropertyType', type: 'uint8' },
              { name: 'minValue', internalType: 'uint256', type: 'uint256' },
              { name: 'maxValue', internalType: 'uint256', type: 'uint256' },
              { name: 'boolValue', internalType: 'bool', type: 'bool' },
              { name: 'checkBoolValue', internalType: 'bool', type: 'bool' },
              { name: 'stringValue', internalType: 'string', type: 'string' },
              { name: 'checkStringValue', internalType: 'bool', type: 'bool' },
              { name: 'bytes32Value', internalType: 'bytes32', type: 'bytes32' },
              { name: 'checkBytes32Value', internalType: 'bool', type: 'bool' },
            ],
          },
        ],
      },
      {
        name: '_traits',
        internalType: 'struct Trait[]',
        type: 'tuple[]',
        components: [
          { name: 'typeName', internalType: 'string', type: 'string' },
          { name: 'valueString', internalType: 'string', type: 'string' },
          { name: 'valueNumber', internalType: 'uint256', type: 'uint256' },
          { name: 'traitType', internalType: 'enum TraitType', type: 'uint8' },
        ],
      },
      { name: '_ethCostInWei', internalType: 'uint256', type: 'uint256' },
      { name: '_feeRecipient', internalType: 'address', type: 'address' },
      { name: '_defaultCraftAmount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'updateFungibleItem',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_itemId', internalType: 'uint256', type: 'uint256' },
      { name: '_name', internalType: 'string', type: 'string' },
      { name: '_description', internalType: 'string', type: 'string' },
      { name: '_defaultImageUri', internalType: 'string', type: 'string' },
      { name: '_defaultTierImageUris', internalType: 'string[7]', type: 'string[7]' },
      {
        name: '_blueprint',
        internalType: 'struct BlueprintComponent[]',
        type: 'tuple[]',
        components: [
          { name: 'componentType', internalType: 'enum ComponentType', type: 'uint8' },
          { name: 'itemIdOrOtomTokenId', internalType: 'uint256', type: 'uint256' },
          { name: 'amount', internalType: 'uint256', type: 'uint256' },
          {
            name: 'criteria',
            internalType: 'struct PropertyCriterion[]',
            type: 'tuple[]',
            components: [
              { name: 'propertyType', internalType: 'enum PropertyType', type: 'uint8' },
              { name: 'minValue', internalType: 'uint256', type: 'uint256' },
              { name: 'maxValue', internalType: 'uint256', type: 'uint256' },
              { name: 'boolValue', internalType: 'bool', type: 'bool' },
              { name: 'checkBoolValue', internalType: 'bool', type: 'bool' },
              { name: 'stringValue', internalType: 'string', type: 'string' },
              { name: 'checkStringValue', internalType: 'bool', type: 'bool' },
              { name: 'bytes32Value', internalType: 'bytes32', type: 'bytes32' },
              { name: 'checkBytes32Value', internalType: 'bool', type: 'bool' },
            ],
          },
        ],
      },
      {
        name: '_traits',
        internalType: 'struct Trait[]',
        type: 'tuple[]',
        components: [
          { name: 'typeName', internalType: 'string', type: 'string' },
          { name: 'valueString', internalType: 'string', type: 'string' },
          { name: 'valueNumber', internalType: 'uint256', type: 'uint256' },
          { name: 'traitType', internalType: 'enum TraitType', type: 'uint8' },
        ],
      },
      { name: '_mutatorContract', internalType: 'address', type: 'address' },
      { name: '_ethCostInWei', internalType: 'uint256', type: 'uint256' },
      { name: '_feeRecipient', internalType: 'address', type: 'address' },
    ],
    name: 'updateNonFungibleItem',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_tokenId', internalType: 'uint256', type: 'uint256' },
      { name: '_owner', internalType: 'address', type: 'address' },
      { name: '_data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'useItem',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AssemblyItemsContract
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const assemblyItemsContractAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC1155InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidApprover',
  },
  {
    type: 'error',
    inputs: [
      { name: 'idsLength', internalType: 'uint256', type: 'uint256' },
      { name: 'valuesLength', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC1155InvalidArrayLength',
  },
  {
    type: 'error',
    inputs: [{ name: 'operator', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidOperator',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidSender',
  },
  {
    type: 'error',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'owner', internalType: 'address', type: 'address' },
    ],
    name: 'ERC1155MissingApprovalForAll',
  },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'NotCore' },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'account', internalType: 'address', type: 'address', indexed: true },
      { name: 'operator', internalType: 'address', type: 'address', indexed: true },
      { name: 'approved', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'ApprovalForAll',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'version', internalType: 'uint64', type: 'uint64', indexed: false }],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256', indexed: false }],
    name: 'MetadataUpdate',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousOwner', internalType: 'address', type: 'address', indexed: true },
      { name: 'newOwner', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'OwnershipTransferStarted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousOwner', internalType: 'address', type: 'address', indexed: true },
      { name: 'newOwner', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address', indexed: true },
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      { name: 'ids', internalType: 'uint256[]', type: 'uint256[]', indexed: false },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]', indexed: false },
    ],
    name: 'TransferBatch',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address', indexed: true },
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'value', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'TransferSingle',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'value', internalType: 'string', type: 'string', indexed: false },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
    ],
    name: 'URI',
  },
  {
    type: 'function',
    inputs: [],
    name: 'acceptOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'accounts', internalType: 'address[]', type: 'address[]' },
      { name: 'ids', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'balanceOfBatch',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'ids', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'amounts', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'burnBatch',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'core',
    outputs: [{ name: '', internalType: 'contract IOtomItemsCore', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'emitMetadataUpdate',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'exists',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_coreAddress', internalType: 'address', type: 'address' },
      { name: '_trackingAddress', internalType: 'address', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'operator', internalType: 'address', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'pendingOwner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'ids', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeBatchTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'approved', internalType: 'bool', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'tracking',
    outputs: [{ name: '', internalType: 'contract IOtomItemsTracking', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'uri',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AssemblyTrackingContract
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const assemblyTrackingContractAbi = [
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'InvalidInput' },
  { type: 'error', inputs: [], name: 'InvalidItem' },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  { type: 'error', inputs: [], name: 'NotOtomItems' },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'coreAddress', internalType: 'address', type: 'address', indexed: true }],
    name: 'CoreSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'version', internalType: 'uint64', type: 'uint64', indexed: false }],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'otomItemsAddress', internalType: 'address', type: 'address', indexed: true }],
    name: 'OtomItemsSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousOwner', internalType: 'address', type: 'address', indexed: true },
      { name: 'newOwner', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'OwnershipTransferStarted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousOwner', internalType: 'address', type: 'address', indexed: true },
      { name: 'newOwner', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'function',
    inputs: [],
    name: 'acceptOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_tokenIds', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '_currentOwners', internalType: 'address[]', type: 'address[]' },
    ],
    name: 'batchReconcileTokens',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'core',
    outputs: [{ name: '', internalType: 'contract IOtomItemsCore', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_offset', internalType: 'uint256', type: 'uint256' },
      { name: '_limit', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getAllItemsPaginated',
    outputs: [
      {
        name: '',
        internalType: 'struct Item[]',
        type: 'tuple[]',
        components: [
          { name: 'id', internalType: 'uint256', type: 'uint256' },
          { name: 'name', internalType: 'string', type: 'string' },
          { name: 'description', internalType: 'string', type: 'string' },
          { name: 'creator', internalType: 'address', type: 'address' },
          { name: 'admin', internalType: 'address', type: 'address' },
          { name: 'defaultImageUri', internalType: 'string', type: 'string' },
          { name: 'itemType', internalType: 'enum ItemType', type: 'uint8' },
          {
            name: 'blueprint',
            internalType: 'struct BlueprintComponent[]',
            type: 'tuple[]',
            components: [
              { name: 'componentType', internalType: 'enum ComponentType', type: 'uint8' },
              { name: 'itemIdOrOtomTokenId', internalType: 'uint256', type: 'uint256' },
              { name: 'amount', internalType: 'uint256', type: 'uint256' },
              {
                name: 'criteria',
                internalType: 'struct PropertyCriterion[]',
                type: 'tuple[]',
                components: [
                  { name: 'propertyType', internalType: 'enum PropertyType', type: 'uint8' },
                  { name: 'minValue', internalType: 'uint256', type: 'uint256' },
                  { name: 'maxValue', internalType: 'uint256', type: 'uint256' },
                  { name: 'boolValue', internalType: 'bool', type: 'bool' },
                  { name: 'checkBoolValue', internalType: 'bool', type: 'bool' },
                  { name: 'stringValue', internalType: 'string', type: 'string' },
                  { name: 'checkStringValue', internalType: 'bool', type: 'bool' },
                  { name: 'bytes32Value', internalType: 'bytes32', type: 'bytes32' },
                  { name: 'checkBytes32Value', internalType: 'bool', type: 'bool' },
                ],
              },
            ],
          },
          { name: 'mutatorContract', internalType: 'address', type: 'address' },
          { name: 'ethCostInWei', internalType: 'uint256', type: 'uint256' },
          { name: 'feeRecipient', internalType: 'address', type: 'address' },
          { name: 'defaultTierImageUris', internalType: 'string[7]', type: 'string[7]' },
          { name: 'defaultCraftAmount', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_itemId', internalType: 'uint256', type: 'uint256' }],
    name: 'getItemSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_owner', internalType: 'address', type: 'address' },
      { name: '_itemId', internalType: 'uint256', type: 'uint256' },
      { name: '_offset', internalType: 'uint256', type: 'uint256' },
      { name: '_limit', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getNonFungibleItemOwnerTokenIdsPaginated',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_itemId', internalType: 'uint256', type: 'uint256' },
      { name: '_offset', internalType: 'uint256', type: 'uint256' },
      { name: '_limit', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getNonFungibleItemTokenIdsPaginated',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'getNonFungibleTokenOwner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_coreAddress', internalType: 'address', type: 'address' }],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'ids', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'onUpdate',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'otomItems',
    outputs: [{ name: '', internalType: 'contract IOtomItems', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'pendingOwner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_tokenId', internalType: 'uint256', type: 'uint256' },
      { name: '_currentOwner', internalType: 'address', type: 'address' },
    ],
    name: 'reconcileToken',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_coreAddress', internalType: 'address', type: 'address' }],
    name: 'setCore',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_otomItemsAddress', internalType: 'address', type: 'address' }],
    name: 'setOtomItems',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_itemId', internalType: 'uint256', type: 'uint256' },
      { name: '_tokenIds', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'updateGlobalTokenList',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_itemId', internalType: 'uint256', type: 'uint256' },
      { name: '_owners', internalType: 'address[]', type: 'address[]' },
      { name: '_ownerTokenIds', internalType: 'uint256[][]', type: 'uint256[][]' },
    ],
    name: 'updateOwnerTokenLists',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// OtomsCoreContract
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const otomsCoreContractAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  { type: 'error', inputs: [], name: 'ECDSAInvalidSignature' },
  {
    type: 'error',
    inputs: [{ name: 'length', internalType: 'uint256', type: 'uint256' }],
    name: 'ECDSAInvalidSignatureLength',
  },
  {
    type: 'error',
    inputs: [{ name: 's', internalType: 'bytes32', type: 'bytes32' }],
    name: 'ECDSAInvalidSignatureS',
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC1155InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidApprover',
  },
  {
    type: 'error',
    inputs: [
      { name: 'idsLength', internalType: 'uint256', type: 'uint256' },
      { name: 'valuesLength', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC1155InvalidArrayLength',
  },
  {
    type: 'error',
    inputs: [{ name: 'operator', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidOperator',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidSender',
  },
  {
    type: 'error',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'owner', internalType: 'address', type: 'address' },
    ],
    name: 'ERC1155MissingApprovalForAll',
  },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'InvalidMiningHash' },
  { type: 'error', inputs: [], name: 'InvalidSignature' },
  { type: 'error', inputs: [], name: 'InvalidUniverseHash' },
  { type: 'error', inputs: [], name: 'MinesDepleted' },
  { type: 'error', inputs: [], name: 'MiningLimitExceeded' },
  { type: 'error', inputs: [], name: 'NotAnAtom' },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  { type: 'error', inputs: [], name: 'NotOperator' },
  { type: 'error', inputs: [], name: 'NotSeeded' },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
  { type: 'error', inputs: [], name: 'UniverseSeedingClosed' },
  { type: 'error', inputs: [], name: 'UsedSignature' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'account', internalType: 'address', type: 'address', indexed: true },
      { name: 'operator', internalType: 'address', type: 'address', indexed: true },
      { name: 'approved', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'ApprovalForAll',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'encoder', internalType: 'address', type: 'address', indexed: true }],
    name: 'EncoderUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'version', internalType: 'uint64', type: 'uint64', indexed: false }],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'minesDepleted', internalType: 'bool', type: 'bool', indexed: true }],
    name: 'MinesDepletedSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'miningLimit', internalType: 'uint256', type: 'uint256', indexed: true }],
    name: 'MiningLimitSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address', indexed: true },
      { name: 'isActive', internalType: 'bool', type: 'bool', indexed: true },
    ],
    name: 'OperatorToggled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'minedBy', internalType: 'address', type: 'address', indexed: true },
      { name: 'universeHash', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'atomId', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'creationHash', internalType: 'bytes32', type: 'bytes32', indexed: false },
    ],
    name: 'OtomMined',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousOwner', internalType: 'address', type: 'address', indexed: true },
      { name: 'newOwner', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'OwnershipTransferStarted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousOwner', internalType: 'address', type: 'address', indexed: true },
      { name: 'newOwner', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'signer', internalType: 'address', type: 'address', indexed: true }],
    name: 'SignerSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address', indexed: true },
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      { name: 'ids', internalType: 'uint256[]', type: 'uint256[]', indexed: false },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]', indexed: false },
    ],
    name: 'TransferBatch',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address', indexed: true },
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'value', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'TransferSingle',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'value', internalType: 'string', type: 'string', indexed: false },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
    ],
    name: 'URI',
  },
  {
    type: 'function',
    inputs: [],
    name: 'acceptOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_atomId', internalType: 'uint256', type: 'uint256' },
      { name: '_chemist', internalType: 'address', type: 'address' },
    ],
    name: 'annihilate',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'accounts', internalType: 'address[]', type: 'address[]' },
      { name: 'ids', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'balanceOfBatch',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'database',
    outputs: [{ name: '', internalType: 'contract IOtomsDatabase', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'encoder',
    outputs: [{ name: '', internalType: 'contract IOtomsEncoder', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'exists',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_universeHash', internalType: 'bytes32', type: 'bytes32' },
      { name: '_chemist', internalType: 'address', type: 'address' },
    ],
    name: 'getMiningNonce',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_reactionResult',
        internalType: 'struct ReactionResult',
        type: 'tuple',
        components: [
          { name: 'universeHash', internalType: 'bytes32', type: 'bytes32' },
          { name: 'reactionOutputId', internalType: 'uint256', type: 'uint256' },
          {
            name: 'outputMolecules',
            internalType: 'struct MoleculeWithUri[]',
            type: 'tuple[]',
            components: [
              {
                name: 'molecule',
                internalType: 'struct Molecule',
                type: 'tuple',
                components: [
                  { name: 'id', internalType: 'string', type: 'string' },
                  { name: 'name', internalType: 'string', type: 'string' },
                  { name: 'universeHash', internalType: 'bytes32', type: 'bytes32' },
                  { name: 'activationEnergy', internalType: 'uint256', type: 'uint256' },
                  { name: 'radius', internalType: 'uint256', type: 'uint256' },
                  {
                    name: 'bond',
                    internalType: 'struct Bond',
                    type: 'tuple',
                    components: [
                      { name: 'strength', internalType: 'uint256', type: 'uint256' },
                      { name: 'bondType', internalType: 'string', type: 'string' },
                    ],
                  },
                  {
                    name: 'givingAtoms',
                    internalType: 'struct Atom[]',
                    type: 'tuple[]',
                    components: [
                      { name: 'radius', internalType: 'uint256', type: 'uint256' },
                      { name: 'volume', internalType: 'uint256', type: 'uint256' },
                      { name: 'mass', internalType: 'uint256', type: 'uint256' },
                      { name: 'density', internalType: 'uint256', type: 'uint256' },
                      { name: 'electronegativity', internalType: 'uint256', type: 'uint256' },
                      { name: 'metallic', internalType: 'bool', type: 'bool' },
                      { name: 'name', internalType: 'string', type: 'string' },
                      { name: 'series', internalType: 'string', type: 'string' },
                      { name: 'periodicTableX', internalType: 'uint256', type: 'uint256' },
                      { name: 'periodicTableY', internalType: 'uint256', type: 'uint256' },
                      {
                        name: 'structure',
                        internalType: 'struct AtomStructure',
                        type: 'tuple',
                        components: [
                          { name: 'universeHash', internalType: 'bytes32', type: 'bytes32' },
                          { name: 'depth', internalType: 'uint256', type: 'uint256' },
                          { name: 'distance', internalType: 'uint256', type: 'uint256' },
                          { name: 'distanceIndex', internalType: 'uint256', type: 'uint256' },
                          { name: 'shell', internalType: 'uint256', type: 'uint256' },
                          { name: 'totalInOuter', internalType: 'uint256[]', type: 'uint256[]' },
                          { name: 'emptyInOuter', internalType: 'uint256[]', type: 'uint256[]' },
                          { name: 'filledInOuter', internalType: 'uint256[]', type: 'uint256[]' },
                          { name: 'ancestors', internalType: 'uint256[]', type: 'uint256[]' },
                        ],
                      },
                      {
                        name: 'nucleus',
                        internalType: 'struct Nucleus',
                        type: 'tuple',
                        components: [
                          { name: 'protons', internalType: 'uint256', type: 'uint256' },
                          { name: 'neutrons', internalType: 'uint256', type: 'uint256' },
                          { name: 'nucleons', internalType: 'uint256', type: 'uint256' },
                          { name: 'stability', internalType: 'uint256', type: 'uint256' },
                          { name: 'decayType', internalType: 'string', type: 'string' },
                        ],
                      },
                    ],
                  },
                  {
                    name: 'receivingAtoms',
                    internalType: 'struct Atom[]',
                    type: 'tuple[]',
                    components: [
                      { name: 'radius', internalType: 'uint256', type: 'uint256' },
                      { name: 'volume', internalType: 'uint256', type: 'uint256' },
                      { name: 'mass', internalType: 'uint256', type: 'uint256' },
                      { name: 'density', internalType: 'uint256', type: 'uint256' },
                      { name: 'electronegativity', internalType: 'uint256', type: 'uint256' },
                      { name: 'metallic', internalType: 'bool', type: 'bool' },
                      { name: 'name', internalType: 'string', type: 'string' },
                      { name: 'series', internalType: 'string', type: 'string' },
                      { name: 'periodicTableX', internalType: 'uint256', type: 'uint256' },
                      { name: 'periodicTableY', internalType: 'uint256', type: 'uint256' },
                      {
                        name: 'structure',
                        internalType: 'struct AtomStructure',
                        type: 'tuple',
                        components: [
                          { name: 'universeHash', internalType: 'bytes32', type: 'bytes32' },
                          { name: 'depth', internalType: 'uint256', type: 'uint256' },
                          { name: 'distance', internalType: 'uint256', type: 'uint256' },
                          { name: 'distanceIndex', internalType: 'uint256', type: 'uint256' },
                          { name: 'shell', internalType: 'uint256', type: 'uint256' },
                          { name: 'totalInOuter', internalType: 'uint256[]', type: 'uint256[]' },
                          { name: 'emptyInOuter', internalType: 'uint256[]', type: 'uint256[]' },
                          { name: 'filledInOuter', internalType: 'uint256[]', type: 'uint256[]' },
                          { name: 'ancestors', internalType: 'uint256[]', type: 'uint256[]' },
                        ],
                      },
                      {
                        name: 'nucleus',
                        internalType: 'struct Nucleus',
                        type: 'tuple',
                        components: [
                          { name: 'protons', internalType: 'uint256', type: 'uint256' },
                          { name: 'neutrons', internalType: 'uint256', type: 'uint256' },
                          { name: 'nucleons', internalType: 'uint256', type: 'uint256' },
                          { name: 'stability', internalType: 'uint256', type: 'uint256' },
                          { name: 'decayType', internalType: 'string', type: 'string' },
                        ],
                      },
                    ],
                  },
                  { name: 'electricalConductivity', internalType: 'uint256', type: 'uint256' },
                  { name: 'thermalConductivity', internalType: 'uint256', type: 'uint256' },
                  { name: 'toughness', internalType: 'uint256', type: 'uint256' },
                  { name: 'hardness', internalType: 'uint256', type: 'uint256' },
                  { name: 'ductility', internalType: 'uint256', type: 'uint256' },
                ],
              },
              { name: 'tokenUri', internalType: 'string', type: 'string' },
            ],
          },
          { name: 'inputAtomIds', internalType: 'uint256[]', type: 'uint256[]' },
          { name: 'remainingEnergy', internalType: 'uint256', type: 'uint256' },
          { name: 'reactionTypes', internalType: 'string[]', type: 'string[]' },
          { name: 'success', internalType: 'bool', type: 'bool' },
        ],
      },
      { name: '_chemist', internalType: 'address', type: 'address' },
    ],
    name: 'handleReactionResult',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_operators', internalType: 'address[]', type: 'address[]' },
      { name: 'signerAddress', internalType: 'address', type: 'address' },
      { name: 'encoderAddress', internalType: 'address', type: 'address' },
      { name: 'databaseAddress', internalType: 'address', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'operator', internalType: 'address', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_payloads',
        internalType: 'struct MiningPayload[]',
        type: 'tuple[]',
        components: [
          {
            name: 'minedMolecule',
            internalType: 'struct Molecule',
            type: 'tuple',
            components: [
              { name: 'id', internalType: 'string', type: 'string' },
              { name: 'name', internalType: 'string', type: 'string' },
              { name: 'universeHash', internalType: 'bytes32', type: 'bytes32' },
              { name: 'activationEnergy', internalType: 'uint256', type: 'uint256' },
              { name: 'radius', internalType: 'uint256', type: 'uint256' },
              {
                name: 'bond',
                internalType: 'struct Bond',
                type: 'tuple',
                components: [
                  { name: 'strength', internalType: 'uint256', type: 'uint256' },
                  { name: 'bondType', internalType: 'string', type: 'string' },
                ],
              },
              {
                name: 'givingAtoms',
                internalType: 'struct Atom[]',
                type: 'tuple[]',
                components: [
                  { name: 'radius', internalType: 'uint256', type: 'uint256' },
                  { name: 'volume', internalType: 'uint256', type: 'uint256' },
                  { name: 'mass', internalType: 'uint256', type: 'uint256' },
                  { name: 'density', internalType: 'uint256', type: 'uint256' },
                  { name: 'electronegativity', internalType: 'uint256', type: 'uint256' },
                  { name: 'metallic', internalType: 'bool', type: 'bool' },
                  { name: 'name', internalType: 'string', type: 'string' },
                  { name: 'series', internalType: 'string', type: 'string' },
                  { name: 'periodicTableX', internalType: 'uint256', type: 'uint256' },
                  { name: 'periodicTableY', internalType: 'uint256', type: 'uint256' },
                  {
                    name: 'structure',
                    internalType: 'struct AtomStructure',
                    type: 'tuple',
                    components: [
                      { name: 'universeHash', internalType: 'bytes32', type: 'bytes32' },
                      { name: 'depth', internalType: 'uint256', type: 'uint256' },
                      { name: 'distance', internalType: 'uint256', type: 'uint256' },
                      { name: 'distanceIndex', internalType: 'uint256', type: 'uint256' },
                      { name: 'shell', internalType: 'uint256', type: 'uint256' },
                      { name: 'totalInOuter', internalType: 'uint256[]', type: 'uint256[]' },
                      { name: 'emptyInOuter', internalType: 'uint256[]', type: 'uint256[]' },
                      { name: 'filledInOuter', internalType: 'uint256[]', type: 'uint256[]' },
                      { name: 'ancestors', internalType: 'uint256[]', type: 'uint256[]' },
                    ],
                  },
                  {
                    name: 'nucleus',
                    internalType: 'struct Nucleus',
                    type: 'tuple',
                    components: [
                      { name: 'protons', internalType: 'uint256', type: 'uint256' },
                      { name: 'neutrons', internalType: 'uint256', type: 'uint256' },
                      { name: 'nucleons', internalType: 'uint256', type: 'uint256' },
                      { name: 'stability', internalType: 'uint256', type: 'uint256' },
                      { name: 'decayType', internalType: 'string', type: 'string' },
                    ],
                  },
                ],
              },
              {
                name: 'receivingAtoms',
                internalType: 'struct Atom[]',
                type: 'tuple[]',
                components: [
                  { name: 'radius', internalType: 'uint256', type: 'uint256' },
                  { name: 'volume', internalType: 'uint256', type: 'uint256' },
                  { name: 'mass', internalType: 'uint256', type: 'uint256' },
                  { name: 'density', internalType: 'uint256', type: 'uint256' },
                  { name: 'electronegativity', internalType: 'uint256', type: 'uint256' },
                  { name: 'metallic', internalType: 'bool', type: 'bool' },
                  { name: 'name', internalType: 'string', type: 'string' },
                  { name: 'series', internalType: 'string', type: 'string' },
                  { name: 'periodicTableX', internalType: 'uint256', type: 'uint256' },
                  { name: 'periodicTableY', internalType: 'uint256', type: 'uint256' },
                  {
                    name: 'structure',
                    internalType: 'struct AtomStructure',
                    type: 'tuple',
                    components: [
                      { name: 'universeHash', internalType: 'bytes32', type: 'bytes32' },
                      { name: 'depth', internalType: 'uint256', type: 'uint256' },
                      { name: 'distance', internalType: 'uint256', type: 'uint256' },
                      { name: 'distanceIndex', internalType: 'uint256', type: 'uint256' },
                      { name: 'shell', internalType: 'uint256', type: 'uint256' },
                      { name: 'totalInOuter', internalType: 'uint256[]', type: 'uint256[]' },
                      { name: 'emptyInOuter', internalType: 'uint256[]', type: 'uint256[]' },
                      { name: 'filledInOuter', internalType: 'uint256[]', type: 'uint256[]' },
                      { name: 'ancestors', internalType: 'uint256[]', type: 'uint256[]' },
                    ],
                  },
                  {
                    name: 'nucleus',
                    internalType: 'struct Nucleus',
                    type: 'tuple',
                    components: [
                      { name: 'protons', internalType: 'uint256', type: 'uint256' },
                      { name: 'neutrons', internalType: 'uint256', type: 'uint256' },
                      { name: 'nucleons', internalType: 'uint256', type: 'uint256' },
                      { name: 'stability', internalType: 'uint256', type: 'uint256' },
                      { name: 'decayType', internalType: 'string', type: 'string' },
                    ],
                  },
                ],
              },
              { name: 'electricalConductivity', internalType: 'uint256', type: 'uint256' },
              { name: 'thermalConductivity', internalType: 'uint256', type: 'uint256' },
              { name: 'toughness', internalType: 'uint256', type: 'uint256' },
              { name: 'hardness', internalType: 'uint256', type: 'uint256' },
              { name: 'ductility', internalType: 'uint256', type: 'uint256' },
            ],
          },
          { name: 'miningHash', internalType: 'bytes32', type: 'bytes32' },
          { name: 'tokenUri', internalType: 'string', type: 'string' },
          { name: 'universeHash', internalType: 'bytes32', type: 'bytes32' },
          { name: 'expiry', internalType: 'uint256', type: 'uint256' },
          { name: 'signature', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'mine',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'minesDepleted',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'miningLimit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_molecule',
        internalType: 'struct Molecule',
        type: 'tuple',
        components: [
          { name: 'id', internalType: 'string', type: 'string' },
          { name: 'name', internalType: 'string', type: 'string' },
          { name: 'universeHash', internalType: 'bytes32', type: 'bytes32' },
          { name: 'activationEnergy', internalType: 'uint256', type: 'uint256' },
          { name: 'radius', internalType: 'uint256', type: 'uint256' },
          {
            name: 'bond',
            internalType: 'struct Bond',
            type: 'tuple',
            components: [
              { name: 'strength', internalType: 'uint256', type: 'uint256' },
              { name: 'bondType', internalType: 'string', type: 'string' },
            ],
          },
          {
            name: 'givingAtoms',
            internalType: 'struct Atom[]',
            type: 'tuple[]',
            components: [
              { name: 'radius', internalType: 'uint256', type: 'uint256' },
              { name: 'volume', internalType: 'uint256', type: 'uint256' },
              { name: 'mass', internalType: 'uint256', type: 'uint256' },
              { name: 'density', internalType: 'uint256', type: 'uint256' },
              { name: 'electronegativity', internalType: 'uint256', type: 'uint256' },
              { name: 'metallic', internalType: 'bool', type: 'bool' },
              { name: 'name', internalType: 'string', type: 'string' },
              { name: 'series', internalType: 'string', type: 'string' },
              { name: 'periodicTableX', internalType: 'uint256', type: 'uint256' },
              { name: 'periodicTableY', internalType: 'uint256', type: 'uint256' },
              {
                name: 'structure',
                internalType: 'struct AtomStructure',
                type: 'tuple',
                components: [
                  { name: 'universeHash', internalType: 'bytes32', type: 'bytes32' },
                  { name: 'depth', internalType: 'uint256', type: 'uint256' },
                  { name: 'distance', internalType: 'uint256', type: 'uint256' },
                  { name: 'distanceIndex', internalType: 'uint256', type: 'uint256' },
                  { name: 'shell', internalType: 'uint256', type: 'uint256' },
                  { name: 'totalInOuter', internalType: 'uint256[]', type: 'uint256[]' },
                  { name: 'emptyInOuter', internalType: 'uint256[]', type: 'uint256[]' },
                  { name: 'filledInOuter', internalType: 'uint256[]', type: 'uint256[]' },
                  { name: 'ancestors', internalType: 'uint256[]', type: 'uint256[]' },
                ],
              },
              {
                name: 'nucleus',
                internalType: 'struct Nucleus',
                type: 'tuple',
                components: [
                  { name: 'protons', internalType: 'uint256', type: 'uint256' },
                  { name: 'neutrons', internalType: 'uint256', type: 'uint256' },
                  { name: 'nucleons', internalType: 'uint256', type: 'uint256' },
                  { name: 'stability', internalType: 'uint256', type: 'uint256' },
                  { name: 'decayType', internalType: 'string', type: 'string' },
                ],
              },
            ],
          },
          {
            name: 'receivingAtoms',
            internalType: 'struct Atom[]',
            type: 'tuple[]',
            components: [
              { name: 'radius', internalType: 'uint256', type: 'uint256' },
              { name: 'volume', internalType: 'uint256', type: 'uint256' },
              { name: 'mass', internalType: 'uint256', type: 'uint256' },
              { name: 'density', internalType: 'uint256', type: 'uint256' },
              { name: 'electronegativity', internalType: 'uint256', type: 'uint256' },
              { name: 'metallic', internalType: 'bool', type: 'bool' },
              { name: 'name', internalType: 'string', type: 'string' },
              { name: 'series', internalType: 'string', type: 'string' },
              { name: 'periodicTableX', internalType: 'uint256', type: 'uint256' },
              { name: 'periodicTableY', internalType: 'uint256', type: 'uint256' },
              {
                name: 'structure',
                internalType: 'struct AtomStructure',
                type: 'tuple',
                components: [
                  { name: 'universeHash', internalType: 'bytes32', type: 'bytes32' },
                  { name: 'depth', internalType: 'uint256', type: 'uint256' },
                  { name: 'distance', internalType: 'uint256', type: 'uint256' },
                  { name: 'distanceIndex', internalType: 'uint256', type: 'uint256' },
                  { name: 'shell', internalType: 'uint256', type: 'uint256' },
                  { name: 'totalInOuter', internalType: 'uint256[]', type: 'uint256[]' },
                  { name: 'emptyInOuter', internalType: 'uint256[]', type: 'uint256[]' },
                  { name: 'filledInOuter', internalType: 'uint256[]', type: 'uint256[]' },
                  { name: 'ancestors', internalType: 'uint256[]', type: 'uint256[]' },
                ],
              },
              {
                name: 'nucleus',
                internalType: 'struct Nucleus',
                type: 'tuple',
                components: [
                  { name: 'protons', internalType: 'uint256', type: 'uint256' },
                  { name: 'neutrons', internalType: 'uint256', type: 'uint256' },
                  { name: 'nucleons', internalType: 'uint256', type: 'uint256' },
                  { name: 'stability', internalType: 'uint256', type: 'uint256' },
                  { name: 'decayType', internalType: 'string', type: 'string' },
                ],
              },
            ],
          },
          { name: 'electricalConductivity', internalType: 'uint256', type: 'uint256' },
          { name: 'thermalConductivity', internalType: 'uint256', type: 'uint256' },
          { name: 'toughness', internalType: 'uint256', type: 'uint256' },
          { name: 'hardness', internalType: 'uint256', type: 'uint256' },
          { name: 'ductility', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'moleculeIsAtom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'operators',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'pendingOwner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'ids', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeBatchTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_universeInformation',
        internalType: 'struct UniverseInformation',
        type: 'tuple',
        components: [
          { name: 'energyFactorBps', internalType: 'uint256', type: 'uint256' },
          { name: 'active', internalType: 'bool', type: 'bool' },
          { name: 'seedHash', internalType: 'bytes32', type: 'bytes32' },
          { name: 'name', internalType: 'string', type: 'string' },
        ],
      },
      { name: 'expiry', internalType: 'uint256', type: 'uint256' },
      { name: 'signature', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'seedUniverse',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'approved', internalType: 'bool', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_newEncoder', internalType: 'address', type: 'address' }],
    name: 'setEncoder',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_minesDepleted', internalType: 'bool', type: 'bool' }],
    name: 'setMinesDepleted',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_miningLimit', internalType: 'uint256', type: 'uint256' }],
    name: 'setMiningLimit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newSigner', internalType: 'address', type: 'address' }],
    name: 'setSigner',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_operator', internalType: 'address', type: 'address' }],
    name: 'toggleOperator',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'uri',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// OtomsDatabaseContract
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const otomsDatabaseContractAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  { type: 'error', inputs: [], name: 'AlreadySeeded' },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'InvalidUniverseName' },
  { type: 'error', inputs: [], name: 'InvalidUniverseSeed' },
  { type: 'error', inputs: [], name: 'MoleculeNotDiscovered' },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  { type: 'error', inputs: [], name: 'NotOperator' },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
  { type: 'error', inputs: [], name: 'TokenUriNotSet' },
  { type: 'error', inputs: [], name: 'UniverseNameTaken' },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'newEncoder', internalType: 'address', type: 'address', indexed: true }],
    name: 'EncoderUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'version', internalType: 'uint64', type: 'uint64', indexed: false }],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256', indexed: true }],
    name: 'MetadataUpdate',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'universeHash', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'discoveredBy', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'MoleculeDiscovered',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address', indexed: true },
      { name: 'enabled', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'OperatorToggled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousOwner', internalType: 'address', type: 'address', indexed: true },
      { name: 'newOwner', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'OwnershipTransferStarted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousOwner', internalType: 'address', type: 'address', indexed: true },
      { name: 'newOwner', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'universeHash', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'active', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'UniverseActiveToggled',
  },
  {
    type: 'function',
    inputs: [],
    name: 'acceptOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'activeUniverses',
    outputs: [{ name: '', internalType: 'bytes32[]', type: 'bytes32[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'encoder',
    outputs: [{ name: '', internalType: 'contract IOtomsEncoder', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'moleculeId', internalType: 'string', type: 'string' }],
    name: 'getMoleculeByMoleculeId',
    outputs: [
      {
        name: '',
        internalType: 'struct Molecule',
        type: 'tuple',
        components: [
          { name: 'id', internalType: 'string', type: 'string' },
          { name: 'name', internalType: 'string', type: 'string' },
          { name: 'universeHash', internalType: 'bytes32', type: 'bytes32' },
          { name: 'activationEnergy', internalType: 'uint256', type: 'uint256' },
          { name: 'radius', internalType: 'uint256', type: 'uint256' },
          {
            name: 'bond',
            internalType: 'struct Bond',
            type: 'tuple',
            components: [
              { name: 'strength', internalType: 'uint256', type: 'uint256' },
              { name: 'bondType', internalType: 'string', type: 'string' },
            ],
          },
          {
            name: 'givingAtoms',
            internalType: 'struct Atom[]',
            type: 'tuple[]',
            components: [
              { name: 'radius', internalType: 'uint256', type: 'uint256' },
              { name: 'volume', internalType: 'uint256', type: 'uint256' },
              { name: 'mass', internalType: 'uint256', type: 'uint256' },
              { name: 'density', internalType: 'uint256', type: 'uint256' },
              { name: 'electronegativity', internalType: 'uint256', type: 'uint256' },
              { name: 'metallic', internalType: 'bool', type: 'bool' },
              { name: 'name', internalType: 'string', type: 'string' },
              { name: 'series', internalType: 'string', type: 'string' },
              { name: 'periodicTableX', internalType: 'uint256', type: 'uint256' },
              { name: 'periodicTableY', internalType: 'uint256', type: 'uint256' },
              {
                name: 'structure',
                internalType: 'struct AtomStructure',
                type: 'tuple',
                components: [
                  { name: 'universeHash', internalType: 'bytes32', type: 'bytes32' },
                  { name: 'depth', internalType: 'uint256', type: 'uint256' },
                  { name: 'distance', internalType: 'uint256', type: 'uint256' },
                  { name: 'distanceIndex', internalType: 'uint256', type: 'uint256' },
                  { name: 'shell', internalType: 'uint256', type: 'uint256' },
                  { name: 'totalInOuter', internalType: 'uint256[]', type: 'uint256[]' },
                  { name: 'emptyInOuter', internalType: 'uint256[]', type: 'uint256[]' },
                  { name: 'filledInOuter', internalType: 'uint256[]', type: 'uint256[]' },
                  { name: 'ancestors', internalType: 'uint256[]', type: 'uint256[]' },
                ],
              },
              {
                name: 'nucleus',
                internalType: 'struct Nucleus',
                type: 'tuple',
                components: [
                  { name: 'protons', internalType: 'uint256', type: 'uint256' },
                  { name: 'neutrons', internalType: 'uint256', type: 'uint256' },
                  { name: 'nucleons', internalType: 'uint256', type: 'uint256' },
                  { name: 'stability', internalType: 'uint256', type: 'uint256' },
                  { name: 'decayType', internalType: 'string', type: 'string' },
                ],
              },
            ],
          },
          {
            name: 'receivingAtoms',
            internalType: 'struct Atom[]',
            type: 'tuple[]',
            components: [
              { name: 'radius', internalType: 'uint256', type: 'uint256' },
              { name: 'volume', internalType: 'uint256', type: 'uint256' },
              { name: 'mass', internalType: 'uint256', type: 'uint256' },
              { name: 'density', internalType: 'uint256', type: 'uint256' },
              { name: 'electronegativity', internalType: 'uint256', type: 'uint256' },
              { name: 'metallic', internalType: 'bool', type: 'bool' },
              { name: 'name', internalType: 'string', type: 'string' },
              { name: 'series', internalType: 'string', type: 'string' },
              { name: 'periodicTableX', internalType: 'uint256', type: 'uint256' },
              { name: 'periodicTableY', internalType: 'uint256', type: 'uint256' },
              {
                name: 'structure',
                internalType: 'struct AtomStructure',
                type: 'tuple',
                components: [
                  { name: 'universeHash', internalType: 'bytes32', type: 'bytes32' },
                  { name: 'depth', internalType: 'uint256', type: 'uint256' },
                  { name: 'distance', internalType: 'uint256', type: 'uint256' },
                  { name: 'distanceIndex', internalType: 'uint256', type: 'uint256' },
                  { name: 'shell', internalType: 'uint256', type: 'uint256' },
                  { name: 'totalInOuter', internalType: 'uint256[]', type: 'uint256[]' },
                  { name: 'emptyInOuter', internalType: 'uint256[]', type: 'uint256[]' },
                  { name: 'filledInOuter', internalType: 'uint256[]', type: 'uint256[]' },
                  { name: 'ancestors', internalType: 'uint256[]', type: 'uint256[]' },
                ],
              },
              {
                name: 'nucleus',
                internalType: 'struct Nucleus',
                type: 'tuple',
                components: [
                  { name: 'protons', internalType: 'uint256', type: 'uint256' },
                  { name: 'neutrons', internalType: 'uint256', type: 'uint256' },
                  { name: 'nucleons', internalType: 'uint256', type: 'uint256' },
                  { name: 'stability', internalType: 'uint256', type: 'uint256' },
                  { name: 'decayType', internalType: 'string', type: 'string' },
                ],
              },
            ],
          },
          { name: 'electricalConductivity', internalType: 'uint256', type: 'uint256' },
          { name: 'thermalConductivity', internalType: 'uint256', type: 'uint256' },
          { name: 'toughness', internalType: 'uint256', type: 'uint256' },
          { name: 'hardness', internalType: 'uint256', type: 'uint256' },
          { name: 'ductility', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'getMoleculeByTokenId',
    outputs: [
      {
        name: '',
        internalType: 'struct Molecule',
        type: 'tuple',
        components: [
          { name: 'id', internalType: 'string', type: 'string' },
          { name: 'name', internalType: 'string', type: 'string' },
          { name: 'universeHash', internalType: 'bytes32', type: 'bytes32' },
          { name: 'activationEnergy', internalType: 'uint256', type: 'uint256' },
          { name: 'radius', internalType: 'uint256', type: 'uint256' },
          {
            name: 'bond',
            internalType: 'struct Bond',
            type: 'tuple',
            components: [
              { name: 'strength', internalType: 'uint256', type: 'uint256' },
              { name: 'bondType', internalType: 'string', type: 'string' },
            ],
          },
          {
            name: 'givingAtoms',
            internalType: 'struct Atom[]',
            type: 'tuple[]',
            components: [
              { name: 'radius', internalType: 'uint256', type: 'uint256' },
              { name: 'volume', internalType: 'uint256', type: 'uint256' },
              { name: 'mass', internalType: 'uint256', type: 'uint256' },
              { name: 'density', internalType: 'uint256', type: 'uint256' },
              { name: 'electronegativity', internalType: 'uint256', type: 'uint256' },
              { name: 'metallic', internalType: 'bool', type: 'bool' },
              { name: 'name', internalType: 'string', type: 'string' },
              { name: 'series', internalType: 'string', type: 'string' },
              { name: 'periodicTableX', internalType: 'uint256', type: 'uint256' },
              { name: 'periodicTableY', internalType: 'uint256', type: 'uint256' },
              {
                name: 'structure',
                internalType: 'struct AtomStructure',
                type: 'tuple',
                components: [
                  { name: 'universeHash', internalType: 'bytes32', type: 'bytes32' },
                  { name: 'depth', internalType: 'uint256', type: 'uint256' },
                  { name: 'distance', internalType: 'uint256', type: 'uint256' },
                  { name: 'distanceIndex', internalType: 'uint256', type: 'uint256' },
                  { name: 'shell', internalType: 'uint256', type: 'uint256' },
                  { name: 'totalInOuter', internalType: 'uint256[]', type: 'uint256[]' },
                  { name: 'emptyInOuter', internalType: 'uint256[]', type: 'uint256[]' },
                  { name: 'filledInOuter', internalType: 'uint256[]', type: 'uint256[]' },
                  { name: 'ancestors', internalType: 'uint256[]', type: 'uint256[]' },
                ],
              },
              {
                name: 'nucleus',
                internalType: 'struct Nucleus',
                type: 'tuple',
                components: [
                  { name: 'protons', internalType: 'uint256', type: 'uint256' },
                  { name: 'neutrons', internalType: 'uint256', type: 'uint256' },
                  { name: 'nucleons', internalType: 'uint256', type: 'uint256' },
                  { name: 'stability', internalType: 'uint256', type: 'uint256' },
                  { name: 'decayType', internalType: 'string', type: 'string' },
                ],
              },
            ],
          },
          {
            name: 'receivingAtoms',
            internalType: 'struct Atom[]',
            type: 'tuple[]',
            components: [
              { name: 'radius', internalType: 'uint256', type: 'uint256' },
              { name: 'volume', internalType: 'uint256', type: 'uint256' },
              { name: 'mass', internalType: 'uint256', type: 'uint256' },
              { name: 'density', internalType: 'uint256', type: 'uint256' },
              { name: 'electronegativity', internalType: 'uint256', type: 'uint256' },
              { name: 'metallic', internalType: 'bool', type: 'bool' },
              { name: 'name', internalType: 'string', type: 'string' },
              { name: 'series', internalType: 'string', type: 'string' },
              { name: 'periodicTableX', internalType: 'uint256', type: 'uint256' },
              { name: 'periodicTableY', internalType: 'uint256', type: 'uint256' },
              {
                name: 'structure',
                internalType: 'struct AtomStructure',
                type: 'tuple',
                components: [
                  { name: 'universeHash', internalType: 'bytes32', type: 'bytes32' },
                  { name: 'depth', internalType: 'uint256', type: 'uint256' },
                  { name: 'distance', internalType: 'uint256', type: 'uint256' },
                  { name: 'distanceIndex', internalType: 'uint256', type: 'uint256' },
                  { name: 'shell', internalType: 'uint256', type: 'uint256' },
                  { name: 'totalInOuter', internalType: 'uint256[]', type: 'uint256[]' },
                  { name: 'emptyInOuter', internalType: 'uint256[]', type: 'uint256[]' },
                  { name: 'filledInOuter', internalType: 'uint256[]', type: 'uint256[]' },
                  { name: 'ancestors', internalType: 'uint256[]', type: 'uint256[]' },
                ],
              },
              {
                name: 'nucleus',
                internalType: 'struct Nucleus',
                type: 'tuple',
                components: [
                  { name: 'protons', internalType: 'uint256', type: 'uint256' },
                  { name: 'neutrons', internalType: 'uint256', type: 'uint256' },
                  { name: 'nucleons', internalType: 'uint256', type: 'uint256' },
                  { name: 'stability', internalType: 'uint256', type: 'uint256' },
                  { name: 'decayType', internalType: 'string', type: 'string' },
                ],
              },
            ],
          },
          { name: 'electricalConductivity', internalType: 'uint256', type: 'uint256' },
          { name: 'thermalConductivity', internalType: 'uint256', type: 'uint256' },
          { name: 'toughness', internalType: 'uint256', type: 'uint256' },
          { name: 'hardness', internalType: 'uint256', type: 'uint256' },
          { name: 'ductility', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'universeHash', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getMoleculesDiscovered',
    outputs: [
      {
        name: '',
        internalType: 'struct Molecule[]',
        type: 'tuple[]',
        components: [
          { name: 'id', internalType: 'string', type: 'string' },
          { name: 'name', internalType: 'string', type: 'string' },
          { name: 'universeHash', internalType: 'bytes32', type: 'bytes32' },
          { name: 'activationEnergy', internalType: 'uint256', type: 'uint256' },
          { name: 'radius', internalType: 'uint256', type: 'uint256' },
          {
            name: 'bond',
            internalType: 'struct Bond',
            type: 'tuple',
            components: [
              { name: 'strength', internalType: 'uint256', type: 'uint256' },
              { name: 'bondType', internalType: 'string', type: 'string' },
            ],
          },
          {
            name: 'givingAtoms',
            internalType: 'struct Atom[]',
            type: 'tuple[]',
            components: [
              { name: 'radius', internalType: 'uint256', type: 'uint256' },
              { name: 'volume', internalType: 'uint256', type: 'uint256' },
              { name: 'mass', internalType: 'uint256', type: 'uint256' },
              { name: 'density', internalType: 'uint256', type: 'uint256' },
              { name: 'electronegativity', internalType: 'uint256', type: 'uint256' },
              { name: 'metallic', internalType: 'bool', type: 'bool' },
              { name: 'name', internalType: 'string', type: 'string' },
              { name: 'series', internalType: 'string', type: 'string' },
              { name: 'periodicTableX', internalType: 'uint256', type: 'uint256' },
              { name: 'periodicTableY', internalType: 'uint256', type: 'uint256' },
              {
                name: 'structure',
                internalType: 'struct AtomStructure',
                type: 'tuple',
                components: [
                  { name: 'universeHash', internalType: 'bytes32', type: 'bytes32' },
                  { name: 'depth', internalType: 'uint256', type: 'uint256' },
                  { name: 'distance', internalType: 'uint256', type: 'uint256' },
                  { name: 'distanceIndex', internalType: 'uint256', type: 'uint256' },
                  { name: 'shell', internalType: 'uint256', type: 'uint256' },
                  { name: 'totalInOuter', internalType: 'uint256[]', type: 'uint256[]' },
                  { name: 'emptyInOuter', internalType: 'uint256[]', type: 'uint256[]' },
                  { name: 'filledInOuter', internalType: 'uint256[]', type: 'uint256[]' },
                  { name: 'ancestors', internalType: 'uint256[]', type: 'uint256[]' },
                ],
              },
              {
                name: 'nucleus',
                internalType: 'struct Nucleus',
                type: 'tuple',
                components: [
                  { name: 'protons', internalType: 'uint256', type: 'uint256' },
                  { name: 'neutrons', internalType: 'uint256', type: 'uint256' },
                  { name: 'nucleons', internalType: 'uint256', type: 'uint256' },
                  { name: 'stability', internalType: 'uint256', type: 'uint256' },
                  { name: 'decayType', internalType: 'string', type: 'string' },
                ],
              },
            ],
          },
          {
            name: 'receivingAtoms',
            internalType: 'struct Atom[]',
            type: 'tuple[]',
            components: [
              { name: 'radius', internalType: 'uint256', type: 'uint256' },
              { name: 'volume', internalType: 'uint256', type: 'uint256' },
              { name: 'mass', internalType: 'uint256', type: 'uint256' },
              { name: 'density', internalType: 'uint256', type: 'uint256' },
              { name: 'electronegativity', internalType: 'uint256', type: 'uint256' },
              { name: 'metallic', internalType: 'bool', type: 'bool' },
              { name: 'name', internalType: 'string', type: 'string' },
              { name: 'series', internalType: 'string', type: 'string' },
              { name: 'periodicTableX', internalType: 'uint256', type: 'uint256' },
              { name: 'periodicTableY', internalType: 'uint256', type: 'uint256' },
              {
                name: 'structure',
                internalType: 'struct AtomStructure',
                type: 'tuple',
                components: [
                  { name: 'universeHash', internalType: 'bytes32', type: 'bytes32' },
                  { name: 'depth', internalType: 'uint256', type: 'uint256' },
                  { name: 'distance', internalType: 'uint256', type: 'uint256' },
                  { name: 'distanceIndex', internalType: 'uint256', type: 'uint256' },
                  { name: 'shell', internalType: 'uint256', type: 'uint256' },
                  { name: 'totalInOuter', internalType: 'uint256[]', type: 'uint256[]' },
                  { name: 'emptyInOuter', internalType: 'uint256[]', type: 'uint256[]' },
                  { name: 'filledInOuter', internalType: 'uint256[]', type: 'uint256[]' },
                  { name: 'ancestors', internalType: 'uint256[]', type: 'uint256[]' },
                ],
              },
              {
                name: 'nucleus',
                internalType: 'struct Nucleus',
                type: 'tuple',
                components: [
                  { name: 'protons', internalType: 'uint256', type: 'uint256' },
                  { name: 'neutrons', internalType: 'uint256', type: 'uint256' },
                  { name: 'nucleons', internalType: 'uint256', type: 'uint256' },
                  { name: 'stability', internalType: 'uint256', type: 'uint256' },
                  { name: 'decayType', internalType: 'string', type: 'string' },
                ],
              },
            ],
          },
          { name: 'electricalConductivity', internalType: 'uint256', type: 'uint256' },
          { name: 'thermalConductivity', internalType: 'uint256', type: 'uint256' },
          { name: 'toughness', internalType: 'uint256', type: 'uint256' },
          { name: 'hardness', internalType: 'uint256', type: 'uint256' },
          { name: 'ductility', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'universeHash', internalType: 'bytes32', type: 'bytes32' },
      { name: 'offset', internalType: 'uint256', type: 'uint256' },
      { name: 'limit', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getMoleculesDiscoveredPaginated',
    outputs: [
      {
        name: 'molecules',
        internalType: 'struct Molecule[]',
        type: 'tuple[]',
        components: [
          { name: 'id', internalType: 'string', type: 'string' },
          { name: 'name', internalType: 'string', type: 'string' },
          { name: 'universeHash', internalType: 'bytes32', type: 'bytes32' },
          { name: 'activationEnergy', internalType: 'uint256', type: 'uint256' },
          { name: 'radius', internalType: 'uint256', type: 'uint256' },
          {
            name: 'bond',
            internalType: 'struct Bond',
            type: 'tuple',
            components: [
              { name: 'strength', internalType: 'uint256', type: 'uint256' },
              { name: 'bondType', internalType: 'string', type: 'string' },
            ],
          },
          {
            name: 'givingAtoms',
            internalType: 'struct Atom[]',
            type: 'tuple[]',
            components: [
              { name: 'radius', internalType: 'uint256', type: 'uint256' },
              { name: 'volume', internalType: 'uint256', type: 'uint256' },
              { name: 'mass', internalType: 'uint256', type: 'uint256' },
              { name: 'density', internalType: 'uint256', type: 'uint256' },
              { name: 'electronegativity', internalType: 'uint256', type: 'uint256' },
              { name: 'metallic', internalType: 'bool', type: 'bool' },
              { name: 'name', internalType: 'string', type: 'string' },
              { name: 'series', internalType: 'string', type: 'string' },
              { name: 'periodicTableX', internalType: 'uint256', type: 'uint256' },
              { name: 'periodicTableY', internalType: 'uint256', type: 'uint256' },
              {
                name: 'structure',
                internalType: 'struct AtomStructure',
                type: 'tuple',
                components: [
                  { name: 'universeHash', internalType: 'bytes32', type: 'bytes32' },
                  { name: 'depth', internalType: 'uint256', type: 'uint256' },
                  { name: 'distance', internalType: 'uint256', type: 'uint256' },
                  { name: 'distanceIndex', internalType: 'uint256', type: 'uint256' },
                  { name: 'shell', internalType: 'uint256', type: 'uint256' },
                  { name: 'totalInOuter', internalType: 'uint256[]', type: 'uint256[]' },
                  { name: 'emptyInOuter', internalType: 'uint256[]', type: 'uint256[]' },
                  { name: 'filledInOuter', internalType: 'uint256[]', type: 'uint256[]' },
                  { name: 'ancestors', internalType: 'uint256[]', type: 'uint256[]' },
                ],
              },
              {
                name: 'nucleus',
                internalType: 'struct Nucleus',
                type: 'tuple',
                components: [
                  { name: 'protons', internalType: 'uint256', type: 'uint256' },
                  { name: 'neutrons', internalType: 'uint256', type: 'uint256' },
                  { name: 'nucleons', internalType: 'uint256', type: 'uint256' },
                  { name: 'stability', internalType: 'uint256', type: 'uint256' },
                  { name: 'decayType', internalType: 'string', type: 'string' },
                ],
              },
            ],
          },
          {
            name: 'receivingAtoms',
            internalType: 'struct Atom[]',
            type: 'tuple[]',
            components: [
              { name: 'radius', internalType: 'uint256', type: 'uint256' },
              { name: 'volume', internalType: 'uint256', type: 'uint256' },
              { name: 'mass', internalType: 'uint256', type: 'uint256' },
              { name: 'density', internalType: 'uint256', type: 'uint256' },
              { name: 'electronegativity', internalType: 'uint256', type: 'uint256' },
              { name: 'metallic', internalType: 'bool', type: 'bool' },
              { name: 'name', internalType: 'string', type: 'string' },
              { name: 'series', internalType: 'string', type: 'string' },
              { name: 'periodicTableX', internalType: 'uint256', type: 'uint256' },
              { name: 'periodicTableY', internalType: 'uint256', type: 'uint256' },
              {
                name: 'structure',
                internalType: 'struct AtomStructure',
                type: 'tuple',
                components: [
                  { name: 'universeHash', internalType: 'bytes32', type: 'bytes32' },
                  { name: 'depth', internalType: 'uint256', type: 'uint256' },
                  { name: 'distance', internalType: 'uint256', type: 'uint256' },
                  { name: 'distanceIndex', internalType: 'uint256', type: 'uint256' },
                  { name: 'shell', internalType: 'uint256', type: 'uint256' },
                  { name: 'totalInOuter', internalType: 'uint256[]', type: 'uint256[]' },
                  { name: 'emptyInOuter', internalType: 'uint256[]', type: 'uint256[]' },
                  { name: 'filledInOuter', internalType: 'uint256[]', type: 'uint256[]' },
                  { name: 'ancestors', internalType: 'uint256[]', type: 'uint256[]' },
                ],
              },
              {
                name: 'nucleus',
                internalType: 'struct Nucleus',
                type: 'tuple',
                components: [
                  { name: 'protons', internalType: 'uint256', type: 'uint256' },
                  { name: 'neutrons', internalType: 'uint256', type: 'uint256' },
                  { name: 'nucleons', internalType: 'uint256', type: 'uint256' },
                  { name: 'stability', internalType: 'uint256', type: 'uint256' },
                  { name: 'decayType', internalType: 'string', type: 'string' },
                ],
              },
            ],
          },
          { name: 'electricalConductivity', internalType: 'uint256', type: 'uint256' },
          { name: 'thermalConductivity', internalType: 'uint256', type: 'uint256' },
          { name: 'toughness', internalType: 'uint256', type: 'uint256' },
          { name: 'hardness', internalType: 'uint256', type: 'uint256' },
          { name: 'ductility', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: 'total', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'universeHash', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getUniverseInformation',
    outputs: [
      {
        name: '',
        internalType: 'struct UniverseInformation',
        type: 'tuple',
        components: [
          { name: 'energyFactorBps', internalType: 'uint256', type: 'uint256' },
          { name: 'active', internalType: 'bool', type: 'bool' },
          { name: 'seedHash', internalType: 'bytes32', type: 'bytes32' },
          { name: 'name', internalType: 'string', type: 'string' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'string', type: 'string' }],
    name: 'idToTokenId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: '_operators', internalType: 'address[]', type: 'address[]' },
      { name: 'encoderAddress', internalType: 'address', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'knownUniverses',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_molecule',
        internalType: 'struct Molecule',
        type: 'tuple',
        components: [
          { name: 'id', internalType: 'string', type: 'string' },
          { name: 'name', internalType: 'string', type: 'string' },
          { name: 'universeHash', internalType: 'bytes32', type: 'bytes32' },
          { name: 'activationEnergy', internalType: 'uint256', type: 'uint256' },
          { name: 'radius', internalType: 'uint256', type: 'uint256' },
          {
            name: 'bond',
            internalType: 'struct Bond',
            type: 'tuple',
            components: [
              { name: 'strength', internalType: 'uint256', type: 'uint256' },
              { name: 'bondType', internalType: 'string', type: 'string' },
            ],
          },
          {
            name: 'givingAtoms',
            internalType: 'struct Atom[]',
            type: 'tuple[]',
            components: [
              { name: 'radius', internalType: 'uint256', type: 'uint256' },
              { name: 'volume', internalType: 'uint256', type: 'uint256' },
              { name: 'mass', internalType: 'uint256', type: 'uint256' },
              { name: 'density', internalType: 'uint256', type: 'uint256' },
              { name: 'electronegativity', internalType: 'uint256', type: 'uint256' },
              { name: 'metallic', internalType: 'bool', type: 'bool' },
              { name: 'name', internalType: 'string', type: 'string' },
              { name: 'series', internalType: 'string', type: 'string' },
              { name: 'periodicTableX', internalType: 'uint256', type: 'uint256' },
              { name: 'periodicTableY', internalType: 'uint256', type: 'uint256' },
              {
                name: 'structure',
                internalType: 'struct AtomStructure',
                type: 'tuple',
                components: [
                  { name: 'universeHash', internalType: 'bytes32', type: 'bytes32' },
                  { name: 'depth', internalType: 'uint256', type: 'uint256' },
                  { name: 'distance', internalType: 'uint256', type: 'uint256' },
                  { name: 'distanceIndex', internalType: 'uint256', type: 'uint256' },
                  { name: 'shell', internalType: 'uint256', type: 'uint256' },
                  { name: 'totalInOuter', internalType: 'uint256[]', type: 'uint256[]' },
                  { name: 'emptyInOuter', internalType: 'uint256[]', type: 'uint256[]' },
                  { name: 'filledInOuter', internalType: 'uint256[]', type: 'uint256[]' },
                  { name: 'ancestors', internalType: 'uint256[]', type: 'uint256[]' },
                ],
              },
              {
                name: 'nucleus',
                internalType: 'struct Nucleus',
                type: 'tuple',
                components: [
                  { name: 'protons', internalType: 'uint256', type: 'uint256' },
                  { name: 'neutrons', internalType: 'uint256', type: 'uint256' },
                  { name: 'nucleons', internalType: 'uint256', type: 'uint256' },
                  { name: 'stability', internalType: 'uint256', type: 'uint256' },
                  { name: 'decayType', internalType: 'string', type: 'string' },
                ],
              },
            ],
          },
          {
            name: 'receivingAtoms',
            internalType: 'struct Atom[]',
            type: 'tuple[]',
            components: [
              { name: 'radius', internalType: 'uint256', type: 'uint256' },
              { name: 'volume', internalType: 'uint256', type: 'uint256' },
              { name: 'mass', internalType: 'uint256', type: 'uint256' },
              { name: 'density', internalType: 'uint256', type: 'uint256' },
              { name: 'electronegativity', internalType: 'uint256', type: 'uint256' },
              { name: 'metallic', internalType: 'bool', type: 'bool' },
              { name: 'name', internalType: 'string', type: 'string' },
              { name: 'series', internalType: 'string', type: 'string' },
              { name: 'periodicTableX', internalType: 'uint256', type: 'uint256' },
              { name: 'periodicTableY', internalType: 'uint256', type: 'uint256' },
              {
                name: 'structure',
                internalType: 'struct AtomStructure',
                type: 'tuple',
                components: [
                  { name: 'universeHash', internalType: 'bytes32', type: 'bytes32' },
                  { name: 'depth', internalType: 'uint256', type: 'uint256' },
                  { name: 'distance', internalType: 'uint256', type: 'uint256' },
                  { name: 'distanceIndex', internalType: 'uint256', type: 'uint256' },
                  { name: 'shell', internalType: 'uint256', type: 'uint256' },
                  { name: 'totalInOuter', internalType: 'uint256[]', type: 'uint256[]' },
                  { name: 'emptyInOuter', internalType: 'uint256[]', type: 'uint256[]' },
                  { name: 'filledInOuter', internalType: 'uint256[]', type: 'uint256[]' },
                  { name: 'ancestors', internalType: 'uint256[]', type: 'uint256[]' },
                ],
              },
              {
                name: 'nucleus',
                internalType: 'struct Nucleus',
                type: 'tuple',
                components: [
                  { name: 'protons', internalType: 'uint256', type: 'uint256' },
                  { name: 'neutrons', internalType: 'uint256', type: 'uint256' },
                  { name: 'nucleons', internalType: 'uint256', type: 'uint256' },
                  { name: 'stability', internalType: 'uint256', type: 'uint256' },
                  { name: 'decayType', internalType: 'string', type: 'string' },
                ],
              },
            ],
          },
          { name: 'electricalConductivity', internalType: 'uint256', type: 'uint256' },
          { name: 'thermalConductivity', internalType: 'uint256', type: 'uint256' },
          { name: 'toughness', internalType: 'uint256', type: 'uint256' },
          { name: 'hardness', internalType: 'uint256', type: 'uint256' },
          { name: 'ductility', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: 'tokenUri', internalType: 'string', type: 'string' },
      { name: '_discoveredBy', internalType: 'address', type: 'address' },
    ],
    name: 'maybeMarkMoleculeAsDiscovered',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'moleculeDiscoveredBy',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'bytes32', type: 'bytes32' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'moleculesDiscovered',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'operators',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'pendingOwner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_newEncoder', internalType: 'address', type: 'address' }],
    name: 'setEncoder',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_universeInformation',
        internalType: 'struct UniverseInformation',
        type: 'tuple',
        components: [
          { name: 'energyFactorBps', internalType: 'uint256', type: 'uint256' },
          { name: 'active', internalType: 'bool', type: 'bool' },
          { name: 'seedHash', internalType: 'bytes32', type: 'bytes32' },
          { name: 'name', internalType: 'string', type: 'string' },
        ],
      },
    ],
    name: 'setUniverseInformation',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'string', type: 'string' }],
    name: 'takenUniverseNames',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_operator', internalType: 'address', type: 'address' }],
    name: 'toggleOperator',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_universeHash', internalType: 'bytes32', type: 'bytes32' }],
    name: 'toggleUniverseActive',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    name: 'universeInformation',
    outputs: [
      { name: 'energyFactorBps', internalType: 'uint256', type: 'uint256' },
      { name: 'active', internalType: 'bool', type: 'bool' },
      { name: 'seedHash', internalType: 'bytes32', type: 'bytes32' },
      { name: 'name', internalType: 'string', type: 'string' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_molecule',
        internalType: 'struct Molecule',
        type: 'tuple',
        components: [
          { name: 'id', internalType: 'string', type: 'string' },
          { name: 'name', internalType: 'string', type: 'string' },
          { name: 'universeHash', internalType: 'bytes32', type: 'bytes32' },
          { name: 'activationEnergy', internalType: 'uint256', type: 'uint256' },
          { name: 'radius', internalType: 'uint256', type: 'uint256' },
          {
            name: 'bond',
            internalType: 'struct Bond',
            type: 'tuple',
            components: [
              { name: 'strength', internalType: 'uint256', type: 'uint256' },
              { name: 'bondType', internalType: 'string', type: 'string' },
            ],
          },
          {
            name: 'givingAtoms',
            internalType: 'struct Atom[]',
            type: 'tuple[]',
            components: [
              { name: 'radius', internalType: 'uint256', type: 'uint256' },
              { name: 'volume', internalType: 'uint256', type: 'uint256' },
              { name: 'mass', internalType: 'uint256', type: 'uint256' },
              { name: 'density', internalType: 'uint256', type: 'uint256' },
              { name: 'electronegativity', internalType: 'uint256', type: 'uint256' },
              { name: 'metallic', internalType: 'bool', type: 'bool' },
              { name: 'name', internalType: 'string', type: 'string' },
              { name: 'series', internalType: 'string', type: 'string' },
              { name: 'periodicTableX', internalType: 'uint256', type: 'uint256' },
              { name: 'periodicTableY', internalType: 'uint256', type: 'uint256' },
              {
                name: 'structure',
                internalType: 'struct AtomStructure',
                type: 'tuple',
                components: [
                  { name: 'universeHash', internalType: 'bytes32', type: 'bytes32' },
                  { name: 'depth', internalType: 'uint256', type: 'uint256' },
                  { name: 'distance', internalType: 'uint256', type: 'uint256' },
                  { name: 'distanceIndex', internalType: 'uint256', type: 'uint256' },
                  { name: 'shell', internalType: 'uint256', type: 'uint256' },
                  { name: 'totalInOuter', internalType: 'uint256[]', type: 'uint256[]' },
                  { name: 'emptyInOuter', internalType: 'uint256[]', type: 'uint256[]' },
                  { name: 'filledInOuter', internalType: 'uint256[]', type: 'uint256[]' },
                  { name: 'ancestors', internalType: 'uint256[]', type: 'uint256[]' },
                ],
              },
              {
                name: 'nucleus',
                internalType: 'struct Nucleus',
                type: 'tuple',
                components: [
                  { name: 'protons', internalType: 'uint256', type: 'uint256' },
                  { name: 'neutrons', internalType: 'uint256', type: 'uint256' },
                  { name: 'nucleons', internalType: 'uint256', type: 'uint256' },
                  { name: 'stability', internalType: 'uint256', type: 'uint256' },
                  { name: 'decayType', internalType: 'string', type: 'string' },
                ],
              },
            ],
          },
          {
            name: 'receivingAtoms',
            internalType: 'struct Atom[]',
            type: 'tuple[]',
            components: [
              { name: 'radius', internalType: 'uint256', type: 'uint256' },
              { name: 'volume', internalType: 'uint256', type: 'uint256' },
              { name: 'mass', internalType: 'uint256', type: 'uint256' },
              { name: 'density', internalType: 'uint256', type: 'uint256' },
              { name: 'electronegativity', internalType: 'uint256', type: 'uint256' },
              { name: 'metallic', internalType: 'bool', type: 'bool' },
              { name: 'name', internalType: 'string', type: 'string' },
              { name: 'series', internalType: 'string', type: 'string' },
              { name: 'periodicTableX', internalType: 'uint256', type: 'uint256' },
              { name: 'periodicTableY', internalType: 'uint256', type: 'uint256' },
              {
                name: 'structure',
                internalType: 'struct AtomStructure',
                type: 'tuple',
                components: [
                  { name: 'universeHash', internalType: 'bytes32', type: 'bytes32' },
                  { name: 'depth', internalType: 'uint256', type: 'uint256' },
                  { name: 'distance', internalType: 'uint256', type: 'uint256' },
                  { name: 'distanceIndex', internalType: 'uint256', type: 'uint256' },
                  { name: 'shell', internalType: 'uint256', type: 'uint256' },
                  { name: 'totalInOuter', internalType: 'uint256[]', type: 'uint256[]' },
                  { name: 'emptyInOuter', internalType: 'uint256[]', type: 'uint256[]' },
                  { name: 'filledInOuter', internalType: 'uint256[]', type: 'uint256[]' },
                  { name: 'ancestors', internalType: 'uint256[]', type: 'uint256[]' },
                ],
              },
              {
                name: 'nucleus',
                internalType: 'struct Nucleus',
                type: 'tuple',
                components: [
                  { name: 'protons', internalType: 'uint256', type: 'uint256' },
                  { name: 'neutrons', internalType: 'uint256', type: 'uint256' },
                  { name: 'nucleons', internalType: 'uint256', type: 'uint256' },
                  { name: 'stability', internalType: 'uint256', type: 'uint256' },
                  { name: 'decayType', internalType: 'string', type: 'string' },
                ],
              },
            ],
          },
          { name: 'electricalConductivity', internalType: 'uint256', type: 'uint256' },
          { name: 'thermalConductivity', internalType: 'uint256', type: 'uint256' },
          { name: 'toughness', internalType: 'uint256', type: 'uint256' },
          { name: 'hardness', internalType: 'uint256', type: 'uint256' },
          { name: 'ductility', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: '_tokenUri', internalType: 'string', type: 'string' },
    ],
    name: 'updateMolecule',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: '_tokenUri', internalType: 'string', type: 'string' },
    ],
    name: 'updateTokenURI',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link assemblyCoreContractAbi}__
 */
export const useReadAssemblyCoreContract = /*#__PURE__*/ createUseReadContract({
  abi: assemblyCoreContractAbi,
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `functionName` set to `"creationEnabled"`
 */
export const useReadAssemblyCoreContractCreationEnabled = /*#__PURE__*/ createUseReadContract({
  abi: assemblyCoreContractAbi,
  functionName: 'creationEnabled',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `functionName` set to `"frozenItems"`
 */
export const useReadAssemblyCoreContractFrozenItems = /*#__PURE__*/ createUseReadContract({
  abi: assemblyCoreContractAbi,
  functionName: 'frozenItems',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `functionName` set to `"getItemByItemId"`
 */
export const useReadAssemblyCoreContractGetItemByItemId = /*#__PURE__*/ createUseReadContract({
  abi: assemblyCoreContractAbi,
  functionName: 'getItemByItemId',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `functionName` set to `"getItemIdForToken"`
 */
export const useReadAssemblyCoreContractGetItemIdForToken = /*#__PURE__*/ createUseReadContract({
  abi: assemblyCoreContractAbi,
  functionName: 'getItemIdForToken',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `functionName` set to `"getNonFungibleTokenId"`
 */
export const useReadAssemblyCoreContractGetNonFungibleTokenId = /*#__PURE__*/ createUseReadContract(
  { abi: assemblyCoreContractAbi, functionName: 'getNonFungibleTokenId' }
);

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `functionName` set to `"getTokenDefaultImageUri"`
 */
export const useReadAssemblyCoreContractGetTokenDefaultImageUri =
  /*#__PURE__*/ createUseReadContract({
    abi: assemblyCoreContractAbi,
    functionName: 'getTokenDefaultImageUri',
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `functionName` set to `"getTokenTrait"`
 */
export const useReadAssemblyCoreContractGetTokenTrait = /*#__PURE__*/ createUseReadContract({
  abi: assemblyCoreContractAbi,
  functionName: 'getTokenTrait',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `functionName` set to `"getTokenTraits"`
 */
export const useReadAssemblyCoreContractGetTokenTraits = /*#__PURE__*/ createUseReadContract({
  abi: assemblyCoreContractAbi,
  functionName: 'getTokenTraits',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `functionName` set to `"getTokenUri"`
 */
export const useReadAssemblyCoreContractGetTokenUri = /*#__PURE__*/ createUseReadContract({
  abi: assemblyCoreContractAbi,
  functionName: 'getTokenUri',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `functionName` set to `"isApprovedForItem"`
 */
export const useReadAssemblyCoreContractIsApprovedForItem = /*#__PURE__*/ createUseReadContract({
  abi: assemblyCoreContractAbi,
  functionName: 'isApprovedForItem',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `functionName` set to `"isApprovedForToken"`
 */
export const useReadAssemblyCoreContractIsApprovedForToken = /*#__PURE__*/ createUseReadContract({
  abi: assemblyCoreContractAbi,
  functionName: 'isApprovedForToken',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `functionName` set to `"isFungibleTokenId"`
 */
export const useReadAssemblyCoreContractIsFungibleTokenId = /*#__PURE__*/ createUseReadContract({
  abi: assemblyCoreContractAbi,
  functionName: 'isFungibleTokenId',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `functionName` set to `"itemMintCount"`
 */
export const useReadAssemblyCoreContractItemMintCount = /*#__PURE__*/ createUseReadContract({
  abi: assemblyCoreContractAbi,
  functionName: 'itemMintCount',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `functionName` set to `"nextItemId"`
 */
export const useReadAssemblyCoreContractNextItemId = /*#__PURE__*/ createUseReadContract({
  abi: assemblyCoreContractAbi,
  functionName: 'nextItemId',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `functionName` set to `"nonFungibleTokenToActualBlueprint"`
 */
export const useReadAssemblyCoreContractNonFungibleTokenToActualBlueprint =
  /*#__PURE__*/ createUseReadContract({
    abi: assemblyCoreContractAbi,
    functionName: 'nonFungibleTokenToActualBlueprint',
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `functionName` set to `"nonFungibleTokenToTier"`
 */
export const useReadAssemblyCoreContractNonFungibleTokenToTier =
  /*#__PURE__*/ createUseReadContract({
    abi: assemblyCoreContractAbi,
    functionName: 'nonFungibleTokenToTier',
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `functionName` set to `"owner"`
 */
export const useReadAssemblyCoreContractOwner = /*#__PURE__*/ createUseReadContract({
  abi: assemblyCoreContractAbi,
  functionName: 'owner',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link assemblyCoreContractAbi}__
 */
export const useWriteAssemblyCoreContract = /*#__PURE__*/ createUseWriteContract({
  abi: assemblyCoreContractAbi,
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `functionName` set to `"consumeItem"`
 */
export const useWriteAssemblyCoreContractConsumeItem = /*#__PURE__*/ createUseWriteContract({
  abi: assemblyCoreContractAbi,
  functionName: 'consumeItem',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `functionName` set to `"craftItem"`
 */
export const useWriteAssemblyCoreContractCraftItem = /*#__PURE__*/ createUseWriteContract({
  abi: assemblyCoreContractAbi,
  functionName: 'craftItem',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `functionName` set to `"createFungibleItem"`
 */
export const useWriteAssemblyCoreContractCreateFungibleItem = /*#__PURE__*/ createUseWriteContract({
  abi: assemblyCoreContractAbi,
  functionName: 'createFungibleItem',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `functionName` set to `"createNonFungibleItem"`
 */
export const useWriteAssemblyCoreContractCreateNonFungibleItem =
  /*#__PURE__*/ createUseWriteContract({
    abi: assemblyCoreContractAbi,
    functionName: 'createNonFungibleItem',
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `functionName` set to `"freezeItem"`
 */
export const useWriteAssemblyCoreContractFreezeItem = /*#__PURE__*/ createUseWriteContract({
  abi: assemblyCoreContractAbi,
  functionName: 'freezeItem',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `functionName` set to `"initialize"`
 */
export const useWriteAssemblyCoreContractInitialize = /*#__PURE__*/ createUseWriteContract({
  abi: assemblyCoreContractAbi,
  functionName: 'initialize',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `functionName` set to `"onUpdate"`
 */
export const useWriteAssemblyCoreContractOnUpdate = /*#__PURE__*/ createUseWriteContract({
  abi: assemblyCoreContractAbi,
  functionName: 'onUpdate',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteAssemblyCoreContractRenounceOwnership = /*#__PURE__*/ createUseWriteContract({
  abi: assemblyCoreContractAbi,
  functionName: 'renounceOwnership',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `functionName` set to `"setApprovalForItemIds"`
 */
export const useWriteAssemblyCoreContractSetApprovalForItemIds =
  /*#__PURE__*/ createUseWriteContract({
    abi: assemblyCoreContractAbi,
    functionName: 'setApprovalForItemIds',
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `functionName` set to `"setApprovalForTokenIds"`
 */
export const useWriteAssemblyCoreContractSetApprovalForTokenIds =
  /*#__PURE__*/ createUseWriteContract({
    abi: assemblyCoreContractAbi,
    functionName: 'setApprovalForTokenIds',
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `functionName` set to `"setCreationEnabled"`
 */
export const useWriteAssemblyCoreContractSetCreationEnabled = /*#__PURE__*/ createUseWriteContract({
  abi: assemblyCoreContractAbi,
  functionName: 'setCreationEnabled',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `functionName` set to `"setItemAdmin"`
 */
export const useWriteAssemblyCoreContractSetItemAdmin = /*#__PURE__*/ createUseWriteContract({
  abi: assemblyCoreContractAbi,
  functionName: 'setItemAdmin',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `functionName` set to `"setOtomItems"`
 */
export const useWriteAssemblyCoreContractSetOtomItems = /*#__PURE__*/ createUseWriteContract({
  abi: assemblyCoreContractAbi,
  functionName: 'setOtomItems',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `functionName` set to `"setRenderer"`
 */
export const useWriteAssemblyCoreContractSetRenderer = /*#__PURE__*/ createUseWriteContract({
  abi: assemblyCoreContractAbi,
  functionName: 'setRenderer',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `functionName` set to `"setValidator"`
 */
export const useWriteAssemblyCoreContractSetValidator = /*#__PURE__*/ createUseWriteContract({
  abi: assemblyCoreContractAbi,
  functionName: 'setValidator',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteAssemblyCoreContractTransferOwnership = /*#__PURE__*/ createUseWriteContract({
  abi: assemblyCoreContractAbi,
  functionName: 'transferOwnership',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `functionName` set to `"updateFungibleItem"`
 */
export const useWriteAssemblyCoreContractUpdateFungibleItem = /*#__PURE__*/ createUseWriteContract({
  abi: assemblyCoreContractAbi,
  functionName: 'updateFungibleItem',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `functionName` set to `"updateNonFungibleItem"`
 */
export const useWriteAssemblyCoreContractUpdateNonFungibleItem =
  /*#__PURE__*/ createUseWriteContract({
    abi: assemblyCoreContractAbi,
    functionName: 'updateNonFungibleItem',
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `functionName` set to `"useItem"`
 */
export const useWriteAssemblyCoreContractUseItem = /*#__PURE__*/ createUseWriteContract({
  abi: assemblyCoreContractAbi,
  functionName: 'useItem',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link assemblyCoreContractAbi}__
 */
export const useSimulateAssemblyCoreContract = /*#__PURE__*/ createUseSimulateContract({
  abi: assemblyCoreContractAbi,
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `functionName` set to `"consumeItem"`
 */
export const useSimulateAssemblyCoreContractConsumeItem = /*#__PURE__*/ createUseSimulateContract({
  abi: assemblyCoreContractAbi,
  functionName: 'consumeItem',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `functionName` set to `"craftItem"`
 */
export const useSimulateAssemblyCoreContractCraftItem = /*#__PURE__*/ createUseSimulateContract({
  abi: assemblyCoreContractAbi,
  functionName: 'craftItem',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `functionName` set to `"createFungibleItem"`
 */
export const useSimulateAssemblyCoreContractCreateFungibleItem =
  /*#__PURE__*/ createUseSimulateContract({
    abi: assemblyCoreContractAbi,
    functionName: 'createFungibleItem',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `functionName` set to `"createNonFungibleItem"`
 */
export const useSimulateAssemblyCoreContractCreateNonFungibleItem =
  /*#__PURE__*/ createUseSimulateContract({
    abi: assemblyCoreContractAbi,
    functionName: 'createNonFungibleItem',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `functionName` set to `"freezeItem"`
 */
export const useSimulateAssemblyCoreContractFreezeItem = /*#__PURE__*/ createUseSimulateContract({
  abi: assemblyCoreContractAbi,
  functionName: 'freezeItem',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `functionName` set to `"initialize"`
 */
export const useSimulateAssemblyCoreContractInitialize = /*#__PURE__*/ createUseSimulateContract({
  abi: assemblyCoreContractAbi,
  functionName: 'initialize',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `functionName` set to `"onUpdate"`
 */
export const useSimulateAssemblyCoreContractOnUpdate = /*#__PURE__*/ createUseSimulateContract({
  abi: assemblyCoreContractAbi,
  functionName: 'onUpdate',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateAssemblyCoreContractRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: assemblyCoreContractAbi,
    functionName: 'renounceOwnership',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `functionName` set to `"setApprovalForItemIds"`
 */
export const useSimulateAssemblyCoreContractSetApprovalForItemIds =
  /*#__PURE__*/ createUseSimulateContract({
    abi: assemblyCoreContractAbi,
    functionName: 'setApprovalForItemIds',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `functionName` set to `"setApprovalForTokenIds"`
 */
export const useSimulateAssemblyCoreContractSetApprovalForTokenIds =
  /*#__PURE__*/ createUseSimulateContract({
    abi: assemblyCoreContractAbi,
    functionName: 'setApprovalForTokenIds',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `functionName` set to `"setCreationEnabled"`
 */
export const useSimulateAssemblyCoreContractSetCreationEnabled =
  /*#__PURE__*/ createUseSimulateContract({
    abi: assemblyCoreContractAbi,
    functionName: 'setCreationEnabled',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `functionName` set to `"setItemAdmin"`
 */
export const useSimulateAssemblyCoreContractSetItemAdmin = /*#__PURE__*/ createUseSimulateContract({
  abi: assemblyCoreContractAbi,
  functionName: 'setItemAdmin',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `functionName` set to `"setOtomItems"`
 */
export const useSimulateAssemblyCoreContractSetOtomItems = /*#__PURE__*/ createUseSimulateContract({
  abi: assemblyCoreContractAbi,
  functionName: 'setOtomItems',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `functionName` set to `"setRenderer"`
 */
export const useSimulateAssemblyCoreContractSetRenderer = /*#__PURE__*/ createUseSimulateContract({
  abi: assemblyCoreContractAbi,
  functionName: 'setRenderer',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `functionName` set to `"setValidator"`
 */
export const useSimulateAssemblyCoreContractSetValidator = /*#__PURE__*/ createUseSimulateContract({
  abi: assemblyCoreContractAbi,
  functionName: 'setValidator',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateAssemblyCoreContractTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: assemblyCoreContractAbi,
    functionName: 'transferOwnership',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `functionName` set to `"updateFungibleItem"`
 */
export const useSimulateAssemblyCoreContractUpdateFungibleItem =
  /*#__PURE__*/ createUseSimulateContract({
    abi: assemblyCoreContractAbi,
    functionName: 'updateFungibleItem',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `functionName` set to `"updateNonFungibleItem"`
 */
export const useSimulateAssemblyCoreContractUpdateNonFungibleItem =
  /*#__PURE__*/ createUseSimulateContract({
    abi: assemblyCoreContractAbi,
    functionName: 'updateNonFungibleItem',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `functionName` set to `"useItem"`
 */
export const useSimulateAssemblyCoreContractUseItem = /*#__PURE__*/ createUseSimulateContract({
  abi: assemblyCoreContractAbi,
  functionName: 'useItem',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link assemblyCoreContractAbi}__
 */
export const useWatchAssemblyCoreContractEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: assemblyCoreContractAbi,
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `eventName` set to `"CreationEnabledSet"`
 */
export const useWatchAssemblyCoreContractCreationEnabledSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: assemblyCoreContractAbi,
    eventName: 'CreationEnabledSet',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `eventName` set to `"Initialized"`
 */
export const useWatchAssemblyCoreContractInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: assemblyCoreContractAbi,
    eventName: 'Initialized',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `eventName` set to `"ItemCrafted"`
 */
export const useWatchAssemblyCoreContractItemCraftedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: assemblyCoreContractAbi,
    eventName: 'ItemCrafted',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `eventName` set to `"ItemCreated"`
 */
export const useWatchAssemblyCoreContractItemCreatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: assemblyCoreContractAbi,
    eventName: 'ItemCreated',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `eventName` set to `"ItemDestroyed"`
 */
export const useWatchAssemblyCoreContractItemDestroyedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: assemblyCoreContractAbi,
    eventName: 'ItemDestroyed',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `eventName` set to `"ItemFrozen"`
 */
export const useWatchAssemblyCoreContractItemFrozenEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: assemblyCoreContractAbi,
    eventName: 'ItemFrozen',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `eventName` set to `"ItemUpdated"`
 */
export const useWatchAssemblyCoreContractItemUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: assemblyCoreContractAbi,
    eventName: 'ItemUpdated',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `eventName` set to `"ItemUsed"`
 */
export const useWatchAssemblyCoreContractItemUsedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: assemblyCoreContractAbi,
  eventName: 'ItemUsed',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `eventName` set to `"ItemsApprovalForAll"`
 */
export const useWatchAssemblyCoreContractItemsApprovalForAllEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: assemblyCoreContractAbi,
    eventName: 'ItemsApprovalForAll',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `eventName` set to `"OtomItemsSet"`
 */
export const useWatchAssemblyCoreContractOtomItemsSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: assemblyCoreContractAbi,
    eventName: 'OtomItemsSet',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchAssemblyCoreContractOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: assemblyCoreContractAbi,
    eventName: 'OwnershipTransferred',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `eventName` set to `"RendererSet"`
 */
export const useWatchAssemblyCoreContractRendererSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: assemblyCoreContractAbi,
    eventName: 'RendererSet',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `eventName` set to `"TokensApprovalForAll"`
 */
export const useWatchAssemblyCoreContractTokensApprovalForAllEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: assemblyCoreContractAbi,
    eventName: 'TokensApprovalForAll',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `eventName` set to `"TraitsUpdated"`
 */
export const useWatchAssemblyCoreContractTraitsUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: assemblyCoreContractAbi,
    eventName: 'TraitsUpdated',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link assemblyCoreContractAbi}__ and `eventName` set to `"ValidatorSet"`
 */
export const useWatchAssemblyCoreContractValidatorSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: assemblyCoreContractAbi,
    eventName: 'ValidatorSet',
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link assemblyItemsContractAbi}__
 */
export const useReadAssemblyItemsContract = /*#__PURE__*/ createUseReadContract({
  abi: assemblyItemsContractAbi,
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link assemblyItemsContractAbi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadAssemblyItemsContractBalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: assemblyItemsContractAbi,
  functionName: 'balanceOf',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link assemblyItemsContractAbi}__ and `functionName` set to `"balanceOfBatch"`
 */
export const useReadAssemblyItemsContractBalanceOfBatch = /*#__PURE__*/ createUseReadContract({
  abi: assemblyItemsContractAbi,
  functionName: 'balanceOfBatch',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link assemblyItemsContractAbi}__ and `functionName` set to `"core"`
 */
export const useReadAssemblyItemsContractCore = /*#__PURE__*/ createUseReadContract({
  abi: assemblyItemsContractAbi,
  functionName: 'core',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link assemblyItemsContractAbi}__ and `functionName` set to `"exists"`
 */
export const useReadAssemblyItemsContractExists = /*#__PURE__*/ createUseReadContract({
  abi: assemblyItemsContractAbi,
  functionName: 'exists',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link assemblyItemsContractAbi}__ and `functionName` set to `"isApprovedForAll"`
 */
export const useReadAssemblyItemsContractIsApprovedForAll = /*#__PURE__*/ createUseReadContract({
  abi: assemblyItemsContractAbi,
  functionName: 'isApprovedForAll',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link assemblyItemsContractAbi}__ and `functionName` set to `"name"`
 */
export const useReadAssemblyItemsContractName = /*#__PURE__*/ createUseReadContract({
  abi: assemblyItemsContractAbi,
  functionName: 'name',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link assemblyItemsContractAbi}__ and `functionName` set to `"owner"`
 */
export const useReadAssemblyItemsContractOwner = /*#__PURE__*/ createUseReadContract({
  abi: assemblyItemsContractAbi,
  functionName: 'owner',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link assemblyItemsContractAbi}__ and `functionName` set to `"pendingOwner"`
 */
export const useReadAssemblyItemsContractPendingOwner = /*#__PURE__*/ createUseReadContract({
  abi: assemblyItemsContractAbi,
  functionName: 'pendingOwner',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link assemblyItemsContractAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadAssemblyItemsContractSupportsInterface = /*#__PURE__*/ createUseReadContract({
  abi: assemblyItemsContractAbi,
  functionName: 'supportsInterface',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link assemblyItemsContractAbi}__ and `functionName` set to `"totalSupply"`
 */
export const useReadAssemblyItemsContractTotalSupply = /*#__PURE__*/ createUseReadContract({
  abi: assemblyItemsContractAbi,
  functionName: 'totalSupply',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link assemblyItemsContractAbi}__ and `functionName` set to `"tracking"`
 */
export const useReadAssemblyItemsContractTracking = /*#__PURE__*/ createUseReadContract({
  abi: assemblyItemsContractAbi,
  functionName: 'tracking',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link assemblyItemsContractAbi}__ and `functionName` set to `"uri"`
 */
export const useReadAssemblyItemsContractUri = /*#__PURE__*/ createUseReadContract({
  abi: assemblyItemsContractAbi,
  functionName: 'uri',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link assemblyItemsContractAbi}__
 */
export const useWriteAssemblyItemsContract = /*#__PURE__*/ createUseWriteContract({
  abi: assemblyItemsContractAbi,
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link assemblyItemsContractAbi}__ and `functionName` set to `"acceptOwnership"`
 */
export const useWriteAssemblyItemsContractAcceptOwnership = /*#__PURE__*/ createUseWriteContract({
  abi: assemblyItemsContractAbi,
  functionName: 'acceptOwnership',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link assemblyItemsContractAbi}__ and `functionName` set to `"burn"`
 */
export const useWriteAssemblyItemsContractBurn = /*#__PURE__*/ createUseWriteContract({
  abi: assemblyItemsContractAbi,
  functionName: 'burn',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link assemblyItemsContractAbi}__ and `functionName` set to `"burnBatch"`
 */
export const useWriteAssemblyItemsContractBurnBatch = /*#__PURE__*/ createUseWriteContract({
  abi: assemblyItemsContractAbi,
  functionName: 'burnBatch',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link assemblyItemsContractAbi}__ and `functionName` set to `"emitMetadataUpdate"`
 */
export const useWriteAssemblyItemsContractEmitMetadataUpdate = /*#__PURE__*/ createUseWriteContract(
  { abi: assemblyItemsContractAbi, functionName: 'emitMetadataUpdate' }
);

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link assemblyItemsContractAbi}__ and `functionName` set to `"initialize"`
 */
export const useWriteAssemblyItemsContractInitialize = /*#__PURE__*/ createUseWriteContract({
  abi: assemblyItemsContractAbi,
  functionName: 'initialize',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link assemblyItemsContractAbi}__ and `functionName` set to `"mint"`
 */
export const useWriteAssemblyItemsContractMint = /*#__PURE__*/ createUseWriteContract({
  abi: assemblyItemsContractAbi,
  functionName: 'mint',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link assemblyItemsContractAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteAssemblyItemsContractRenounceOwnership = /*#__PURE__*/ createUseWriteContract({
  abi: assemblyItemsContractAbi,
  functionName: 'renounceOwnership',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link assemblyItemsContractAbi}__ and `functionName` set to `"safeBatchTransferFrom"`
 */
export const useWriteAssemblyItemsContractSafeBatchTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: assemblyItemsContractAbi,
    functionName: 'safeBatchTransferFrom',
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link assemblyItemsContractAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useWriteAssemblyItemsContractSafeTransferFrom = /*#__PURE__*/ createUseWriteContract({
  abi: assemblyItemsContractAbi,
  functionName: 'safeTransferFrom',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link assemblyItemsContractAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useWriteAssemblyItemsContractSetApprovalForAll = /*#__PURE__*/ createUseWriteContract({
  abi: assemblyItemsContractAbi,
  functionName: 'setApprovalForAll',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link assemblyItemsContractAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteAssemblyItemsContractTransferOwnership = /*#__PURE__*/ createUseWriteContract({
  abi: assemblyItemsContractAbi,
  functionName: 'transferOwnership',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link assemblyItemsContractAbi}__
 */
export const useSimulateAssemblyItemsContract = /*#__PURE__*/ createUseSimulateContract({
  abi: assemblyItemsContractAbi,
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link assemblyItemsContractAbi}__ and `functionName` set to `"acceptOwnership"`
 */
export const useSimulateAssemblyItemsContractAcceptOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: assemblyItemsContractAbi,
    functionName: 'acceptOwnership',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link assemblyItemsContractAbi}__ and `functionName` set to `"burn"`
 */
export const useSimulateAssemblyItemsContractBurn = /*#__PURE__*/ createUseSimulateContract({
  abi: assemblyItemsContractAbi,
  functionName: 'burn',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link assemblyItemsContractAbi}__ and `functionName` set to `"burnBatch"`
 */
export const useSimulateAssemblyItemsContractBurnBatch = /*#__PURE__*/ createUseSimulateContract({
  abi: assemblyItemsContractAbi,
  functionName: 'burnBatch',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link assemblyItemsContractAbi}__ and `functionName` set to `"emitMetadataUpdate"`
 */
export const useSimulateAssemblyItemsContractEmitMetadataUpdate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: assemblyItemsContractAbi,
    functionName: 'emitMetadataUpdate',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link assemblyItemsContractAbi}__ and `functionName` set to `"initialize"`
 */
export const useSimulateAssemblyItemsContractInitialize = /*#__PURE__*/ createUseSimulateContract({
  abi: assemblyItemsContractAbi,
  functionName: 'initialize',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link assemblyItemsContractAbi}__ and `functionName` set to `"mint"`
 */
export const useSimulateAssemblyItemsContractMint = /*#__PURE__*/ createUseSimulateContract({
  abi: assemblyItemsContractAbi,
  functionName: 'mint',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link assemblyItemsContractAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateAssemblyItemsContractRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: assemblyItemsContractAbi,
    functionName: 'renounceOwnership',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link assemblyItemsContractAbi}__ and `functionName` set to `"safeBatchTransferFrom"`
 */
export const useSimulateAssemblyItemsContractSafeBatchTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: assemblyItemsContractAbi,
    functionName: 'safeBatchTransferFrom',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link assemblyItemsContractAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useSimulateAssemblyItemsContractSafeTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: assemblyItemsContractAbi,
    functionName: 'safeTransferFrom',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link assemblyItemsContractAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useSimulateAssemblyItemsContractSetApprovalForAll =
  /*#__PURE__*/ createUseSimulateContract({
    abi: assemblyItemsContractAbi,
    functionName: 'setApprovalForAll',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link assemblyItemsContractAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateAssemblyItemsContractTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: assemblyItemsContractAbi,
    functionName: 'transferOwnership',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link assemblyItemsContractAbi}__
 */
export const useWatchAssemblyItemsContractEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: assemblyItemsContractAbi,
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link assemblyItemsContractAbi}__ and `eventName` set to `"ApprovalForAll"`
 */
export const useWatchAssemblyItemsContractApprovalForAllEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: assemblyItemsContractAbi,
    eventName: 'ApprovalForAll',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link assemblyItemsContractAbi}__ and `eventName` set to `"Initialized"`
 */
export const useWatchAssemblyItemsContractInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: assemblyItemsContractAbi,
    eventName: 'Initialized',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link assemblyItemsContractAbi}__ and `eventName` set to `"MetadataUpdate"`
 */
export const useWatchAssemblyItemsContractMetadataUpdateEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: assemblyItemsContractAbi,
    eventName: 'MetadataUpdate',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link assemblyItemsContractAbi}__ and `eventName` set to `"OwnershipTransferStarted"`
 */
export const useWatchAssemblyItemsContractOwnershipTransferStartedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: assemblyItemsContractAbi,
    eventName: 'OwnershipTransferStarted',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link assemblyItemsContractAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchAssemblyItemsContractOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: assemblyItemsContractAbi,
    eventName: 'OwnershipTransferred',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link assemblyItemsContractAbi}__ and `eventName` set to `"TransferBatch"`
 */
export const useWatchAssemblyItemsContractTransferBatchEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: assemblyItemsContractAbi,
    eventName: 'TransferBatch',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link assemblyItemsContractAbi}__ and `eventName` set to `"TransferSingle"`
 */
export const useWatchAssemblyItemsContractTransferSingleEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: assemblyItemsContractAbi,
    eventName: 'TransferSingle',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link assemblyItemsContractAbi}__ and `eventName` set to `"URI"`
 */
export const useWatchAssemblyItemsContractUriEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: assemblyItemsContractAbi,
  eventName: 'URI',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link assemblyTrackingContractAbi}__
 */
export const useReadAssemblyTrackingContract = /*#__PURE__*/ createUseReadContract({
  abi: assemblyTrackingContractAbi,
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link assemblyTrackingContractAbi}__ and `functionName` set to `"core"`
 */
export const useReadAssemblyTrackingContractCore = /*#__PURE__*/ createUseReadContract({
  abi: assemblyTrackingContractAbi,
  functionName: 'core',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link assemblyTrackingContractAbi}__ and `functionName` set to `"getAllItemsPaginated"`
 */
export const useReadAssemblyTrackingContractGetAllItemsPaginated =
  /*#__PURE__*/ createUseReadContract({
    abi: assemblyTrackingContractAbi,
    functionName: 'getAllItemsPaginated',
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link assemblyTrackingContractAbi}__ and `functionName` set to `"getItemSupply"`
 */
export const useReadAssemblyTrackingContractGetItemSupply = /*#__PURE__*/ createUseReadContract({
  abi: assemblyTrackingContractAbi,
  functionName: 'getItemSupply',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link assemblyTrackingContractAbi}__ and `functionName` set to `"getNonFungibleItemOwnerTokenIdsPaginated"`
 */
export const useReadAssemblyTrackingContractGetNonFungibleItemOwnerTokenIdsPaginated =
  /*#__PURE__*/ createUseReadContract({
    abi: assemblyTrackingContractAbi,
    functionName: 'getNonFungibleItemOwnerTokenIdsPaginated',
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link assemblyTrackingContractAbi}__ and `functionName` set to `"getNonFungibleItemTokenIdsPaginated"`
 */
export const useReadAssemblyTrackingContractGetNonFungibleItemTokenIdsPaginated =
  /*#__PURE__*/ createUseReadContract({
    abi: assemblyTrackingContractAbi,
    functionName: 'getNonFungibleItemTokenIdsPaginated',
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link assemblyTrackingContractAbi}__ and `functionName` set to `"getNonFungibleTokenOwner"`
 */
export const useReadAssemblyTrackingContractGetNonFungibleTokenOwner =
  /*#__PURE__*/ createUseReadContract({
    abi: assemblyTrackingContractAbi,
    functionName: 'getNonFungibleTokenOwner',
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link assemblyTrackingContractAbi}__ and `functionName` set to `"otomItems"`
 */
export const useReadAssemblyTrackingContractOtomItems = /*#__PURE__*/ createUseReadContract({
  abi: assemblyTrackingContractAbi,
  functionName: 'otomItems',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link assemblyTrackingContractAbi}__ and `functionName` set to `"owner"`
 */
export const useReadAssemblyTrackingContractOwner = /*#__PURE__*/ createUseReadContract({
  abi: assemblyTrackingContractAbi,
  functionName: 'owner',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link assemblyTrackingContractAbi}__ and `functionName` set to `"pendingOwner"`
 */
export const useReadAssemblyTrackingContractPendingOwner = /*#__PURE__*/ createUseReadContract({
  abi: assemblyTrackingContractAbi,
  functionName: 'pendingOwner',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link assemblyTrackingContractAbi}__
 */
export const useWriteAssemblyTrackingContract = /*#__PURE__*/ createUseWriteContract({
  abi: assemblyTrackingContractAbi,
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link assemblyTrackingContractAbi}__ and `functionName` set to `"acceptOwnership"`
 */
export const useWriteAssemblyTrackingContractAcceptOwnership = /*#__PURE__*/ createUseWriteContract(
  { abi: assemblyTrackingContractAbi, functionName: 'acceptOwnership' }
);

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link assemblyTrackingContractAbi}__ and `functionName` set to `"batchReconcileTokens"`
 */
export const useWriteAssemblyTrackingContractBatchReconcileTokens =
  /*#__PURE__*/ createUseWriteContract({
    abi: assemblyTrackingContractAbi,
    functionName: 'batchReconcileTokens',
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link assemblyTrackingContractAbi}__ and `functionName` set to `"initialize"`
 */
export const useWriteAssemblyTrackingContractInitialize = /*#__PURE__*/ createUseWriteContract({
  abi: assemblyTrackingContractAbi,
  functionName: 'initialize',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link assemblyTrackingContractAbi}__ and `functionName` set to `"onUpdate"`
 */
export const useWriteAssemblyTrackingContractOnUpdate = /*#__PURE__*/ createUseWriteContract({
  abi: assemblyTrackingContractAbi,
  functionName: 'onUpdate',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link assemblyTrackingContractAbi}__ and `functionName` set to `"reconcileToken"`
 */
export const useWriteAssemblyTrackingContractReconcileToken = /*#__PURE__*/ createUseWriteContract({
  abi: assemblyTrackingContractAbi,
  functionName: 'reconcileToken',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link assemblyTrackingContractAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteAssemblyTrackingContractRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: assemblyTrackingContractAbi,
    functionName: 'renounceOwnership',
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link assemblyTrackingContractAbi}__ and `functionName` set to `"setCore"`
 */
export const useWriteAssemblyTrackingContractSetCore = /*#__PURE__*/ createUseWriteContract({
  abi: assemblyTrackingContractAbi,
  functionName: 'setCore',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link assemblyTrackingContractAbi}__ and `functionName` set to `"setOtomItems"`
 */
export const useWriteAssemblyTrackingContractSetOtomItems = /*#__PURE__*/ createUseWriteContract({
  abi: assemblyTrackingContractAbi,
  functionName: 'setOtomItems',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link assemblyTrackingContractAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteAssemblyTrackingContractTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: assemblyTrackingContractAbi,
    functionName: 'transferOwnership',
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link assemblyTrackingContractAbi}__ and `functionName` set to `"updateGlobalTokenList"`
 */
export const useWriteAssemblyTrackingContractUpdateGlobalTokenList =
  /*#__PURE__*/ createUseWriteContract({
    abi: assemblyTrackingContractAbi,
    functionName: 'updateGlobalTokenList',
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link assemblyTrackingContractAbi}__ and `functionName` set to `"updateOwnerTokenLists"`
 */
export const useWriteAssemblyTrackingContractUpdateOwnerTokenLists =
  /*#__PURE__*/ createUseWriteContract({
    abi: assemblyTrackingContractAbi,
    functionName: 'updateOwnerTokenLists',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link assemblyTrackingContractAbi}__
 */
export const useSimulateAssemblyTrackingContract = /*#__PURE__*/ createUseSimulateContract({
  abi: assemblyTrackingContractAbi,
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link assemblyTrackingContractAbi}__ and `functionName` set to `"acceptOwnership"`
 */
export const useSimulateAssemblyTrackingContractAcceptOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: assemblyTrackingContractAbi,
    functionName: 'acceptOwnership',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link assemblyTrackingContractAbi}__ and `functionName` set to `"batchReconcileTokens"`
 */
export const useSimulateAssemblyTrackingContractBatchReconcileTokens =
  /*#__PURE__*/ createUseSimulateContract({
    abi: assemblyTrackingContractAbi,
    functionName: 'batchReconcileTokens',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link assemblyTrackingContractAbi}__ and `functionName` set to `"initialize"`
 */
export const useSimulateAssemblyTrackingContractInitialize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: assemblyTrackingContractAbi,
    functionName: 'initialize',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link assemblyTrackingContractAbi}__ and `functionName` set to `"onUpdate"`
 */
export const useSimulateAssemblyTrackingContractOnUpdate = /*#__PURE__*/ createUseSimulateContract({
  abi: assemblyTrackingContractAbi,
  functionName: 'onUpdate',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link assemblyTrackingContractAbi}__ and `functionName` set to `"reconcileToken"`
 */
export const useSimulateAssemblyTrackingContractReconcileToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: assemblyTrackingContractAbi,
    functionName: 'reconcileToken',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link assemblyTrackingContractAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateAssemblyTrackingContractRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: assemblyTrackingContractAbi,
    functionName: 'renounceOwnership',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link assemblyTrackingContractAbi}__ and `functionName` set to `"setCore"`
 */
export const useSimulateAssemblyTrackingContractSetCore = /*#__PURE__*/ createUseSimulateContract({
  abi: assemblyTrackingContractAbi,
  functionName: 'setCore',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link assemblyTrackingContractAbi}__ and `functionName` set to `"setOtomItems"`
 */
export const useSimulateAssemblyTrackingContractSetOtomItems =
  /*#__PURE__*/ createUseSimulateContract({
    abi: assemblyTrackingContractAbi,
    functionName: 'setOtomItems',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link assemblyTrackingContractAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateAssemblyTrackingContractTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: assemblyTrackingContractAbi,
    functionName: 'transferOwnership',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link assemblyTrackingContractAbi}__ and `functionName` set to `"updateGlobalTokenList"`
 */
export const useSimulateAssemblyTrackingContractUpdateGlobalTokenList =
  /*#__PURE__*/ createUseSimulateContract({
    abi: assemblyTrackingContractAbi,
    functionName: 'updateGlobalTokenList',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link assemblyTrackingContractAbi}__ and `functionName` set to `"updateOwnerTokenLists"`
 */
export const useSimulateAssemblyTrackingContractUpdateOwnerTokenLists =
  /*#__PURE__*/ createUseSimulateContract({
    abi: assemblyTrackingContractAbi,
    functionName: 'updateOwnerTokenLists',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link assemblyTrackingContractAbi}__
 */
export const useWatchAssemblyTrackingContractEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: assemblyTrackingContractAbi,
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link assemblyTrackingContractAbi}__ and `eventName` set to `"CoreSet"`
 */
export const useWatchAssemblyTrackingContractCoreSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: assemblyTrackingContractAbi,
    eventName: 'CoreSet',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link assemblyTrackingContractAbi}__ and `eventName` set to `"Initialized"`
 */
export const useWatchAssemblyTrackingContractInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: assemblyTrackingContractAbi,
    eventName: 'Initialized',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link assemblyTrackingContractAbi}__ and `eventName` set to `"OtomItemsSet"`
 */
export const useWatchAssemblyTrackingContractOtomItemsSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: assemblyTrackingContractAbi,
    eventName: 'OtomItemsSet',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link assemblyTrackingContractAbi}__ and `eventName` set to `"OwnershipTransferStarted"`
 */
export const useWatchAssemblyTrackingContractOwnershipTransferStartedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: assemblyTrackingContractAbi,
    eventName: 'OwnershipTransferStarted',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link assemblyTrackingContractAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchAssemblyTrackingContractOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: assemblyTrackingContractAbi,
    eventName: 'OwnershipTransferred',
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsCoreContractAbi}__
 */
export const useReadOtomsCoreContract = /*#__PURE__*/ createUseReadContract({
  abi: otomsCoreContractAbi,
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadOtomsCoreContractBalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: otomsCoreContractAbi,
  functionName: 'balanceOf',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"balanceOfBatch"`
 */
export const useReadOtomsCoreContractBalanceOfBatch = /*#__PURE__*/ createUseReadContract({
  abi: otomsCoreContractAbi,
  functionName: 'balanceOfBatch',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"database"`
 */
export const useReadOtomsCoreContractDatabase = /*#__PURE__*/ createUseReadContract({
  abi: otomsCoreContractAbi,
  functionName: 'database',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"encoder"`
 */
export const useReadOtomsCoreContractEncoder = /*#__PURE__*/ createUseReadContract({
  abi: otomsCoreContractAbi,
  functionName: 'encoder',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"exists"`
 */
export const useReadOtomsCoreContractExists = /*#__PURE__*/ createUseReadContract({
  abi: otomsCoreContractAbi,
  functionName: 'exists',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"getMiningNonce"`
 */
export const useReadOtomsCoreContractGetMiningNonce = /*#__PURE__*/ createUseReadContract({
  abi: otomsCoreContractAbi,
  functionName: 'getMiningNonce',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"isApprovedForAll"`
 */
export const useReadOtomsCoreContractIsApprovedForAll = /*#__PURE__*/ createUseReadContract({
  abi: otomsCoreContractAbi,
  functionName: 'isApprovedForAll',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"minesDepleted"`
 */
export const useReadOtomsCoreContractMinesDepleted = /*#__PURE__*/ createUseReadContract({
  abi: otomsCoreContractAbi,
  functionName: 'minesDepleted',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"miningLimit"`
 */
export const useReadOtomsCoreContractMiningLimit = /*#__PURE__*/ createUseReadContract({
  abi: otomsCoreContractAbi,
  functionName: 'miningLimit',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"moleculeIsAtom"`
 */
export const useReadOtomsCoreContractMoleculeIsAtom = /*#__PURE__*/ createUseReadContract({
  abi: otomsCoreContractAbi,
  functionName: 'moleculeIsAtom',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"operators"`
 */
export const useReadOtomsCoreContractOperators = /*#__PURE__*/ createUseReadContract({
  abi: otomsCoreContractAbi,
  functionName: 'operators',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"owner"`
 */
export const useReadOtomsCoreContractOwner = /*#__PURE__*/ createUseReadContract({
  abi: otomsCoreContractAbi,
  functionName: 'owner',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"pendingOwner"`
 */
export const useReadOtomsCoreContractPendingOwner = /*#__PURE__*/ createUseReadContract({
  abi: otomsCoreContractAbi,
  functionName: 'pendingOwner',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadOtomsCoreContractSupportsInterface = /*#__PURE__*/ createUseReadContract({
  abi: otomsCoreContractAbi,
  functionName: 'supportsInterface',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"totalSupply"`
 */
export const useReadOtomsCoreContractTotalSupply = /*#__PURE__*/ createUseReadContract({
  abi: otomsCoreContractAbi,
  functionName: 'totalSupply',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"uri"`
 */
export const useReadOtomsCoreContractUri = /*#__PURE__*/ createUseReadContract({
  abi: otomsCoreContractAbi,
  functionName: 'uri',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsCoreContractAbi}__
 */
export const useWriteOtomsCoreContract = /*#__PURE__*/ createUseWriteContract({
  abi: otomsCoreContractAbi,
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"acceptOwnership"`
 */
export const useWriteOtomsCoreContractAcceptOwnership = /*#__PURE__*/ createUseWriteContract({
  abi: otomsCoreContractAbi,
  functionName: 'acceptOwnership',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"annihilate"`
 */
export const useWriteOtomsCoreContractAnnihilate = /*#__PURE__*/ createUseWriteContract({
  abi: otomsCoreContractAbi,
  functionName: 'annihilate',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"handleReactionResult"`
 */
export const useWriteOtomsCoreContractHandleReactionResult = /*#__PURE__*/ createUseWriteContract({
  abi: otomsCoreContractAbi,
  functionName: 'handleReactionResult',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"initialize"`
 */
export const useWriteOtomsCoreContractInitialize = /*#__PURE__*/ createUseWriteContract({
  abi: otomsCoreContractAbi,
  functionName: 'initialize',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"mine"`
 */
export const useWriteOtomsCoreContractMine = /*#__PURE__*/ createUseWriteContract({
  abi: otomsCoreContractAbi,
  functionName: 'mine',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteOtomsCoreContractRenounceOwnership = /*#__PURE__*/ createUseWriteContract({
  abi: otomsCoreContractAbi,
  functionName: 'renounceOwnership',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"safeBatchTransferFrom"`
 */
export const useWriteOtomsCoreContractSafeBatchTransferFrom = /*#__PURE__*/ createUseWriteContract({
  abi: otomsCoreContractAbi,
  functionName: 'safeBatchTransferFrom',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useWriteOtomsCoreContractSafeTransferFrom = /*#__PURE__*/ createUseWriteContract({
  abi: otomsCoreContractAbi,
  functionName: 'safeTransferFrom',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"seedUniverse"`
 */
export const useWriteOtomsCoreContractSeedUniverse = /*#__PURE__*/ createUseWriteContract({
  abi: otomsCoreContractAbi,
  functionName: 'seedUniverse',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useWriteOtomsCoreContractSetApprovalForAll = /*#__PURE__*/ createUseWriteContract({
  abi: otomsCoreContractAbi,
  functionName: 'setApprovalForAll',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"setEncoder"`
 */
export const useWriteOtomsCoreContractSetEncoder = /*#__PURE__*/ createUseWriteContract({
  abi: otomsCoreContractAbi,
  functionName: 'setEncoder',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"setMinesDepleted"`
 */
export const useWriteOtomsCoreContractSetMinesDepleted = /*#__PURE__*/ createUseWriteContract({
  abi: otomsCoreContractAbi,
  functionName: 'setMinesDepleted',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"setMiningLimit"`
 */
export const useWriteOtomsCoreContractSetMiningLimit = /*#__PURE__*/ createUseWriteContract({
  abi: otomsCoreContractAbi,
  functionName: 'setMiningLimit',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"setSigner"`
 */
export const useWriteOtomsCoreContractSetSigner = /*#__PURE__*/ createUseWriteContract({
  abi: otomsCoreContractAbi,
  functionName: 'setSigner',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"toggleOperator"`
 */
export const useWriteOtomsCoreContractToggleOperator = /*#__PURE__*/ createUseWriteContract({
  abi: otomsCoreContractAbi,
  functionName: 'toggleOperator',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteOtomsCoreContractTransferOwnership = /*#__PURE__*/ createUseWriteContract({
  abi: otomsCoreContractAbi,
  functionName: 'transferOwnership',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsCoreContractAbi}__
 */
export const useSimulateOtomsCoreContract = /*#__PURE__*/ createUseSimulateContract({
  abi: otomsCoreContractAbi,
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"acceptOwnership"`
 */
export const useSimulateOtomsCoreContractAcceptOwnership = /*#__PURE__*/ createUseSimulateContract({
  abi: otomsCoreContractAbi,
  functionName: 'acceptOwnership',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"annihilate"`
 */
export const useSimulateOtomsCoreContractAnnihilate = /*#__PURE__*/ createUseSimulateContract({
  abi: otomsCoreContractAbi,
  functionName: 'annihilate',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"handleReactionResult"`
 */
export const useSimulateOtomsCoreContractHandleReactionResult =
  /*#__PURE__*/ createUseSimulateContract({
    abi: otomsCoreContractAbi,
    functionName: 'handleReactionResult',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"initialize"`
 */
export const useSimulateOtomsCoreContractInitialize = /*#__PURE__*/ createUseSimulateContract({
  abi: otomsCoreContractAbi,
  functionName: 'initialize',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"mine"`
 */
export const useSimulateOtomsCoreContractMine = /*#__PURE__*/ createUseSimulateContract({
  abi: otomsCoreContractAbi,
  functionName: 'mine',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateOtomsCoreContractRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: otomsCoreContractAbi,
    functionName: 'renounceOwnership',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"safeBatchTransferFrom"`
 */
export const useSimulateOtomsCoreContractSafeBatchTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: otomsCoreContractAbi,
    functionName: 'safeBatchTransferFrom',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useSimulateOtomsCoreContractSafeTransferFrom = /*#__PURE__*/ createUseSimulateContract(
  { abi: otomsCoreContractAbi, functionName: 'safeTransferFrom' }
);

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"seedUniverse"`
 */
export const useSimulateOtomsCoreContractSeedUniverse = /*#__PURE__*/ createUseSimulateContract({
  abi: otomsCoreContractAbi,
  functionName: 'seedUniverse',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useSimulateOtomsCoreContractSetApprovalForAll =
  /*#__PURE__*/ createUseSimulateContract({
    abi: otomsCoreContractAbi,
    functionName: 'setApprovalForAll',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"setEncoder"`
 */
export const useSimulateOtomsCoreContractSetEncoder = /*#__PURE__*/ createUseSimulateContract({
  abi: otomsCoreContractAbi,
  functionName: 'setEncoder',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"setMinesDepleted"`
 */
export const useSimulateOtomsCoreContractSetMinesDepleted = /*#__PURE__*/ createUseSimulateContract(
  { abi: otomsCoreContractAbi, functionName: 'setMinesDepleted' }
);

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"setMiningLimit"`
 */
export const useSimulateOtomsCoreContractSetMiningLimit = /*#__PURE__*/ createUseSimulateContract({
  abi: otomsCoreContractAbi,
  functionName: 'setMiningLimit',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"setSigner"`
 */
export const useSimulateOtomsCoreContractSetSigner = /*#__PURE__*/ createUseSimulateContract({
  abi: otomsCoreContractAbi,
  functionName: 'setSigner',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"toggleOperator"`
 */
export const useSimulateOtomsCoreContractToggleOperator = /*#__PURE__*/ createUseSimulateContract({
  abi: otomsCoreContractAbi,
  functionName: 'toggleOperator',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateOtomsCoreContractTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: otomsCoreContractAbi,
    functionName: 'transferOwnership',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link otomsCoreContractAbi}__
 */
export const useWatchOtomsCoreContractEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: otomsCoreContractAbi,
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `eventName` set to `"ApprovalForAll"`
 */
export const useWatchOtomsCoreContractApprovalForAllEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: otomsCoreContractAbi,
    eventName: 'ApprovalForAll',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `eventName` set to `"EncoderUpdated"`
 */
export const useWatchOtomsCoreContractEncoderUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: otomsCoreContractAbi,
    eventName: 'EncoderUpdated',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `eventName` set to `"Initialized"`
 */
export const useWatchOtomsCoreContractInitializedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: otomsCoreContractAbi,
  eventName: 'Initialized',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `eventName` set to `"MinesDepletedSet"`
 */
export const useWatchOtomsCoreContractMinesDepletedSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: otomsCoreContractAbi,
    eventName: 'MinesDepletedSet',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `eventName` set to `"MiningLimitSet"`
 */
export const useWatchOtomsCoreContractMiningLimitSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: otomsCoreContractAbi,
    eventName: 'MiningLimitSet',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `eventName` set to `"OperatorToggled"`
 */
export const useWatchOtomsCoreContractOperatorToggledEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: otomsCoreContractAbi,
    eventName: 'OperatorToggled',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `eventName` set to `"OtomMined"`
 */
export const useWatchOtomsCoreContractOtomMinedEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: otomsCoreContractAbi,
  eventName: 'OtomMined',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `eventName` set to `"OwnershipTransferStarted"`
 */
export const useWatchOtomsCoreContractOwnershipTransferStartedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: otomsCoreContractAbi,
    eventName: 'OwnershipTransferStarted',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchOtomsCoreContractOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: otomsCoreContractAbi,
    eventName: 'OwnershipTransferred',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `eventName` set to `"SignerSet"`
 */
export const useWatchOtomsCoreContractSignerSetEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: otomsCoreContractAbi,
  eventName: 'SignerSet',
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `eventName` set to `"TransferBatch"`
 */
export const useWatchOtomsCoreContractTransferBatchEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: otomsCoreContractAbi,
    eventName: 'TransferBatch',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `eventName` set to `"TransferSingle"`
 */
export const useWatchOtomsCoreContractTransferSingleEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: otomsCoreContractAbi,
    eventName: 'TransferSingle',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `eventName` set to `"URI"`
 */
export const useWatchOtomsCoreContractUriEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: otomsCoreContractAbi,
  eventName: 'URI',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__
 */
export const useReadOtomsDatabaseContract = /*#__PURE__*/ createUseReadContract({
  abi: otomsDatabaseContractAbi,
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"activeUniverses"`
 */
export const useReadOtomsDatabaseContractActiveUniverses = /*#__PURE__*/ createUseReadContract({
  abi: otomsDatabaseContractAbi,
  functionName: 'activeUniverses',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"encoder"`
 */
export const useReadOtomsDatabaseContractEncoder = /*#__PURE__*/ createUseReadContract({
  abi: otomsDatabaseContractAbi,
  functionName: 'encoder',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"getMoleculeByMoleculeId"`
 */
export const useReadOtomsDatabaseContractGetMoleculeByMoleculeId =
  /*#__PURE__*/ createUseReadContract({
    abi: otomsDatabaseContractAbi,
    functionName: 'getMoleculeByMoleculeId',
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"getMoleculeByTokenId"`
 */
export const useReadOtomsDatabaseContractGetMoleculeByTokenId = /*#__PURE__*/ createUseReadContract(
  { abi: otomsDatabaseContractAbi, functionName: 'getMoleculeByTokenId' }
);

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"getMoleculesDiscovered"`
 */
export const useReadOtomsDatabaseContractGetMoleculesDiscovered =
  /*#__PURE__*/ createUseReadContract({
    abi: otomsDatabaseContractAbi,
    functionName: 'getMoleculesDiscovered',
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"getMoleculesDiscoveredPaginated"`
 */
export const useReadOtomsDatabaseContractGetMoleculesDiscoveredPaginated =
  /*#__PURE__*/ createUseReadContract({
    abi: otomsDatabaseContractAbi,
    functionName: 'getMoleculesDiscoveredPaginated',
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"getUniverseInformation"`
 */
export const useReadOtomsDatabaseContractGetUniverseInformation =
  /*#__PURE__*/ createUseReadContract({
    abi: otomsDatabaseContractAbi,
    functionName: 'getUniverseInformation',
  });

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"idToTokenId"`
 */
export const useReadOtomsDatabaseContractIdToTokenId = /*#__PURE__*/ createUseReadContract({
  abi: otomsDatabaseContractAbi,
  functionName: 'idToTokenId',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"knownUniverses"`
 */
export const useReadOtomsDatabaseContractKnownUniverses = /*#__PURE__*/ createUseReadContract({
  abi: otomsDatabaseContractAbi,
  functionName: 'knownUniverses',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"moleculeDiscoveredBy"`
 */
export const useReadOtomsDatabaseContractMoleculeDiscoveredBy = /*#__PURE__*/ createUseReadContract(
  { abi: otomsDatabaseContractAbi, functionName: 'moleculeDiscoveredBy' }
);

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"moleculesDiscovered"`
 */
export const useReadOtomsDatabaseContractMoleculesDiscovered = /*#__PURE__*/ createUseReadContract({
  abi: otomsDatabaseContractAbi,
  functionName: 'moleculesDiscovered',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"operators"`
 */
export const useReadOtomsDatabaseContractOperators = /*#__PURE__*/ createUseReadContract({
  abi: otomsDatabaseContractAbi,
  functionName: 'operators',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"owner"`
 */
export const useReadOtomsDatabaseContractOwner = /*#__PURE__*/ createUseReadContract({
  abi: otomsDatabaseContractAbi,
  functionName: 'owner',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"pendingOwner"`
 */
export const useReadOtomsDatabaseContractPendingOwner = /*#__PURE__*/ createUseReadContract({
  abi: otomsDatabaseContractAbi,
  functionName: 'pendingOwner',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"takenUniverseNames"`
 */
export const useReadOtomsDatabaseContractTakenUniverseNames = /*#__PURE__*/ createUseReadContract({
  abi: otomsDatabaseContractAbi,
  functionName: 'takenUniverseNames',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"tokenURI"`
 */
export const useReadOtomsDatabaseContractTokenUri = /*#__PURE__*/ createUseReadContract({
  abi: otomsDatabaseContractAbi,
  functionName: 'tokenURI',
});

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"universeInformation"`
 */
export const useReadOtomsDatabaseContractUniverseInformation = /*#__PURE__*/ createUseReadContract({
  abi: otomsDatabaseContractAbi,
  functionName: 'universeInformation',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__
 */
export const useWriteOtomsDatabaseContract = /*#__PURE__*/ createUseWriteContract({
  abi: otomsDatabaseContractAbi,
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"acceptOwnership"`
 */
export const useWriteOtomsDatabaseContractAcceptOwnership = /*#__PURE__*/ createUseWriteContract({
  abi: otomsDatabaseContractAbi,
  functionName: 'acceptOwnership',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"initialize"`
 */
export const useWriteOtomsDatabaseContractInitialize = /*#__PURE__*/ createUseWriteContract({
  abi: otomsDatabaseContractAbi,
  functionName: 'initialize',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"maybeMarkMoleculeAsDiscovered"`
 */
export const useWriteOtomsDatabaseContractMaybeMarkMoleculeAsDiscovered =
  /*#__PURE__*/ createUseWriteContract({
    abi: otomsDatabaseContractAbi,
    functionName: 'maybeMarkMoleculeAsDiscovered',
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteOtomsDatabaseContractRenounceOwnership = /*#__PURE__*/ createUseWriteContract({
  abi: otomsDatabaseContractAbi,
  functionName: 'renounceOwnership',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"setEncoder"`
 */
export const useWriteOtomsDatabaseContractSetEncoder = /*#__PURE__*/ createUseWriteContract({
  abi: otomsDatabaseContractAbi,
  functionName: 'setEncoder',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"setUniverseInformation"`
 */
export const useWriteOtomsDatabaseContractSetUniverseInformation =
  /*#__PURE__*/ createUseWriteContract({
    abi: otomsDatabaseContractAbi,
    functionName: 'setUniverseInformation',
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"toggleOperator"`
 */
export const useWriteOtomsDatabaseContractToggleOperator = /*#__PURE__*/ createUseWriteContract({
  abi: otomsDatabaseContractAbi,
  functionName: 'toggleOperator',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"toggleUniverseActive"`
 */
export const useWriteOtomsDatabaseContractToggleUniverseActive =
  /*#__PURE__*/ createUseWriteContract({
    abi: otomsDatabaseContractAbi,
    functionName: 'toggleUniverseActive',
  });

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteOtomsDatabaseContractTransferOwnership = /*#__PURE__*/ createUseWriteContract({
  abi: otomsDatabaseContractAbi,
  functionName: 'transferOwnership',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"updateMolecule"`
 */
export const useWriteOtomsDatabaseContractUpdateMolecule = /*#__PURE__*/ createUseWriteContract({
  abi: otomsDatabaseContractAbi,
  functionName: 'updateMolecule',
});

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"updateTokenURI"`
 */
export const useWriteOtomsDatabaseContractUpdateTokenUri = /*#__PURE__*/ createUseWriteContract({
  abi: otomsDatabaseContractAbi,
  functionName: 'updateTokenURI',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__
 */
export const useSimulateOtomsDatabaseContract = /*#__PURE__*/ createUseSimulateContract({
  abi: otomsDatabaseContractAbi,
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"acceptOwnership"`
 */
export const useSimulateOtomsDatabaseContractAcceptOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: otomsDatabaseContractAbi,
    functionName: 'acceptOwnership',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"initialize"`
 */
export const useSimulateOtomsDatabaseContractInitialize = /*#__PURE__*/ createUseSimulateContract({
  abi: otomsDatabaseContractAbi,
  functionName: 'initialize',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"maybeMarkMoleculeAsDiscovered"`
 */
export const useSimulateOtomsDatabaseContractMaybeMarkMoleculeAsDiscovered =
  /*#__PURE__*/ createUseSimulateContract({
    abi: otomsDatabaseContractAbi,
    functionName: 'maybeMarkMoleculeAsDiscovered',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateOtomsDatabaseContractRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: otomsDatabaseContractAbi,
    functionName: 'renounceOwnership',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"setEncoder"`
 */
export const useSimulateOtomsDatabaseContractSetEncoder = /*#__PURE__*/ createUseSimulateContract({
  abi: otomsDatabaseContractAbi,
  functionName: 'setEncoder',
});

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"setUniverseInformation"`
 */
export const useSimulateOtomsDatabaseContractSetUniverseInformation =
  /*#__PURE__*/ createUseSimulateContract({
    abi: otomsDatabaseContractAbi,
    functionName: 'setUniverseInformation',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"toggleOperator"`
 */
export const useSimulateOtomsDatabaseContractToggleOperator =
  /*#__PURE__*/ createUseSimulateContract({
    abi: otomsDatabaseContractAbi,
    functionName: 'toggleOperator',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"toggleUniverseActive"`
 */
export const useSimulateOtomsDatabaseContractToggleUniverseActive =
  /*#__PURE__*/ createUseSimulateContract({
    abi: otomsDatabaseContractAbi,
    functionName: 'toggleUniverseActive',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateOtomsDatabaseContractTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: otomsDatabaseContractAbi,
    functionName: 'transferOwnership',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"updateMolecule"`
 */
export const useSimulateOtomsDatabaseContractUpdateMolecule =
  /*#__PURE__*/ createUseSimulateContract({
    abi: otomsDatabaseContractAbi,
    functionName: 'updateMolecule',
  });

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"updateTokenURI"`
 */
export const useSimulateOtomsDatabaseContractUpdateTokenUri =
  /*#__PURE__*/ createUseSimulateContract({
    abi: otomsDatabaseContractAbi,
    functionName: 'updateTokenURI',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link otomsDatabaseContractAbi}__
 */
export const useWatchOtomsDatabaseContractEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: otomsDatabaseContractAbi,
});

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `eventName` set to `"EncoderUpdated"`
 */
export const useWatchOtomsDatabaseContractEncoderUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: otomsDatabaseContractAbi,
    eventName: 'EncoderUpdated',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `eventName` set to `"Initialized"`
 */
export const useWatchOtomsDatabaseContractInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: otomsDatabaseContractAbi,
    eventName: 'Initialized',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `eventName` set to `"MetadataUpdate"`
 */
export const useWatchOtomsDatabaseContractMetadataUpdateEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: otomsDatabaseContractAbi,
    eventName: 'MetadataUpdate',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `eventName` set to `"MoleculeDiscovered"`
 */
export const useWatchOtomsDatabaseContractMoleculeDiscoveredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: otomsDatabaseContractAbi,
    eventName: 'MoleculeDiscovered',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `eventName` set to `"OperatorToggled"`
 */
export const useWatchOtomsDatabaseContractOperatorToggledEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: otomsDatabaseContractAbi,
    eventName: 'OperatorToggled',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `eventName` set to `"OwnershipTransferStarted"`
 */
export const useWatchOtomsDatabaseContractOwnershipTransferStartedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: otomsDatabaseContractAbi,
    eventName: 'OwnershipTransferStarted',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchOtomsDatabaseContractOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: otomsDatabaseContractAbi,
    eventName: 'OwnershipTransferred',
  });

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `eventName` set to `"UniverseActiveToggled"`
 */
export const useWatchOtomsDatabaseContractUniverseActiveToggledEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: otomsDatabaseContractAbi,
    eventName: 'UniverseActiveToggled',
  });
