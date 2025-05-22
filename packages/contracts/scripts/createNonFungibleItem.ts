import { ethers } from "hardhat";

const OTOM_ITEMS_CORE_ADDRESS = "0xe8af571878D33CfecA4eA11caEf124E5ef105a30"; // Shape Mainnet

const item = {
    name: "Jusonic Sword",
    description: "A non-fungible sword made of Ju3 and U77",
    imageUri: "https://oldschool.runescape.wiki/images/Wilderness_sword_1_detail.png?29623",
    tieredImageUris: ["", "", "", "", "", "", ""],
    blueprint: [
        {
            componentType: 0, // ComponentType.OTOM
            itemIdOrOtomTokenId:
                "30743134292964981883308030024777035899442251708304773008789347656986494153707", // Ju3
            amount: 1,
            criteria: [],
        },
        {
            componentType: 0, // ComponentType.OTOM
            itemIdOrOtomTokenId:
                "80208761829410857019562512949342321687846549513711446602791659410207977883078", // U77
            amount: 1,
            criteria: [],
        },
    ],
    traits: [
        {
            typeName: "Damage",
            valueString: "100",
            valueNumber: 100,
            traitType: 0, // TraitType.NUMBER
        },
    ],
    costInWei: 0,
    feeRecipient: "0x0000000000000000000000000000000000000000",
};

const main = async () => {
    const core = await ethers.getContractAt("OtomItemsCore", OTOM_ITEMS_CORE_ADDRESS);

    await core.createNonFungibleItem(
        item.name,
        item.description,
        item.imageUri,
        item.tieredImageUris,
        item.blueprint,
        item.traits,
        "0x0000000000000000000000000000000000000000",
        item.costInWei,
        item.feeRecipient
    );

    console.log(`Item created with ID: ${Number(await core.nextItemId()) - 1}`);
};

main();
