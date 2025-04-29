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
  [shapeSepolia.id]: '0x08A66A2Ce5bc7d54822b487A29eC5c881E5Fd4Fd',
  [shape.id]: '0x0000000000000000000000000000000000000000',
} as const;

export const assemblyValidation = {
  [shapeSepolia.id]: '0x949de90A83F5f89E3c7DE69DaC0C550eb29c5012',
  [shape.id]: '0x0000000000000000000000000000000000000000',
} as const;

export const assemblyTracking = {
  [shapeSepolia.id]: '0x08aD384c1e10D7af3bcffFfFd6082D640B9bB9c0',
  [shape.id]: '0x0000000000000000000000000000000000000000',
} as const;

export const assemblyItems = {
  [shapeSepolia.id]: '0x54bbB2A4D2E115cd3F7D8ddadB54b70d86aa5127',
  [shape.id]: '0x0000000000000000000000000000000000000000',
} as const;

export const assemblyRenderer = {
  [shapeSepolia.id]: '0x0382A7a66E4a4329d12BF1237cb822fE1e04600f',
  [shape.id]: '0x0000000000000000000000000000000000000000',
} as const;
