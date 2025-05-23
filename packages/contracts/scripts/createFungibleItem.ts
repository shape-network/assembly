import fs from 'fs';
import { ethers } from 'hardhat';

const OTOM_ITEMS_CORE_ADDRESS = '0x488B5bAEA1Eb28F48c279C9Ac4e3312790813C2e'; // Shape Sepolia

const main = async () => {
  // Grab the Materia template
  const item = JSON.parse(fs.readFileSync('./scripts/templates/Materia.json').toString());

  const core = await ethers.getContractAt('OtomItemsCore', OTOM_ITEMS_CORE_ADDRESS);

  // Create the Materia
  await core.createFungibleItem(
    item.name,
    item.description,
    item.imageUri,
    item.blueprint,
    item.traits,
    item.costInWei,
    item.feeRecipient
  );
};

main();
