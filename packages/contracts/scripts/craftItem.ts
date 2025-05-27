import { ethers } from 'hardhat';

const OTOM_ITEMS_CORE_ADDRESS = '0x488B5bAEA1Eb28F48c279C9Ac4e3312790813C2e'; // Shape Sepolia

const OTOM_ITEMS_TRACKING_ADDRESS = '0xd0424C0365C95F6f6174ceB0D7c24b99C09adc2B'; // Shape Sepolia

const main = async () => {
  const [sender] = await ethers.getSigners();

  const itemId = 8; // Update this to the item ID you want to craft

  const core = await ethers.getContractAt('OtomItemsCore', OTOM_ITEMS_CORE_ADDRESS);

  console.log(`Crafting non-fungible item with item ID: ${itemId}`);

  await core.craftItem(itemId, 1, [], [], '0x0000000000000000000000000000000000000000', {
    value: 0,
  });

  const tracking = await ethers.getContractAt('OtomItemsTracking', OTOM_ITEMS_TRACKING_ADDRESS);

  const ids = await tracking.getNonFungibleItemOwnerTokenIdsPaginated(
    sender.address,
    itemId,
    0,
    100000
  );

  console.log(`Crafted non-fungible item with token ID: ${ids[ids.length - 1]}`);
};

main();
