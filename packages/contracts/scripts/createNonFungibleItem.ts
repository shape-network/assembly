import fs from 'fs';
import { ethers } from 'hardhat';

const OTOM_ITEMS_CORE_ADDRESS = '0x488B5bAEA1Eb28F48c279C9Ac4e3312790813C2e'; // Shape Sepolia

const main = async () => {
  // Grab the Medallion template
  const item = JSON.parse(fs.readFileSync('./scripts/templates/Medallion.json').toString());

  const core = await ethers.getContractAt('OtomItemsCore', OTOM_ITEMS_CORE_ADDRESS);

  console.log('Creating Medallion...');

  // Create the Medallion
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

  console.log(`Medallion created with item ID: ${Number(await core.nextItemId()) - 1}`);
};

main();
