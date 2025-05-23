import fs from 'fs';
import { ethers } from 'hardhat';

const OTOM_ITEMS_CORE_ADDRESS = '0x488B5bAEA1Eb28F48c279C9Ac4e3312790813C2e'; // Shape Sepolia

const main = async () => {
  // Grab the Invisibility Cloak template
  const item = JSON.parse(fs.readFileSync('./scripts/templates/InvisibilityCloak.json').toString());

  const core = await ethers.getContractAt('OtomItemsCore', OTOM_ITEMS_CORE_ADDRESS);

  // Create the Invisibility Cloak
  await core.createNonFungibleItem(
    item.name,
    item.description,
    item.imageUri,
    item.tieredImageUris,
    item.blueprint,
    item.traits,
    '0x0000000000000000000000000000000000000000',
    item.costInWei,
    item.feeRecipient
  );

  console.log(`Item created with ID: ${Number(await core.nextItemId()) - 1}`);
};

main();
