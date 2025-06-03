'use client';

import { ItemsInventory, OtomsInventory } from '@/components/inventories';
import { DroppedItemsState, ItemsToCraft } from '@/components/items';
import { OnboardingWizard } from '@/components/onboarding-wizard';
import { InlineLink } from '@/components/ui/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WalletConnect } from '@/components/wallet-connect';
import {
  inventoryWindowFloatingAtom,
  inventoryWindowPositionAtom,
  inventoryWindowSizeAtom,
  onboardingCompletedAtom,
} from '@/lib/atoms';
import { paths } from '@/lib/paths';
import { checkCriteria } from '@/lib/property-utils';
import type { BlueprintComponent, OtomItem } from '@/lib/types';
import { cn } from '@/lib/utils';
import { DndContext, DragOverlay, type DragEndEvent, type DragStartEvent } from '@dnd-kit/core';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useAtom } from 'jotai/react';
import { AppWindow } from 'lucide-react';
import { FC, useCallback, useMemo, useState } from 'react';
import { Rnd } from 'react-rnd';
import { useAccount } from 'wagmi';

export const HomeContent = () => {
  const { address } = useAccount();
  const [droppedItemsState, setDroppedItemsState] = useState<DroppedItemsState>({});
  const [activeItem, setActiveItem] = useState<OtomItem | null>(null);
  const [isFloating, setIsFloating] = useAtom(inventoryWindowFloatingAtom);
  const [rndPosition, setRndPosition] = useAtom(inventoryWindowPositionAtom);
  const [rndSize, setRndSize] = useAtom(inventoryWindowSizeAtom);
  const [onboardingCompleted, setOnboardingCompleted] = useAtom(onboardingCompletedAtom);

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

  const renderOtomsInventory = useMemo(
    () => (
      <div className={cn('flex flex-col gap-2', isFloating && 'h-full w-full overflow-hidden p-4')}>
        <div
          className={cn(
            'flex items-baseline justify-between gap-2',
            isFloating && 'rnd-drag-handle cursor-move'
          )}
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

        <div className={cn('flex-1 overflow-auto', isFloating && 'h-full w-full')}>
          <OtomsInventory usedCounts={usedCounts} />
        </div>
      </div>
    ),
    [handleOpenFloating, isFloating, setIsFloating, usedCounts]
  );

  return (
    <main className="mx-auto grid min-h-screen max-w-7xl gap-4 sm:p-5">
      <OnboardingWizard
        open={!onboardingCompleted}
        onOpenChange={(open) => setOnboardingCompleted(!open)}
      />

      <div className="flex flex-col justify-start gap-8 overflow-x-hidden px-2 py-12 sm:px-0">
        {!address && <Hero />}

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

            {address && (
              <div className="flex w-full flex-col gap-2">
                {isFloating ? (
                  <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
                    <Rnd
                      position={rndPosition}
                      size={rndSize}
                      bounds={'window'}
                      onDragStop={(e, d) => {
                        setRndPosition({ x: d.x, y: d.y });
                      }}
                      onResize={(e, direction, ref, delta, position) => {
                        setRndPosition(position);
                      }}
                      onResizeStop={(e, direction, ref, delta, position) => {
                        setRndSize({
                          width: parseInt(ref.style.width),
                          height: parseInt(ref.style.height),
                        });
                        setRndPosition(position);
                      }}
                      className="bg-background border-border pointer-events-auto rounded-lg border shadow-lg"
                      dragHandleClassName="rnd-drag-handle"
                    >
                      {renderOtomsInventory}
                    </Rnd>
                  </div>
                ) : (
                  renderOtomsInventory
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
      </div>
    </main>
  );
};

const Hero: FC = () => {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-start gap-8">
      <h2 className="text-center text-2xl font-semibold tracking-wide text-pretty sm:text-3xl">
        An open-source item crafting tool based on the world of{' '}
        <InlineLink href={paths.otom} className="font-semibold">
          Otoms
        </InlineLink>
      </h2>

      <p className="w-full text-center text-balance">
        Composability is at the heart of Assembly, items can have dynamic properties and be used in
        any project, in a very wide range of applications. Item creation is permissionless & open to
        anyone.
      </p>

      <div className="flex w-full flex-wrap justify-center gap-4">
        <WalletConnect label="Get Started" />

        <div className="flex w-full flex-wrap justify-center gap-2">
          <InlineLink className="self-start" href={paths.repo}>
            Source Code
          </InlineLink>
          <span>・</span>
          <InlineLink className="self-start" href={paths.docs.assembly}>
            Documentation
          </InlineLink>
        </div>
      </div>
    </div>
  );
};
