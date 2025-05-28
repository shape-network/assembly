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
import { Cross2Icon } from '@radix-ui/react-icons';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { AppWindow } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useMemo, useState } from 'react';
import { Rnd } from 'react-rnd';
import { useAccount } from 'wagmi';

type WindowPosition = { x: number; y: number };
type WindowSize = { width: number; height: number };

const otomWindowPositionAtom = atomWithStorage<WindowPosition>('otom-window-position', {
  x: 0,
  y: 0,
});
const otomWindowSizeAtom = atomWithStorage<WindowSize>('otom-window-size', {
  width: 378, // 5 columns of elements
  height: 400,
});
const otomWindowIsFloatingAtom = atomWithStorage<boolean>('otom-window-is-floating', false);

export const HomeContent = () => {
  const { address } = useAccount();
  const [droppedItemsState, setDroppedItemsState] = useState<DroppedItemsState>({});
  const [activeItem, setActiveItem] = useState<OtomItem | null>(null);
  const [isFloating, setIsFloating] = useAtom(otomWindowIsFloatingAtom);
  const [rndPosition, setRndPosition] = useAtom(otomWindowPositionAtom);
  const [rndSize, setRndSize] = useAtom(otomWindowSizeAtom);
  const handleOpenFloating = useCallback(() => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const xPos = windowWidth - rndSize.width - 50;
    const yPos = windowHeight - rndSize.height - 40;

    setRndPosition({ x: Math.max(0, xPos), y: Math.max(0, yPos) });
    setIsFloating(true);
  }, [rndSize, setRndPosition, setIsFloating]);

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

  const renderOtomsInventory = (isFloatingView = false) => (
    <div
      className={
        isFloatingView
          ? 'flex h-full w-full flex-col gap-2 overflow-hidden p-4'
          : 'flex flex-col gap-2'
      }
    >
      <div
        className={`flex items-baseline justify-between gap-2 ${isFloatingView ? 'rnd-drag-handle cursor-move' : ''}`}
      >
        <h2 className="text-primary font-bold tracking-wide uppercase">Owned Otom Elements</h2>
        <div className="flex items-center gap-2">
          {!isFloating ? (
            <button
              onClick={handleOpenFloating}
              className="text-muted-foreground/50 flex cursor-pointer items-center justify-center gap-2 text-sm no-underline hover:underline"
              aria-label="Open window"
            >
              open in a window
              <AppWindow className="size-4" />
            </button>
          ) : (
            <button
              onClick={() => setIsFloating(false)}
              className="text-muted-foreground/70 hover:text-primary hover:bg-muted/50 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full"
              aria-label="Close window"
            >
              <Cross2Icon className="size-4" />
            </button>
          )}
        </div>
      </div>

      <div className={isFloatingView ? 'flex-1 overflow-auto' : ''}>
        <OtomsInventory usedCounts={usedCounts} />
      </div>
    </div>
  );

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
                {/* <div className="flex h-full w-full flex-col gap-2 overflow-hidden p-4"> */}
                {isFloating ? (
                  <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
                    <Rnd
                      position={rndPosition}
                      size={rndSize}
                      onDragStop={(e, d) => {
                        // Save position to persisted state
                        setRndPosition({ x: d.x, y: d.y });
                      }}
                      onResize={(e, direction, ref, delta, position) => {
                        // Update position during resize without saving to storage
                        // This prevents excessive writes to localStorage
                        setRndPosition(position);
                      }}
                      onResizeStop={(e, direction, ref, delta, position) => {
                        // Save final size and position to persisted state
                        setRndSize({
                          width: parseInt(ref.style.width),
                          height: parseInt(ref.style.height),
                        });
                        setRndPosition(position);
                      }}
                      className="bg-background border-border pointer-events-auto rounded-lg border shadow-lg"
                      dragHandleClassName="rnd-drag-handle"
                    >
                      {renderOtomsInventory(true)}
                    </Rnd>
                  </div>
                ) : (
                  renderOtomsInventory(false)
                )}

                <div className="mt-4 flex flex-wrap gap-2">
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
