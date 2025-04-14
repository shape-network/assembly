import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// OtomsContract
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const otomsContractAbi = [
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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsContractAbi}__
 */
export const useReadOtomsContract = /*#__PURE__*/ createUseReadContract({
  abi: otomsContractAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsContractAbi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadOtomsContractBalanceOf =
  /*#__PURE__*/ createUseReadContract({
    abi: otomsContractAbi,
    functionName: 'balanceOf',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsContractAbi}__ and `functionName` set to `"balanceOfBatch"`
 */
export const useReadOtomsContractBalanceOfBatch =
  /*#__PURE__*/ createUseReadContract({
    abi: otomsContractAbi,
    functionName: 'balanceOfBatch',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsContractAbi}__ and `functionName` set to `"database"`
 */
export const useReadOtomsContractDatabase = /*#__PURE__*/ createUseReadContract(
  { abi: otomsContractAbi, functionName: 'database' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsContractAbi}__ and `functionName` set to `"encoder"`
 */
export const useReadOtomsContractEncoder = /*#__PURE__*/ createUseReadContract({
  abi: otomsContractAbi,
  functionName: 'encoder',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsContractAbi}__ and `functionName` set to `"exists"`
 */
export const useReadOtomsContractExists = /*#__PURE__*/ createUseReadContract({
  abi: otomsContractAbi,
  functionName: 'exists',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsContractAbi}__ and `functionName` set to `"getMiningNonce"`
 */
export const useReadOtomsContractGetMiningNonce =
  /*#__PURE__*/ createUseReadContract({
    abi: otomsContractAbi,
    functionName: 'getMiningNonce',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsContractAbi}__ and `functionName` set to `"isApprovedForAll"`
 */
export const useReadOtomsContractIsApprovedForAll =
  /*#__PURE__*/ createUseReadContract({
    abi: otomsContractAbi,
    functionName: 'isApprovedForAll',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsContractAbi}__ and `functionName` set to `"minesDepleted"`
 */
export const useReadOtomsContractMinesDepleted =
  /*#__PURE__*/ createUseReadContract({
    abi: otomsContractAbi,
    functionName: 'minesDepleted',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsContractAbi}__ and `functionName` set to `"miningLimit"`
 */
export const useReadOtomsContractMiningLimit =
  /*#__PURE__*/ createUseReadContract({
    abi: otomsContractAbi,
    functionName: 'miningLimit',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsContractAbi}__ and `functionName` set to `"moleculeIsAtom"`
 */
export const useReadOtomsContractMoleculeIsAtom =
  /*#__PURE__*/ createUseReadContract({
    abi: otomsContractAbi,
    functionName: 'moleculeIsAtom',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsContractAbi}__ and `functionName` set to `"operators"`
 */
export const useReadOtomsContractOperators =
  /*#__PURE__*/ createUseReadContract({
    abi: otomsContractAbi,
    functionName: 'operators',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsContractAbi}__ and `functionName` set to `"owner"`
 */
export const useReadOtomsContractOwner = /*#__PURE__*/ createUseReadContract({
  abi: otomsContractAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsContractAbi}__ and `functionName` set to `"pendingOwner"`
 */
export const useReadOtomsContractPendingOwner =
  /*#__PURE__*/ createUseReadContract({
    abi: otomsContractAbi,
    functionName: 'pendingOwner',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsContractAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadOtomsContractSupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: otomsContractAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsContractAbi}__ and `functionName` set to `"totalSupply"`
 */
export const useReadOtomsContractTotalSupply =
  /*#__PURE__*/ createUseReadContract({
    abi: otomsContractAbi,
    functionName: 'totalSupply',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link otomsContractAbi}__ and `functionName` set to `"uri"`
 */
export const useReadOtomsContractUri = /*#__PURE__*/ createUseReadContract({
  abi: otomsContractAbi,
  functionName: 'uri',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsContractAbi}__
 */
export const useWriteOtomsContract = /*#__PURE__*/ createUseWriteContract({
  abi: otomsContractAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsContractAbi}__ and `functionName` set to `"acceptOwnership"`
 */
export const useWriteOtomsContractAcceptOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: otomsContractAbi,
    functionName: 'acceptOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsContractAbi}__ and `functionName` set to `"annihilate"`
 */
export const useWriteOtomsContractAnnihilate =
  /*#__PURE__*/ createUseWriteContract({
    abi: otomsContractAbi,
    functionName: 'annihilate',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsContractAbi}__ and `functionName` set to `"handleReactionResult"`
 */
export const useWriteOtomsContractHandleReactionResult =
  /*#__PURE__*/ createUseWriteContract({
    abi: otomsContractAbi,
    functionName: 'handleReactionResult',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsContractAbi}__ and `functionName` set to `"initialize"`
 */
export const useWriteOtomsContractInitialize =
  /*#__PURE__*/ createUseWriteContract({
    abi: otomsContractAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsContractAbi}__ and `functionName` set to `"mine"`
 */
export const useWriteOtomsContractMine = /*#__PURE__*/ createUseWriteContract({
  abi: otomsContractAbi,
  functionName: 'mine',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsContractAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteOtomsContractRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: otomsContractAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsContractAbi}__ and `functionName` set to `"safeBatchTransferFrom"`
 */
export const useWriteOtomsContractSafeBatchTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: otomsContractAbi,
    functionName: 'safeBatchTransferFrom',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsContractAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useWriteOtomsContractSafeTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: otomsContractAbi,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsContractAbi}__ and `functionName` set to `"seedUniverse"`
 */
export const useWriteOtomsContractSeedUniverse =
  /*#__PURE__*/ createUseWriteContract({
    abi: otomsContractAbi,
    functionName: 'seedUniverse',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsContractAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useWriteOtomsContractSetApprovalForAll =
  /*#__PURE__*/ createUseWriteContract({
    abi: otomsContractAbi,
    functionName: 'setApprovalForAll',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsContractAbi}__ and `functionName` set to `"setEncoder"`
 */
export const useWriteOtomsContractSetEncoder =
  /*#__PURE__*/ createUseWriteContract({
    abi: otomsContractAbi,
    functionName: 'setEncoder',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsContractAbi}__ and `functionName` set to `"setMinesDepleted"`
 */
export const useWriteOtomsContractSetMinesDepleted =
  /*#__PURE__*/ createUseWriteContract({
    abi: otomsContractAbi,
    functionName: 'setMinesDepleted',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsContractAbi}__ and `functionName` set to `"setMiningLimit"`
 */
export const useWriteOtomsContractSetMiningLimit =
  /*#__PURE__*/ createUseWriteContract({
    abi: otomsContractAbi,
    functionName: 'setMiningLimit',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsContractAbi}__ and `functionName` set to `"setSigner"`
 */
export const useWriteOtomsContractSetSigner =
  /*#__PURE__*/ createUseWriteContract({
    abi: otomsContractAbi,
    functionName: 'setSigner',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsContractAbi}__ and `functionName` set to `"toggleOperator"`
 */
export const useWriteOtomsContractToggleOperator =
  /*#__PURE__*/ createUseWriteContract({
    abi: otomsContractAbi,
    functionName: 'toggleOperator',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link otomsContractAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteOtomsContractTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: otomsContractAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsContractAbi}__
 */
export const useSimulateOtomsContract = /*#__PURE__*/ createUseSimulateContract(
  { abi: otomsContractAbi },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsContractAbi}__ and `functionName` set to `"acceptOwnership"`
 */
export const useSimulateOtomsContractAcceptOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: otomsContractAbi,
    functionName: 'acceptOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsContractAbi}__ and `functionName` set to `"annihilate"`
 */
export const useSimulateOtomsContractAnnihilate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: otomsContractAbi,
    functionName: 'annihilate',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsContractAbi}__ and `functionName` set to `"handleReactionResult"`
 */
export const useSimulateOtomsContractHandleReactionResult =
  /*#__PURE__*/ createUseSimulateContract({
    abi: otomsContractAbi,
    functionName: 'handleReactionResult',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsContractAbi}__ and `functionName` set to `"initialize"`
 */
export const useSimulateOtomsContractInitialize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: otomsContractAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsContractAbi}__ and `functionName` set to `"mine"`
 */
export const useSimulateOtomsContractMine =
  /*#__PURE__*/ createUseSimulateContract({
    abi: otomsContractAbi,
    functionName: 'mine',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsContractAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateOtomsContractRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: otomsContractAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsContractAbi}__ and `functionName` set to `"safeBatchTransferFrom"`
 */
export const useSimulateOtomsContractSafeBatchTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: otomsContractAbi,
    functionName: 'safeBatchTransferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsContractAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useSimulateOtomsContractSafeTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: otomsContractAbi,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsContractAbi}__ and `functionName` set to `"seedUniverse"`
 */
export const useSimulateOtomsContractSeedUniverse =
  /*#__PURE__*/ createUseSimulateContract({
    abi: otomsContractAbi,
    functionName: 'seedUniverse',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsContractAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useSimulateOtomsContractSetApprovalForAll =
  /*#__PURE__*/ createUseSimulateContract({
    abi: otomsContractAbi,
    functionName: 'setApprovalForAll',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsContractAbi}__ and `functionName` set to `"setEncoder"`
 */
export const useSimulateOtomsContractSetEncoder =
  /*#__PURE__*/ createUseSimulateContract({
    abi: otomsContractAbi,
    functionName: 'setEncoder',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsContractAbi}__ and `functionName` set to `"setMinesDepleted"`
 */
export const useSimulateOtomsContractSetMinesDepleted =
  /*#__PURE__*/ createUseSimulateContract({
    abi: otomsContractAbi,
    functionName: 'setMinesDepleted',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsContractAbi}__ and `functionName` set to `"setMiningLimit"`
 */
export const useSimulateOtomsContractSetMiningLimit =
  /*#__PURE__*/ createUseSimulateContract({
    abi: otomsContractAbi,
    functionName: 'setMiningLimit',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsContractAbi}__ and `functionName` set to `"setSigner"`
 */
export const useSimulateOtomsContractSetSigner =
  /*#__PURE__*/ createUseSimulateContract({
    abi: otomsContractAbi,
    functionName: 'setSigner',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsContractAbi}__ and `functionName` set to `"toggleOperator"`
 */
export const useSimulateOtomsContractToggleOperator =
  /*#__PURE__*/ createUseSimulateContract({
    abi: otomsContractAbi,
    functionName: 'toggleOperator',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link otomsContractAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateOtomsContractTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: otomsContractAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link otomsContractAbi}__
 */
export const useWatchOtomsContractEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: otomsContractAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link otomsContractAbi}__ and `eventName` set to `"ApprovalForAll"`
 */
export const useWatchOtomsContractApprovalForAllEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: otomsContractAbi,
    eventName: 'ApprovalForAll',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link otomsContractAbi}__ and `eventName` set to `"EncoderUpdated"`
 */
export const useWatchOtomsContractEncoderUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: otomsContractAbi,
    eventName: 'EncoderUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link otomsContractAbi}__ and `eventName` set to `"Initialized"`
 */
export const useWatchOtomsContractInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: otomsContractAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link otomsContractAbi}__ and `eventName` set to `"MinesDepletedSet"`
 */
export const useWatchOtomsContractMinesDepletedSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: otomsContractAbi,
    eventName: 'MinesDepletedSet',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link otomsContractAbi}__ and `eventName` set to `"MiningLimitSet"`
 */
export const useWatchOtomsContractMiningLimitSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: otomsContractAbi,
    eventName: 'MiningLimitSet',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link otomsContractAbi}__ and `eventName` set to `"OperatorToggled"`
 */
export const useWatchOtomsContractOperatorToggledEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: otomsContractAbi,
    eventName: 'OperatorToggled',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link otomsContractAbi}__ and `eventName` set to `"OtomMined"`
 */
export const useWatchOtomsContractOtomMinedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: otomsContractAbi,
    eventName: 'OtomMined',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link otomsContractAbi}__ and `eventName` set to `"OwnershipTransferStarted"`
 */
export const useWatchOtomsContractOwnershipTransferStartedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: otomsContractAbi,
    eventName: 'OwnershipTransferStarted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link otomsContractAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchOtomsContractOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: otomsContractAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link otomsContractAbi}__ and `eventName` set to `"SignerSet"`
 */
export const useWatchOtomsContractSignerSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: otomsContractAbi,
    eventName: 'SignerSet',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link otomsContractAbi}__ and `eventName` set to `"TransferBatch"`
 */
export const useWatchOtomsContractTransferBatchEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: otomsContractAbi,
    eventName: 'TransferBatch',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link otomsContractAbi}__ and `eventName` set to `"TransferSingle"`
 */
export const useWatchOtomsContractTransferSingleEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: otomsContractAbi,
    eventName: 'TransferSingle',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link otomsContractAbi}__ and `eventName` set to `"URI"`
 */
export const useWatchOtomsContractUriEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: otomsContractAbi,
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
