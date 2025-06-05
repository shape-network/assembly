'use client';

import { OtomsInventory } from '@/components/inventories';
import {
  droppedItemsStateAtom,
  inventoryWindowFloatingAtom,
  inventoryWindowPositionAtom,
  inventoryWindowSizeAtom,
} from '@/lib/atoms';
import { cn } from '@/lib/utils';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useAtom } from 'jotai/react';
import { usePostHog } from 'posthog-js/react';
import { useCallback, useEffect, useMemo } from 'react';
import { Rnd } from 'react-rnd';
import { useAccount } from 'wagmi';

// Component manages its own state with no props needed
export const FloatingInventory = () => {
  const { isConnected } = useAccount();
  const [droppedItemsState] = useAtom(droppedItemsStateAtom);

  // Calculate which items are being used in crafting
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

    const newX = Math.min(Math.max(0, rndPosition.x), windowWidth - rndSize.width);
    const newY = Math.min(Math.max(0, rndPosition.y), windowHeight - rndSize.height);

    if (newX !== rndPosition.x || newY !== rndPosition.y) {
      setRndPosition({ x: newX, y: newY });
    }
  }, [rndPosition, rndSize, setRndPosition]);

  const handleOpeningPosition = useCallback(() => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const xPos = windowWidth - rndSize.width - 155;
    const yPos = windowHeight - rndSize.height - 100;

    setRndPosition({ x: Math.max(0, xPos), y: Math.max(0, yPos) });
  }, [rndSize, setRndPosition]);

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
    if (isConnected) {
      setIsFloating(true);
      handleOpeningPosition();
    }
  }, [isConnected, setIsFloating, handleOpeningPosition]);

  if (!isConnected) return null;

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
                    onClick={() => setIsFloating(false)}
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
