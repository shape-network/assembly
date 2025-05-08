import { shape, shapeSepolia } from 'viem/chains';

export const otomsCore = {
  [shape.id]: '0x2f9810789aebBB6cdC6c0332948fF3B6D11121E3',
  [shapeSepolia.id]: '0xc709F59f1356230025d4fdFDCeD92341A14FF2F8',
} as const;

export const otomsDatabase = {
  [shape.id]: '0x953761a771d6Ad9F888e41b3E7c9338a32b1A346',
  [shapeSepolia.id]: '0xC6E01938846D3d62EafD7FF485afeE416f6D8A40',
} as const;

export const assemblyCore = {
  [shapeSepolia.id]: '0x2710F1eF89D2D7948b181647261103CFc23b9BDF',
  [shape.id]: '0x0000000000000000000000000000000000000000',
} as const;

export const assemblyValidation = {
  [shapeSepolia.id]: '0x180bace829C74c44B68C9Ef091945d1eB1d2Ff54',
  [shape.id]: '0x0000000000000000000000000000000000000000',
} as const;

export const assemblyTracking = {
  [shapeSepolia.id]: '0xFA4123f88d858Aca015D57f5d1C81B69d5B2E016',
  [shape.id]: '0x0000000000000000000000000000000000000000',
} as const;

export const assemblyItems = {
  [shapeSepolia.id]: '0xdCC342226CD26c648D8462E270cE93b6707BB941',
  [shape.id]: '0x0000000000000000000000000000000000000000',
} as const;

export const assemblyRenderer = {
  [shapeSepolia.id]: '0x4e52C6d8D1774F736BC5F52749838c91CAeBF326',
  [shape.id]: '0x0000000000000000000000000000000000000000',
} as const;
