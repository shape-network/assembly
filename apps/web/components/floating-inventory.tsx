'use client';

import {
  inventoryWindowFloatingAtom,
  inventoryWindowPositionAtom,
  inventoryWindowSizeAtom,
} from '@/lib/atoms';
import { useAtom } from 'jotai/react';
import { useCallback, useEffect } from 'react';
import { Rnd } from 'react-rnd';

type FloatingInventoryProps = {
  children: React.ReactNode;
};

export const FloatingInventory = ({ children }: FloatingInventoryProps) => {
  const [isFloating] = useAtom(inventoryWindowFloatingAtom);
  const [rndPosition, setRndPosition] = useAtom(inventoryWindowPositionAtom);
  const [rndSize, setRndSize] = useAtom(inventoryWindowSizeAtom);

  const ensureWindowInBounds = useCallback(() => {
    if (!isFloating) return;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const newX = Math.min(Math.max(0, rndPosition.x), windowWidth - rndSize.width);
    const newY = Math.min(Math.max(0, rndPosition.y), windowHeight - rndSize.height);

    if (newX !== rndPosition.x || newY !== rndPosition.y) {
      setRndPosition({ x: newX, y: newY });
    }
  }, [isFloating, rndPosition, rndSize, setRndPosition]);

  useEffect(() => {
    const handleResize = () => {
      ensureWindowInBounds();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [ensureWindowInBounds]);

  if (!isFloating) {
    return <>{children}</>;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <Rnd
        position={rndPosition}
        size={rndSize}
        bounds={'window'}
        onDragStop={(e, d) => {
          setRndPosition({ x: d.x, y: d.y });
          setTimeout(ensureWindowInBounds, 0);
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
          setTimeout(ensureWindowInBounds, 0);
        }}
        className="bg-background border-border pointer-events-auto rounded-lg border shadow-lg"
        dragHandleClassName="rnd-drag-handle"
      >
        <div className="h-full w-full overflow-hidden p-4">{children}</div>
      </Rnd>
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
