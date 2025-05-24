import fs from 'fs';
import { ethers, run } from 'hardhat';

const OTOM_ITEMS_CORE_ADDRESS = '0x488B5bAEA1Eb28F48c279C9Ac4e3312790813C2e'; // Shape Sepolia
const OTOMS_DATABASE_ADDRESS = '0xC6E01938846D3d62EafD7FF485afeE416f6D8A40'; // Shape Sepolia

const main = async () => {
  // Grab the Mystic Sword template
  const item = JSON.parse(fs.readFileSync('./scripts/templates/MysticSword.json').toString());

  // Deploy SwordMutator
  const Mutator = await ethers.getContractFactory('SwordMutator');
  const mutator = await Mutator.deploy(OTOMS_DATABASE_ADDRESS);
  await mutator.waitForDeployment();
  const mutatorAddress = await mutator.getAddress();

  console.log('Mutator deployed to:', mutatorAddress);

  const core = await ethers.getContractAt('OtomItemsCore', OTOM_ITEMS_CORE_ADDRESS);

  // Create the Mystic Sword
  await core.createNonFungibleItem(
    item.name,
    item.description,
    item.imageUri,
    item.tieredImageUris,
    item.blueprint,
    item.traits,
    mutatorAddress,
    item.costInWei,
    item.feeRecipient
  );

  console.log(`Item created with ID: ${Number(await core.nextItemId()) - 1}\nVerifying mutator...`);

  // Wait before verification
  await new Promise((resolve) => setTimeout(resolve, 30 * 1000));

  // Verify SwordMutator
  await run('verify:verify', {
    address: mutatorAddress,
    constructorArguments: [OTOMS_DATABASE_ADDRESS],
  });
};

main();
