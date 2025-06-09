import { getMoleculesByIds } from '@/app/api/fetchers';
import { otomItems } from '@/lib/addresses';
import { alchemy } from '@/lib/clients';
import { config } from '@/lib/config';
import { BlueprintComponent, ComponentType, RawBlueprintComponent } from '@/lib/types';

const PRECISION_FACTOR = 1e18;
const MAX_UINT256_BIGINT = BigInt(
  '115792089237316195423570985008687907853269984665640564039457584007913129639935'
);

export function getBlueprintComponentType(componentType: number): ComponentType {
  switch (componentType) {
    case 0:
      return 'otom';
    case 1:
      return 'variable_otom';
    case 2:
      return 'fungible_item';
    case 3:
      return 'non_fungible_item';
    default:
      throw new Error(`Invalid component type: ${componentType}`);
  }
}

export async function getBlueprintForItem(
  blueprint: RawBlueprintComponent
): Promise<BlueprintComponent> {
  let name: string = '?';

  if (blueprint.componentType === 0) {
    const tokenId = blueprint.itemIdOrOtomTokenId.toString();
    const otomResults = await getMoleculesByIds([tokenId]);
    if (otomResults.length > 0 && otomResults[0]?.molecule) {
      name = otomResults[0].molecule.name;
    } else {
      console.warn(`No molecule data found for specific Otom tokenId: ${tokenId}`);
    }
  } else {
    if (!!blueprint.itemIdOrOtomTokenId) {
      try {
        const nft = await alchemy.nft.getNftMetadata(
          otomItems[config.chain.id],
          blueprint.itemIdOrOtomTokenId.toString()
        );
        name = nft.name ?? '?';
      } catch (error) {
        console.warn(
          `Could not fetch metadata for item ID: ${blueprint.itemIdOrOtomTokenId}`,
          error
        );
        name = `Item ID ${blueprint.itemIdOrOtomTokenId.toString().substring(0, 6)}...`;
      }
    } else if (blueprint.criteria[0].checkStringValue && !!blueprint.criteria[0].stringValue) {
      name = blueprint.criteria[0].stringValue;
    } else {
      name = '?';
    }
  }

  const parsedCriteria = blueprint.criteria.map((c) => {
    let minValue: number | undefined = undefined;
    let maxValue: number | undefined = undefined;

    const numericPropertiesUsingPrecision = [
      2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 16, 17, 18,
    ];

    if (numericPropertiesUsingPrecision.includes(c.propertyType)) {
      if (c.minValue !== undefined && c.minValue !== null) {
        if (c.minValue === BigInt(0) && c.maxValue === MAX_UINT256_BIGINT) {
          minValue = 0;
          maxValue = Infinity;
        } else {
          minValue = Number(c.minValue) / PRECISION_FACTOR;
          if (
            !!c.maxValue !== undefined &&
            c.maxValue !== null &&
            c.maxValue !== MAX_UINT256_BIGINT
          ) {
            maxValue = Number(c.maxValue) / PRECISION_FACTOR;
          } else if (c.maxValue === MAX_UINT256_BIGINT) {
            maxValue = Infinity;
          }
        }
      }
    }

    return {
      propertyType: c.propertyType,
      minValue,
      maxValue,
      boolValue: c.boolValue,
      checkBoolValue: c.checkBoolValue,
      stringValue: c.stringValue,
      checkStringValue: c.checkStringValue,
    };
  });

  return {
    itemIdOrOtomTokenId: blueprint.itemIdOrOtomTokenId,
    name,
    amount: Number(blueprint.amount),
    componentType: getBlueprintComponentType(blueprint.componentType),
    criteria: parsedCriteria,
  };
}

export const HIDDEN_ITEMS: bigint[] = [
  BigInt(1), // test pickaxe
];
