'use client';

import {
  useGetCraftableItems,
  useGetMoleculesFromOtomTokenId,
  useGetOtomItemsForUser,
} from '@/app/api/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useWriteAssemblyCoreContractCraftItem } from '@/generated';
import { assemblyCore } from '@/lib/addresses';
import { hoveredOtomIdAtom } from '@/lib/atoms';
import { config } from '@/lib/config';
import { isOtomAtom } from '@/lib/otoms';
import { paths } from '@/lib/paths';
import { checkCriteria, formatPropertyName } from '@/lib/property-utils';
import { BlueprintComponent, Item, Molecule, OtomItem, OwnedItem, Trait } from '@/lib/types';
import { cn, isNotNullish } from '@/lib/utils';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import { useAtom } from 'jotai';
import Image from 'next/image';
import { FC, useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAccount, useSwitchChain, useWaitForTransactionReceipt } from 'wagmi';

export const ItemsToCraft: FC<{
  droppedItemsState: Record<string, Record<number, OtomItem | null>>;
  onDrop: (itemId: string, index: number, item: OtomItem | null) => void;
  droppedOnRequiredSlots: Set<string>;
  onClearRequired: (itemId: string) => void;
  onCraftSuccess: (itemId: string) => void;
}> = ({ droppedItemsState, onDrop, droppedOnRequiredSlots, onClearRequired, onCraftSuccess }) => {
  const { data, isLoading, isError } = useGetCraftableItems();

  if (isLoading) {
    return <ItemsToCraftSkeleton />;
  }

  if (!data || isError) {
    return <p>Error loading items to craft.</p>;
  }

  return (
    <HorizontallScrollWrapper>
      {data.map((item) => {
        const droppedItemsForThisCard = droppedItemsState[String(item.id)] || {};
        return (
          <ItemToCraftCard
            key={item.id}
            item={item}
            droppedVariableItems={droppedItemsForThisCard}
            onDropVariable={onDrop}
            droppedOnRequiredSlots={droppedOnRequiredSlots}
            onClearRequired={onClearRequired}
            onCraftSuccess={onCraftSuccess}
          />
        );
      })}
    </HorizontallScrollWrapper>
  );
};

type ItemToCraftCardProps = {
  item: Item;
  droppedVariableItems: Record<number, OtomItem | null>;
  onDropVariable: (itemId: string, index: number, item: OtomItem | null) => void;
  droppedOnRequiredSlots: Set<string>;
  onClearRequired: (itemId: string) => void;
  onCraftSuccess: (itemId: string) => void;
};

const ItemToCraftCard: FC<ItemToCraftCardProps> = ({
  item,
  droppedVariableItems,
  onDropVariable,
  droppedOnRequiredSlots,
  onClearRequired,
  onCraftSuccess,
}) => {
  const { data } = useGetOtomItemsForUser();
  const inventory = data?.pages.flatMap((page) => page.items) || [];

  function isElementOwned(otomTokenId: bigint): boolean {
    if (!inventory) return false;
    return inventory.some((i) => i.tokenId === otomTokenId.toString());
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
    }) &&
    variableBlueprints.length === Object.keys(droppedVariableItems).length &&
    variableBlueprints.every((_, i) => droppedVariableItems[i] !== null);

  function handleClearRequiredClick() {
    onClearRequired(String(item.id));
  }

  function handleClearVariableClick() {
    variableBlueprints.forEach((_, index) => {
      onDropVariable(String(item.id), index, null);
    });
  }

  const handleSuccess = useCallback(
    (itemId: string) => {
      onCraftSuccess(itemId);
      handleClearRequiredClick();
      handleClearVariableClick();
    },
    [onCraftSuccess]
  );

  const isPickaxe = item.id === BigInt(2);

  return (
    <li className="grid w-[300px] shrink-0 grid-rows-[1fr_auto] gap-1">
      <Card className="relative w-full">
        <CraftItemButton
          isCraftable={isCraftable}
          item={item}
          className="absolute top-2 right-2 z-10 h-8 px-3"
          droppedVariableItems={droppedVariableItems}
          onCraftSuccess={handleSuccess}
        />

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
                  className="scale-125 object-contain"
                />
              ) : (
                <Skeleton className="h-40 w-full" />
              )}
            </div>

            <CardDescription className="text-center italic">{item.description}</CardDescription>

            {isPickaxe ? (
              <ItemTraits
                traits={[
                  { name: 'Tier', value: '1 - 5' },
                  { name: 'Mining Power', value: '6 - 30' },
                  { name: 'Usages', value: '6 - 9' },
                ]}
              />
            ) : (
              <ItemTraits traits={item.initialTraits} />
            )}
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-muted-foreground text-sm">Required components</p>
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
                  const isOwned = isElementOwned(component.itemIdOrOtomTokenId);
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
                    <p className="text-muted-foreground text-sm">Wildcards</p>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <QuestionMarkCircledIcon className="text-muted-foreground/50 size-4" />
                      </TooltipTrigger>

                      <TooltipContent>
                        <p>
                          Enhance the item with otoms that match specific criteria. The higher the
                          value, the more powerful the item will be.
                        </p>
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
  usedCounts: Map<string, number>;
};

