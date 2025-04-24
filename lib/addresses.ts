import { shape, shapeSepolia } from 'viem/chains';

export const otomsCore = {
  [shape.id]: '0x2f9810789aebBB6cdC6c0332948fF3B6D11121E3',
  [shapeSepolia.id]: '0xc709F59f1356230025d4fdFDCeD92341A14FF2F8',
} as const;

export const otomsDatabase = {
  [shape.id]: '0x953761a771d6Ad9F888e41b3E7c9338a32b1A346',
  [shapeSepolia.id]: '0xC6E01938846D3d62EafD7FF485afeE416f6D8A40',
} as const;

export const itemsCore = {
  [shapeSepolia.id]: '0x8F8C6B41F008Fb8fbBB36ff41Ef1771590a7D270',
  [shape.id]: '0x0000000000000000000000000000000000000000',
} as const;
