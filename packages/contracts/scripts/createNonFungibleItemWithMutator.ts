import { ethers, run } from "hardhat";

const OTOM_ITEMS_CORE_ADDRESS = "0xe8af571878D33CfecA4eA11caEf124E5ef105a30"; // Shape Mainnet
const OTOMS_DATABASE_ADDRESS = "0x953761a771d6Ad9F888e41b3E7c9338a32b1A346"; // Shape Mainnet

const item = {
    name: "Jusonic Sword",
    description: "A non-fungible tiered sword made of Ju3 and U77",
    imageUri: "https://oldschool.runescape.wiki/images/Wilderness_sword_1_detail.png?29623",
    tieredImageUris: [
        "https://oldschool.runescape.wiki/images/Wilderness_sword_1_detail.png?29623",
        "https://oldschool.runescape.wiki/images/Wilderness_sword_2_detail.png?29623",
        "https://oldschool.runescape.wiki/images/Wilderness_sword_3_detail.png?29623",
        "https://oldschool.runescape.wiki/images/Wilderness_sword_4_detail.png?29623",
        "", // Tier 5
        "", // Tier 6
        "", // Tier 7
    ],
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
        {
            componentType: 1, // ComponentType.VARIABLE_OTOM
            itemIdOrOtomTokenId: 0,
            amount: 1,
            criteria: [
                {
                    propertyType: 11, // PropertyType.MASS
                    minValue: 0,
                    maxValue:
                        "115792089237316195423570985008687907853269984665640564039457584007913129639934",
                    boolValue: false,
                    checkBoolValue: false,
                    stringValue: "",
                    checkStringValue: false,
                    bytes32Value:
                        "0x0000000000000000000000000000000000000000000000000000000000000000",
                    checkBytes32Value: false,
                },
            ],
        },
    ],
    traits: [
        {
            typeName: "Damage",
            valueString: "100",
            valueNumber: 100,
            traitType: 0, // TraitType.NUMBER
        },
        {
            typeName: "Battles fought",
            valueString: "0",
            valueNumber: 0,
            traitType: 0, // TraitType.NUMBER
        },
    ],
    costInWei: 0,
    feeRecipient: "0x0000000000000000000000000000000000000000",
};

const main = async () => {
    const Mutator = await ethers.getContractFactory("SwordMutator");
    const mutator = await Mutator.deploy(OTOMS_DATABASE_ADDRESS);
    await mutator.waitForDeployment();
    const mutatorAddress = await mutator.getAddress();

    console.log("Mutator deployed to:", mutatorAddress);

    const core = await ethers.getContractAt("OtomItemsCore", OTOM_ITEMS_CORE_ADDRESS);

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

    console.log(
        `Item created with ID: ${Number(await core.nextItemId()) - 1}\nVerifying mutator...`
    );

    // Wait before verification
    await new Promise((resolve) => setTimeout(resolve, 30 * 1000));

    await run("verify:verify", {
        address: mutatorAddress,
        constructorArguments: [OTOMS_DATABASE_ADDRESS],
    });
};

main();
