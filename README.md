# Assembly (Otom Items)

## Overview

The Otom Items system is a flexible ERC1155 implementation enabling the creation, crafting, and management of both fungible and non-fungible items on the blockchain. Built with upgradeability in mind, the system allows for component-based crafting where items can be created using blueprints that define required components with specific properties.

### Key Components

- **OtomItems**: Main ERC1155 token contract that implements the token standard and handles token operations
- **OtomItemsCore**: Manages item definitions, crafting logic, and item usage behaviors
- **OtomItemsTracking**: Tracks ownership and supplies of items without requiring an offchain indexer, which is usually required for ERC1155 contracts

## Item Types

The system supports two primary item types:

1. **Fungible Items**: Standard fungible tokens that stack in inventory, useful for resources or consumables that have all identical properties at all times e.g. bricks, oak logs, gold ore
2. **Non-Fungible Items**: Unique items that can have tiers (1-7) and dynamic properties, suitable for equipment or collectibles where each instance of an item could have different properties at any given time e.g. a car with differing amounts of fuel in the tank

## Item and Token ID System

The Otom Items system uses two ID types to track items and their instances:

- **Item IDs**: Sequential identifiers that represent item definitions or blueprints. Each distinct item type (like "Steel Sword" or "Health Potion") has a unique item ID assigned when it's created. Item IDs define what an item is, including its blueprint requirements, traits, and behaviors.
- **Token IDs**: ERC1155 token identifiers that represent specific instances or quantities of items owned by users. For fungible items, the token ID == item ID, as all instances are identical. For non-fungible items, each crafted instance receives a unique token ID that maps back to its parent item ID. The system maintains this mapping through `getItemIdForToken()`. Non-fungible tokens also store tier information and the actual components used in crafting, enabling dynamic properties based on crafting input. Practically, token IDs are derived by concatenating the item id and the mint count of that item

The system uses a specific function `getNonFungibleTokenId(itemId, mintIndex)` to generate token IDs for non-fungible items:

```
function getNonFungibleTokenId(uint256 itemId, uint256 mintIndex) {
    return (uint256(keccak256(abi.encodePacked(itemId, mintIndex))) % 2 ** 128) + 2 ** 128;
}

```

This function creates a unique token ID by hashing the item ID and mint index together, then ensuring the result is above 2^128. This approach guarantees that:

1. Each non-fungible token has a unique ID
2. The token ID range is distinct from fungible tokens (all non-fungible token IDs are greater than 2^128), and all fungible token ids are less than 2^128
3. ID collisions are prevented by the cryptographic properties of keccak256 hashing, which creates a unique output for each unique (itemId, mintIndex) pair

## Blueprint System

Items are defined by blueprints that specify:

- Required components (Otoms, variable Otoms, or other items)
- Property criteria that components must meet
- Quantities of each component needed

### Component Types

```
OTOM               - Specific Otom token required
VARIABLE_OTOM      - Any Otom meeting property criteria
FUNGIBLE_ITEM      - Fungible item component
NON_FUNGIBLE_ITEM  - Non-fungible item component

```

### Property Criteria

Components can be required to have specific properties within defined ranges:

```
PropertyCriterion:
- PropertyType (e.g., ATOM_RADIUS, MASS, ELECTRONEGATIVITY)
- Min/Max values for numerical properties
- Boolean values for flag properties
- String values for categorical properties e.g. the decay type must match some string

```

## Item Creation and Crafting

### Creation Flow

1. User creates item definitions with `createFungibleItem` or `createNonFungibleItem`
2. Each item receives a unique ID and blueprint definition
3. Base traits can be defined at creation time, and for non fungible tokens, get updated as the item is used, or at craft time if the blueprint is variable. Fungible token base traits never change.

### Crafting Flow

1. User calls `craftItem` with item ID, amount, and any variable components
   1. When crafting variable blueprints, two arrays are provided, 1 for otom token ids used in the variable slots, and 1 for the item token ids used in the variable slots. The ordering of ids within those arrays matter - the first VARIABLE_OTOM blueprint component will be filled by the first element in the first array, and so on.
   2. Arrays are not needed for OTOM and FUNGIBLE ITEM blueprint components because the token ids are predefined in the blueprint.
2. System verifies user has required components meeting criteria
3. System burns the components as part of crafting
4. For non-fungible items, tier is calculated via mutator contract
5. New item tokens are minted to the user with appropriate traits

Items can be “frozen”, meaning their core properties (name, description, mutator address, initial traits) can no longer be updated, and the behaviour of mutation is set in stone. Freezing is a one way operation.

## Tier System

Non-fungible items have optional tiers (1-7) that are calculated by mutator contracts based on components used and price paid in crafting.

The intent is for users to seek out the most powerful otoms to use in blueprints, so that they can get the top tier version of the item.

Tiers are not named, they should just be referred to as T1 through T7. This is so that at a glance every user knows the relative power the item is considered to have.

If all instances of a non fungible item are equal, the developer can set the tier to 0 and no tier will be set.

## Item Usage

Items can be:

- **Used**: Trigger custom logic in mutator contracts through `useItem`
  - ONLY non fungible items can be used in this way
  - The intent is that “using” an item then causes the traits to be altered in some way. Differing traits for the same item is only possible if the item is non fungible
  - Using an item may destroy it, if the mutator contract called in the use function says so
- **Consumed**: Burned via `consumeItem`
  - ONLY fungible items can be consumed
  - Fungible items have no reason to be “used” because the tokens are all identical. But they can still be “consumed”, e.g., using 10 bricks to build a house, the 10 bricks will be consumed.

The `useItem` and `consumeItem` functions are expected to be called by contracts, not by users directly. In order for the calls to succeed, the user must have granted approval to the caller to be allowed to use their OtomItems nfts. There are 3 ways to grant approval:

1. Call the ERC1155 `setApprovalForAll` function on the nft contract itself - unsafe because it means the operator will have access to all of the user’s items even if they aren’t relevant
2. Call `setApprovalForItemIds` on the core contract, which approves an operator to consume that item or use any instance of a non fungible item
3. Call `setApprovalForTokenIds` on the core contract, which approves an operator to use/consume that specific token id

## Trait System

Items have dynamic traits that:

```
Trait:
- typeName: The name of the trait
- valueString: String representation (for STRING type traits)
- valueNumber: Numeric representation (for NUMBER type traits)
- traitType: Either NUMBER or STRING

```

- Can be updated through item usage via mutator contracts
- Affect item functionality and appearance
- Store custom metadata relevant to the item

## Rendering

The rendering is handled by a hot swappable renderer contract. All token metadata is onchain. The image rendered is simply the name of the item (and tier if applicable), plus the blueprint used to create it.

When creating items, users can provide a “default image uri” for the fungible token and for all tiers of non fungible tokens. This image is not what will appear in wallets and marketplaces, but front ends for the items system (e.g. Assembly), can use these images instead of the onchain svg.

Work probably needs to be done to improve the generated svg to better handle long names and blueprints.

## Run the project locally

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
