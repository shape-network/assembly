import { BlueprintComponent, OtomItem } from '@/lib/types';
import { atom } from 'jotai';

export const hoveredOtomItemAtom = atom<{
  item?: OtomItem | null;
  component?: BlueprintComponent;
} | null>(null);