export const OtomItemCard: FC<OtomItemCardProps> = ({ representativeItem, count, usedCounts }) => {
  const { data: craftableItems } = useGetCraftableItems();
  const [hoveredTokenId, setHoveredTokenId] = useAtom(hoveredOtomIdAtom);

  const usedCount = usedCounts.get(representativeItem.tokenId) || 0;
  const availableCount = count - usedCount;
  const areAllItemsUsed = availableCount <= 0;

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: representativeItem.tokenId,
    data: representativeItem,
    disabled: areAllItemsUsed,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  const isRequiredInBlueprint = craftableItems?.some((item) =>
    item.blueprint.some(
      (b) =>
        b.componentType !== 'variable_otom' &&
        b.itemIdOrOtomTokenId.toString() === representativeItem.tokenId
    )
  );

  const handleMouseEnter = () => {
    if (isRequiredInBlueprint && !areAllItemsUsed) {
      setHoveredTokenId(representativeItem.tokenId);
    }
  };

  const handleMouseLeave = () => {
    setHoveredTokenId(null);
  };

  const mass =
    representativeItem.giving_atoms.reduce((acc, atom) => acc + atom.mass, 0) +
    representativeItem.receiving_atoms.reduce((acc, atom) => acc + atom.mass, 0);

  const isMolecule = !isOtomAtom(representativeItem);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Card
          ref={setNodeRef}
          style={style}
          {...listeners}
          {...attributes}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={cn(
            'relative cursor-pointer touch-none py-0 font-semibold transition-colors',
            areAllItemsUsed
              ? 'bg-primary text-primary-foreground'
              : isRequiredInBlueprint
                ? 'border-primary text-primary border-dashed'
                : 'border-border text-muted-foreground font-normal',
            areAllItemsUsed && 'cursor-not-allowed',
            hoveredTokenId === representativeItem.tokenId && !areAllItemsUsed && 'bg-primary/15'
          )}
        >
          <CardContent className="grid aspect-square w-full place-items-center px-0 sm:size-15">
            <ElementName otom={representativeItem} />
            {availableCount > 1 && (
              <span className="text-muted-foreground bg-background absolute -top-2 -right-2 grid h-5 min-w-[20px] place-items-center rounded-full px-0.5 text-[10px] font-bold">
                x{availableCount}
              </span>
            )}
          </CardContent>

          {isMolecule && (
            <span
              className={cn(
                'absolute top-0 left-1 text-xs',
                isRequiredInBlueprint ? 'text-primary font-semibold' : 'text-muted-foreground'
              )}
            >
              M
            </span>
          )}
        </Card>
      </TooltipTrigger>

      <TooltipContent className="max-w-[300px]">
        <p className="text-base font-semibold">{representativeItem.name}</p>
        <p className="mb-1">{isMolecule ? 'Molecule (M)' : 'Otom'}</p>
        <p>Hardness: {representativeItem.hardness.toFixed(3)}</p>
        <p>Toughness: {representativeItem.toughness.toFixed(3)}</p>
        <p>Ductility: {representativeItem.ductility.toFixed(3)}</p>
        <p>Mass: {mass}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export const ElementName: FC<{ otom: OtomItem | Molecule; className?: string }> = ({
  otom,
  className,
}) => {
  const isAtom = isOtomAtom(otom);

  return (
    <div className={cn('relative p-0.5 select-none', className)}>
      <span className="flex items-center">
        {isAtom && (
          <span className="mr-0.5 inline-block text-right text-xs">
            <sup className="block leading-1.5 font-semibold">
              {otom.giving_atoms[0].nucleus.nucleons}
            </sup>
            <sub className="block leading-1.5 font-semibold">
              {otom.giving_atoms[0].nucleus.protons}
            </sub>
          </span>
        )}

        <span className="max-w-10 truncate">{otom.name}</span>
      </span>
    </div>
  );
};

const CraftItemButton: FC<{
  item: Item;
  className?: string;
  droppedVariableItems?: Record<number, OtomItem | null>;
  onCraftSuccess?: (itemId: string) => void;
  isCraftable?: boolean;
}> = ({ item, className, droppedVariableItems, onCraftSuccess, isCraftable }) => {
  const { data: hash, writeContractAsync } = useWriteAssemblyCoreContractCraftItem();
  const { refetch: refetchOtomItems } = useGetOtomItemsForUser();
  const { chain: currentWalletChain } = useAccount();
  const { switchChainAsync } = useSwitchChain();

  const [craftingStatus, setCraftingStatus] = useState<'idle' | 'pending' | 'success' | 'error'>(
    'idle'
  );

  async function handleCraftItem() {
    if (!switchChainAsync) {
      toast.error(
        'Could not automatically switch to Shape network. Please ensure your wallet network is set to Shape.'
      );
      return;
    }

    if (currentWalletChain?.id !== config.chainId) {
      try {
        await switchChainAsync({ chainId: config.chainId });
      } catch (error) {
        toast.dismiss();
        toast.error('Failed to switch to Shape network. Please switch manually.');
        console.error('Failed to switch network:', error);
        return;
      }
    }

    setCraftingStatus('pending');
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
        args: [item.id, BigInt(1), variableOtomTokenIds, [], '0x'],
      });
    } catch (error) {
      setCraftingStatus('error');
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
    if (hash && isTxConfirming && craftingStatus === 'pending') {
      toast.loading('Item is being crafted...', { id: 'loading' });
    }
  }, [hash, isTxConfirming, craftingStatus]);

  useEffect(() => {
    if (isTxConfirmed && craftingStatus === 'pending') {
      setCraftingStatus('success');
      toast.success(`${item.name} crafted successfully!`);
      toast.dismiss('loading');
      refetchOtomItems();
      if (onCraftSuccess) {
        onCraftSuccess(String(item.id));
      }
    }
  }, [isTxConfirmed, craftingStatus, onCraftSuccess, refetchOtomItems]);

  useEffect(() => {
    if (isTxError && craftingStatus === 'pending') {
      setCraftingStatus('error');
      toast.error(`An error occurred while crafting ${item.name}, please try again.`);
      toast.dismiss('loading');
    }
  }, [isTxError, craftingStatus, item.name]);

  const disabled = !isCraftable || craftingStatus === 'pending' || isTxConfirming;

  return (
    <Button
      disabled={disabled}
      onClick={handleCraftItem}
      className={cn('disabled:opacity-15', className)}
    >
      {craftingStatus === 'pending' || isTxConfirming ? 'Crafting...' : 'Craft'}
    </Button>
  );
};

