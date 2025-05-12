'use client';

import { useGetCraftableItems, useGetItemsForUser, useGetOtomItemsForUser } from '@/app/api/hooks';
import {
  HorizontallScrollWrapper,
  ItemToCraftCard,
  OtomItemCard,
  OwnedItemCard,
} from '@/components/items';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { InlineLink } from '@/components/ui/link';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WalletConnect } from '@/components/wallet-connect';
import { paths } from '@/lib/paths';
import type { OtomItem } from '@/lib/types';
import { DndContext, DragOverlay, type DragEndEvent, type DragStartEvent } from '@dnd-kit/core';
import { ExternalLinkIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { useDeferredValue, useMemo, useState, type FC } from 'react';
import { useAccount } from 'wagmi';

const ItemsToCraft: FC<{
  droppedItemsState: Record<string, Record<number, OtomItem | null>>;
  onDrop: (itemId: string, index: number, item: OtomItem | null) => void;
  droppedOnRequiredSlots: Set<string>;
  onClearRequired: (itemId: string) => void;
  onCraftSuccess?: (itemId: string) => void;
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

type GroupedOtomItems = {
  representativeItem: OtomItem;
  count: number;
  allItems: OtomItem[];
};

const OtomsInventory: FC<{ usedRequiredItems: Set<string> }> = ({ usedRequiredItems }) => {
  const { data: rawInventory, isLoading, isError } = useGetOtomItemsForUser();
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm);

  const groupedInventory = useMemo(() => {
    if (!rawInventory) return [];

    const filteredInventory = rawInventory.filter((item) =>
      item.name.toLowerCase().includes(deferredSearchTerm.toLowerCase())
    );
    const groups = new Map<string, GroupedOtomItems>();
    for (const item of filteredInventory) {
      if (groups.has(item.tokenId)) {
        const group = groups.get(item.tokenId);
        if (group) {
          group.count++;
          group.allItems.push(item);
        }
      } else {
        groups.set(item.tokenId, {
          representativeItem: item,
          count: 1,
          allItems: [item],
        });
      }
    }
    return Array.from(groups.values());
  }, [rawInventory, deferredSearchTerm]);

  if (isLoading) {
    return <InventorySkeleton />;
  }

  if (isError) {
    return <p>Error loading inventory.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {!rawInventory ||
        (rawInventory.length === 0 && (
          <div className="grid place-items-center gap-4 py-12">
            <p>No otoms found in your wallet.</p>
            <Button asChild>
              <a href={paths.otom} target="_blank" rel="noopener noreferrer">
                Get otoms
              </a>
            </Button>
          </div>
        ))}

      <Input
        type="search"
        placeholder="Search owned otoms (eg Ju)"
        className="max-w-xs"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        disabled={!rawInventory || rawInventory.length === 0}
      />

      <ScrollArea className="h-full max-h-[50vh] sm:max-h-[36vh]">
        {groupedInventory.length > 0 ? (
          <ul className="flex flex-wrap items-start gap-2 rounded">
            {groupedInventory.map((group) => (
              <OtomItemCard
                key={group.representativeItem.tokenId}
                representativeItem={group.representativeItem}
                count={group.count}
                allItems={group.allItems}
                usedTokenIds={usedRequiredItems}
              />
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground py-4 text-sm">{`No otoms found matching "${deferredSearchTerm}".`}</p>
        )}
      </ScrollArea>
    </div>
  );
};

const ItemsInventory: FC = () => {
  const { data, isLoading, isError } = useGetItemsForUser();

  if (isLoading) {
    return <ItemsToCraftSkeleton />;
  }

  if (isError) {
    return <p>Error loading inventory.</p>;
  }

  if (!data || data.length === 0)
    return (
      <Card>
        <CardContent className="grid place-items-center gap-4 py-12">
          <p>No items found in your wallet.</p>
        </CardContent>
      </Card>
    );

  return (
    <HorizontallScrollWrapper>
      {data.map((item) => (
        <OwnedItemCard key={item.id} item={item} />
      ))}
    </HorizontallScrollWrapper>
  );
};

const InventorySkeleton: FC = () => {
  return (
    <div className="flex flex-wrap items-start gap-2">
      {Array.from({ length: 25 }).map((_, index) => (
        <Skeleton key={index} className="size-15" />
      ))}
    </div>
  );
};

const ItemsToCraftSkeleton: FC = () => {
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

export const HomeContent = () => {
  const { address } = useAccount();
  const [droppedItemsState, setDroppedItemsState] = useState<
    Record<string, Record<number, OtomItem | null>>
  >({});
  const [droppedOnRequiredSlots, setDroppedOnRequiredSlots] = useState<Set<string>>(new Set());
  const [usedRequiredItems, setUsedRequiredItems] = useState<Set<string>>(new Set());
  const [requiredSlotToOtomMap, setRequiredSlotToOtomMap] = useState<Record<string, string>>({});
  const [activeItem, setActiveItem] = useState<OtomItem | null>(null);

  function handleDrop(itemId: string, index: number, droppedItem: OtomItem | null) {
    setDroppedItemsState((prev) => {
      const newState = { ...prev };
      if (!newState[itemId]) {
        newState[itemId] = {};
      }
      newState[itemId][index] = droppedItem;
      if (droppedItem === null && Object.values(newState[itemId]).every((v) => v === null)) {
      }
      return newState;
    });
  }

  function handleClearRequired(itemId: string) {
    const slotsToClear = new Set<string>();
    const otomsToUnuse = new Set<string>();
    const mapUpdates = { ...requiredSlotToOtomMap };

    for (const slotId in mapUpdates) {
      if (slotId.startsWith(`required-${itemId}-`)) {
        slotsToClear.add(slotId);
        otomsToUnuse.add(mapUpdates[slotId]);
        delete mapUpdates[slotId];
      }
    }

    if (slotsToClear.size > 0) {
      setRequiredSlotToOtomMap(mapUpdates);
      setDroppedOnRequiredSlots((prev) => new Set([...prev].filter((id) => !slotsToClear.has(id))));
      setUsedRequiredItems((prev) => new Set([...prev].filter((id) => !otomsToUnuse.has(id))));
    }
  }

  function handleCraftSuccess(itemId: string) {
    handleClearRequired(itemId);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveItem(null);

    if (over) {
      const droppedItemData = active.data.current as OtomItem | null;
      const dropZoneId = String(over.id);
      const dropZoneData = over.data.current as {
        type: string;
        requiredTokenId?: string;
        index?: number;
      };
      const draggedItemId = String(active.id);

      if (!droppedItemData || !dropZoneData) return;

      if (dropZoneData?.type === 'required') {
        if (droppedItemData?.tokenId === dropZoneData?.requiredTokenId) {
          setDroppedOnRequiredSlots((prev) => new Set(prev).add(dropZoneId));
          setUsedRequiredItems((prev) => new Set(prev).add(draggedItemId));
          setRequiredSlotToOtomMap((prev) => ({ ...prev, [dropZoneId]: draggedItemId }));
        }
      } else if (dropZoneData?.type === 'variable') {
        const parts = dropZoneId.split('-');
        if (parts.length === 3 && parts[0] === 'variable') {
          const itemId = parts[1];
          const index = parseInt(parts[2], 10);
          if (!isNaN(index)) {
            handleDrop(itemId, index, droppedItemData);
          } else {
            console.error('Could not parse index from drop zone ID:', dropZoneId);
          }
        } else {
          console.error('Could not parse item ID and index from drop zone ID:', dropZoneId);
        }
      }
    } else {
      let slotIdToClear: string | null = null;
      for (const slotId in requiredSlotToOtomMap) {
        if (requiredSlotToOtomMap[slotId] === String(active.id)) {
          slotIdToClear = slotId;
          break;
        }
      }
      if (slotIdToClear) {
        setDroppedOnRequiredSlots((prev) => {
          const newSet = new Set(prev);
          newSet.delete(slotIdToClear!);
          return newSet;
        });
        setUsedRequiredItems((prev) => {
          const newSet = new Set(prev);
          newSet.delete(String(active.id));
          return newSet;
        });
        setRequiredSlotToOtomMap((prev) => {
          const newMap = { ...prev };
          delete newMap[slotIdToClear!];
          return newMap;
        });
      }
    }
  }

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const droppedItemData = active.data.current as OtomItem | null;
    if (droppedItemData) {
      setActiveItem(droppedItemData);
    }
  }

  return (
    <div className="mx-auto grid min-h-screen max-w-7xl grid-rows-[auto_1fr] gap-4 p-5">
      <header className="flex items-center justify-between">
        <div className="relative">
          <h1 className="text-primary text-2xl font-semibold tracking-wide uppercase">
            <Link href={paths.home}>Assembly</Link>
          </h1>
          <span className="text-muted-foreground/50 absolute -bottom-5 left-0 text-sm whitespace-nowrap">
            An otom-based item crafter
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="link">
            <a href={paths.otom} target="_blank" rel="noopener noreferrer">
              otom.xyz
            </a>
          </Button>

          <WalletConnect />
        </div>
      </header>

      <main className="flex flex-col justify-start gap-8 overflow-x-hidden py-12">
        <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
          <div className="flex flex-col gap-16">
            <div className="flex flex-col gap-2">
              <Tabs defaultValue="items-to-craft">
                <div className="flex items-baseline justify-between gap-2">
                  <TabsList>
                    <TabsTrigger value="items-to-craft">Items to craft</TabsTrigger>
                    <TabsTrigger value="owned-otoms">Owned Items</TabsTrigger>
                  </TabsList>

                  <InlineLink
                    href={paths.repo}
                    className="text-muted-foreground/50 text-sm no-underline hover:underline"
                  >
                    Propose your own <ExternalLinkIcon className="size-4" />
                  </InlineLink>
                </div>

                <TabsContent value="items-to-craft">
                  <ItemsToCraft
                    droppedItemsState={droppedItemsState}
                    onDrop={handleDrop}
                    droppedOnRequiredSlots={droppedOnRequiredSlots}
                    onClearRequired={handleClearRequired}
                    onCraftSuccess={handleCraftSuccess}
                  />
                </TabsContent>

                <TabsContent value="owned-otoms">
                  <ItemsInventory />
                </TabsContent>
              </Tabs>
            </div>

            {address ? (
              <div className="flex w-full flex-col gap-2">
                <div className="flex items-baseline justify-between gap-2">
                  <h2 className="text-primary font-bold tracking-wide uppercase">Owned otoms</h2>
                  <InlineLink
                    href={paths.otom}
                    className="text-muted-foreground/50 text-sm no-underline hover:underline"
                  >
                    Mine more otoms <ExternalLinkIcon className="size-4" />
                  </InlineLink>
                </div>

                <OtomsInventory usedRequiredItems={usedRequiredItems} />
              </div>
            ) : (
              <div className="flex w-full flex-col items-start gap-8">
                <div className="flex flex-col gap-4">
                  <p>
                    Assembly is an open-source item crafting tool on{' '}
                    <InlineLink href={paths.otom}>Shape</InlineLink>, based on the world of{' '}
                    <InlineLink href={paths.otom}>Otoms</InlineLink>.
                  </p>
                  <p>
                    It&apos;s In esse ullamco in mollit mollit irure laboris irure consectetur
                    aliqua cillum velit duis commodo incididunt. Quis anim consectetur fugiat dolore
                    occaecat nulla ipsum enim laborum ut sint ut.
                  </p>
                  <InlineLink className="self-start" href={paths.otom}>
                    View source code
                  </InlineLink>
                </div>

                <div className="flex w-full flex-col items-center gap-2">
                  <WalletConnect />
                </div>
              </div>
            )}
          </div>

          <DragOverlay zIndex={50} dropAnimation={null}>
            {activeItem && (
              <div className="bg-card size-15 rounded-md border p-1 shadow-md">
                <div className="bg-muted flex size-full items-center justify-center">
                  {activeItem.name.substring(0, 2)}
                </div>
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </main>
    </div>
  );
};
