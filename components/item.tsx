'use client';

import { useGetCraftableItems, useGetOtomItemsForUser } from '@/app/api/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useWriteAssemblyCoreContractCraftItem } from '@/generated';
import { assemblyCore } from '@/lib/addresses';
import { config } from '@/lib/config';
import { BlueprintComponent, Item, OtomItem, Trait } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { LightningBoltIcon, QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import { FC, PropsWithChildren, useEffect } from 'react';
import { toast } from 'sonner';
import { useAccount, useWaitForTransactionReceipt } from 'wagmi';

type ItemToCraftCardProps = {
  item: Item;
  droppedVariableItems: Record<number, OtomItem | null>;
  onDropVariable: (itemId: string, index: number, item: OtomItem | null) => void;
  droppedOnRequiredSlots: Set<string>;
  onClearRequired: (itemId: string) => void;
};

export const ItemToCraftCard: FC<ItemToCraftCardProps> = ({
  item,
  droppedVariableItems,
  onDropVariable,
  droppedOnRequiredSlots,
  onClearRequired,
}) => {
  const { address } = useAccount();
  const { data: inventory } = useGetOtomItemsForUser();

  function isElementOwned(name: string) {
    if (!inventory) return false;
    return inventory.some((i) => i.name === name);
  }

  const variableBlueprints = item.blueprint.filter((i) => i.componentType === 'variable_otom');

  const isCraftable =
    inventory &&
    item.blueprint.length > 0 &&
    item.blueprint.every((component) => {
      if (component.componentType === 'variable_otom') {
        const variableIndex = variableBlueprints.findIndex((vb) => vb === component);
        return (
          droppedVariableItems[variableIndex] !== null &&
          droppedVariableItems[variableIndex] !== undefined
        );
      } else {
        return isElementOwned(component.name);
      }
    });

  const requiredBlueprints = item.blueprint.filter((i) => i.componentType !== 'variable_otom');

  const hasDroppedRequired = requiredBlueprints.some((_, i) =>
    droppedOnRequiredSlots.has(`required-${item.id}-${i}`)
  );
  const hasDroppedVariable = Object.values(droppedVariableItems).some((item) => item !== null);

  const handleClearRequiredClick = () => {
    onClearRequired(String(item.id));
  };

  const handleClearVariableClick = () => {
    variableBlueprints.forEach((_, index) => {
      onDropVariable(String(item.id), index, null);
    });
  };

  return (
    <li className="grid grid-rows-[1fr_auto] gap-1">
      <Card className="relative w-full">
        {isCraftable && address && (
          <CraftItemButton
            item={item}
            className="absolute top-2 right-2 h-8 px-3"
            droppedVariableItems={droppedVariableItems}
          />
        )}

        <CardHeader className="relative">
          <CardTitle>{item.name}</CardTitle>
        </CardHeader>

        <CardContent className="flex h-full flex-col justify-between gap-6">
          <div className="flex flex-col gap-6">
            <div className="relative h-40 w-full">
              {item.defaultImageUri ? (
                <Image
                  src={item.defaultImageUri}
                  alt={item.name}
                  fill
                  className="object-contain py-2"
                />
              ) : (
                <Skeleton className="h-48 w-full" />
              )}
            </div>

            <CardDescription className="text-center italic">{item.description}</CardDescription>

            <ul className="text-sm">
              {item.initialTraits.map((trait, idx) => (
                <li key={idx} className="flex flex-col gap-1">
                  <div className="text-primary flex items-center gap-2">
                    <span>{trait.name === 'Usages Remaining' ? 'Usages' : trait.name}</span>
                    <span className="border-muted-foreground/15 flex-grow border-b border-dotted"></span>
                    <span className="font-medium">{trait.value}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-muted-foreground text-sm">Required elements</p>
                {hasDroppedRequired && (
                  <button
                    type="button"
                    className="text-muted-foreground cursor-pointer text-xs"
                    onClick={handleClearRequiredClick}
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1">
                {requiredBlueprints.map((component, i) => {
                  const isOwned = isElementOwned(component.name);
                  const dropId = `required-${item.id}-${i}`;
                  return (
                    <RequiredDropZone
                      key={dropId}
                      id={dropId}
                      component={component}
                      isOwned={isOwned}
                      isDropped={droppedOnRequiredSlots.has(dropId)}
                    />
                  );
                })}
              </div>
            </div>

            {variableBlueprints.length > 0 ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <p className="text-muted-foreground text-sm">Enhancements</p>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <QuestionMarkCircledIcon className="text-muted-foreground/50 size-4" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Enhance the {item.name} with otoms that match specific criteria...</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  {hasDroppedVariable && (
                    <button
                      type="button"
                      className="text-muted-foreground cursor-pointer text-xs"
                      onClick={handleClearVariableClick}
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="flex justify-start gap-1">
                  {variableBlueprints.map((vb, i) => {
                    const dropId = `variable-${item.id}-${i}`;
                    const droppedItem = droppedVariableItems[i] || null;
                    return (
                      <VariableDropZone
                        key={dropId}
                        id={dropId}
                        index={i}
                        criteria={vb.criteria}
                        droppedItem={droppedItem}
                        onDrop={(_itemId, index, theDroppedItem) =>
                          onDropVariable(String(item.id), index, theDroppedItem)
                        }
                        itemName={item.name}
                      />
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="h-[90px]" />
            )}
          </div>
        </CardContent>
      </Card>
    </li>
  );
};

export const OtomItemCard: FC<{ element: OtomItem; isUsed: boolean }> = ({ element, isUsed }) => {
  const { data } = useGetCraftableItems();
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: element.id,
    data: element,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  const isRequiredInBlueprint = data?.some((item) =>
    item.blueprint.some((b) => b.componentType !== 'variable_otom' && b.name === element.name)
  );

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        'cursor-pointer touch-none py-0 font-semibold transition-colors',
        isUsed
          ? 'bg-primary text-primary-foreground'
          : isRequiredInBlueprint
            ? 'border-primary text-primary'
            : 'border-border text-muted-foreground font-normal'
      )}
    >
      <CardContent className="grid size-15 place-items-center px-0">{element.name}</CardContent>
    </Card>
  );
};

const CraftItemButton: FC<{
  item: Item;
  className?: string;
  droppedVariableItems?: Record<number, OtomItem | null>;
}> = ({ item, className, droppedVariableItems }) => {
  const { data: hash, writeContractAsync, isPending } = useWriteAssemblyCoreContractCraftItem();
  const { refetch: refetchOtomItems } = useGetOtomItemsForUser();

  async function handleCraftItem() {
    const variableOtomTokenIds = item.blueprint
      .filter((bp) => bp.componentType === 'variable_otom')
      .map((bp, index) => {
        const dropped = droppedVariableItems ? droppedVariableItems[index] : null;
        return dropped ? BigInt(dropped.id) : BigInt(0);
      })
      .filter((id) => id !== BigInt(0));

    const variableSlotsCount = item.blueprint.filter(
      (bp) => bp.componentType === 'variable_otom'
    ).length;
    if (variableOtomTokenIds.length !== variableSlotsCount) {
      toast.error('Please fill all enhancement slots.');
      return;
    }

    try {
      toast.info('Please confirm the transaction in your wallet.');
      await writeContractAsync({
        address: assemblyCore[config.chainId],
        args: [item.id, BigInt(1), variableOtomTokenIds, []],
      });
    } catch (error) {
      toast.error(`An error ocurred while crafting ${item.name}, please try again.`);
      console.error(error);
    }
  }

  const {
    isLoading: isTxConfirming,
    isError: isTxError,
    isSuccess: isTxConfirmed,
  } = useWaitForTransactionReceipt({
    hash,
    query: { enabled: !!hash },
  });

  useEffect(() => {
    if (hash && isTxConfirming) {
      toast.loading('Item is being crafted...');
    }

    if (isTxConfirmed) {
      toast.success(`${item.name} crafted successfully!`);
      refetchOtomItems();
    }

    if (isTxError) {
      toast.error(`An error ocurred while crafting ${item.name}, please try again.`);
    }
  }, [hash, refetchOtomItems, isTxConfirming, isTxConfirmed, isTxError, item.name]);

  const disabled = isPending || isTxConfirming;

  return (
    <Button disabled={disabled} onClick={handleCraftItem} className={className}>
      {isPending || isTxConfirming ? 'Crafting...' : 'Craft'}
    </Button>
  );
};

export const OwnedItemCard: FC<{ item: Item }> = ({ item }) => {
  return (
    <li>
      <Card>
        <CardHeader>
          <CardTitle>{item.name}</CardTitle>
        </CardHeader>

        <div className="relative h-40 w-full">
          {item.defaultImageUri ? (
            <Image
              src={item.defaultImageUri}
              alt={item.name}
              fill
              className="object-contain py-2"
            />
          ) : (
            <Skeleton className="h-48 w-full" />
          )}
        </div>

        <CardContent className="flex flex-col gap-6">
          <CardDescription className="text-center italic">{item.description}</CardDescription>
          <ItemTraits traits={item.initialTraits} />
        </CardContent>
      </Card>
    </li>
  );
};

const ItemTraits: FC<{ traits: Trait[] }> = ({ traits }) => {
  return (
    <ul className="text-sm">
      {traits.map((trait, idx) => (
        <li key={idx} className="flex flex-col gap-1">
          <div className="text-primary flex items-center gap-2">
            <span>{trait.name}</span>
            <span className="border-muted-foreground/15 flex-grow border-b border-dotted"></span>
            <span className="font-medium">{trait.value}</span>
          </div>
        </li>
      ))}
    </ul>
  );
};

const RequiredDropZone: FC<{
  id: string;
  component: BlueprintComponent;
  isOwned: boolean;
  isDropped: boolean;
}> = ({ id, component, isOwned, isDropped }) => {
  const { isOver, setNodeRef, active } = useDroppable({
    id: id,
    data: { requiredName: component.name, type: 'required' },
  });

  const canDrop = active?.data.current?.name === component.name;

  return (
    <Card
      ref={setNodeRef}
      className={cn(
        'py-0 transition-colors select-none',
        isDropped
          ? 'bg-primary text-primary-foreground font-semibold'
          : isOwned
            ? 'border-primary font-semibold'
            : 'text-muted-foreground/50 border-border font-normal',
        isOver && canDrop && 'ring-primary ring-2 ring-offset-2',
        isOver && !canDrop && 'ring-destructive ring-2 ring-offset-2'
      )}
    >
      <CardContent className="grid size-15 place-items-center px-0">{component.name}</CardContent>
    </Card>
  );
};

// --- Helper Function for Criteria Validation ---

// TODO: Define the complete mapping from propertyType enum value (number)
// to the actual property path and type in OtomItem/Atom
// NOTE: Assuming criteria apply to the FIRST atom in giving_atoms unless it's a molecule property
type PropertyPath = (string | number)[]; // Define a type for the path array
const PROPERTY_TYPE_MAP: Record<
  number,
  { path: PropertyPath; type: 'number' | 'boolean' | 'string' }
> = {
  // --- Atom Properties (Accessed via item.giving_atoms[0]) ---
  0: { path: ['giving_atoms', 0, 'radius'], type: 'number' }, // Assuming 0 maps to Atom radius
  1: { path: ['giving_atoms', 0, 'mass'], type: 'number' }, // Assuming 1 maps to Atom mass
  2: { path: ['giving_atoms', 0, 'nucleus', 'protons'], type: 'number' }, // Atom protons
  3: { path: ['giving_atoms', 0, 'metallic'], type: 'boolean' }, // Atom metallic
  // 4: { path: ['giving_atoms', 0, 'nucleus', 'decay_type'], type: 'string' }, // Atom decay_type example

  // --- Molecule Properties (Accessed via item directly) ---
  100: { path: ['electrical_conductivity'], type: 'number' }, // Example molecule property

  // Add other mappings based on PropertyType enum in Solidity
};

// Helper to safely get nested property value with improved typing
function getNestedValue(obj: Record<string, unknown>, path: PropertyPath): unknown {
  try {
    // Use 'unknown' as initial type for accumulator
    const value = path.reduce((current: unknown, key: string | number) => {
      // Check if current is an object and key is valid before indexing
      if (typeof current === 'object' && current !== null && key in current) {
        return (current as Record<string | number, unknown>)[key];
      }
      return undefined; // Path is invalid or current is not an object
    }, obj as unknown); // Start with the object cast to unknown
    return value;
  } catch (e) {
    console.error('Error accessing property path:', path, e);
    return undefined;
  }
}

function checkCriteria(item: OtomItem, criteria: BlueprintComponent['criteria']): boolean {
  if (!item || !criteria) return false;

  // Ensure there's an atom to check if needed
  if (
    criteria.some((c) => PROPERTY_TYPE_MAP[c.propertyType]?.path[0] === 'giving_atoms') &&
    (!item.giving_atoms || item.giving_atoms.length === 0)
  ) {
    console.warn('Criteria requires atom properties, but item has no giving_atoms.');
    return false;
  }

  for (const c of criteria) {
    const mapping = PROPERTY_TYPE_MAP[c.propertyType];
    if (!mapping) {
      console.warn(`Unknown propertyType ${c.propertyType} in criteria check.`);
      return false; // Unknown property type fails the check
    }

    const itemValue = getNestedValue(item, mapping.path);

    if (itemValue === undefined || itemValue === null) {
      console.warn(`Property ${String(mapping.path)} not found or is null/undefined on item.`);
      return false;
    }

    // Perform checks based on criterion type and flags
    if (mapping.type === 'number' && typeof itemValue === 'number') {
      const itemValueBigInt = BigInt(itemValue);
      const min = c.minValue;
      const max = c.maxValue;
      if (
        (min !== undefined && itemValueBigInt < min) ||
        (max !== undefined && itemValueBigInt > max)
      ) {
        console.log(
          `Criteria fail (Number): ${String(mapping.path)} (${itemValueBigInt}) not in range [${min ?? '-inf'}, ${max ?? '+inf'}]`
        );
        return false;
      }
    } else if (mapping.type === 'boolean' && typeof itemValue === 'boolean' && c.checkBoolValue) {
      if (itemValue !== c.boolValue) {
        console.log(
          `Criteria fail (Boolean): ${String(mapping.path)} (${itemValue}) !== ${c.boolValue}`
        );
        return false;
      }
    } else if (mapping.type === 'string' && typeof itemValue === 'string' && c.checkStringValue) {
      if (itemValue !== c.stringValue) {
        console.log(
          `Criteria fail (String): ${String(mapping.path)} (${itemValue}) !== ${c.stringValue}`
        );
        return false;
      }
    } else if (
      mapping.type === 'number' ||
      mapping.type === 'boolean' ||
      mapping.type === 'string'
    ) {
      // Check if the type mismatch occurred (itemValue's type didn't match mapping.type)
      if (
        (mapping.type === 'number' && typeof itemValue !== 'number') ||
        (mapping.type === 'boolean' && typeof itemValue !== 'boolean') ||
        (mapping.type === 'string' && typeof itemValue !== 'string')
      ) {
        console.warn(
          `Type mismatch for criteria check: Property ${String(mapping.path)} expected ${mapping.type}, got ${typeof itemValue}`
        );
        return false;
      }
      // If types matched but conditions above didn't fail (e.g., boolean check where checkBoolValue is false), continue.
    }
  }

  return true; // All criteria passed
}

const VariableDropZone: FC<{
  id: string;
  index: number;
  criteria: BlueprintComponent['criteria'];
  droppedItem: OtomItem | null;
  onDrop: (itemId: string, index: number, item: OtomItem | null) => void;
  itemName: string;
}> = ({ id, index, criteria, droppedItem, itemName }) => {
  const { isOver, setNodeRef, active } = useDroppable({
    id: id,
    data: { index: index, type: 'variable' },
  });

  const draggedItem = active?.data.current as OtomItem | undefined;
  const canDrop = active ? checkCriteria(draggedItem!, criteria) : false;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Card
          ref={setNodeRef}
          className={cn(
            'relative py-0 transition-colors',
            droppedItem && 'border-primary font-semibold',
            isOver && canDrop && 'ring-primary ring-2 ring-offset-2',
            isOver && !canDrop && 'ring-destructive ring-2 ring-offset-2'
          )}
        >
          <CardContent
            className={cn(
              'grid size-15 place-items-center px-0',
              droppedItem ? 'text-primary' : 'text-muted-foreground/40'
            )}
          >
            {droppedItem ? droppedItem.name : <LightningBoltIcon className="size-4" />}
          </CardContent>
        </Card>
      </TooltipTrigger>
      <TooltipContent>
        <div className="flex flex-col gap-1">
          <p className="font-medium">Enhance {itemName}</p>
          {droppedItem ? (
            <p>Using: {droppedItem.name}</p>
          ) : (
            <p>Drop an Otom that meets the criteria.</p>
          )}
          {criteria.map((c) => {
            const mapping = PROPERTY_TYPE_MAP[c.propertyType];
            const propName = mapping ? String(mapping.path) : `Property ${c.propertyType}`;
            return (
              <span key={c.propertyType}>
                <p className="text-muted-foreground text-xs">{propName}</p>
                <p className="text-xs">
                  {c.checkBoolValue ? (
                    `Required: ${c.boolValue}`
                  ) : c.checkStringValue ? (
                    `Required: ${c.stringValue}`
                  ) : (
                    <>
                      Range:{' '}
                      {typeof c.minValue === 'bigint' && c.minValue > BigInt(10000)
                        ? `${Number(c.minValue).toExponential(2)}`
                        : String(c.minValue)}{' '}
                      -{' '}
                      {typeof c.maxValue === 'bigint' && c.maxValue > BigInt(10000)
                        ? `${Number(c.maxValue).toExponential(2)}`
                        : String(c.maxValue)}
                    </>
                  )}
                </p>
              </span>
            );
          })}
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

export const BlueprintComponentsGrid: FC<PropsWithChildren> = ({ children }) => {
  return <ul className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-8">{children}</ul>;
};