export const OwnedItemCard: FC<{ item: OwnedItem }> = ({ item }) => {
  const traits = item.initialTraits.filter((t) => t.name !== 'Usages Remaining');

  const isPickaxe = item.id === BigInt(2);

  return (
    <li className="w-xs shrink-0 sm:w-[300px]">
      <Card className="h-full">
        <CardHeader>
          <CardTitle>{item.name}</CardTitle>
        </CardHeader>

        <div className="relative h-40 w-full">
          {item.defaultImageUri ? (
            <Image
              src={paths.assemblyItemImage(item.id, item.tier ?? 1)}
              alt={item.name}
              fill
              className="object-contain py-2"
            />
          ) : (
            <Skeleton className="h-40 w-full" />
          )}
        </div>

        <CardContent className="flex flex-col gap-6">
          {isPickaxe ? (
            <ItemTraits
              traits={[
                item.tier ? { name: 'Tier', value: item.tier } : null,
                { name: 'Mining Power', value: getPickaxeMiningPower(item.tier ?? 1) },
                { name: 'Remaining Usages', value: item.usagesRemaining ?? '?' },
              ].filter(isNotNullish)}
            />
          ) : (
            <ItemTraits
              traits={[
                item.tier ? { name: 'Tier', value: item.tier } : null,
                ...traits,
                { name: 'Remaining Usages', value: item.usagesRemaining ?? '?' },
              ].filter(isNotNullish)}
            />
          )}
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
    data: { requiredTokenId: String(component.itemIdOrOtomTokenId), type: 'required' },
  });
  const [hoveredTokenId, setHoveredTokenId] = useAtom(hoveredOtomIdAtom);
  const isHoveredTarget = hoveredTokenId === String(component.itemIdOrOtomTokenId);

  const draggedElement = active?.data.current as OtomItem | null;

  const canDrop = draggedElement?.tokenId === String(component.itemIdOrOtomTokenId);

  const { data: molecule } = useGetMoleculesFromOtomTokenId({
    otomTokenId: String(component.itemIdOrOtomTokenId),
    enabled: component.componentType === 'otom',
  });

  const isMolecule = molecule ? !isOtomAtom(molecule) : false;

  const handleMouseEnter = () => {
    if (isOwned) {
      setHoveredTokenId(String(component.itemIdOrOtomTokenId));
    }
  };

  const handleMouseLeave = () => {
    setHoveredTokenId(null);
  };

  return (
    <div ref={setNodeRef}>
      <Card
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(
          'relative py-0 transition-[colors,transform] select-none',
          isDropped
            ? 'bg-primary text-primary-foreground font-semibold'
            : isOwned
              ? 'border-primary border-dashed font-semibold'
              : 'text-muted-foreground/50 border-border font-normal',
          isOver && canDrop && 'ring-primary ring-2 ring-offset-2',
          isOver && !canDrop && 'ring-destructive ring-2 ring-offset-2',
          isHoveredTarget && !isDropped && 'bg-primary/15'
        )}
      >
        <CardContent className="grid size-15 place-items-center px-0">
          {component.componentType === 'otom' && molecule ? (
            <ElementName otom={molecule} />
          ) : (
            component.name
          )}

          {isMolecule && (
            <span
              className={cn(
                'absolute top-0 left-1 text-xs',
                isOwned ? 'text-primary font-semibold' : 'text-muted-foreground/50'
              )}
            >
              M
            </span>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const VariableDropZone: FC<{
  id: string;
  index: number;
  criteria: BlueprintComponent['criteria'];
  droppedItem: OtomItem | null;
}> = ({ id, index, criteria, droppedItem }) => {
  const { isOver, setNodeRef, active } = useDroppable({
    id: id,
    data: { index: index, type: 'variable' },
  });

  const draggedItem = active?.data.current as OtomItem | undefined;
  const canDrop = active ? checkCriteria(draggedItem!, criteria) : false;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div ref={setNodeRef}>
          <Card
            className={cn(
              'relative py-0 transition-colors',
              droppedItem
                ? 'bg-primary border-primary font-semibold text-white'
                : 'border-primary text-primary border-dashed',
              isOver && canDrop && 'ring-primary ring-2 ring-offset-2',
              isOver && !canDrop && 'ring-destructive ring-2 ring-offset-2'
            )}
          >
            <CardContent className="grid size-15 place-items-center px-0">
              {droppedItem ? (
                droppedItem.name
              ) : (
                <div className="relative size-9">
                  <Image
                    src="/molicon.svg"
                    alt="Molecule"
                    fill
                    className="object-contain"
                    loading="lazy"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </TooltipTrigger>

      <TooltipContent>
        <div className="flex flex-col gap-1">
          {criteria.map((c) => (
            <span key={c.propertyType}>
              <p className="font-semibold">{formatPropertyName(c.propertyType)}</p>
              <p className="flex gap-1">
                {c.checkBoolValue ? (
                  `Required: ${c.boolValue}`
                ) : c.checkStringValue ? (
                  `Required: ${c.stringValue}`
                ) : (
                  <>
                    Range:{' '}
                    {typeof c.minValue === 'number' && c.minValue > 10000
                      ? `${c.minValue.toExponential(2)}`
                      : String(c.minValue)}{' '}
                    -{' '}
                    {typeof c.maxValue === 'number' && c.maxValue > 1000000000 ? (
                      <span className="text-sm">∞</span>
                    ) : typeof c.maxValue === 'number' && c.maxValue > 10000 ? (
                      `${c.maxValue.toExponential(2)}`
                    ) : (
                      String(c.maxValue)
                    )}
                  </>
                )}
              </p>
            </span>
          ))}
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

function getRequiredDropZoneId(itemId: bigint | string, index: number): string {
  return `required-${itemId}-${index}`;
}

export const HorizontallScrollWrapper: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ScrollArea className="w-full" orientation="horizontal">
      <div className="overflow-x-auto">
        <ul className="flex flex-nowrap gap-2 pb-4">{children}</ul>
      </div>
    </ScrollArea>
  );
};

export const InventorySkeleton: FC = () => {
  return (
    <div className="flex flex-wrap items-start gap-2">
      {Array.from({ length: 25 }).map((_, index) => (
        <Skeleton key={index} className="size-15" />
      ))}
    </div>
  );
};

export const ItemsToCraftSkeleton: FC = () => {
  return (
    <HorizontallScrollWrapper>
      {Array.from({ length: 4 }).map((_, index) => (
        <li key={index} className="w-xs flex-shrink-0 sm:w-[300px]">
          <Skeleton className="h-[578px] w-full" />
        </li>
      ))}
    </HorizontallScrollWrapper>
  );
};

function getPickaxeMiningPower(tier: number): string {
  switch (tier) {
    case 1:
      return '6';
    case 2:
      return '12';
    case 3:
      return '18';
    case 4:
      return '24';
    case 5:
      return '30';
    default:
      return '6';
  }
}
