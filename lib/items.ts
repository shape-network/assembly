import { getMoleculesByIds } from '@/app/api/fetchers';
import { assemblyItems } from '@/lib/addresses';
import { alchemy } from '@/lib/clients';
import { config } from '@/lib/config';
import { BlueprintComponent, ComponentType, RawBlueprintComponent } from '@/lib/types';

const PRECISION_FACTOR = 1 * 1e18;

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

  if (blueprint.componentType === 0 || blueprint.componentType === 1) {
    const tokenId = blueprint.itemIdOrOtomTokenId.toString();
    const otom = await getMoleculesByIds([tokenId]);

    if (otom.length === 0) {
      console.warn(`No molecule found for tokenId: ${tokenId}`);
      name = '?';
    } else {
      name = otom[0].molecule.name;
    }
  } else if (blueprint.componentType === 2 || blueprint.componentType === 3) {
    const item = await alchemy.nft.getNftMetadata(
      assemblyItems[config.chainId],
      blueprint.itemIdOrOtomTokenId.toString()
    );
    name = item.name ?? '?';
  }

  return {
    itemIdOrOtomTokenId: blueprint.itemIdOrOtomTokenId,
    name,
    amount: Number(blueprint.amount),
    componentType: getBlueprintComponentType(blueprint.componentType),
    criteria: blueprint.criteria.map((c) => ({
      propertyType: c.propertyType,
      minValue: Number(c.minValue) / PRECISION_FACTOR,
      maxValue: Number(c.maxValue) / PRECISION_FACTOR,
      boolValue: c.boolValue,
      checkBoolValue: c.checkBoolValue,
      stringValue: c.stringValue,
      checkStringValue: c.checkStringValue,
    })),
  };
}
