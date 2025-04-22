import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ItemsCoreContract
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const itemsCoreContractAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  { type: 'error', inputs: [], name: 'CreationDisabled' },
  { type: 'error', inputs: [], name: 'InsufficientItemBalance' },
  { type: 'error', inputs: [], name: 'InsufficientOtomBalance' },
  { type: 'error', inputs: [], name: 'InvalidCraftAmount' },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'InvalidItem' },
  {
    type: 'error',
    inputs: [{ name: 'itemId', internalType: 'uint256', type: 'uint256' }],
    name: 'ItemIsFrozen',
  },
  { type: 'error', inputs: [], name: 'MutatorFailed' },
  { type: 'error', inputs: [], name: 'NotAdmin' },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  { type: 'error', inputs: [], name: 'NotOperator' },
  { type: 'error', inputs: [], name: 'NotOtomItems' },
  {
    type: 'error',
    inputs: [
      { name: 'msgSender', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'NotOwner',
  },
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
  {
    type: 'error',
    inputs: [
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'length', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'StringsInsufficientHexLength',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'isEnabled', internalType: 'bool', type: 'bool', indexed: true },
    ],
    name: 'CreationEnabledSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'crafter',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'itemId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ItemCrafted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'itemId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      { name: 'name', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'ItemCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'itemId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'ItemDestroyed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'itemId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'ItemFrozen',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'itemId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'ItemUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'itemId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'ItemUsed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'isActive', internalType: 'bool', type: 'bool', indexed: true },
    ],
    name: 'OperatorSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'otomItems',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OtomItemsSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferStarted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'renderer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'RendererSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
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
    type: 'function',
    inputs: [],
    name: 'acceptOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
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
    ],
    name: 'craftItem',
    outputs: [],
    stateMutability: 'nonpayable',
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
          {
            name: 'componentType',
            internalType: 'enum ComponentType',
            type: 'uint8',
          },
          {
            name: 'itemIdOrOtomTokenId',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'amount', internalType: 'uint256', type: 'uint256' },
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
      {
        name: '_blueprint',
        internalType: 'struct BlueprintComponent[]',
        type: 'tuple[]',
        components: [
          {
            name: 'componentType',
            internalType: 'enum ComponentType',
            type: 'uint8',
          },
          {
            name: 'itemIdOrOtomTokenId',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'amount', internalType: 'uint256', type: 'uint256' },
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
              {
                name: 'componentType',
                internalType: 'enum ComponentType',
                type: 'uint8',
              },
              {
                name: 'itemIdOrOtomTokenId',
                internalType: 'uint256',
                type: 'uint256',
              },
              { name: 'amount', internalType: 'uint256', type: 'uint256' },
            ],
          },
          { name: 'mutatorContract', internalType: 'address', type: 'address' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'getItemByTokenId',
    outputs: [
      {
        name: '',
        internalType: 'struct Item',
        type: 'tuple',
        components: [
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
              {
                name: 'componentType',
                internalType: 'enum ComponentType',
                type: 'uint8',
              },
              {
                name: 'itemIdOrOtomTokenId',
                internalType: 'uint256',
                type: 'uint256',
              },
              { name: 'amount', internalType: 'uint256', type: 'uint256' },
            ],
          },
          { name: 'mutatorContract', internalType: 'address', type: 'address' },
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
    inputs: [{ name: '_itemId', internalType: 'uint256', type: 'uint256' }],
    name: 'getItemMintCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getNextItemId',
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
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
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
    inputs: [{ name: '_itemId', internalType: 'uint256', type: 'uint256' }],
    name: 'isItemFrozen',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'items',
    outputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'description', internalType: 'string', type: 'string' },
      { name: 'creator', internalType: 'address', type: 'address' },
      { name: 'admin', internalType: 'address', type: 'address' },
      { name: 'defaultImageUri', internalType: 'string', type: 'string' },
      { name: 'itemType', internalType: 'enum ItemType', type: 'uint8' },
      { name: 'mutatorContract', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'otomItems',
    outputs: [
      { name: '', internalType: 'contract IOtomItems', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'otoms',
    outputs: [{ name: '', internalType: 'contract IOtomsV2', type: 'address' }],
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
    name: 'renderer',
    outputs: [
      {
        name: '',
        internalType: 'contract IOtomItemsRenderer',
        type: 'address',
      },
    ],
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
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'isActive', internalType: 'bool', type: 'bool' },
    ],
    name: 'setOperator',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_otomItemsAddress', internalType: 'address', type: 'address' },
    ],
    name: 'setOtomItems',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_rendererAddress', internalType: 'address', type: 'address' },
    ],
    name: 'setRenderer',
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
          {
            name: 'componentType',
            internalType: 'enum ComponentType',
            type: 'uint8',
          },
          {
            name: 'itemIdOrOtomTokenId',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'amount', internalType: 'uint256', type: 'uint256' },
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
      {
        name: '_blueprint',
        internalType: 'struct BlueprintComponent[]',
        type: 'tuple[]',
        components: [
          {
            name: 'componentType',
            internalType: 'enum ComponentType',
            type: 'uint8',
          },
          {
            name: 'itemIdOrOtomTokenId',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'amount', internalType: 'uint256', type: 'uint256' },
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
] as const

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
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'approved', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'ApprovalForAll',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'encoder',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'EncoderUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'minesDepleted',
        internalType: 'bool',
        type: 'bool',
        indexed: true,
      },
    ],
    name: 'MinesDepletedSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'miningLimit',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'MiningLimitSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'isActive', internalType: 'bool', type: 'bool', indexed: true },
    ],
    name: 'OperatorToggled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'minedBy',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'universeHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'atomId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'creationHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
    ],
    name: 'OtomMined',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferStarted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'signer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'SignerSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'ids',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
      {
        name: 'values',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
    ],
    name: 'TransferBatch',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: false },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
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
    outputs: [
      { name: '', internalType: 'contract IOtomsDatabase', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'encoder',
    outputs: [
      { name: '', internalType: 'contract IOtomsEncoder', type: 'address' },
    ],
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
          {
            name: 'reactionOutputId',
            internalType: 'uint256',
            type: 'uint256',
          },
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
                  {
                    name: 'universeHash',
                    internalType: 'bytes32',
                    type: 'bytes32',
                  },
                  {
                    name: 'activationEnergy',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  { name: 'radius', internalType: 'uint256', type: 'uint256' },
                  {
                    name: 'bond',
                    internalType: 'struct Bond',
                    type: 'tuple',
                    components: [
                      {
                        name: 'strength',
                        internalType: 'uint256',
                        type: 'uint256',
                      },
                      {
                        name: 'bondType',
                        internalType: 'string',
                        type: 'string',
                      },
                    ],
                  },
                  {
                    name: 'givingAtoms',
                    internalType: 'struct Atom[]',
                    type: 'tuple[]',
                    components: [
                      {
                        name: 'radius',
                        internalType: 'uint256',
                        type: 'uint256',
                      },
                      {
                        name: 'volume',
                        internalType: 'uint256',
                        type: 'uint256',
                      },
                      {
                        name: 'mass',
                        internalType: 'uint256',
                        type: 'uint256',
                      },
                      {
                        name: 'density',
                        internalType: 'uint256',
                        type: 'uint256',
                      },
                      {
                        name: 'electronegativity',
                        internalType: 'uint256',
                        type: 'uint256',
                      },
                      { name: 'metallic', internalType: 'bool', type: 'bool' },
                      { name: 'name', internalType: 'string', type: 'string' },
                      {
                        name: 'series',
                        internalType: 'string',
                        type: 'string',
                      },
                      {
                        name: 'periodicTableX',
                        internalType: 'uint256',
                        type: 'uint256',
                      },
                      {
                        name: 'periodicTableY',
                        internalType: 'uint256',
                        type: 'uint256',
                      },
                      {
                        name: 'structure',
                        internalType: 'struct AtomStructure',
                        type: 'tuple',
                        components: [
                          {
                            name: 'universeHash',
                            internalType: 'bytes32',
                            type: 'bytes32',
                          },
                          {
                            name: 'depth',
                            internalType: 'uint256',
                            type: 'uint256',
                          },
                          {
                            name: 'distance',
                            internalType: 'uint256',
                            type: 'uint256',
                          },
                          {
                            name: 'distanceIndex',
                            internalType: 'uint256',
                            type: 'uint256',
                          },
                          {
                            name: 'shell',
                            internalType: 'uint256',
                            type: 'uint256',
                          },
                          {
                            name: 'totalInOuter',
                            internalType: 'uint256[]',
                            type: 'uint256[]',
                          },
                          {
                            name: 'emptyInOuter',
                            internalType: 'uint256[]',
                            type: 'uint256[]',
                          },
                          {
                            name: 'filledInOuter',
                            internalType: 'uint256[]',
                            type: 'uint256[]',
                          },
                          {
                            name: 'ancestors',
                            internalType: 'uint256[]',
                            type: 'uint256[]',
                          },
                        ],
                      },
                      {
                        name: 'nucleus',
                        internalType: 'struct Nucleus',
                        type: 'tuple',
                        components: [
                          {
                            name: 'protons',
                            internalType: 'uint256',
                            type: 'uint256',
                          },
                          {
                            name: 'neutrons',
                            internalType: 'uint256',
                            type: 'uint256',
                          },
                          {
                            name: 'nucleons',
                            internalType: 'uint256',
                            type: 'uint256',
                          },
                          {
                            name: 'stability',
                            internalType: 'uint256',
                            type: 'uint256',
                          },
                          {
                            name: 'decayType',
                            internalType: 'string',
                            type: 'string',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    name: 'receivingAtoms',
                    internalType: 'struct Atom[]',
                    type: 'tuple[]',
                    components: [
                      {
                        name: 'radius',
                        internalType: 'uint256',
                        type: 'uint256',
                      },
                      {
                        name: 'volume',
                        internalType: 'uint256',
                        type: 'uint256',
                      },
                      {
                        name: 'mass',
                        internalType: 'uint256',
                        type: 'uint256',
                      },
                      {
                        name: 'density',
                        internalType: 'uint256',
                        type: 'uint256',
                      },
                      {
                        name: 'electronegativity',
                        internalType: 'uint256',
                        type: 'uint256',
                      },
                      { name: 'metallic', internalType: 'bool', type: 'bool' },
                      { name: 'name', internalType: 'string', type: 'string' },
                      {
                        name: 'series',
                        internalType: 'string',
                        type: 'string',
                      },
                      {
                        name: 'periodicTableX',
                        internalType: 'uint256',
                        type: 'uint256',
                      },
                      {
                        name: 'periodicTableY',
                        internalType: 'uint256',
                        type: 'uint256',
                      },
                      {
                        name: 'structure',
                        internalType: 'struct AtomStructure',
                        type: 'tuple',
                        components: [
                          {
                            name: 'universeHash',
                            internalType: 'bytes32',
                            type: 'bytes32',
                          },
                          {
                            name: 'depth',
                            internalType: 'uint256',
                            type: 'uint256',
                          },
                          {
                            name: 'distance',
                            internalType: 'uint256',
                            type: 'uint256',
                          },
                          {
                            name: 'distanceIndex',
                            internalType: 'uint256',
                            type: 'uint256',
                          },
                          {
                            name: 'shell',
                            internalType: 'uint256',
                            type: 'uint256',
                          },
                          {
                            name: 'totalInOuter',
                            internalType: 'uint256[]',
                            type: 'uint256[]',
                          },
                          {
                            name: 'emptyInOuter',
                            internalType: 'uint256[]',
                            type: 'uint256[]',
                          },
                          {
                            name: 'filledInOuter',
                            internalType: 'uint256[]',
                            type: 'uint256[]',
                          },
                          {
                            name: 'ancestors',
                            internalType: 'uint256[]',
                            type: 'uint256[]',
                          },
                        ],
                      },
                      {
                        name: 'nucleus',
                        internalType: 'struct Nucleus',
                        type: 'tuple',
                        components: [
                          {
                            name: 'protons',
                            internalType: 'uint256',
                            type: 'uint256',
                          },
                          {
                            name: 'neutrons',
                            internalType: 'uint256',
                            type: 'uint256',
                          },
                          {
                            name: 'nucleons',
                            internalType: 'uint256',
                            type: 'uint256',
                          },
                          {
                            name: 'stability',
                            internalType: 'uint256',
                            type: 'uint256',
                          },
                          {
                            name: 'decayType',
                            internalType: 'string',
                            type: 'string',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    name: 'electricalConductivity',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'thermalConductivity',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'toughness',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'hardness',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'ductility',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                ],
              },
              { name: 'tokenUri', internalType: 'string', type: 'string' },
            ],
          },
          {
            name: 'inputAtomIds',
            internalType: 'uint256[]',
            type: 'uint256[]',
          },
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
              {
                name: 'universeHash',
                internalType: 'bytes32',
                type: 'bytes32',
              },
              {
                name: 'activationEnergy',
                internalType: 'uint256',
                type: 'uint256',
              },
              { name: 'radius', internalType: 'uint256', type: 'uint256' },
              {
                name: 'bond',
                internalType: 'struct Bond',
                type: 'tuple',
                components: [
                  {
                    name: 'strength',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
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
                  {
                    name: 'electronegativity',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  { name: 'metallic', internalType: 'bool', type: 'bool' },
                  { name: 'name', internalType: 'string', type: 'string' },
                  { name: 'series', internalType: 'string', type: 'string' },
                  {
                    name: 'periodicTableX',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'periodicTableY',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'structure',
                    internalType: 'struct AtomStructure',
                    type: 'tuple',
                    components: [
                      {
                        name: 'universeHash',
                        internalType: 'bytes32',
                        type: 'bytes32',
                      },
                      {
                        name: 'depth',
                        internalType: 'uint256',
                        type: 'uint256',
                      },
                      {
                        name: 'distance',
                        internalType: 'uint256',
                        type: 'uint256',
                      },
                      {
                        name: 'distanceIndex',
                        internalType: 'uint256',
                        type: 'uint256',
                      },
                      {
                        name: 'shell',
                        internalType: 'uint256',
                        type: 'uint256',
                      },
                      {
                        name: 'totalInOuter',
                        internalType: 'uint256[]',
                        type: 'uint256[]',
                      },
                      {
                        name: 'emptyInOuter',
                        internalType: 'uint256[]',
                        type: 'uint256[]',
                      },
                      {
                        name: 'filledInOuter',
                        internalType: 'uint256[]',
                        type: 'uint256[]',
                      },
                      {
                        name: 'ancestors',
                        internalType: 'uint256[]',
                        type: 'uint256[]',
                      },
                    ],
                  },
                  {
                    name: 'nucleus',
                    internalType: 'struct Nucleus',
                    type: 'tuple',
                    components: [
                      {
                        name: 'protons',
                        internalType: 'uint256',
                        type: 'uint256',
                      },
                      {
                        name: 'neutrons',
                        internalType: 'uint256',
                        type: 'uint256',
                      },
                      {
                        name: 'nucleons',
                        internalType: 'uint256',
                        type: 'uint256',
                      },
                      {
                        name: 'stability',
                        internalType: 'uint256',
                        type: 'uint256',
                      },
                      {
                        name: 'decayType',
                        internalType: 'string',
                        type: 'string',
                      },
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
                  {
                    name: 'electronegativity',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  { name: 'metallic', internalType: 'bool', type: 'bool' },
                  { name: 'name', internalType: 'string', type: 'string' },
                  { name: 'series', internalType: 'string', type: 'string' },
                  {
                    name: 'periodicTableX',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'periodicTableY',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'structure',
                    internalType: 'struct AtomStructure',
                    type: 'tuple',
                    components: [
                      {
                        name: 'universeHash',
                        internalType: 'bytes32',
                        type: 'bytes32',
                      },
                      {
                        name: 'depth',
                        internalType: 'uint256',
                        type: 'uint256',
                      },
                      {
                        name: 'distance',
                        internalType: 'uint256',
                        type: 'uint256',
                      },
                      {
                        name: 'distanceIndex',
                        internalType: 'uint256',
                        type: 'uint256',
                      },
                      {
                        name: 'shell',
                        internalType: 'uint256',
                        type: 'uint256',
                      },
                      {
                        name: 'totalInOuter',
                        internalType: 'uint256[]',
                        type: 'uint256[]',
                      },
                      {
                        name: 'emptyInOuter',
                        internalType: 'uint256[]',
                        type: 'uint256[]',
                      },
                      {
                        name: 'filledInOuter',
                        internalType: 'uint256[]',
                        type: 'uint256[]',
                      },
                      {
                        name: 'ancestors',
                        internalType: 'uint256[]',
                        type: 'uint256[]',
                      },
                    ],
                  },
                  {
                    name: 'nucleus',
                    internalType: 'struct Nucleus',
                    type: 'tuple',
                    components: [
                      {
                        name: 'protons',
                        internalType: 'uint256',
                        type: 'uint256',
                      },
                      {
                        name: 'neutrons',
                        internalType: 'uint256',
                        type: 'uint256',
                      },
                      {
                        name: 'nucleons',
                        internalType: 'uint256',
                        type: 'uint256',
                      },
                      {
                        name: 'stability',
                        internalType: 'uint256',
                        type: 'uint256',
                      },
                      {
                        name: 'decayType',
                        internalType: 'string',
                        type: 'string',
                      },
                    ],
                  },
                ],
              },
              {
                name: 'electricalConductivity',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'thermalConductivity',
                internalType: 'uint256',
                type: 'uint256',
              },
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
          {
            name: 'activationEnergy',
            internalType: 'uint256',
            type: 'uint256',
          },
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
              {
                name: 'electronegativity',
                internalType: 'uint256',
                type: 'uint256',
              },
              { name: 'metallic', internalType: 'bool', type: 'bool' },
              { name: 'name', internalType: 'string', type: 'string' },
              { name: 'series', internalType: 'string', type: 'string' },
              {
                name: 'periodicTableX',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'periodicTableY',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'structure',
                internalType: 'struct AtomStructure',
                type: 'tuple',
                components: [
                  {
                    name: 'universeHash',
                    internalType: 'bytes32',
                    type: 'bytes32',
                  },
                  { name: 'depth', internalType: 'uint256', type: 'uint256' },
                  {
                    name: 'distance',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'distanceIndex',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  { name: 'shell', internalType: 'uint256', type: 'uint256' },
                  {
                    name: 'totalInOuter',
                    internalType: 'uint256[]',
                    type: 'uint256[]',
                  },
                  {
                    name: 'emptyInOuter',
                    internalType: 'uint256[]',
                    type: 'uint256[]',
                  },
                  {
                    name: 'filledInOuter',
                    internalType: 'uint256[]',
                    type: 'uint256[]',
                  },
                  {
                    name: 'ancestors',
                    internalType: 'uint256[]',
                    type: 'uint256[]',
                  },
                ],
              },
              {
                name: 'nucleus',
                internalType: 'struct Nucleus',
                type: 'tuple',
                components: [
                  { name: 'protons', internalType: 'uint256', type: 'uint256' },
                  {
                    name: 'neutrons',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'nucleons',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'stability',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
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
              {
                name: 'electronegativity',
                internalType: 'uint256',
                type: 'uint256',
              },
              { name: 'metallic', internalType: 'bool', type: 'bool' },
              { name: 'name', internalType: 'string', type: 'string' },
              { name: 'series', internalType: 'string', type: 'string' },
              {
                name: 'periodicTableX',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'periodicTableY',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'structure',
                internalType: 'struct AtomStructure',
                type: 'tuple',
                components: [
                  {
                    name: 'universeHash',
                    internalType: 'bytes32',
                    type: 'bytes32',
                  },
                  { name: 'depth', internalType: 'uint256', type: 'uint256' },
                  {
                    name: 'distance',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'distanceIndex',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  { name: 'shell', internalType: 'uint256', type: 'uint256' },
                  {
                    name: 'totalInOuter',
                    internalType: 'uint256[]',
                    type: 'uint256[]',
                  },
                  {
                    name: 'emptyInOuter',
                    internalType: 'uint256[]',
                    type: 'uint256[]',
                  },
                  {
                    name: 'filledInOuter',
                    internalType: 'uint256[]',
                    type: 'uint256[]',
                  },
                  {
                    name: 'ancestors',
                    internalType: 'uint256[]',
                    type: 'uint256[]',
                  },
                ],
              },
              {
                name: 'nucleus',
                internalType: 'struct Nucleus',
                type: 'tuple',
                components: [
                  { name: 'protons', internalType: 'uint256', type: 'uint256' },
                  {
                    name: 'neutrons',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'nucleons',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'stability',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  { name: 'decayType', internalType: 'string', type: 'string' },
                ],
              },
            ],
          },
          {
            name: 'electricalConductivity',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'thermalConductivity',
            internalType: 'uint256',
            type: 'uint256',
          },
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
    inputs: [
      { name: '_miningLimit', internalType: 'uint256', type: 'uint256' },
    ],
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
] as const

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
    inputs: [
      {
        name: 'newEncoder',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'EncoderUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'MetadataUpdate',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'universeHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'discoveredBy',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'MoleculeDiscovered',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'enabled', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'OperatorToggled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferStarted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'universeHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
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
    outputs: [
      { name: '', internalType: 'contract IOtomsEncoder', type: 'address' },
    ],
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
          {
            name: 'activationEnergy',
            internalType: 'uint256',
            type: 'uint256',
          },
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
              {
                name: 'electronegativity',
                internalType: 'uint256',
                type: 'uint256',
              },
              { name: 'metallic', internalType: 'bool', type: 'bool' },
              { name: 'name', internalType: 'string', type: 'string' },
              { name: 'series', internalType: 'string', type: 'string' },
              {
                name: 'periodicTableX',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'periodicTableY',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'structure',
                internalType: 'struct AtomStructure',
                type: 'tuple',
                components: [
                  {
                    name: 'universeHash',
                    internalType: 'bytes32',
                    type: 'bytes32',
                  },
                  { name: 'depth', internalType: 'uint256', type: 'uint256' },
                  {
                    name: 'distance',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'distanceIndex',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  { name: 'shell', internalType: 'uint256', type: 'uint256' },
                  {
                    name: 'totalInOuter',
                    internalType: 'uint256[]',
                    type: 'uint256[]',
                  },
                  {
                    name: 'emptyInOuter',
                    internalType: 'uint256[]',
                    type: 'uint256[]',
                  },
                  {
                    name: 'filledInOuter',
                    internalType: 'uint256[]',
                    type: 'uint256[]',
                  },
                  {
                    name: 'ancestors',
                    internalType: 'uint256[]',
                    type: 'uint256[]',
                  },
                ],
              },
              {
                name: 'nucleus',
                internalType: 'struct Nucleus',
                type: 'tuple',
                components: [
                  { name: 'protons', internalType: 'uint256', type: 'uint256' },
                  {
                    name: 'neutrons',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'nucleons',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'stability',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
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
              {
                name: 'electronegativity',
                internalType: 'uint256',
                type: 'uint256',
              },
              { name: 'metallic', internalType: 'bool', type: 'bool' },
              { name: 'name', internalType: 'string', type: 'string' },
              { name: 'series', internalType: 'string', type: 'string' },
              {
                name: 'periodicTableX',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'periodicTableY',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'structure',
                internalType: 'struct AtomStructure',
                type: 'tuple',
                components: [
                  {
                    name: 'universeHash',
                    internalType: 'bytes32',
                    type: 'bytes32',
                  },
                  { name: 'depth', internalType: 'uint256', type: 'uint256' },
                  {
                    name: 'distance',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'distanceIndex',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  { name: 'shell', internalType: 'uint256', type: 'uint256' },
                  {
                    name: 'totalInOuter',
                    internalType: 'uint256[]',
                    type: 'uint256[]',
                  },
                  {
                    name: 'emptyInOuter',
                    internalType: 'uint256[]',
                    type: 'uint256[]',
                  },
                  {
                    name: 'filledInOuter',
                    internalType: 'uint256[]',
                    type: 'uint256[]',
                  },
                  {
                    name: 'ancestors',
                    internalType: 'uint256[]',
                    type: 'uint256[]',
                  },
                ],
              },
              {
                name: 'nucleus',
                internalType: 'struct Nucleus',
                type: 'tuple',
                components: [
                  { name: 'protons', internalType: 'uint256', type: 'uint256' },
                  {
                    name: 'neutrons',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'nucleons',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'stability',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  { name: 'decayType', internalType: 'string', type: 'string' },
                ],
              },
            ],
          },
          {
            name: 'electricalConductivity',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'thermalConductivity',
            internalType: 'uint256',
            type: 'uint256',
          },
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
          {
            name: 'activationEnergy',
            internalType: 'uint256',
            type: 'uint256',
          },
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
              {
                name: 'electronegativity',
                internalType: 'uint256',
                type: 'uint256',
              },
              { name: 'metallic', internalType: 'bool', type: 'bool' },
              { name: 'name', internalType: 'string', type: 'string' },
              { name: 'series', internalType: 'string', type: 'string' },
              {
                name: 'periodicTableX',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'periodicTableY',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'structure',
                internalType: 'struct AtomStructure',
                type: 'tuple',
                components: [
                  {
                    name: 'universeHash',
                    internalType: 'bytes32',
                    type: 'bytes32',
                  },
                  { name: 'depth', internalType: 'uint256', type: 'uint256' },
                  {
                    name: 'distance',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'distanceIndex',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  { name: 'shell', internalType: 'uint256', type: 'uint256' },
                  {
                    name: 'totalInOuter',
                    internalType: 'uint256[]',
                    type: 'uint256[]',
                  },
                  {
                    name: 'emptyInOuter',
                    internalType: 'uint256[]',
                    type: 'uint256[]',
                  },
                  {
                    name: 'filledInOuter',
                    internalType: 'uint256[]',
                    type: 'uint256[]',
                  },
                  {
                    name: 'ancestors',
                    internalType: 'uint256[]',
                    type: 'uint256[]',
                  },
                ],
              },
              {
                name: 'nucleus',
                internalType: 'struct Nucleus',
                type: 'tuple',
                components: [
                  { name: 'protons', internalType: 'uint256', type: 'uint256' },
                  {
                    name: 'neutrons',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'nucleons',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'stability',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
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
              {
                name: 'electronegativity',
                internalType: 'uint256',
                type: 'uint256',
              },
              { name: 'metallic', internalType: 'bool', type: 'bool' },
              { name: 'name', internalType: 'string', type: 'string' },
              { name: 'series', internalType: 'string', type: 'string' },
              {
                name: 'periodicTableX',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'periodicTableY',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'structure',
                internalType: 'struct AtomStructure',
                type: 'tuple',
                components: [
                  {
                    name: 'universeHash',
                    internalType: 'bytes32',
                    type: 'bytes32',
                  },
                  { name: 'depth', internalType: 'uint256', type: 'uint256' },
                  {
                    name: 'distance',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'distanceIndex',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  { name: 'shell', internalType: 'uint256', type: 'uint256' },
                  {
                    name: 'totalInOuter',
                    internalType: 'uint256[]',
                    type: 'uint256[]',
                  },
                  {
                    name: 'emptyInOuter',
                    internalType: 'uint256[]',
                    type: 'uint256[]',
                  },
                  {
                    name: 'filledInOuter',
                    internalType: 'uint256[]',
                    type: 'uint256[]',
                  },
                  {
                    name: 'ancestors',
                    internalType: 'uint256[]',
                    type: 'uint256[]',
                  },
                ],
              },
              {
                name: 'nucleus',
                internalType: 'struct Nucleus',
                type: 'tuple',
                components: [
                  { name: 'protons', internalType: 'uint256', type: 'uint256' },
                  {
                    name: 'neutrons',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'nucleons',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'stability',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  { name: 'decayType', internalType: 'string', type: 'string' },
                ],
              },
            ],
          },
          {
            name: 'electricalConductivity',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'thermalConductivity',
            internalType: 'uint256',
            type: 'uint256',
          },
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
    ],
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
          {
            name: 'activationEnergy',
            internalType: 'uint256',
            type: 'uint256',
          },
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
              {
                name: 'electronegativity',
                internalType: 'uint256',
                type: 'uint256',
              },
              { name: 'metallic', internalType: 'bool', type: 'bool' },
              { name: 'name', internalType: 'string', type: 'string' },
              { name: 'series', internalType: 'string', type: 'string' },
              {
                name: 'periodicTableX',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'periodicTableY',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'structure',
                internalType: 'struct AtomStructure',
                type: 'tuple',
                components: [
                  {
                    name: 'universeHash',
                    internalType: 'bytes32',
                    type: 'bytes32',
                  },
                  { name: 'depth', internalType: 'uint256', type: 'uint256' },
                  {
                    name: 'distance',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'distanceIndex',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  { name: 'shell', internalType: 'uint256', type: 'uint256' },
                  {
                    name: 'totalInOuter',
                    internalType: 'uint256[]',
                    type: 'uint256[]',
                  },
                  {
                    name: 'emptyInOuter',
                    internalType: 'uint256[]',
                    type: 'uint256[]',
                  },
                  {
                    name: 'filledInOuter',
                    internalType: 'uint256[]',
                    type: 'uint256[]',
                  },
                  {
                    name: 'ancestors',
                    internalType: 'uint256[]',
                    type: 'uint256[]',
                  },
                ],
              },
              {
                name: 'nucleus',
                internalType: 'struct Nucleus',
                type: 'tuple',
                components: [
                  { name: 'protons', internalType: 'uint256', type: 'uint256' },
                  {
                    name: 'neutrons',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'nucleons',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'stability',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
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
              {
                name: 'electronegativity',
                internalType: 'uint256',
                type: 'uint256',
              },
              { name: 'metallic', internalType: 'bool', type: 'bool' },
              { name: 'name', internalType: 'string', type: 'string' },
              { name: 'series', internalType: 'string', type: 'string' },
              {
                name: 'periodicTableX',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'periodicTableY',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'structure',
                internalType: 'struct AtomStructure',
                type: 'tuple',
                components: [
                  {
                    name: 'universeHash',
                    internalType: 'bytes32',
                    type: 'bytes32',
                  },
                  { name: 'depth', internalType: 'uint256', type: 'uint256' },
                  {
                    name: 'distance',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'distanceIndex',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  { name: 'shell', internalType: 'uint256', type: 'uint256' },
                  {
                    name: 'totalInOuter',
                    internalType: 'uint256[]',
                    type: 'uint256[]',
                  },
                  {
                    name: 'emptyInOuter',
                    internalType: 'uint256[]',
                    type: 'uint256[]',
                  },
                  {
                    name: 'filledInOuter',
                    internalType: 'uint256[]',
                    type: 'uint256[]',
                  },
                  {
                    name: 'ancestors',
                    internalType: 'uint256[]',
                    type: 'uint256[]',
                  },
                ],
              },
              {
                name: 'nucleus',
                internalType: 'struct Nucleus',
                type: 'tuple',
                components: [
                  { name: 'protons', internalType: 'uint256', type: 'uint256' },
                  {
                    name: 'neutrons',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'nucleons',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'stability',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  { name: 'decayType', internalType: 'string', type: 'string' },
                ],
              },
            ],
          },
          {
            name: 'electricalConductivity',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'thermalConductivity',
            internalType: 'uint256',
            type: 'uint256',
          },
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
          {
            name: 'activationEnergy',
            internalType: 'uint256',
            type: 'uint256',
          },
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
              {
                name: 'electronegativity',
                internalType: 'uint256',
                type: 'uint256',
              },
              { name: 'metallic', internalType: 'bool', type: 'bool' },
              { name: 'name', internalType: 'string', type: 'string' },
              { name: 'series', internalType: 'string', type: 'string' },
              {
                name: 'periodicTableX',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'periodicTableY',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'structure',
                internalType: 'struct AtomStructure',
                type: 'tuple',
                components: [
                  {
                    name: 'universeHash',
                    internalType: 'bytes32',
                    type: 'bytes32',
                  },
                  { name: 'depth', internalType: 'uint256', type: 'uint256' },
                  {
                    name: 'distance',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'distanceIndex',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  { name: 'shell', internalType: 'uint256', type: 'uint256' },
                  {
                    name: 'totalInOuter',
                    internalType: 'uint256[]',
                    type: 'uint256[]',
                  },
                  {
                    name: 'emptyInOuter',
                    internalType: 'uint256[]',
                    type: 'uint256[]',
                  },
                  {
                    name: 'filledInOuter',
                    internalType: 'uint256[]',
                    type: 'uint256[]',
                  },
                  {
                    name: 'ancestors',
                    internalType: 'uint256[]',
                    type: 'uint256[]',
                  },
                ],
              },
              {
                name: 'nucleus',
                internalType: 'struct Nucleus',
                type: 'tuple',
                components: [
                  { name: 'protons', internalType: 'uint256', type: 'uint256' },
                  {
                    name: 'neutrons',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'nucleons',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'stability',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
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
              {
                name: 'electronegativity',
                internalType: 'uint256',
                type: 'uint256',
              },
              { name: 'metallic', internalType: 'bool', type: 'bool' },
              { name: 'name', internalType: 'string', type: 'string' },
              { name: 'series', internalType: 'string', type: 'string' },
              {
                name: 'periodicTableX',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'periodicTableY',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'structure',
                internalType: 'struct AtomStructure',
                type: 'tuple',
                components: [
                  {
                    name: 'universeHash',
                    internalType: 'bytes32',
                    type: 'bytes32',
                  },
                  { name: 'depth', internalType: 'uint256', type: 'uint256' },
                  {
                    name: 'distance',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'distanceIndex',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  { name: 'shell', internalType: 'uint256', type: 'uint256' },
                  {
                    name: 'totalInOuter',
                    internalType: 'uint256[]',
                    type: 'uint256[]',
                  },
                  {
                    name: 'emptyInOuter',
                    internalType: 'uint256[]',
                    type: 'uint256[]',
                  },
                  {
                    name: 'filledInOuter',
                    internalType: 'uint256[]',
                    type: 'uint256[]',
                  },
                  {
                    name: 'ancestors',
                    internalType: 'uint256[]',
                    type: 'uint256[]',
                  },
                ],
              },
              {
                name: 'nucleus',
                internalType: 'struct Nucleus',
                type: 'tuple',
                components: [
                  { name: 'protons', internalType: 'uint256', type: 'uint256' },
                  {
                    name: 'neutrons',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'nucleons',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'stability',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  { name: 'decayType', internalType: 'string', type: 'string' },
                ],
              },
            ],
          },
          {
            name: 'electricalConductivity',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'thermalConductivity',
            internalType: 'uint256',
            type: 'uint256',
          },
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
    inputs: [
      { name: 'universeHash', internalType: 'bytes32', type: 'bytes32' },
    ],
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
          {
            name: 'activationEnergy',
            internalType: 'uint256',
            type: 'uint256',
          },
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
              {
                name: 'electronegativity',
                internalType: 'uint256',
                type: 'uint256',
              },
              { name: 'metallic', internalType: 'bool', type: 'bool' },
              { name: 'name', internalType: 'string', type: 'string' },
              { name: 'series', internalType: 'string', type: 'string' },
              {
                name: 'periodicTableX',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'periodicTableY',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'structure',
                internalType: 'struct AtomStructure',
                type: 'tuple',
                components: [
                  {
                    name: 'universeHash',
                    internalType: 'bytes32',
                    type: 'bytes32',
                  },
                  { name: 'depth', internalType: 'uint256', type: 'uint256' },
                  {
                    name: 'distance',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'distanceIndex',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  { name: 'shell', internalType: 'uint256', type: 'uint256' },
                  {
                    name: 'totalInOuter',
                    internalType: 'uint256[]',
                    type: 'uint256[]',
                  },
                  {
                    name: 'emptyInOuter',
                    internalType: 'uint256[]',
                    type: 'uint256[]',
                  },
                  {
                    name: 'filledInOuter',
                    internalType: 'uint256[]',
                    type: 'uint256[]',
                  },
                  {
                    name: 'ancestors',
                    internalType: 'uint256[]',
                    type: 'uint256[]',
                  },
                ],
              },
              {
                name: 'nucleus',
                internalType: 'struct Nucleus',
                type: 'tuple',
                components: [
                  { name: 'protons', internalType: 'uint256', type: 'uint256' },
                  {
                    name: 'neutrons',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'nucleons',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'stability',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
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
              {
                name: 'electronegativity',
                internalType: 'uint256',
                type: 'uint256',
              },
              { name: 'metallic', internalType: 'bool', type: 'bool' },
              { name: 'name', internalType: 'string', type: 'string' },
              { name: 'series', internalType: 'string', type: 'string' },
              {
                name: 'periodicTableX',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'periodicTableY',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'structure',
                internalType: 'struct AtomStructure',
                type: 'tuple',
                components: [
                  {
                    name: 'universeHash',
                    internalType: 'bytes32',
                    type: 'bytes32',
                  },
                  { name: 'depth', internalType: 'uint256', type: 'uint256' },
                  {
                    name: 'distance',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'distanceIndex',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  { name: 'shell', internalType: 'uint256', type: 'uint256' },
                  {
                    name: 'totalInOuter',
                    internalType: 'uint256[]',
                    type: 'uint256[]',
                  },
                  {
                    name: 'emptyInOuter',
                    internalType: 'uint256[]',
                    type: 'uint256[]',
                  },
                  {
                    name: 'filledInOuter',
                    internalType: 'uint256[]',
                    type: 'uint256[]',
                  },
                  {
                    name: 'ancestors',
                    internalType: 'uint256[]',
                    type: 'uint256[]',
                  },
                ],
              },
              {
                name: 'nucleus',
                internalType: 'struct Nucleus',
                type: 'tuple',
                components: [
                  { name: 'protons', internalType: 'uint256', type: 'uint256' },
                  {
                    name: 'neutrons',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'nucleons',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'stability',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  { name: 'decayType', internalType: 'string', type: 'string' },
                ],
              },
            ],
          },
          {
            name: 'electricalConductivity',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'thermalConductivity',
            internalType: 'uint256',
            type: 'uint256',
          },
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
    inputs: [
      { name: '_universeHash', internalType: 'bytes32', type: 'bytes32' },
    ],
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
          {
            name: 'activationEnergy',
            internalType: 'uint256',
            type: 'uint256',
          },
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
              {
                name: 'electronegativity',
                internalType: 'uint256',
                type: 'uint256',
              },
              { name: 'metallic', internalType: 'bool', type: 'bool' },
              { name: 'name', internalType: 'string', type: 'string' },
              { name: 'series', internalType: 'string', type: 'string' },
              {
                name: 'periodicTableX',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'periodicTableY',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'structure',
                internalType: 'struct AtomStructure',
                type: 'tuple',
                components: [
                  {
                    name: 'universeHash',
                    internalType: 'bytes32',
                    type: 'bytes32',
                  },
                  { name: 'depth', internalType: 'uint256', type: 'uint256' },
                  {
                    name: 'distance',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'distanceIndex',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  { name: 'shell', internalType: 'uint256', type: 'uint256' },
                  {
                    name: 'totalInOuter',
                    internalType: 'uint256[]',
                    type: 'uint256[]',
                  },
                  {
                    name: 'emptyInOuter',
                    internalType: 'uint256[]',
                    type: 'uint256[]',
                  },
                  {
                    name: 'filledInOuter',
                    internalType: 'uint256[]',
                    type: 'uint256[]',
                  },
                  {
                    name: 'ancestors',
                    internalType: 'uint256[]',
                    type: 'uint256[]',
                  },
                ],
              },
              {
                name: 'nucleus',
                internalType: 'struct Nucleus',
                type: 'tuple',
                components: [
                  { name: 'protons', internalType: 'uint256', type: 'uint256' },
                  {
                    name: 'neutrons',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'nucleons',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'stability',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
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
              {
                name: 'electronegativity',
                internalType: 'uint256',
                type: 'uint256',
              },
              { name: 'metallic', internalType: 'bool', type: 'bool' },
              { name: 'name', internalType: 'string', type: 'string' },
              { name: 'series', internalType: 'string', type: 'string' },
              {
                name: 'periodicTableX',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'periodicTableY',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'structure',
                internalType: 'struct AtomStructure',
                type: 'tuple',
                components: [
                  {
                    name: 'universeHash',
                    internalType: 'bytes32',
                    type: 'bytes32',
                  },
                  { name: 'depth', internalType: 'uint256', type: 'uint256' },
                  {
                    name: 'distance',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'distanceIndex',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  { name: 'shell', internalType: 'uint256', type: 'uint256' },
                  {
                    name: 'totalInOuter',
                    internalType: 'uint256[]',
                    type: 'uint256[]',
                  },
                  {
                    name: 'emptyInOuter',
                    internalType: 'uint256[]',
                    type: 'uint256[]',
                  },
                  {
                    name: 'filledInOuter',
                    internalType: 'uint256[]',
                    type: 'uint256[]',
                  },
                  {
                    name: 'ancestors',
                    internalType: 'uint256[]',
                    type: 'uint256[]',
                  },
                ],
              },
              {
                name: 'nucleus',
                internalType: 'struct Nucleus',
                type: 'tuple',
                components: [
                  { name: 'protons', internalType: 'uint256', type: 'uint256' },
                  {
                    name: 'neutrons',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'nucleons',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  {
                    name: 'stability',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  { name: 'decayType', internalType: 'string', type: 'string' },
                ],
              },
            ],
          },
          {
            name: 'electricalConductivity',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'thermalConductivity',
            internalType: 'uint256',
            type: 'uint256',
          },
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
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link itemsCoreContractAbi}__
 */
export const useReadItemsCoreContract = /*#__PURE__*/ createUseReadContract({
  abi: itemsCoreContractAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `functionName` set to `"creationEnabled"`
 */
export const useReadItemsCoreContractCreationEnabled =
  /*#__PURE__*/ createUseReadContract({
    abi: itemsCoreContractAbi,
    functionName: 'creationEnabled',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `functionName` set to `"frozenItems"`
 */
export const useReadItemsCoreContractFrozenItems =
  /*#__PURE__*/ createUseReadContract({
    abi: itemsCoreContractAbi,
    functionName: 'frozenItems',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `functionName` set to `"getItemByItemId"`
 */
export const useReadItemsCoreContractGetItemByItemId =
  /*#__PURE__*/ createUseReadContract({
    abi: itemsCoreContractAbi,
    functionName: 'getItemByItemId',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `functionName` set to `"getItemByTokenId"`
 */
export const useReadItemsCoreContractGetItemByTokenId =
  /*#__PURE__*/ createUseReadContract({
    abi: itemsCoreContractAbi,
    functionName: 'getItemByTokenId',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `functionName` set to `"getItemIdForToken"`
 */
export const useReadItemsCoreContractGetItemIdForToken =
  /*#__PURE__*/ createUseReadContract({
    abi: itemsCoreContractAbi,
    functionName: 'getItemIdForToken',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `functionName` set to `"getItemMintCount"`
 */
export const useReadItemsCoreContractGetItemMintCount =
  /*#__PURE__*/ createUseReadContract({
    abi: itemsCoreContractAbi,
    functionName: 'getItemMintCount',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `functionName` set to `"getNextItemId"`
 */
export const useReadItemsCoreContractGetNextItemId =
  /*#__PURE__*/ createUseReadContract({
    abi: itemsCoreContractAbi,
    functionName: 'getNextItemId',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `functionName` set to `"getNonFungibleTokenId"`
 */
export const useReadItemsCoreContractGetNonFungibleTokenId =
  /*#__PURE__*/ createUseReadContract({
    abi: itemsCoreContractAbi,
    functionName: 'getNonFungibleTokenId',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `functionName` set to `"getTokenTrait"`
 */
export const useReadItemsCoreContractGetTokenTrait =
  /*#__PURE__*/ createUseReadContract({
    abi: itemsCoreContractAbi,
    functionName: 'getTokenTrait',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `functionName` set to `"getTokenTraits"`
 */
export const useReadItemsCoreContractGetTokenTraits =
  /*#__PURE__*/ createUseReadContract({
    abi: itemsCoreContractAbi,
    functionName: 'getTokenTraits',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `functionName` set to `"getTokenUri"`
 */
export const useReadItemsCoreContractGetTokenUri =
  /*#__PURE__*/ createUseReadContract({
    abi: itemsCoreContractAbi,
    functionName: 'getTokenUri',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `functionName` set to `"isFungibleTokenId"`
 */
export const useReadItemsCoreContractIsFungibleTokenId =
  /*#__PURE__*/ createUseReadContract({
    abi: itemsCoreContractAbi,
    functionName: 'isFungibleTokenId',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `functionName` set to `"isItemFrozen"`
 */
export const useReadItemsCoreContractIsItemFrozen =
  /*#__PURE__*/ createUseReadContract({
    abi: itemsCoreContractAbi,
    functionName: 'isItemFrozen',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `functionName` set to `"items"`
 */
export const useReadItemsCoreContractItems =
  /*#__PURE__*/ createUseReadContract({
    abi: itemsCoreContractAbi,
    functionName: 'items',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `functionName` set to `"otomItems"`
 */
export const useReadItemsCoreContractOtomItems =
  /*#__PURE__*/ createUseReadContract({
    abi: itemsCoreContractAbi,
    functionName: 'otomItems',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `functionName` set to `"otoms"`
 */
export const useReadItemsCoreContractOtoms =
  /*#__PURE__*/ createUseReadContract({
    abi: itemsCoreContractAbi,
    functionName: 'otoms',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `functionName` set to `"owner"`
 */
export const useReadItemsCoreContractOwner =
  /*#__PURE__*/ createUseReadContract({
    abi: itemsCoreContractAbi,
    functionName: 'owner',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `functionName` set to `"pendingOwner"`
 */
export const useReadItemsCoreContractPendingOwner =
  /*#__PURE__*/ createUseReadContract({
    abi: itemsCoreContractAbi,
    functionName: 'pendingOwner',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `functionName` set to `"renderer"`
 */
export const useReadItemsCoreContractRenderer =
  /*#__PURE__*/ createUseReadContract({
    abi: itemsCoreContractAbi,
    functionName: 'renderer',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link itemsCoreContractAbi}__
 */
export const useWriteItemsCoreContract = /*#__PURE__*/ createUseWriteContract({
  abi: itemsCoreContractAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `functionName` set to `"acceptOwnership"`
 */
export const useWriteItemsCoreContractAcceptOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: itemsCoreContractAbi,
    functionName: 'acceptOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `functionName` set to `"consumeItem"`
 */
export const useWriteItemsCoreContractConsumeItem =
  /*#__PURE__*/ createUseWriteContract({
    abi: itemsCoreContractAbi,
    functionName: 'consumeItem',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `functionName` set to `"craftItem"`
 */
export const useWriteItemsCoreContractCraftItem =
  /*#__PURE__*/ createUseWriteContract({
    abi: itemsCoreContractAbi,
    functionName: 'craftItem',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `functionName` set to `"createFungibleItem"`
 */
export const useWriteItemsCoreContractCreateFungibleItem =
  /*#__PURE__*/ createUseWriteContract({
    abi: itemsCoreContractAbi,
    functionName: 'createFungibleItem',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `functionName` set to `"createNonFungibleItem"`
 */
export const useWriteItemsCoreContractCreateNonFungibleItem =
  /*#__PURE__*/ createUseWriteContract({
    abi: itemsCoreContractAbi,
    functionName: 'createNonFungibleItem',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `functionName` set to `"freezeItem"`
 */
export const useWriteItemsCoreContractFreezeItem =
  /*#__PURE__*/ createUseWriteContract({
    abi: itemsCoreContractAbi,
    functionName: 'freezeItem',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `functionName` set to `"initialize"`
 */
export const useWriteItemsCoreContractInitialize =
  /*#__PURE__*/ createUseWriteContract({
    abi: itemsCoreContractAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteItemsCoreContractRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: itemsCoreContractAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `functionName` set to `"setCreationEnabled"`
 */
export const useWriteItemsCoreContractSetCreationEnabled =
  /*#__PURE__*/ createUseWriteContract({
    abi: itemsCoreContractAbi,
    functionName: 'setCreationEnabled',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `functionName` set to `"setItemAdmin"`
 */
export const useWriteItemsCoreContractSetItemAdmin =
  /*#__PURE__*/ createUseWriteContract({
    abi: itemsCoreContractAbi,
    functionName: 'setItemAdmin',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `functionName` set to `"setOperator"`
 */
export const useWriteItemsCoreContractSetOperator =
  /*#__PURE__*/ createUseWriteContract({
    abi: itemsCoreContractAbi,
    functionName: 'setOperator',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `functionName` set to `"setOtomItems"`
 */
export const useWriteItemsCoreContractSetOtomItems =
  /*#__PURE__*/ createUseWriteContract({
    abi: itemsCoreContractAbi,
    functionName: 'setOtomItems',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `functionName` set to `"setRenderer"`
 */
export const useWriteItemsCoreContractSetRenderer =
  /*#__PURE__*/ createUseWriteContract({
    abi: itemsCoreContractAbi,
    functionName: 'setRenderer',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteItemsCoreContractTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: itemsCoreContractAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `functionName` set to `"updateFungibleItem"`
 */
export const useWriteItemsCoreContractUpdateFungibleItem =
  /*#__PURE__*/ createUseWriteContract({
    abi: itemsCoreContractAbi,
    functionName: 'updateFungibleItem',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `functionName` set to `"updateNonFungibleItem"`
 */
export const useWriteItemsCoreContractUpdateNonFungibleItem =
  /*#__PURE__*/ createUseWriteContract({
    abi: itemsCoreContractAbi,
    functionName: 'updateNonFungibleItem',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `functionName` set to `"useItem"`
 */
export const useWriteItemsCoreContractUseItem =
  /*#__PURE__*/ createUseWriteContract({
    abi: itemsCoreContractAbi,
    functionName: 'useItem',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link itemsCoreContractAbi}__
 */
export const useSimulateItemsCoreContract =
  /*#__PURE__*/ createUseSimulateContract({ abi: itemsCoreContractAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `functionName` set to `"acceptOwnership"`
 */
export const useSimulateItemsCoreContractAcceptOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: itemsCoreContractAbi,
    functionName: 'acceptOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `functionName` set to `"consumeItem"`
 */
export const useSimulateItemsCoreContractConsumeItem =
  /*#__PURE__*/ createUseSimulateContract({
    abi: itemsCoreContractAbi,
    functionName: 'consumeItem',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `functionName` set to `"craftItem"`
 */
export const useSimulateItemsCoreContractCraftItem =
  /*#__PURE__*/ createUseSimulateContract({
    abi: itemsCoreContractAbi,
    functionName: 'craftItem',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `functionName` set to `"createFungibleItem"`
 */
export const useSimulateItemsCoreContractCreateFungibleItem =
  /*#__PURE__*/ createUseSimulateContract({
    abi: itemsCoreContractAbi,
    functionName: 'createFungibleItem',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `functionName` set to `"createNonFungibleItem"`
 */
export const useSimulateItemsCoreContractCreateNonFungibleItem =
  /*#__PURE__*/ createUseSimulateContract({
    abi: itemsCoreContractAbi,
    functionName: 'createNonFungibleItem',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `functionName` set to `"freezeItem"`
 */
export const useSimulateItemsCoreContractFreezeItem =
  /*#__PURE__*/ createUseSimulateContract({
    abi: itemsCoreContractAbi,
    functionName: 'freezeItem',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `functionName` set to `"initialize"`
 */
export const useSimulateItemsCoreContractInitialize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: itemsCoreContractAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateItemsCoreContractRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: itemsCoreContractAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `functionName` set to `"setCreationEnabled"`
 */
export const useSimulateItemsCoreContractSetCreationEnabled =
  /*#__PURE__*/ createUseSimulateContract({
    abi: itemsCoreContractAbi,
    functionName: 'setCreationEnabled',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `functionName` set to `"setItemAdmin"`
 */
export const useSimulateItemsCoreContractSetItemAdmin =
  /*#__PURE__*/ createUseSimulateContract({
    abi: itemsCoreContractAbi,
    functionName: 'setItemAdmin',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `functionName` set to `"setOperator"`
 */
export const useSimulateItemsCoreContractSetOperator =
  /*#__PURE__*/ createUseSimulateContract({
    abi: itemsCoreContractAbi,
    functionName: 'setOperator',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `functionName` set to `"setOtomItems"`
 */
export const useSimulateItemsCoreContractSetOtomItems =
  /*#__PURE__*/ createUseSimulateContract({
    abi: itemsCoreContractAbi,
    functionName: 'setOtomItems',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `functionName` set to `"setRenderer"`
 */
export const useSimulateItemsCoreContractSetRenderer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: itemsCoreContractAbi,
    functionName: 'setRenderer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateItemsCoreContractTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: itemsCoreContractAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `functionName` set to `"updateFungibleItem"`
 */
export const useSimulateItemsCoreContractUpdateFungibleItem =
  /*#__PURE__*/ createUseSimulateContract({
    abi: itemsCoreContractAbi,
    functionName: 'updateFungibleItem',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `functionName` set to `"updateNonFungibleItem"`
 */
export const useSimulateItemsCoreContractUpdateNonFungibleItem =
  /*#__PURE__*/ createUseSimulateContract({
    abi: itemsCoreContractAbi,
    functionName: 'updateNonFungibleItem',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `functionName` set to `"useItem"`
 */
export const useSimulateItemsCoreContractUseItem =
  /*#__PURE__*/ createUseSimulateContract({
    abi: itemsCoreContractAbi,
    functionName: 'useItem',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link itemsCoreContractAbi}__
 */
export const useWatchItemsCoreContractEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: itemsCoreContractAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `eventName` set to `"CreationEnabledSet"`
 */
export const useWatchItemsCoreContractCreationEnabledSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: itemsCoreContractAbi,
    eventName: 'CreationEnabledSet',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `eventName` set to `"Initialized"`
 */
export const useWatchItemsCoreContractInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: itemsCoreContractAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `eventName` set to `"ItemCrafted"`
 */
export const useWatchItemsCoreContractItemCraftedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: itemsCoreContractAbi,
    eventName: 'ItemCrafted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `eventName` set to `"ItemCreated"`
 */
export const useWatchItemsCoreContractItemCreatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: itemsCoreContractAbi,
    eventName: 'ItemCreated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `eventName` set to `"ItemDestroyed"`
 */
export const useWatchItemsCoreContractItemDestroyedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: itemsCoreContractAbi,
    eventName: 'ItemDestroyed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `eventName` set to `"ItemFrozen"`
 */
export const useWatchItemsCoreContractItemFrozenEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: itemsCoreContractAbi,
    eventName: 'ItemFrozen',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `eventName` set to `"ItemUpdated"`
 */
export const useWatchItemsCoreContractItemUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: itemsCoreContractAbi,
    eventName: 'ItemUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `eventName` set to `"ItemUsed"`
 */
export const useWatchItemsCoreContractItemUsedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: itemsCoreContractAbi,
    eventName: 'ItemUsed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `eventName` set to `"OperatorSet"`
 */
export const useWatchItemsCoreContractOperatorSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: itemsCoreContractAbi,
    eventName: 'OperatorSet',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `eventName` set to `"OtomItemsSet"`
 */
export const useWatchItemsCoreContractOtomItemsSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: itemsCoreContractAbi,
    eventName: 'OtomItemsSet',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `eventName` set to `"OwnershipTransferStarted"`
 */
export const useWatchItemsCoreContractOwnershipTransferStartedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: itemsCoreContractAbi,
    eventName: 'OwnershipTransferStarted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchItemsCoreContractOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: itemsCoreContractAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `eventName` set to `"RendererSet"`
 */
export const useWatchItemsCoreContractRendererSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: itemsCoreContractAbi,
    eventName: 'RendererSet',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link itemsCoreContractAbi}__ and `eventName` set to `"TraitsUpdated"`
 */
export const useWatchItemsCoreContractTraitsUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: itemsCoreContractAbi,
    eventName: 'TraitsUpdated',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsCoreContractAbi}__
 */
export const useReadOtomsCoreContract = /*#__PURE__*/ createUseReadContract({
  abi: otomsCoreContractAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadOtomsCoreContractBalanceOf =
  /*#__PURE__*/ createUseReadContract({
    abi: otomsCoreContractAbi,
    functionName: 'balanceOf',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"balanceOfBatch"`
 */
export const useReadOtomsCoreContractBalanceOfBatch =
  /*#__PURE__*/ createUseReadContract({
    abi: otomsCoreContractAbi,
    functionName: 'balanceOfBatch',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"database"`
 */
export const useReadOtomsCoreContractDatabase =
  /*#__PURE__*/ createUseReadContract({
    abi: otomsCoreContractAbi,
    functionName: 'database',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"encoder"`
 */
export const useReadOtomsCoreContractEncoder =
  /*#__PURE__*/ createUseReadContract({
    abi: otomsCoreContractAbi,
    functionName: 'encoder',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"exists"`
 */
export const useReadOtomsCoreContractExists =
  /*#__PURE__*/ createUseReadContract({
    abi: otomsCoreContractAbi,
    functionName: 'exists',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"getMiningNonce"`
 */
export const useReadOtomsCoreContractGetMiningNonce =
  /*#__PURE__*/ createUseReadContract({
    abi: otomsCoreContractAbi,
    functionName: 'getMiningNonce',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"isApprovedForAll"`
 */
export const useReadOtomsCoreContractIsApprovedForAll =
  /*#__PURE__*/ createUseReadContract({
    abi: otomsCoreContractAbi,
    functionName: 'isApprovedForAll',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"minesDepleted"`
 */
export const useReadOtomsCoreContractMinesDepleted =
  /*#__PURE__*/ createUseReadContract({
    abi: otomsCoreContractAbi,
    functionName: 'minesDepleted',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"miningLimit"`
 */
export const useReadOtomsCoreContractMiningLimit =
  /*#__PURE__*/ createUseReadContract({
    abi: otomsCoreContractAbi,
    functionName: 'miningLimit',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"moleculeIsAtom"`
 */
export const useReadOtomsCoreContractMoleculeIsAtom =
  /*#__PURE__*/ createUseReadContract({
    abi: otomsCoreContractAbi,
    functionName: 'moleculeIsAtom',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"operators"`
 */
export const useReadOtomsCoreContractOperators =
  /*#__PURE__*/ createUseReadContract({
    abi: otomsCoreContractAbi,
    functionName: 'operators',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"owner"`
 */
export const useReadOtomsCoreContractOwner =
  /*#__PURE__*/ createUseReadContract({
    abi: otomsCoreContractAbi,
    functionName: 'owner',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"pendingOwner"`
 */
export const useReadOtomsCoreContractPendingOwner =
  /*#__PURE__*/ createUseReadContract({
    abi: otomsCoreContractAbi,
    functionName: 'pendingOwner',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadOtomsCoreContractSupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: otomsCoreContractAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"totalSupply"`
 */
export const useReadOtomsCoreContractTotalSupply =
  /*#__PURE__*/ createUseReadContract({
    abi: otomsCoreContractAbi,
    functionName: 'totalSupply',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"uri"`
 */
export const useReadOtomsCoreContractUri = /*#__PURE__*/ createUseReadContract({
  abi: otomsCoreContractAbi,
  functionName: 'uri',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsCoreContractAbi}__
 */
export const useWriteOtomsCoreContract = /*#__PURE__*/ createUseWriteContract({
  abi: otomsCoreContractAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"acceptOwnership"`
 */
export const useWriteOtomsCoreContractAcceptOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: otomsCoreContractAbi,
    functionName: 'acceptOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"annihilate"`
 */
export const useWriteOtomsCoreContractAnnihilate =
  /*#__PURE__*/ createUseWriteContract({
    abi: otomsCoreContractAbi,
    functionName: 'annihilate',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"handleReactionResult"`
 */
export const useWriteOtomsCoreContractHandleReactionResult =
  /*#__PURE__*/ createUseWriteContract({
    abi: otomsCoreContractAbi,
    functionName: 'handleReactionResult',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"initialize"`
 */
export const useWriteOtomsCoreContractInitialize =
  /*#__PURE__*/ createUseWriteContract({
    abi: otomsCoreContractAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"mine"`
 */
export const useWriteOtomsCoreContractMine =
  /*#__PURE__*/ createUseWriteContract({
    abi: otomsCoreContractAbi,
    functionName: 'mine',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteOtomsCoreContractRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: otomsCoreContractAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"safeBatchTransferFrom"`
 */
export const useWriteOtomsCoreContractSafeBatchTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: otomsCoreContractAbi,
    functionName: 'safeBatchTransferFrom',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useWriteOtomsCoreContractSafeTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: otomsCoreContractAbi,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"seedUniverse"`
 */
export const useWriteOtomsCoreContractSeedUniverse =
  /*#__PURE__*/ createUseWriteContract({
    abi: otomsCoreContractAbi,
    functionName: 'seedUniverse',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useWriteOtomsCoreContractSetApprovalForAll =
  /*#__PURE__*/ createUseWriteContract({
    abi: otomsCoreContractAbi,
    functionName: 'setApprovalForAll',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"setEncoder"`
 */
export const useWriteOtomsCoreContractSetEncoder =
  /*#__PURE__*/ createUseWriteContract({
    abi: otomsCoreContractAbi,
    functionName: 'setEncoder',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"setMinesDepleted"`
 */
export const useWriteOtomsCoreContractSetMinesDepleted =
  /*#__PURE__*/ createUseWriteContract({
    abi: otomsCoreContractAbi,
    functionName: 'setMinesDepleted',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"setMiningLimit"`
 */
export const useWriteOtomsCoreContractSetMiningLimit =
  /*#__PURE__*/ createUseWriteContract({
    abi: otomsCoreContractAbi,
    functionName: 'setMiningLimit',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"setSigner"`
 */
export const useWriteOtomsCoreContractSetSigner =
  /*#__PURE__*/ createUseWriteContract({
    abi: otomsCoreContractAbi,
    functionName: 'setSigner',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"toggleOperator"`
 */
export const useWriteOtomsCoreContractToggleOperator =
  /*#__PURE__*/ createUseWriteContract({
    abi: otomsCoreContractAbi,
    functionName: 'toggleOperator',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteOtomsCoreContractTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: otomsCoreContractAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsCoreContractAbi}__
 */
export const useSimulateOtomsCoreContract =
  /*#__PURE__*/ createUseSimulateContract({ abi: otomsCoreContractAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"acceptOwnership"`
 */
export const useSimulateOtomsCoreContractAcceptOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: otomsCoreContractAbi,
    functionName: 'acceptOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"annihilate"`
 */
export const useSimulateOtomsCoreContractAnnihilate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: otomsCoreContractAbi,
    functionName: 'annihilate',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"handleReactionResult"`
 */
export const useSimulateOtomsCoreContractHandleReactionResult =
  /*#__PURE__*/ createUseSimulateContract({
    abi: otomsCoreContractAbi,
    functionName: 'handleReactionResult',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"initialize"`
 */
export const useSimulateOtomsCoreContractInitialize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: otomsCoreContractAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"mine"`
 */
export const useSimulateOtomsCoreContractMine =
  /*#__PURE__*/ createUseSimulateContract({
    abi: otomsCoreContractAbi,
    functionName: 'mine',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateOtomsCoreContractRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: otomsCoreContractAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"safeBatchTransferFrom"`
 */
export const useSimulateOtomsCoreContractSafeBatchTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: otomsCoreContractAbi,
    functionName: 'safeBatchTransferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useSimulateOtomsCoreContractSafeTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: otomsCoreContractAbi,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"seedUniverse"`
 */
export const useSimulateOtomsCoreContractSeedUniverse =
  /*#__PURE__*/ createUseSimulateContract({
    abi: otomsCoreContractAbi,
    functionName: 'seedUniverse',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useSimulateOtomsCoreContractSetApprovalForAll =
  /*#__PURE__*/ createUseSimulateContract({
    abi: otomsCoreContractAbi,
    functionName: 'setApprovalForAll',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"setEncoder"`
 */
export const useSimulateOtomsCoreContractSetEncoder =
  /*#__PURE__*/ createUseSimulateContract({
    abi: otomsCoreContractAbi,
    functionName: 'setEncoder',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"setMinesDepleted"`
 */
export const useSimulateOtomsCoreContractSetMinesDepleted =
  /*#__PURE__*/ createUseSimulateContract({
    abi: otomsCoreContractAbi,
    functionName: 'setMinesDepleted',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"setMiningLimit"`
 */
export const useSimulateOtomsCoreContractSetMiningLimit =
  /*#__PURE__*/ createUseSimulateContract({
    abi: otomsCoreContractAbi,
    functionName: 'setMiningLimit',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"setSigner"`
 */
export const useSimulateOtomsCoreContractSetSigner =
  /*#__PURE__*/ createUseSimulateContract({
    abi: otomsCoreContractAbi,
    functionName: 'setSigner',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"toggleOperator"`
 */
export const useSimulateOtomsCoreContractToggleOperator =
  /*#__PURE__*/ createUseSimulateContract({
    abi: otomsCoreContractAbi,
    functionName: 'toggleOperator',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateOtomsCoreContractTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: otomsCoreContractAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link otomsCoreContractAbi}__
 */
export const useWatchOtomsCoreContractEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: otomsCoreContractAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `eventName` set to `"ApprovalForAll"`
 */
export const useWatchOtomsCoreContractApprovalForAllEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: otomsCoreContractAbi,
    eventName: 'ApprovalForAll',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `eventName` set to `"EncoderUpdated"`
 */
export const useWatchOtomsCoreContractEncoderUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: otomsCoreContractAbi,
    eventName: 'EncoderUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `eventName` set to `"Initialized"`
 */
export const useWatchOtomsCoreContractInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: otomsCoreContractAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `eventName` set to `"MinesDepletedSet"`
 */
export const useWatchOtomsCoreContractMinesDepletedSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: otomsCoreContractAbi,
    eventName: 'MinesDepletedSet',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `eventName` set to `"MiningLimitSet"`
 */
export const useWatchOtomsCoreContractMiningLimitSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: otomsCoreContractAbi,
    eventName: 'MiningLimitSet',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `eventName` set to `"OperatorToggled"`
 */
export const useWatchOtomsCoreContractOperatorToggledEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: otomsCoreContractAbi,
    eventName: 'OperatorToggled',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `eventName` set to `"OtomMined"`
 */
export const useWatchOtomsCoreContractOtomMinedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: otomsCoreContractAbi,
    eventName: 'OtomMined',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `eventName` set to `"OwnershipTransferStarted"`
 */
export const useWatchOtomsCoreContractOwnershipTransferStartedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: otomsCoreContractAbi,
    eventName: 'OwnershipTransferStarted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchOtomsCoreContractOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: otomsCoreContractAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `eventName` set to `"SignerSet"`
 */
export const useWatchOtomsCoreContractSignerSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: otomsCoreContractAbi,
    eventName: 'SignerSet',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `eventName` set to `"TransferBatch"`
 */
export const useWatchOtomsCoreContractTransferBatchEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: otomsCoreContractAbi,
    eventName: 'TransferBatch',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `eventName` set to `"TransferSingle"`
 */
export const useWatchOtomsCoreContractTransferSingleEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: otomsCoreContractAbi,
    eventName: 'TransferSingle',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link otomsCoreContractAbi}__ and `eventName` set to `"URI"`
 */
export const useWatchOtomsCoreContractUriEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: otomsCoreContractAbi,
    eventName: 'URI',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__
 */
export const useReadOtomsDatabaseContract = /*#__PURE__*/ createUseReadContract(
  { abi: otomsDatabaseContractAbi },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"activeUniverses"`
 */
export const useReadOtomsDatabaseContractActiveUniverses =
  /*#__PURE__*/ createUseReadContract({
    abi: otomsDatabaseContractAbi,
    functionName: 'activeUniverses',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"encoder"`
 */
export const useReadOtomsDatabaseContractEncoder =
  /*#__PURE__*/ createUseReadContract({
    abi: otomsDatabaseContractAbi,
    functionName: 'encoder',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"getMoleculeByMoleculeId"`
 */
export const useReadOtomsDatabaseContractGetMoleculeByMoleculeId =
  /*#__PURE__*/ createUseReadContract({
    abi: otomsDatabaseContractAbi,
    functionName: 'getMoleculeByMoleculeId',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"getMoleculeByTokenId"`
 */
export const useReadOtomsDatabaseContractGetMoleculeByTokenId =
  /*#__PURE__*/ createUseReadContract({
    abi: otomsDatabaseContractAbi,
    functionName: 'getMoleculeByTokenId',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"getMoleculesDiscovered"`
 */
export const useReadOtomsDatabaseContractGetMoleculesDiscovered =
  /*#__PURE__*/ createUseReadContract({
    abi: otomsDatabaseContractAbi,
    functionName: 'getMoleculesDiscovered',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"getMoleculesDiscoveredPaginated"`
 */
export const useReadOtomsDatabaseContractGetMoleculesDiscoveredPaginated =
  /*#__PURE__*/ createUseReadContract({
    abi: otomsDatabaseContractAbi,
    functionName: 'getMoleculesDiscoveredPaginated',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"getUniverseInformation"`
 */
export const useReadOtomsDatabaseContractGetUniverseInformation =
  /*#__PURE__*/ createUseReadContract({
    abi: otomsDatabaseContractAbi,
    functionName: 'getUniverseInformation',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"idToTokenId"`
 */
export const useReadOtomsDatabaseContractIdToTokenId =
  /*#__PURE__*/ createUseReadContract({
    abi: otomsDatabaseContractAbi,
    functionName: 'idToTokenId',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"knownUniverses"`
 */
export const useReadOtomsDatabaseContractKnownUniverses =
  /*#__PURE__*/ createUseReadContract({
    abi: otomsDatabaseContractAbi,
    functionName: 'knownUniverses',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"moleculeDiscoveredBy"`
 */
export const useReadOtomsDatabaseContractMoleculeDiscoveredBy =
  /*#__PURE__*/ createUseReadContract({
    abi: otomsDatabaseContractAbi,
    functionName: 'moleculeDiscoveredBy',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"moleculesDiscovered"`
 */
export const useReadOtomsDatabaseContractMoleculesDiscovered =
  /*#__PURE__*/ createUseReadContract({
    abi: otomsDatabaseContractAbi,
    functionName: 'moleculesDiscovered',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"operators"`
 */
export const useReadOtomsDatabaseContractOperators =
  /*#__PURE__*/ createUseReadContract({
    abi: otomsDatabaseContractAbi,
    functionName: 'operators',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"owner"`
 */
export const useReadOtomsDatabaseContractOwner =
  /*#__PURE__*/ createUseReadContract({
    abi: otomsDatabaseContractAbi,
    functionName: 'owner',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"pendingOwner"`
 */
export const useReadOtomsDatabaseContractPendingOwner =
  /*#__PURE__*/ createUseReadContract({
    abi: otomsDatabaseContractAbi,
    functionName: 'pendingOwner',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"takenUniverseNames"`
 */
export const useReadOtomsDatabaseContractTakenUniverseNames =
  /*#__PURE__*/ createUseReadContract({
    abi: otomsDatabaseContractAbi,
    functionName: 'takenUniverseNames',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"tokenURI"`
 */
export const useReadOtomsDatabaseContractTokenUri =
  /*#__PURE__*/ createUseReadContract({
    abi: otomsDatabaseContractAbi,
    functionName: 'tokenURI',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"universeInformation"`
 */
export const useReadOtomsDatabaseContractUniverseInformation =
  /*#__PURE__*/ createUseReadContract({
    abi: otomsDatabaseContractAbi,
    functionName: 'universeInformation',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__
 */
export const useWriteOtomsDatabaseContract =
  /*#__PURE__*/ createUseWriteContract({ abi: otomsDatabaseContractAbi })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"acceptOwnership"`
 */
export const useWriteOtomsDatabaseContractAcceptOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: otomsDatabaseContractAbi,
    functionName: 'acceptOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"initialize"`
 */
export const useWriteOtomsDatabaseContractInitialize =
  /*#__PURE__*/ createUseWriteContract({
    abi: otomsDatabaseContractAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"maybeMarkMoleculeAsDiscovered"`
 */
export const useWriteOtomsDatabaseContractMaybeMarkMoleculeAsDiscovered =
  /*#__PURE__*/ createUseWriteContract({
    abi: otomsDatabaseContractAbi,
    functionName: 'maybeMarkMoleculeAsDiscovered',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteOtomsDatabaseContractRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: otomsDatabaseContractAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"setEncoder"`
 */
export const useWriteOtomsDatabaseContractSetEncoder =
  /*#__PURE__*/ createUseWriteContract({
    abi: otomsDatabaseContractAbi,
    functionName: 'setEncoder',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"setUniverseInformation"`
 */
export const useWriteOtomsDatabaseContractSetUniverseInformation =
  /*#__PURE__*/ createUseWriteContract({
    abi: otomsDatabaseContractAbi,
    functionName: 'setUniverseInformation',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"toggleOperator"`
 */
export const useWriteOtomsDatabaseContractToggleOperator =
  /*#__PURE__*/ createUseWriteContract({
    abi: otomsDatabaseContractAbi,
    functionName: 'toggleOperator',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"toggleUniverseActive"`
 */
export const useWriteOtomsDatabaseContractToggleUniverseActive =
  /*#__PURE__*/ createUseWriteContract({
    abi: otomsDatabaseContractAbi,
    functionName: 'toggleUniverseActive',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteOtomsDatabaseContractTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: otomsDatabaseContractAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"updateMolecule"`
 */
export const useWriteOtomsDatabaseContractUpdateMolecule =
  /*#__PURE__*/ createUseWriteContract({
    abi: otomsDatabaseContractAbi,
    functionName: 'updateMolecule',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"updateTokenURI"`
 */
export const useWriteOtomsDatabaseContractUpdateTokenUri =
  /*#__PURE__*/ createUseWriteContract({
    abi: otomsDatabaseContractAbi,
    functionName: 'updateTokenURI',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__
 */
export const useSimulateOtomsDatabaseContract =
  /*#__PURE__*/ createUseSimulateContract({ abi: otomsDatabaseContractAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"acceptOwnership"`
 */
export const useSimulateOtomsDatabaseContractAcceptOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: otomsDatabaseContractAbi,
    functionName: 'acceptOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"initialize"`
 */
export const useSimulateOtomsDatabaseContractInitialize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: otomsDatabaseContractAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"maybeMarkMoleculeAsDiscovered"`
 */
export const useSimulateOtomsDatabaseContractMaybeMarkMoleculeAsDiscovered =
  /*#__PURE__*/ createUseSimulateContract({
    abi: otomsDatabaseContractAbi,
    functionName: 'maybeMarkMoleculeAsDiscovered',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateOtomsDatabaseContractRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: otomsDatabaseContractAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"setEncoder"`
 */
export const useSimulateOtomsDatabaseContractSetEncoder =
  /*#__PURE__*/ createUseSimulateContract({
    abi: otomsDatabaseContractAbi,
    functionName: 'setEncoder',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"setUniverseInformation"`
 */
export const useSimulateOtomsDatabaseContractSetUniverseInformation =
  /*#__PURE__*/ createUseSimulateContract({
    abi: otomsDatabaseContractAbi,
    functionName: 'setUniverseInformation',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"toggleOperator"`
 */
export const useSimulateOtomsDatabaseContractToggleOperator =
  /*#__PURE__*/ createUseSimulateContract({
    abi: otomsDatabaseContractAbi,
    functionName: 'toggleOperator',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"toggleUniverseActive"`
 */
export const useSimulateOtomsDatabaseContractToggleUniverseActive =
  /*#__PURE__*/ createUseSimulateContract({
    abi: otomsDatabaseContractAbi,
    functionName: 'toggleUniverseActive',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateOtomsDatabaseContractTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: otomsDatabaseContractAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"updateMolecule"`
 */
export const useSimulateOtomsDatabaseContractUpdateMolecule =
  /*#__PURE__*/ createUseSimulateContract({
    abi: otomsDatabaseContractAbi,
    functionName: 'updateMolecule',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `functionName` set to `"updateTokenURI"`
 */
export const useSimulateOtomsDatabaseContractUpdateTokenUri =
  /*#__PURE__*/ createUseSimulateContract({
    abi: otomsDatabaseContractAbi,
    functionName: 'updateTokenURI',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link otomsDatabaseContractAbi}__
 */
export const useWatchOtomsDatabaseContractEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: otomsDatabaseContractAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `eventName` set to `"EncoderUpdated"`
 */
export const useWatchOtomsDatabaseContractEncoderUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: otomsDatabaseContractAbi,
    eventName: 'EncoderUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `eventName` set to `"Initialized"`
 */
export const useWatchOtomsDatabaseContractInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: otomsDatabaseContractAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `eventName` set to `"MetadataUpdate"`
 */
export const useWatchOtomsDatabaseContractMetadataUpdateEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: otomsDatabaseContractAbi,
    eventName: 'MetadataUpdate',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `eventName` set to `"MoleculeDiscovered"`
 */
export const useWatchOtomsDatabaseContractMoleculeDiscoveredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: otomsDatabaseContractAbi,
    eventName: 'MoleculeDiscovered',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `eventName` set to `"OperatorToggled"`
 */
export const useWatchOtomsDatabaseContractOperatorToggledEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: otomsDatabaseContractAbi,
    eventName: 'OperatorToggled',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `eventName` set to `"OwnershipTransferStarted"`
 */
export const useWatchOtomsDatabaseContractOwnershipTransferStartedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: otomsDatabaseContractAbi,
    eventName: 'OwnershipTransferStarted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchOtomsDatabaseContractOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: otomsDatabaseContractAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link otomsDatabaseContractAbi}__ and `eventName` set to `"UniverseActiveToggled"`
 */
export const useWatchOtomsDatabaseContractUniverseActiveToggledEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: otomsDatabaseContractAbi,
    eventName: 'UniverseActiveToggled',
  })
