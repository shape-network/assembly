import { shape, shapeSepolia } from 'viem/chains';

export const otomsCore = {
  [shape.id]: '0x2f9810789aebBB6cdC6c0332948fF3B6D11121E3',
  [shapeSepolia.id]: '0xc709F59f1356230025d4fdFDCeD92341A14FF2F8',
} as const;

export const otomsDatabase = {
  [shape.id]: '0x953761a771d6Ad9F888e41b3E7c9338a32b1A346',
  [shapeSepolia.id]: '0xC6E01938846D3d62EafD7FF485afeE416f6D8A40',
} as const;

export const otomItemsCore = {
  [shapeSepolia.id]: '0x488B5bAEA1Eb28F48c279C9Ac4e3312790813C2e',
  [shape.id]: '0xe8af571878D33CfecA4eA11caEf124E5ef105a30',
} as const;

export const otomItemsTracking = {
  [shapeSepolia.id]: '0xd0424C0365C95F6f6174ceB0D7c24b99C09adc2B',
  [shape.id]: '0xBF165fF844938D04d741C260A2Dc82d24bd92ffF',
} as const;

export const otomItems = {
  [shapeSepolia.id]: '0x489B90261Ccf74E4D3883fd8B2C6A19f6E8B2b06',
  [shape.id]: '0x72b89472d81BADAf167FB21c128fAA5e495de904',
} as const;
