import { BlueprintComponent, OtomItem } from '@/lib/types';
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const hoveredOtomItemAtom = atom<{
  item?: OtomItem | null;
  component?: BlueprintComponent;
} | null>(null);

export const itemCreationBannerDismissedAtom = atom(false);

export const otomWindowPositionAtom = atomWithStorage<{ x: number; y: number }>(
  'otom-window-position',
  {
    x: 0,
    y: 0,
  }
);

export const otomWindowSizeAtom = atomWithStorage<{ width: number; height: number }>(
  'otom-window-size',
  {
    width: 378, // 5 columns of elements
    height: 400,
  }
);

export const otomWindowIsFloatingAtom = atomWithStorage<boolean>('otom-window-is-floating', false);

export const onboardingCompletedAtom = atomWithStorage<boolean>('onboarding-completed', false);
