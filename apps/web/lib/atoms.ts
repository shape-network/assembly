import { BlueprintComponent, OtomItem } from '@/lib/types';
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const hoveredOtomItemAtom = atom<{
  item?: OtomItem | null;
  component?: BlueprintComponent;
} | null>(null);

export const itemCreationBannerDismissedAtom = atom(false);

export const inventoryWindowPositionAtom = atom<{ x: number; y: number }>({
  x: 0,
  y: 0,
});

export const inventoryWindowSizeAtom = atom<{ width: number; height: number }>({
  width: 410, // 5 columns of elements
  height: 400,
});

export const inventoryWindowFloatingAtom = atom<boolean>(false);

export const droppedItemsStateAtom = atom<Record<string, Record<number, OtomItem>>>({});

export const onboardingCompletedAtom = atomWithStorage<boolean>('onboarding-completed', false);

export const isSelectingWildcardIdAtom = atom<null | (BlueprintComponent & { posId: string })>(
  null
);
