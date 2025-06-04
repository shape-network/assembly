import { BlueprintComponent, OtomItem } from '@/lib/types';
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const hoveredOtomItemAtom = atom<{
  item?: OtomItem | null;
  component?: BlueprintComponent;
} | null>(null);

export const itemCreationBannerDismissedAtom = atom(false);

export const inventoryWindowPositionAtom = atomWithStorage<{ x: number; y: number }>(
  'inventory-window-position',
  {
    x: 0,
    y: 0,
  }
);

export const inventoryWindowSizeAtom = atomWithStorage<{ width: number; height: number }>(
  'inventory-window-size',
  {
    width: 378, // 5 columns of elements
    height: 400,
  }
);

export const inventoryWindowFloatingAtom = atomWithStorage<boolean>(
  'inventory-window-is-floating',
  false
);

export const droppedItemsStateAtom = atom<Record<string, Record<number, OtomItem>>>({});

export const onboardingCompletedAtom = atomWithStorage<boolean>('onboarding-completed', false);
