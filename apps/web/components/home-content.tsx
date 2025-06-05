'use client';

import { FloatingInventory } from '@/components/floating-inventory';
import { ItemsInventory } from '@/components/inventories';
import { ItemsToCraft } from '@/components/items';
import { OnboardingWizard } from '@/components/onboarding-wizard';
import { InlineLink } from '@/components/ui/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WalletConnect } from '@/components/wallet-connect';
import { droppedItemsStateAtom, onboardingCompletedAtom } from '@/lib/atoms';
import { paths } from '@/lib/paths';
import { checkCriteria } from '@/lib/property-utils';
import type { BlueprintComponent, OtomItem } from '@/lib/types';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { useAtom } from 'jotai/react';
import { usePostHog } from 'posthog-js/react';
import { FC, useCallback, useState } from 'react';
import { useAccount } from 'wagmi';

export const HomeContent = () => {
  const { address } = useAccount();
  const [droppedItemsState, setDroppedItemsState] = useAtom(droppedItemsStateAtom);
  const [activeItem, setActiveItem] = useState<OtomItem | null>(null);
  const [onboardingCompleted, setOnboardingCompleted] = useAtom(onboardingCompletedAtom);
  const posthog = usePostHog();

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
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
        setDroppedItemsState({
          ...droppedItemsState,
          [itemId]: {
            ...droppedItemsState[itemId],
            [blueprintIndex]: droppedItem,
          },
        });
        posthog?.capture('fill_required_element', {
          itemId,
          blueprintIndex,
          componentType: component.componentType,
          droppedItem,
        });
      }
    },
    [droppedItemsState, setDroppedItemsState]
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const droppedItemData = active.data.current as OtomItem | null;
    if (droppedItemData) {
      setActiveItem(droppedItemData);
    }
  }, []);

  return (
    <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      <main className="mx-auto grid min-h-screen max-w-7xl gap-4 sm:p-5">
        <OnboardingWizard
          open={!!address && !onboardingCompleted}
          onOpenChange={(open) => setOnboardingCompleted(!open)}
        />

        <div className="flex flex-col justify-start gap-8 overflow-x-hidden px-2 py-12 sm:px-0">
          {!address && <Hero />}

          <div className="flex flex-col gap-16">
            <div className="flex flex-col gap-2">
              <Tabs defaultValue="items-to-craft">
                <div className="flex items-baseline justify-between gap-2">
                  <TabsList>
                    <TabsTrigger
                      value="items-to-craft"
                      onClick={() =>
                        posthog?.capture('click', { event: 'change_tab', action: 'items_to_craft' })
                      }
                    >
                      Items to craft
                    </TabsTrigger>
                    {address && (
                      <TabsTrigger
                        value="owned-otoms"
                        onClick={() =>
                          posthog?.capture('click', { event: 'change_tab', action: 'owned_otoms' })
                        }
                      >
                        Owned Items
                      </TabsTrigger>
                    )}
                  </TabsList>
                </div>

                <TabsContent value="items-to-craft">
                  <ItemsToCraft />
                </TabsContent>

                <TabsContent value="owned-otoms">
                  <ItemsInventory />
                </TabsContent>
              </Tabs>
            </div>

            {address && (
              <div className="flex w-full flex-col items-center gap-2 sm:items-start">
                <div className="mt-4 flex flex-wrap gap-2">
                  <InlineLink
                    className="self-start"
                    href={paths.repo}
                    onClick={() =>
                      posthog?.capture('click', { event: 'click_link', action: 'source_code' })
                    }
                  >
                    Contribute
                  </InlineLink>
                  <span>・</span>
                  <InlineLink
                    className="self-start"
                    href={paths.docs.assembly}
                    onClick={() =>
                      posthog?.capture('click', { event: 'click_link', action: 'documentation' })
                    }
                  >
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
        </div>
      </main>
      <FloatingInventory />
    </DndContext>
  );
};

const Hero: FC = () => {
  const posthog = usePostHog();

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
          <InlineLink
            className="self-start"
            href={paths.repo}
            onClick={() =>
              posthog?.capture('click', { event: 'click_link', action: 'source_code' })
            }
          >
            Source Code
          </InlineLink>
          <span>・</span>
          <InlineLink
            className="self-start"
            href={paths.docs.assembly}
            onClick={() =>
              posthog?.capture('click', { event: 'click_link', action: 'documentation' })
            }
          >
            Documentation
          </InlineLink>
        </div>
      </div>
    </div>
  );
};
