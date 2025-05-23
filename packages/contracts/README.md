# Otoms by golid

This repository contains the contracts for [Otoms by golid](https://docs.shape.network/building-on-shape/onchain-compatible/otom), as well as the contracts used in the Assembly system.

The Assembly system, built on top of Otoms, is a flexible ERC1155 implementation enabling the creation, crafting, and management of both fungible and non-fungible items on the blockchain. Built with upgradeability in mind, the system allows for component-based crafting where items can be created using blueprints that define required components with specific properties.

Check out the [Assembly docs](https://docs.shape.network/building-on-shape/onchain-compatible/assembly) for more information on creating and crafting items and what.

## Creating Assembly Items

This repo contains a few example scripts for creating Assembly items using the [`OtomItemsCore`](./contracts/items/OtomItemsCore.sol) contract.

### [createFungibleItem](./scripts/createFungibleItem.ts)

Used to create a fungible "Jusonic Ore". This material can be crafted using three _Ju2_ otoms.

### [createNonFungibleItem](./scripts/createNonFungibleItem.ts)

Used to create a non-fungible "Invisibility Cloak". This item can be crafted using one _T15_ and two _Sr2_ otoms.

### [createNonFungibleItemWithMutator](./scripts/createNonFungibleItemWithMutator.ts)

Used to create a non-fungible tiered "Mystic Sword". This item can be crafted using one _Ju3_, one _U77_ otom and one additional miscellaneous otom. This extra otom will be used to calculate the tier of the sword.

The logic for tiering is handled in the [`SwordMutator`](./contracts/items/mutators/SwordMutator.sol). It calculates the tier based on the mass of the otom. Scaling the damage of the sword based on its tier.

The mutator also keeps track of the number of battles fought. If 100 battles have been fought, the sword will be destroyed.
