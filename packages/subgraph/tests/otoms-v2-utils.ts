import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
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
  ValidatorSet
} from "../generated/OtomsV2/OtomItemsCore"

export function createCreationEnabledSetEvent(
  isEnabled: boolean
): CreationEnabledSet {
  let creationEnabledSetEvent = changetype<CreationEnabledSet>(newMockEvent())

  creationEnabledSetEvent.parameters = new Array()

  creationEnabledSetEvent.parameters.push(
    new ethereum.EventParam("isEnabled", ethereum.Value.fromBoolean(isEnabled))
  )

  return creationEnabledSetEvent
}

export function createInitializedEvent(version: BigInt): Initialized {
  let initializedEvent = changetype<Initialized>(newMockEvent())

  initializedEvent.parameters = new Array()

  initializedEvent.parameters.push(
    new ethereum.EventParam(
      "version",
      ethereum.Value.fromUnsignedBigInt(version)
    )
  )

  return initializedEvent
}

export function createItemCraftedEvent(
  crafter: Address,
  itemId: BigInt,
  amount: BigInt,
  tokenId: BigInt,
  actualComponents: Array<ethereum.Tuple>
): ItemCrafted {
  let itemCraftedEvent = changetype<ItemCrafted>(newMockEvent())

  itemCraftedEvent.parameters = new Array()

  itemCraftedEvent.parameters.push(
    new ethereum.EventParam("crafter", ethereum.Value.fromAddress(crafter))
  )
  itemCraftedEvent.parameters.push(
    new ethereum.EventParam("itemId", ethereum.Value.fromUnsignedBigInt(itemId))
  )
  itemCraftedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  itemCraftedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  itemCraftedEvent.parameters.push(
    new ethereum.EventParam(
      "actualComponents",
      ethereum.Value.fromTupleArray(actualComponents)
    )
  )

  return itemCraftedEvent
}

export function createItemCreatedEvent(
  creator: Address,
  itemId: BigInt,
  name: string
): ItemCreated {
  let itemCreatedEvent = changetype<ItemCreated>(newMockEvent())

  itemCreatedEvent.parameters = new Array()

  itemCreatedEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )
  itemCreatedEvent.parameters.push(
    new ethereum.EventParam("itemId", ethereum.Value.fromUnsignedBigInt(itemId))
  )
  itemCreatedEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )

  return itemCreatedEvent
}

export function createItemDestroyedEvent(
  user: Address,
  itemId: BigInt,
  tokenId: BigInt
): ItemDestroyed {
  let itemDestroyedEvent = changetype<ItemDestroyed>(newMockEvent())

  itemDestroyedEvent.parameters = new Array()

  itemDestroyedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  itemDestroyedEvent.parameters.push(
    new ethereum.EventParam("itemId", ethereum.Value.fromUnsignedBigInt(itemId))
  )
  itemDestroyedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return itemDestroyedEvent
}

export function createItemFrozenEvent(itemId: BigInt): ItemFrozen {
  let itemFrozenEvent = changetype<ItemFrozen>(newMockEvent())

  itemFrozenEvent.parameters = new Array()

  itemFrozenEvent.parameters.push(
    new ethereum.EventParam("itemId", ethereum.Value.fromUnsignedBigInt(itemId))
  )

  return itemFrozenEvent
}

export function createItemUpdatedEvent(itemId: BigInt): ItemUpdated {
  let itemUpdatedEvent = changetype<ItemUpdated>(newMockEvent())

  itemUpdatedEvent.parameters = new Array()

  itemUpdatedEvent.parameters.push(
    new ethereum.EventParam("itemId", ethereum.Value.fromUnsignedBigInt(itemId))
  )

  return itemUpdatedEvent
}

export function createItemUsedEvent(
  user: Address,
  itemId: BigInt,
  tokenId: BigInt
): ItemUsed {
  let itemUsedEvent = changetype<ItemUsed>(newMockEvent())

  itemUsedEvent.parameters = new Array()

  itemUsedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  itemUsedEvent.parameters.push(
    new ethereum.EventParam("itemId", ethereum.Value.fromUnsignedBigInt(itemId))
  )
  itemUsedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return itemUsedEvent
}

export function createItemsApprovalForAllEvent(
  owner: Address,
  itemIds: Array<BigInt>,
  operator: Address,
  approved: boolean
): ItemsApprovalForAll {
  let itemsApprovalForAllEvent = changetype<ItemsApprovalForAll>(newMockEvent())

  itemsApprovalForAllEvent.parameters = new Array()

  itemsApprovalForAllEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  itemsApprovalForAllEvent.parameters.push(
    new ethereum.EventParam(
      "itemIds",
      ethereum.Value.fromUnsignedBigIntArray(itemIds)
    )
  )
  itemsApprovalForAllEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  itemsApprovalForAllEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromBoolean(approved))
  )

  return itemsApprovalForAllEvent
}

export function createOtomItemsSetEvent(otomItems: Address): OtomItemsSet {
  let otomItemsSetEvent = changetype<OtomItemsSet>(newMockEvent())

  otomItemsSetEvent.parameters = new Array()

  otomItemsSetEvent.parameters.push(
    new ethereum.EventParam("otomItems", ethereum.Value.fromAddress(otomItems))
  )

  return otomItemsSetEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent =
    changetype<OwnershipTransferred>(newMockEvent())

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createRendererSetEvent(renderer: Address): RendererSet {
  let rendererSetEvent = changetype<RendererSet>(newMockEvent())

  rendererSetEvent.parameters = new Array()

  rendererSetEvent.parameters.push(
    new ethereum.EventParam("renderer", ethereum.Value.fromAddress(renderer))
  )

  return rendererSetEvent
}

export function createTokensApprovalForAllEvent(
  owner: Address,
  tokenIds: Array<BigInt>,
  operator: Address,
  approved: boolean
): TokensApprovalForAll {
  let tokensApprovalForAllEvent =
    changetype<TokensApprovalForAll>(newMockEvent())

  tokensApprovalForAllEvent.parameters = new Array()

  tokensApprovalForAllEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  tokensApprovalForAllEvent.parameters.push(
    new ethereum.EventParam(
      "tokenIds",
      ethereum.Value.fromUnsignedBigIntArray(tokenIds)
    )
  )
  tokensApprovalForAllEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  tokensApprovalForAllEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromBoolean(approved))
  )

  return tokensApprovalForAllEvent
}

export function createTraitsUpdatedEvent(
  tokenId: BigInt,
  traits: Array<ethereum.Tuple>
): TraitsUpdated {
  let traitsUpdatedEvent = changetype<TraitsUpdated>(newMockEvent())

  traitsUpdatedEvent.parameters = new Array()

  traitsUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  traitsUpdatedEvent.parameters.push(
    new ethereum.EventParam("traits", ethereum.Value.fromTupleArray(traits))
  )

  return traitsUpdatedEvent
}

export function createValidatorSetEvent(validator: Address): ValidatorSet {
  let validatorSetEvent = changetype<ValidatorSet>(newMockEvent())

  validatorSetEvent.parameters = new Array()

  validatorSetEvent.parameters.push(
    new ethereum.EventParam("validator", ethereum.Value.fromAddress(validator))
  )

  return validatorSetEvent
}
