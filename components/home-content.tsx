'use client';

import { ItemsInventory, OtomsInventory } from '@/components/inventories';
import { ItemsToCraft } from '@/components/items';
import { Button } from '@/components/ui/button';
import { InlineLink } from '@/components/ui/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WalletConnect } from '@/components/wallet-connect';
import { paths } from '@/lib/paths';
import type { OtomItem } from '@/lib/types';
import { DndContext, DragOverlay, type DragEndEvent, type DragStartEvent } from '@dnd-kit/core';
import { ExternalLinkIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { useState } from 'react';
import { useAccount } from 'wagmi';

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
    <div className="mx-auto grid min-h-screen max-w-7xl grid-rows-[auto_1fr] gap-4 sm:p-5">
      <header className="flex items-center justify-between p-5 sm:p-0">
        <div className="relative">
          <h1 className="text-primary text-2xl font-semibold tracking-wide uppercase">
            <Link href={paths.home}>Assembly</Link>
          </h1>
          <span className="text-muted-foreground/50 absolute -bottom-8 left-0 text-sm whitespace-nowrap sm:-bottom-5">
            An otom-based item crafter
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="link" className="hidden sm:flex">
            <a href={paths.otom} target="_blank" rel="noopener noreferrer">
              otom.xyz
            </a>
          </Button>

          <WalletConnect />
        </div>
      </header>

      <main className="flex flex-col justify-start gap-8 overflow-x-hidden px-2 py-12 sm:px-0">
        <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
          <div className="flex flex-col gap-16">
            <div className="flex flex-col gap-2">
              <Tabs defaultValue="items-to-craft">
                <div className="flex items-baseline justify-between gap-2">
                  <TabsList>
                    <TabsTrigger value="items-to-craft">Items to craft</TabsTrigger>
                    {address && <TabsTrigger value="owned-otoms">Owned Items</TabsTrigger>}
                  </TabsList>

                  <InlineLink
                    href={paths.repo}
                    className="text-muted-foreground/50 hidden text-sm no-underline hover:underline sm:inline-flex"
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
                  <h2 className="text-primary font-bold tracking-wide uppercase">
                    Owned Otom Elements
                  </h2>
                  <InlineLink
                    href={paths.otom}
                    className="text-muted-foreground/50 hidden text-sm no-underline hover:underline sm:inline-flex"
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
                    <InlineLink href={paths.shape}>Shape</InlineLink>, based on the world of{' '}
                    <InlineLink href={paths.otom}>Otoms</InlineLink>.
                  </p>
                  <p>
                    Composability is at the heart of Assembly. By combining multiple elements new
                    items can be formed, that can be used in other projects.
                  </p>
                  <p>
                    This project is completely open, anyone can contribute to improve the code or
                    submit their own item for people to craft.
                  </p>
                  <InlineLink className="self-start" href={paths.repo}>
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
