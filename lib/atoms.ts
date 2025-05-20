import { OtomItem } from '@/lib/types';
import { atom } from 'jotai';

export const hoveredOtomItemAtom = atom<OtomItem | null>(null);
