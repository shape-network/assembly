import { shape, shapeSepolia } from 'viem/chains';

export const config = {
  chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID) as typeof shape.id | typeof shapeSepolia.id,
  selectedChain: process.env.NEXT_PUBLIC_CHAIN_ID === '1' ? shape : shapeSepolia,
  isMainnet: process.env.NEXT_PUBLIC_CHAIN_ID === '1',
};
