'use client';

import { useGetCraftableItems, useGetOtomItemsForUser } from '@/app/api/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useWriteAssemblyCoreContractCraftItem } from '@/generated';
import { assemblyCore } from '@/lib/addresses';
import { config } from '@/lib/config';
import { checkCriteria, PROPERTY_TYPE_MAP } from '@/lib/property-utils';
import { BlueprintComponent, Item, OtomItem, Trait } from '@/lib/types';
import { cn, isNotNullish } from '@/lib/utils';
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

  function isElementOwned(name: string): boolean {
    if (!inventory) return false;
    return inventory.some((i) => i.name === name);
  }

  const requiredBlueprints = item.blueprint.filter((i) => i.componentType !== 'variable_otom');
  const variableBlueprints = item.blueprint.filter((i) => i.componentType === 'variable_otom');

  const hasDroppedRequired = requiredBlueprints.some((_, i) =>
    droppedOnRequiredSlots.has(getRequiredDropZoneId(item.id, i))
  );
  const hasDroppedVariable = Object.values(droppedVariableItems).some((item) => item !== null);

  const isCraftable =
    requiredBlueprints.length > 0 &&
    requiredBlueprints.every(({ componentType, itemIdOrOtomTokenId }, index) => {
      const dropId = getRequiredDropZoneId(item.id, index);
      const isDropped = droppedOnRequiredSlots.has(dropId);

      if (componentType !== 'variable_otom') {
        const requiredTokenId = String(itemIdOrOtomTokenId);
        const hasRequiredComponent =
          inventory?.some((ownedItem) => ownedItem.tokenId === requiredTokenId) ?? false;
        return isDropped && hasRequiredComponent;
      } else {
        return false;
      }
    });

  function handleClearRequiredClick() {
    onClearRequired(String(item.id));
  }

  function handleClearVariableClick() {
    variableBlueprints.forEach((_, index) => {
      onDropVariable(String(item.id), index, null);
    });
  }

  return (
    <li className="grid grid-rows-[1fr_auto] gap-1">
      <Card className="relative w-full">
        {isCraftable && address && (
          <CraftItemButton
            item={item}
            className="absolute top-2 right-2 z-10 h-8 px-3"
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

            <ItemTraits traits={item.initialTraits} />
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-muted-foreground text-sm">Required elements</p>
                {hasDroppedRequired && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground h-5 cursor-pointer px-2 text-xs"
                    onClick={handleClearRequiredClick}
                  >
                    Clear
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-1">
                {requiredBlueprints.map((component, i) => {
                  const isOwned = isElementOwned(component.name);
                  const dropId = getRequiredDropZoneId(item.id, i);
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
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground h-5 cursor-pointer px-2 text-xs"
                      onClick={handleClearVariableClick}
                    >
                      Clear
                    </Button>
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

type OtomItemCardProps = {
  representativeItem: OtomItem;
  count: number;
  allItems: OtomItem[];
  usedTokenIds: Set<string>;
};

export const OtomItemCard: FC<OtomItemCardProps> = ({
  representativeItem,
  count,
  allItems,
  usedTokenIds,
}) => {
  const { data: craftableItems } = useGetCraftableItems();

  const draggableItem = allItems.find((item) => !usedTokenIds.has(item.tokenId));
  const areAllItemsUsed = allItems.every((item) => usedTokenIds.has(item.tokenId));

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: draggableItem ? draggableItem.tokenId : representativeItem.tokenId,
    data: draggableItem || representativeItem,
    disabled: areAllItemsUsed,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  const isRequiredInBlueprint = craftableItems?.some((item) =>
    item.blueprint.some(
      (b) => b.componentType !== 'variable_otom' && b.name === representativeItem.name
    )
  );

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        'relative cursor-pointer touch-none py-0 font-semibold transition-colors',
        areAllItemsUsed
          ? 'bg-primary text-primary-foreground'
          : isRequiredInBlueprint
            ? 'border-primary text-primary'
            : 'border-border text-muted-foreground font-normal',
        areAllItemsUsed && 'cursor-not-allowed'
      )}
    >
      <CardContent className="grid size-15 place-items-center px-0">
        {representativeItem.name}
        {/* Display count if greater than 1 */}
        {count > 1 && (
          <span className="bg-muted text-muted-foreground absolute -top-2 -right-2 grid h-5 min-w-[20px] place-items-center rounded-full px-1 text-xs font-bold">
            {count}
          </span>
        )}
      </CardContent>
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
      .map((_, index) => {
        const dropped = droppedVariableItems ? droppedVariableItems[index] : null;
        return dropped && dropped.tokenId ? BigInt(dropped.tokenId) : null;
      })
      .filter(isNotNullish);

    try {
      toast.info('Please confirm the transaction in your wallet.');
      await writeContractAsync({
        address: assemblyCore[config.chainId],
        args: [item.id, BigInt(1), variableOtomTokenIds, []],
      });
    } catch (error) {
      toast.error(`An error occurred while crafting ${item.name}, please try again.`);
      console.error(error);
    }
  }

  const {
    isLoading: isTxConfirming,
    isError: isTxError,
    isSuccess: isTxConfirmed,
  } = useWaitForTransactionReceipt({ hash, query: { enabled: !!hash } });
  useEffect(() => {
    if (hash && isTxConfirming) {
      toast.loading('Item is being crafted...');
    }

    if (isTxConfirmed) {
      toast.success(`${item.name} crafted successfully!`);
      refetchOtomItems();
    }

    if (isTxError) {
      toast.error(`An error occurred while crafting ${item.name}, please try again.`);
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
            <span>{trait.name === 'Usages Remaining' ? 'Usages' : trait.name}</span>
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

function getRequiredDropZoneId(itemId: bigint | string, index: number): string {
  return `required-${itemId}-${index}`;
}
