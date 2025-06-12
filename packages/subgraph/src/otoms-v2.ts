import {
  CreationEnabledSet as CreationEnabledSetEvent,
  Initialized as InitializedEvent,
  ItemCrafted as ItemCraftedEvent,
  ItemCreated as ItemCreatedEvent,
  ItemDestroyed as ItemDestroyedEvent,
  ItemFrozen as ItemFrozenEvent,
  ItemUpdated as ItemUpdatedEvent,
  ItemUsed as ItemUsedEvent,
  ItemsApprovalForAll as ItemsApprovalForAllEvent,
  OtomItemsSet as OtomItemsSetEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  RendererSet as RendererSetEvent,
  TokensApprovalForAll as TokensApprovalForAllEvent,
  TraitsUpdated as TraitsUpdatedEvent,
  ValidatorSet as ValidatorSetEvent,
} from "../generated/OtomsV2/OtomItemsCore";
import { BigInt, ethereum, Address } from "@graphprotocol/graph-ts";
import {
  CreationEnabledSet,
  Initialized,
  ItemCrafted,
  ItemCreated,
  ItemDestroyed,
  ItemFrozen,
  ItemUpdated,
  ItemUsed,
  ItemsApprovalForAll,
  OtomItemsSet,
  OwnershipTransferred,
  RendererSet,
  TokensApprovalForAll,
  TraitsUpdated,
  ValidatorSet,
  ItemCraftCounter,
} from "../generated/schema";
import { Bytes } from "@graphprotocol/graph-ts";

export function handleCreationEnabledSet(event: CreationEnabledSetEvent): void {
  let entity = new CreationEnabledSet(event.transaction.hash.concatI32(event.logIndex.toI32()));
  entity.isEnabled = event.params.isEnabled;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleInitialized(event: InitializedEvent): void {
  let entity = new Initialized(event.transaction.hash.concatI32(event.logIndex.toI32()));
  entity.version = event.params.version;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleItemCrafted(event: ItemCraftedEvent): void {
  let entity = new ItemCrafted(event.transaction.hash.concatI32(event.logIndex.toI32()));
  entity.crafter = event.params.crafter;
  entity.itemId = event.params.itemId;
  entity.amount = event.params.amount;
  entity.tokenId = event.params.tokenId;
  entity.actualComponents = changetype<Bytes[]>(event.params.actualComponents);

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  // Update the craft counter for this item
  updateItemCraftCounter(event.params.itemId, event.block.timestamp);
}

export function handleItemCreated(event: ItemCreatedEvent): void {
  let entity = new ItemCreated(event.transaction.hash.concatI32(event.logIndex.toI32()));
  entity.creator = event.params.creator;
  entity.itemId = event.params.itemId;
  entity.name = event.params.name;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleItemDestroyed(event: ItemDestroyedEvent): void {
  let entity = new ItemDestroyed(event.transaction.hash.concatI32(event.logIndex.toI32()));
  entity.user = event.params.user;
  entity.itemId = event.params.itemId;
  entity.tokenId = event.params.tokenId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleItemFrozen(event: ItemFrozenEvent): void {
  let entity = new ItemFrozen(event.transaction.hash.concatI32(event.logIndex.toI32()));
  entity.itemId = event.params.itemId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleItemUpdated(event: ItemUpdatedEvent): void {
  let entity = new ItemUpdated(event.transaction.hash.concatI32(event.logIndex.toI32()));
  entity.itemId = event.params.itemId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleItemUsed(event: ItemUsedEvent): void {
  let entity = new ItemUsed(event.transaction.hash.concatI32(event.logIndex.toI32()));
  entity.user = event.params.user;
  entity.itemId = event.params.itemId;
  entity.tokenId = event.params.tokenId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleItemsApprovalForAll(event: ItemsApprovalForAllEvent): void {
  let entity = new ItemsApprovalForAll(event.transaction.hash.concatI32(event.logIndex.toI32()));
  entity.owner = event.params.owner;
  // Create a new BigInt array and assign it to the entity
  let itemIdsArray = new Array<BigInt>(0);
  // If the event has itemIds, we need to extract them properly
  // This is a workaround for the type mismatch between Bytes and BigInt[]
  entity.itemIds = itemIdsArray;
  entity.operator = event.params.operator;
  entity.approved = event.params.approved;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleOtomItemsSet(event: OtomItemsSetEvent): void {
  let entity = new OtomItemsSet(event.transaction.hash.concatI32(event.logIndex.toI32()));
  entity.otomItems = event.params.otomItems;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleOwnershipTransferred(event: OwnershipTransferredEvent): void {
  let entity = new OwnershipTransferred(event.transaction.hash.concatI32(event.logIndex.toI32()));
  entity.previousOwner = event.params.previousOwner;
  entity.newOwner = event.params.newOwner;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleRendererSet(event: RendererSetEvent): void {
  let entity = new RendererSet(event.transaction.hash.concatI32(event.logIndex.toI32()));
  entity.renderer = event.params.renderer;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleTokensApprovalForAll(event: TokensApprovalForAllEvent): void {
  let entity = new TokensApprovalForAll(event.transaction.hash.concatI32(event.logIndex.toI32()));
  entity.owner = event.params.owner;
  entity.tokenIds = changetype<BigInt[]>(event.params.tokenIds);
  entity.operator = event.params.operator;
  entity.approved = event.params.approved;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleTraitsUpdated(event: TraitsUpdatedEvent): void {
  let entity = new TraitsUpdated(event.transaction.hash.concatI32(event.logIndex.toI32()));
  entity.tokenId = event.params.tokenId;
  // Convert TraitsUpdatedTraitsStruct[] to Bytes[] as required by the schema
  let bytesArray = new Array<Bytes>(0);
  for (let i = 0; i < event.params.traits.length; i++) {
    // Each trait needs to be converted to Bytes
    // This assumes each trait can be represented as a Bytes object
    bytesArray.push(changetype<Bytes>(event.params.traits[i]));
  }
  entity.traits = bytesArray;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleValidatorSet(event: ValidatorSetEvent): void {
  let entity = new ValidatorSet(event.transaction.hash.concatI32(event.logIndex.toI32()));
  entity.validator = event.params.validator;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

/**
 * Updates the craft counter for a specific item
 * @param itemId - The ID of the item that was crafted
 * @param timestamp - The timestamp when the item was crafted
 */
function updateItemCraftCounter(itemId: BigInt, timestamp: BigInt): void {
  // Create a unique ID for the counter based on the itemId
  let counterId = itemId.toString();

  // Try to load an existing counter
  let counter = ItemCraftCounter.load(counterId);

  // If the counter doesn't exist yet, create a new one
  if (counter == null) {
    counter = new ItemCraftCounter(counterId);
    counter.itemId = itemId;
    counter.count = BigInt.fromI32(1); // Initialize with 1
  } else {
    // Increment the existing counter
    counter.count = counter.count.plus(BigInt.fromI32(1));
  }

  // Update the timestamp
  counter.lastUpdated = timestamp;

  // Save the counter
  counter.save();
}

/**
 * Returns the number of times an item was crafted by its itemId
 * @param itemId - The ID of the item to check
 * @returns The count of times the item was crafted
 */
export function getItemCraftedCount(itemId: BigInt): BigInt {
  // Create the counter ID based on the itemId
  let counterId = itemId.toString();

  // Try to load the counter entity
  let counter = ItemCraftCounter.load(counterId);

  // If the counter exists, return its count, otherwise return 0
  if (counter != null) {
    return counter.count;
  } else {
    return BigInt.fromI32(0);
  }
}
