'use client';

import {
  useGetCraftableItems,
  useGetItem,
  useGetMoleculesFromOtomTokenId,
  useGetOtomItemsForUser,
} from '@/app/api/hooks';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { assemblyCoreContractAbi, useWriteAssemblyCoreContractCraftItem } from '@/generated';
import { assemblyCore } from '@/lib/addresses';
import { droppedItemsStateAtom, hoveredOtomItemAtom } from '@/lib/atoms';
import { config } from '@/lib/config';
import { useCopyToClipboard } from '@/lib/hooks';
import { isOtomAtom } from '@/lib/otoms';
import { paths } from '@/lib/paths';
import { checkCriteria, formatPropertyName, isExactMatchCriteria } from '@/lib/property-utils';
import { BlueprintComponent, Item, Molecule, OtomItem, OwnedItem, Trait } from '@/lib/types';
import { abbreviateHash, cn, isNotNullish, isSameAddress } from '@/lib/utils';
import { useDndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { QuestionMarkCircledIcon, TrashIcon } from '@radix-ui/react-icons';
import { useAtom, useSetAtom } from 'jotai';
import { ClipboardCopyIcon, CoinsIcon, WrenchIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePostHog } from 'posthog-js/react';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { decodeEventLog, formatEther, toEventSelector } from 'viem';
import { useAccount, useSwitchChain, useWaitForTransactionReceipt } from 'wagmi';

export const ItemsToCraft: FC = () => {
  const { data, isLoading, isError } = useGetCraftableItems();

  if (isLoading) {
    return <ItemsToCraftSkeleton />;
  }

  if (!data || isError) {
    return <p>Error loading items to craft.</p>;
  }

  return (
    <VerticalScrollWrapper>
      {data.map((item) => (
        <ItemToCraftCard key={item.id} item={item} />
      ))}
    </VerticalScrollWrapper>
  );
};

export type DroppedItemsState = Record<string, Record<number, OtomItem | null>>;

type ItemToCraftCardProps = {
  item: Item;
};

const ItemToCraftCard: FC<ItemToCraftCardProps> = ({ item }) => {
  const { data } = useGetOtomItemsForUser();
  const inventory = data?.pages.flatMap((page) => page.items) || [];
  const [droppedItemsState, setDroppedItemsState] = useAtom(droppedItemsStateAtom);

  const droppedItemsForThisCard = droppedItemsState[String(item.id)] || {};

  const requiredIndices = item.blueprint
    .map((bp, index) =>
      bp.componentType !== 'variable_otom' || isExactMatchCriteria(bp.criteria) ? index : null
    )
    .filter(isNotNullish);

  const wildcardIndices = item.blueprint
    .map((bp, index) =>
      bp.componentType === 'variable_otom' && !isExactMatchCriteria(bp.criteria) ? index : null
    )
    .filter(isNotNullish);

  const isCraftable = item.blueprint.every((component, index) => {
    const droppedItem = droppedItemsForThisCard[index];
    if (!droppedItem) return false;

    if (component.componentType === 'otom') {
      const requiredTokenId = String(component.itemIdOrOtomTokenId);
      const requiredAmount = Number(component.amount);
      const ownedAmount = inventory.filter((i) => i.tokenId === requiredTokenId).length || 0;
      return droppedItem.tokenId === requiredTokenId && ownedAmount >= requiredAmount;
    } else if (component.componentType === 'variable_otom') {
      return checkCriteria(droppedItem, component.criteria);
    }
    return false;
  });

  const handleClearAllClick = useCallback(() => {
    setDroppedItemsState((prev) => ({
      ...prev,
      [String(item.id)]: {},
    }));
  }, [item.id, setDroppedItemsState]);

  const hasDroppedItems = Object.values(droppedItemsForThisCard).some((item) => item !== null);

  function isElementOwned(component: BlueprintComponent): boolean {
    if (!inventory || inventory.length === 0) return false;

    if (component.componentType !== 'variable_otom') {
      return inventory.some((i) => i.tokenId === component.itemIdOrOtomTokenId.toString());
    }

    if (isExactMatchCriteria(component.criteria)) {
      return inventory.some((item) => checkCriteria(item, component.criteria));
    }

    return false;
  }

  function getElementOwned(component: BlueprintComponent): OtomItem | undefined {
    if (!inventory || inventory.length === 0) return undefined;

    if (component.componentType !== 'variable_otom') {
      return inventory.find((i) => i.tokenId === component.itemIdOrOtomTokenId.toString());
    }

    if (isExactMatchCriteria(component.criteria)) {
      return inventory.find((item) => checkCriteria(item, component.criteria));
    }

    return undefined;
  }

  const isPickaxe = config.chain.testnet ? false : item.id === BigInt(2);
  const isFungible = item.itemType === 0;
  const formattedSupply = item.supply > 0 ? Intl.NumberFormat('en-US').format(item.supply) : null;

  return (
    <li className="relative grid w-full shrink-0 grid-rows-[1fr_auto] gap-1">
      {isPickaxe && (
        <Badge
          className="bg-background absolute -bottom-1.5 left-1/2 z-10 -translate-x-1/2"
          variant="outline"
        >
          <Link href={paths.otom} target="_blank" rel="noopener noreferrer">
            For otom.xyz
          </Link>
        </Badge>
      )}

      <Card className="relative w-full">
        <CraftItemButton
          droppedItemsState={droppedItemsState}
          isCraftable={isCraftable}
          item={item}
          className="absolute top-2 right-2 z-20 h-8 px-3"
          onCraftSuccess={handleClearAllClick}
        />

        <CardHeader className="relative">
          <CardTitle className="z-10 flex items-center gap-2">
            {isFungible && <FungibleItemBadge />}
            {item.name}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex h-full flex-col justify-between gap-6">
          <div className="flex flex-col gap-6">
            <div className="relative h-40 w-full">
              {item.defaultImageUri ? (
                <Image
                  src={item.defaultImageUri}
                  alt={item.name}
                  fill
                  className={cn('object-contain', isPickaxe && 'scale-180')}
                />
              ) : (
                <Skeleton className="h-40 w-full" />
              )}
            </div>

            <CardDescription
              className="z-10 line-clamp-2 min-h-10 text-center italic"
              title={item.description}
            >
              {item.description}
            </CardDescription>

            {isPickaxe ? (
              <ItemTraits
                traits={[
                  { name: 'Tier', value: '1 - 5' },
                  { name: 'Mining Power', value: '6 - 30' },
                  { name: 'Usages', value: '6 - 9' },
                ]}
              />
            ) : (
              <ItemTraits
                traits={[
                  ...item.initialTraits,
                  ...(item.ethCostInWei
                    ? [{ name: 'Price', value: formatEther(item.ethCostInWei) }]
                    : []),
                ]}
              />
            )}
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-muted-foreground text-sm">Required components</p>
                {hasDroppedItems && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground h-5 cursor-pointer px-2 text-xs"
                    onClick={handleClearAllClick}
                  >
                    Clear
                  </Button>
                )}
              </div>

              <div className="flex flex-wrap gap-1">
                {requiredIndices.map((blueprintIndex) => {
                  const component = item.blueprint[blueprintIndex];
                  const dropId = `required-${item.id}-${blueprintIndex}`;
                  const isDropped = !!droppedItemsForThisCard[blueprintIndex];
                  return (
                    <RequiredDropZone
                      key={dropId}
                      id={dropId}
                      component={component}
                      isOwned={isElementOwned(component)}
                      isDropped={isDropped}
                      index={blueprintIndex}
                      droppedItem={getElementOwned(component)}
                    />
                  );
                })}
              </div>
            </div>

            {wildcardIndices.length > 0 ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <p className="text-muted-foreground text-sm">Wildcards</p>
                    <Tooltip delayDuration={0}>
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
                </div>

                <div className="flex justify-start gap-1">
                  {wildcardIndices.map((blueprintIndex) => {
                    const dropId = `variable-${item.id}-${blueprintIndex}`;
                    const droppedItem = droppedItemsForThisCard[blueprintIndex] || null;
                    return (
                      <WildcardDropZone
                        key={dropId}
                        id={dropId}
                        index={blueprintIndex}
                        component={item.blueprint[blueprintIndex]}
                        droppedItem={droppedItem}
                      />
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="h-[90px]" />
            )}

            <SupplyBadge supply={formattedSupply} itemId={item.id} />
          </div>
        </CardContent>

        {process.env.NODE_ENV === 'development' && (
          <p className="text-muted-foreground/50 absolute right-2 bottom-1 text-xs">
            dev itemId: {item.id}
          </p>
        )}
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
  const { isCopied, copyToClipboard } = useCopyToClipboard();
  const { data: craftableItems } = useGetCraftableItems();
  const [hoveredState, setHoveredState] = useAtom(hoveredOtomItemAtom);

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

  // Check if this item is required in any blueprint as a standard required component OR
  // as a variable component with exact match criteria
  const isRequiredInBlueprint = craftableItems?.some((item) =>
    item.blueprint.some((b) => {
      // Standard required component check
      if (b.componentType !== 'variable_otom') {
        return b.itemIdOrOtomTokenId.toString() === representativeItem.tokenId;
      }

      // Variable component with exact match criteria
      if (isExactMatchCriteria(b.criteria)) {
        return checkCriteria(representativeItem, b.criteria);
      }

      return false;
    })
  );

  const shouldHighlightFromBlueprintHover =
    !!hoveredState?.component &&
    ((hoveredState.component.componentType !== 'variable_otom' &&
      hoveredState.component.itemIdOrOtomTokenId.toString() === representativeItem.tokenId) ||
      (hoveredState.component.componentType === 'variable_otom' &&
        isExactMatchCriteria(hoveredState.component.criteria) &&
        checkCriteria(representativeItem, hoveredState.component.criteria)));

  function handleMouseEnter() {
    if (isRequiredInBlueprint && !areAllItemsUsed) {
      setHoveredState({ item: representativeItem });
    }
  }

  function handleMouseLeave() {
    setHoveredState(null);
  }

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
            (hoveredState?.item?.tokenId === representativeItem.tokenId ||
              shouldHighlightFromBlueprintHover) &&
              !areAllItemsUsed &&
              'bg-primary/15'
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
        <div className="flex items-center gap-2">
          <p>Token ID: {abbreviateHash(representativeItem.tokenId, 3, 4)}</p>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5"
            onClick={(e) => {
              e.stopPropagation();
              copyToClipboard(representativeItem.tokenId);
              toast.success('Token ID copied to clipboard');
            }}
          >
            <ClipboardCopyIcon className="h-3 w-3" />
            {isCopied && <span className="sr-only">Copied</span>}
          </Button>
        </div>
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
  onCraftSuccess?: (itemId: string) => void;
  isCraftable?: boolean;
  droppedItemsState: DroppedItemsState;
}> = ({ item, className, onCraftSuccess, isCraftable, droppedItemsState }) => {
  const [craftingStatus, setCraftingStatus] = useState<'idle' | 'pending' | 'success' | 'error'>(
    'idle'
  );
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const posthog = usePostHog();

  const { data: hash, writeContractAsync } = useWriteAssemblyCoreContractCraftItem();
  const {
    isLoading: isTxConfirming,
    isError: isTxError,
    isSuccess: isTxConfirmed,
    data: txReceipt,
  } = useWaitForTransactionReceipt({ hash, query: { enabled: !!hash } });
  const { refetch: refetchOtomItems } = useGetOtomItemsForUser();
  const { chain: currentWalletChain } = useAccount();
  const { switchChainAsync } = useSwitchChain();

  const craftedItemTokenId = useMemo<string | undefined>(() => {
    if (txReceipt && txReceipt.logs && txReceipt.logs.length > 0) {
      const itemCraftedSelector = toEventSelector(
        'ItemCrafted(address,uint256,uint256,uint256,(uint8,uint256,uint256,(uint8,uint256,uint256,bool,bool,string,bool,bytes32,bool)[])[])'
      );

      const craftLog = txReceipt.logs.find(
        (log) =>
          isSameAddress(log.address, assemblyCore[config.chain.id]) &&
          log.topics &&
          log.topics[0] === itemCraftedSelector
      );

      if (craftLog) {
        try {
          const decodedLog = decodeEventLog({
            abi: assemblyCoreContractAbi,
            eventName: 'ItemCrafted',
            data: craftLog.data,
            topics: craftLog.topics,
          });

          if (decodedLog.args && 'tokenId' in decodedLog.args) {
            const tokenId = decodedLog.args.tokenId;
            return typeof tokenId === 'bigint' ? tokenId.toString() : String(tokenId);
          }

          console.error(
            'ItemCrafted event decoded, but tokenId not found in args:',
            decodedLog.args
          );
          return undefined;
        } catch (error) {
          console.error('Failed to decode ItemCrafted event with full ABI:', error);
        }
      }
      return undefined;
    }
    return undefined;
  }, [txReceipt]);

  const { data: craftedItem } = useGetItem({
    itemTokenId: craftedItemTokenId ?? '',
    itemId: String(item.id),
    enabled: !!craftedItemTokenId && !!item.id,
  });

  async function handleCraftItem() {
    posthog?.capture('click', {
      event: 'craft_item',
      itemId: String(item.id),
      itemName: item.name,
    });

    if (!switchChainAsync) {
      toast.error(
        'Could not automatically switch to Shape network. Please ensure your wallet network is set to Shape.'
      );
      return;
    }

    if (currentWalletChain?.id !== config.chain.id) {
      try {
        await switchChainAsync({ chainId: config.chain.id });
      } catch (error) {
        toast.dismiss();
        toast.error('Failed to switch to Shape network. Please switch manually.');
        console.error('Failed to switch network:', error);
        return;
      }
    }

    setCraftingStatus('pending');

    const variableOtomTokenIds = item.blueprint
      .map((bp, index) => {
        if (bp.componentType === 'variable_otom') {
          const dropped = droppedItemsState[String(item.id)]?.[index];
          return dropped ? BigInt(dropped.tokenId) : null;
        }
        return null;
      })
      .filter(isNotNullish);

    try {
      toast.info('Please confirm the transaction in your wallet.');
      await writeContractAsync({
        address: assemblyCore[config.chain.id],
        args: [item.id, BigInt(1), variableOtomTokenIds, [], '0x'],
        value: item.ethCostInWei,
      });
    } catch (error) {
      setCraftingStatus('error');
      toast.error(`An error occurred while crafting ${item.name}, please try again.`);
      console.error(error);
    }
  }

  useEffect(() => {
    if (hash && isTxConfirming && craftingStatus === 'pending') {
      toast.loading('Item is being crafted...', { id: 'loading' });
    }
  }, [hash, isTxConfirming, craftingStatus, posthog, item.id]);

  useEffect(() => {
    if (isTxConfirmed && craftingStatus === 'pending') {
      setCraftingStatus('success');
      toast.success(`${item.name} crafted successfully!`);
      toast.dismiss('loading');
      setShowSuccessDialog(true);
      refetchOtomItems();
      posthog?.capture('item_crafted', {
        itemId: String(item.id),
        itemName: item.name,
      });
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

  const isPickaxe = config.chain.testnet ? false : item.id === BigInt(2);

  const disabled = !isCraftable || craftingStatus === 'pending' || isTxConfirming;

  return (
    <>
      <Button
        disabled={disabled}
        onClick={handleCraftItem}
        className={cn('disabled:opacity-15', className)}
      >
        {craftingStatus === 'pending' || isTxConfirming ? 'Crafting...' : 'Craft'}
      </Button>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center">Item Crafted Successfully!</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="relative h-60 w-full">
              {craftedItem?.defaultImageUri ? (
                <Image
                  src={
                    craftedItem?.defaultImageUri ??
                    paths.assemblyItemImage(craftedItem.id, craftedItem.tier ?? 1)
                  }
                  alt={craftedItem.name}
                  fill
                  className="object-contain"
                />
              ) : (
                <Skeleton className="h-60 w-full" />
              )}
            </div>

            <div className="flex w-full flex-col items-center gap-2">
              <h3 className="text-xl font-bold">{craftedItem?.name ?? '-'}</h3>
              <p className="text-muted-foreground text-center">{craftedItem?.description ?? '-'}</p>

              {craftedItem && (
                <div className="w-full">
                  {isPickaxe ? (
                    <ItemTraits
                      traits={[
                        craftedItem.tier ? { name: 'Tier', value: craftedItem.tier } : null,
                        {
                          name: 'Mining Power',
                          value: getPickaxeMiningPower(craftedItem.tier ?? 1),
                        },
                        { name: 'Remaining Usages', value: craftedItem.usagesRemaining ?? '?' },
                      ].filter(isNotNullish)}
                    />
                  ) : (
                    <ItemTraits
                      traits={[
                        craftedItem.tier ? { name: 'Tier', value: craftedItem.tier } : null,
                        ...craftedItem?.initialTraits.filter((t) => t.name !== 'Usages Remaining'),
                        craftedItem.usagesRemaining
                          ? { name: 'Usages', value: craftedItem.usagesRemaining }
                          : null,
                      ].filter(isNotNullish)}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export const OwnedItemCard: FC<{ item: OwnedItem }> = ({ item }) => {
  const traits = item.initialTraits.filter((t) => t.name !== 'Usages Remaining');

  const isPickaxe = config.chain.testnet ? false : item.id === BigInt(2);
  const isFungible = item.itemType === 0;

  const formattedSupply = item.supply > 0 ? Intl.NumberFormat('en-US').format(item.supply) : null;

  return (
    <li className="relative w-full">
      {isPickaxe && (
        <Badge
          className="bg-background absolute -bottom-2.5 left-1/2 z-10 -translate-x-1/2"
          variant="outline"
        >
          <Link href={paths.otom} target="_blank" rel="noopener noreferrer">
            For otom.xyz
          </Link>
        </Badge>
      )}

      <Link href={paths.openSea.token(item.tokenId)} target="_blank" rel="noopener noreferrer">
        <Card className="grid h-full grid-rows-[auto_1fr_auto]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isFungible && <FungibleItemBadge />}
              {item.name}
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col gap-6">
            <div className="relative h-40 w-full">
              {item.defaultImageUri ? (
                <Image
                  src={
                    isPickaxe
                      ? paths.assemblyItemImage(item.id, item.tier ?? 1)
                      : item.defaultImageUri
                  }
                  alt={item.name}
                  fill
                  className="object-contain"
                />
              ) : (
                <Skeleton className="h-40 w-full" />
              )}
            </div>

            <CardDescription
              className="line-clamp-2 min-h-10 text-center italic"
              title={item.description}
            >
              {item.description}
            </CardDescription>

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
                  item.usagesRemaining
                    ? { name: 'Remaining Usages', value: item.usagesRemaining }
                    : null,
                ].filter(isNotNullish)}
              />
            )}
          </CardContent>

          <div className="px-4">
            <SupplyBadge supply={formattedSupply} itemId={item.id} />
          </div>
        </Card>
      </Link>
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
  index: number;
  droppedItem?: OtomItem | null;
}> = ({ id, component, isOwned, isDropped, index, droppedItem }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
    data: {
      type: 'required',
      index: index,
      component: component,
    },
  });
  const setDroppedItemsState = useSetAtom(droppedItemsStateAtom);
  const posthog = usePostHog();

  const { active } = useDndContext();
  const draggedItem = active?.data.current as OtomItem | null;

  const canDrop = draggedItem
    ? component.componentType === 'otom'
      ? draggedItem.tokenId === String(component.itemIdOrOtomTokenId)
      : checkCriteria(draggedItem, component.criteria)
    : false;

  const [hoveredState, setHoveredState] = useAtom(hoveredOtomItemAtom);

  const isHoveredTarget =
    (component.componentType !== 'variable_otom' &&
      hoveredState?.item?.tokenId === String(component.itemIdOrOtomTokenId)) ||
    (component.componentType === 'variable_otom' &&
      isExactMatchCriteria(component.criteria) &&
      hoveredState?.item &&
      checkCriteria(hoveredState.item, component.criteria));

  const { data: molecule } = useGetMoleculesFromOtomTokenId({
    otomTokenId: String(component.itemIdOrOtomTokenId),
    enabled: component.componentType === 'otom',
  });

  const isMolecule = molecule ? !isOtomAtom(molecule) : false;

  function handleMouseEnter() {
    if (isOwned) {
      setHoveredState({ component, item: null });
    }
  }

  function handleMouseLeave() {
    setHoveredState(null);
  }

  const handleClick = useCallback(() => {
    if (isDropped) return;

    if (isOwned && droppedItem) {
      const parts = id.split('-');
      const itemId = parts[1];
      setDroppedItemsState((prev) => ({
        ...prev,
        [itemId]: {
          ...prev[itemId],
          [index]: droppedItem,
        },
      }));
      posthog?.capture('click', {
        event: 'add_component',
        itemId,
        componentType: component.componentType,
      });
    }
  }, [isOwned, droppedItem, setDroppedItemsState, id, index, isDropped, posthog, component]);

  const handleRemove = useCallback(() => {
    const parts = id.split('-');
    const itemId = parts[1];
    setDroppedItemsState((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [index]: null,
      } as Record<number, OtomItem>,
    }));
    posthog?.capture('click', {
      event: 'remove_component',
      itemId,
      componentType: component.componentType,
    });
  }, [setDroppedItemsState, id, index, posthog, component]);

  return (
    <div ref={setNodeRef}>
      <Card
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(
          'py-0 transition-[colors,transform] select-none',
          isDropped
            ? 'bg-primary text-primary-foreground font-semibold'
            : isOwned
              ? 'border-primary cursor-pointer border-dashed font-semibold'
              : 'text-muted-foreground/50 border-border font-normal',
          !isDropped && isOver && canDrop && 'ring-primary ring-2 ring-offset-2',
          !isDropped && isOver && !canDrop && 'ring-destructive ring-2 ring-offset-2',
          isHoveredTarget && !isDropped && 'bg-primary/15'
        )}
        onClick={handleClick}
      >
        <CardContent className="group relative grid size-15 place-items-center px-0">
          {isDropped && (
            <button
              type="button"
              className="absolute inset-0 z-10 hidden cursor-pointer items-center justify-center bg-white/25 group-hover:flex"
              onClick={handleRemove}
              title="Remove component"
            >
              <span className="absolute top-1 right-1 rounded bg-white/90 p-[3px]">
                <TrashIcon className="text-primary size-4" />
              </span>
            </button>
          )}
          {component.componentType === 'otom' && molecule ? (
            <ElementName otom={molecule} />
          ) : (
            component.name
          )}

          {(isMolecule || component.name === 'Ju₃') && (
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

const WildcardDropZone: FC<{
  id: string;
  index: number;
  component: BlueprintComponent;
  droppedItem: OtomItem | null;
}> = ({ id, index, component, droppedItem }) => {
  const { isOver, setNodeRef, active } = useDroppable({
    id: id,
    data: { index, type: 'variable', component },
  });

  const draggedItem = active?.data.current as OtomItem | undefined;
  const canDrop = active ? checkCriteria(draggedItem!, component.criteria) : false;

  return (
    <Tooltip delayDuration={0}>
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
          {component.criteria.map((c) => (
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

export const VerticalScrollWrapper: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ScrollArea className="w-full" orientation="vertical">
      <ul className="grid grid-cols-1 gap-4 pb-4 sm:grid-cols-2 lg:grid-cols-3">{children}</ul>
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
    <VerticalScrollWrapper>
      {Array.from({ length: 4 }).map((_, index) => (
        <li key={index} className="w-full">
          <Skeleton className="h-[578px] w-full" />
        </li>
      ))}
    </VerticalScrollWrapper>
  );
};

const FungibleItemBadge: FC = () => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <CoinsIcon className="size-4" />
      </TooltipTrigger>

      <TooltipContent>
        <p>Fungible item: all instances and their properties are identical.</p>
      </TooltipContent>
    </Tooltip>
  );
};

const SupplyBadge: FC<{ supply: string | null; itemId: bigint }> = ({ supply, itemId }) => {
  return supply ? (
    <Tooltip>
      <TooltipTrigger
        className="text-muted-foreground flex items-center gap-1 self-start text-xs"
        asChild
      >
        <Link href={paths.openSea.item(itemId)}>
          <WrenchIcon className="text-muted-foreground size-3" /> {supply}x
        </Link>
      </TooltipTrigger>

      <TooltipContent>
        <p>Active items: </p>
        <p className="italic">crafted amount - burned amount (used)</p>
      </TooltipContent>
    </Tooltip>
  ) : (
    <span />
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
