import { shape, shapeSepolia } from 'viem/chains';

export const config = {
  chain: Number(process.env.NEXT_PUBLIC_CHAIN_ID) === shape.id ? shape : shapeSepolia,
};
