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
import { useCallback, useEffect, useMemo } from 'react';
import { Rnd } from 'react-rnd';

// Component manages its own state with no props needed
export const FloatingInventory = () => {
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

  // Ensure the floating window is positioned properly when it opens
  useEffect(() => {
    if (isFloating) {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      // Position in the center-right of the screen, but not too low to avoid navbar overlap
      // The navbar is at the bottom-right with some padding
      const xPos = windowWidth - rndSize.width - 100;
      const yPos = windowHeight - rndSize.height - 120; // Higher position to avoid navbar

      setRndPosition({ x: Math.max(0, xPos), y: Math.max(0, yPos) });
    }
  }, [isFloating, rndSize, setRndPosition]);

  useEffect(() => {
    const handleResize = () => {
      ensureWindowInBounds();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [ensureWindowInBounds]);

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
                  <h2 className="text-primary font-bold tracking-wide uppercase">Your Inventory</h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsFloating(false)}
                      className="text-muted-foreground/70 hover:text-primary hover:bg-muted/50 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full"
                      aria-label="Close window"
                    >
                      <Cross2Icon className="size-4" />
                    </button>
                  </div>
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

  const handleOpenFloating = useCallback(() => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const xPos = windowWidth - rndSize.width - 50;
    const yPos = windowHeight - rndSize.height - 40;

    setRndPosition({ x: Math.max(0, xPos), y: Math.max(0, yPos) });
    setIsFloating(true);
  }, [rndSize, setRndPosition, setIsFloating]);

  const handleCloseFloating = useCallback(() => {
    setIsFloating(false);
  }, [setIsFloating]);

  return {
    isFloating,
    handleOpenFloating,
    handleCloseFloating,
  };
};
