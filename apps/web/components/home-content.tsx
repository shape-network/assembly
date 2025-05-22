'use client';

import { ItemsInventory, OtomsInventory } from '@/components/inventories';
import { DroppedItemsState, ItemsToCraft } from '@/components/items';
import { InlineLink } from '@/components/ui/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WalletConnect } from '@/components/wallet-connect';
import { paths } from '@/lib/paths';
import { checkCriteria } from '@/lib/property-utils';
import type { BlueprintComponent, OtomItem } from '@/lib/types';
import { DndContext, DragOverlay, type DragEndEvent, type DragStartEvent } from '@dnd-kit/core';
import { ExternalLinkIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { useCallback, useMemo, useState } from 'react';
import { useAccount } from 'wagmi';

export const HomeContent = () => {
  const { address } = useAccount();
  const [droppedItemsState, setDroppedItemsState] = useState<DroppedItemsState>({});
  const [activeItem, setActiveItem] = useState<OtomItem | null>(null);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setActiveItem(null);

    if (!over) return;

    const droppedItem = active.data.current as OtomItem | null;
    const dropZoneId = String(over.id);
    const dropZoneData = over.data.current as {
      type: string;
      index: number;
      component: BlueprintComponent;
    };

    if (!droppedItem || !dropZoneData) return;

    const parts = dropZoneId.split('-');
    const itemId = parts[1];
    const blueprintIndex = dropZoneData.index;
    const component = dropZoneData.component;

    let canDrop = false;
    if (component.componentType === 'otom') {
      canDrop = droppedItem.tokenId === String(component.itemIdOrOtomTokenId);
    } else if (component.componentType === 'variable_otom') {
      canDrop = checkCriteria(droppedItem, component.criteria);
    }

    if (canDrop) {
      setDroppedItemsState((prev) => ({
        ...prev,
        [itemId]: {
          ...prev[itemId],
          [blueprintIndex]: droppedItem,
        },
      }));
    }
  }, []);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const droppedItemData = active.data.current as OtomItem | null;
    if (droppedItemData) {
      setActiveItem(droppedItemData);
    }
  }, []);

  const usedCounts = useMemo(() => {
    const counts = new Map<string, number>();
    Object.values(droppedItemsState).forEach((itemDrops) => {
      Object.values(itemDrops).forEach((item) => {
        if (item) {
          counts.set(item.tokenId, (counts.get(item.tokenId) || 0) + 1);
        }
      });
    });
    return counts;
  }, [droppedItemsState]);

  const handleClearSlots = useCallback((itemId: string) => {
    setDroppedItemsState((prev) => ({
      ...prev,
      [itemId]: Object.fromEntries(Object.keys(prev[itemId] || {}).map((index) => [index, null])),
    }));
  }, []);

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
          <InlineLink href={paths.otom} target="_blank" rel="noopener noreferrer" className="px-3">
            otom.xyz
          </InlineLink>

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
                    href={paths.create}
                    className="text-muted-foreground/50 hidden text-sm no-underline hover:underline sm:inline-flex"
                  >
                    Propose your own <ExternalLinkIcon className="size-4" />
                  </InlineLink>
                </div>

                <TabsContent value="items-to-craft">
                  <ItemsToCraft
                    droppedItemsState={droppedItemsState}
                    onClearSlots={handleClearSlots}
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

                <OtomsInventory usedCounts={usedCounts} />

                <div className="mt-24 flex flex-wrap gap-2">
                  <InlineLink className="self-start" href={paths.repo}>
                    Contribute
                  </InlineLink>
                  <span>・</span>
                  <InlineLink className="self-start" href={paths.docs.assembly}>
                    Documentation
                  </InlineLink>
                </div>
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
                  <div className="flex flex-wrap gap-2">
                    <InlineLink className="self-start" href={paths.repo}>
                      Source code
                    </InlineLink>
                    <span>・</span>
                    <InlineLink className="self-start" href={paths.docs.assembly}>
                      Documentation
                    </InlineLink>
                  </div>
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
