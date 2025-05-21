import { ethers } from "hardhat";

const OTOM_ITEMS_CORE_ADDRESS = "0xe8af571878D33CfecA4eA11caEf124E5ef105a30"; // Shape Mainnet

const item = {
    name: "Jusonic Materia",
    description: "A fungible thing made of Ju2",
    imageUri:
        "https://oldschool.runescape.wiki/images/thumb/Runite_ore_detail.png/260px-Runite_ore_detail.png?7b4fd",
    blueprint: [
        {
            componentType: 0, // ComponentType.OTOM
            itemIdOrOtomTokenId:
                "35159569680903626501449329353512578019171730918789714169601127546706358467814", // Ju2
            amount: 2,
            criteria: [],
        },
    ],
    traits: [
        {
            typeName: "Base Otom",
            valueString: "Ju2",
            valueNumber: 0,
            traitType: 1, // TraitType.STRING
        },
    ],
    costInWei: 0,
    feeRecipient: "0x0000000000000000000000000000000000000000",
};

const main = async () => {
    const core = await ethers.getContractAt("OtomItemsCore", OTOM_ITEMS_CORE_ADDRESS);

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
