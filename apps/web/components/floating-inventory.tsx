'use client';

import { useMediaQuery } from '@/components/hooks/useMediaQuery';
import { OtomsInventory } from '@/components/inventories';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  droppedItemsStateAtom,
  inventoryWindowFloatingAtom,
  inventoryWindowPositionAtom,
  inventoryWindowSizeAtom,
  isSelectingWildcardIdAtom,
} from '@/lib/atoms';
import { cn } from '@/lib/utils';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useAtom } from 'jotai/react';
import { usePostHog } from 'posthog-js/react';
import { useCallback, useEffect, useMemo } from 'react';
import { Rnd } from 'react-rnd';
import { useAccount } from 'wagmi';
import { ComponentCriteriaDescription } from './items';

export const FloatingInventory = () => {
  const { isConnected } = useAccount();
  const [droppedItemsState] = useAtom(droppedItemsStateAtom);
  const isMobile = useMediaQuery('sm');
  const [isSelectingWildcardId, setIsSelectingWildcardId] = useAtom(isSelectingWildcardIdAtom);

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
  const [isFloating, setIsFloating] = useAtom(inventoryWindowFloatingAtom);
  const [rndPosition, setRndPosition] = useAtom(inventoryWindowPositionAtom);
  const [rndSize, setRndSize] = useAtom(inventoryWindowSizeAtom);

  const ensureWindowInBounds = useCallback(() => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const newX = Math.min(Math.max(0, rndPosition.x), windowWidth - rndSize.width - 200);
    const newY = Math.min(Math.max(0, rndPosition.y), windowHeight - rndSize.height - 150);

    if (newX !== rndPosition.x || newY !== rndPosition.y) {
      setRndPosition({ x: newX, y: newY });
    }
  }, [rndPosition, rndSize, setRndPosition]);

  const handleOpeningPosition = useCallback(() => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const xPos = windowWidth - rndSize.width - 205;
    const yPos = windowHeight - rndSize.height - 150;

    setRndPosition({ x: Math.max(0, xPos), y: Math.max(0, yPos) });
  }, [rndSize, setRndPosition]);

  const handleCloseFloating = useCallback(() => {
    setIsSelectingWildcardId(null);
    setIsFloating(false);
  }, [setIsFloating, setIsSelectingWildcardId]);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (open) {
        setIsFloating(false);
      } else {
        handleCloseFloating();
      }
    },
    [handleCloseFloating, setIsFloating]
  );

  useEffect(() => {
    if (isFloating) {
      handleOpeningPosition();
    }
  }, [isFloating, handleOpeningPosition]);

  useEffect(() => {
    const handleResize = () => {
      ensureWindowInBounds();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [ensureWindowInBounds]);

  useEffect(() => {
    if (isConnected && isFloating === null && !isMobile) {
      setIsFloating(true);
      handleOpeningPosition();
      return;
    }
  }, [isConnected, setIsFloating, handleOpeningPosition, isMobile, isFloating]);

  useEffect(() => {
    if (isSelectingWildcardId && !isFloating) {
      setIsFloating(true);
    }
  }, [isSelectingWildcardId, isFloating, setIsFloating]);

  if (!isConnected) return null;

  if (isMobile) {
    return (
      <Drawer open={!!isFloating} onOpenChange={handleOpenChange} direction="bottom">
        <DrawerContent className="max-h-[80vh]">
          <DrawerHeader className="py-0 pb-4">
            <div className="flex items-center justify-between">
              <DrawerTitle className="text-primary font-bold tracking-wide uppercase">
                Your Inventory
              </DrawerTitle>
              <DrawerClose
                className="text-muted-foreground/70 hover:text-primary hover:bg-muted/50 z-10 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full"
                onClick={handleCloseFloating}
              >
                <Cross2Icon className="size-4" />
              </DrawerClose>
            </div>
            {isSelectingWildcardId && (
              <DrawerDescription className="text-left text-sm" asChild>
                <div>
                  Select the component you want to use for this wildcard. It must match the
                  following criterias:
                  <ComponentCriteriaDescription
                    className="text-primary grid grid-cols-2 gap-2 py-4 text-sm"
                    criteria={isSelectingWildcardId.criteria}
                  />
                </div>
              </DrawerDescription>
            )}
          </DrawerHeader>
          <div className="-webkit-overflow-scrolling-touch h-full overflow-y-auto p-4 pt-0">
            <OtomsInventory usedCounts={usedCounts} />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {isFloating && (
        <div
          className={cn(
            'animate-in fade-in zoom-in-95 origin-bottom-right transform transition-all duration-200 ease-out'
          )}
        >
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
              const newSize = {
                width: parseInt(ref.style.width),
                height: parseInt(ref.style.height),
              };
              setRndSize(newSize);
              setRndPosition(position);
            }}
            className="bg-background border-border pointer-events-auto rounded-lg border shadow-lg"
            dragHandleClassName="rnd-drag-handle"
          >
            <div className="h-full w-full overflow-hidden p-4">
              <div className="flex h-full w-full flex-col gap-2 overflow-hidden">
                <div className="rnd-drag-handle flex cursor-move items-baseline justify-between gap-2">
                  <h2 className="text-primary font-bold tracking-wide uppercase select-none">
                    Your Inventory
                  </h2>
                </div>
                <div className="absolute top-3 right-3 z-10">
                  <button
                    onClick={handleCloseFloating}
                    className="text-muted-foreground/70 hover:text-primary hover:bg-muted/50 z-10 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full"
                    aria-label="Close window"
                  >
                    <Cross2Icon className="size-4" />
                  </button>
                </div>

                <div className="h-full w-full flex-1 overflow-auto">
                  <OtomsInventory usedCounts={usedCounts} />
                </div>
              </div>
            </div>
          </Rnd>
        </div>
      )}
    </div>
  );
};

export const useFloatingInventory = () => {
  const [isFloating, setIsFloating] = useAtom(inventoryWindowFloatingAtom);
  const [, setRndPosition] = useAtom(inventoryWindowPositionAtom);
  const [rndSize] = useAtom(inventoryWindowSizeAtom);
  const posthog = usePostHog();

  const handleOpenFloating = useCallback(() => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const xPos = windowWidth - rndSize.width - 50;
    const yPos = windowHeight - rndSize.height - 40;

    setRndPosition({ x: Math.max(0, xPos), y: Math.max(0, yPos) });
    setIsFloating(true);
    posthog?.capture('inventory', { event: 'opened' });
  }, [rndSize, setRndPosition, setIsFloating, posthog]);

  const handleCloseFloating = useCallback(() => {
    setIsFloating(false);
    posthog?.capture('inventory', { event: 'closed' });
  }, [setIsFloating, posthog]);

  return {
    isFloating,
    handleOpenFloating,
    handleCloseFloating,
  };
};
