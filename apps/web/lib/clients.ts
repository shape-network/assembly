import { config } from '@/lib/config';
import '@rainbow-me/rainbowkit/styles.css';
import { Alchemy, Network } from 'alchemy-sdk';
import { createPublicClient, http } from 'viem';
import { shape } from 'viem/chains';

export const alchemy = new Alchemy({
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY,
  network: config.chain.id === shape.id ? Network.SHAPE_MAINNET : Network.SHAPE_SEPOLIA,
});

export function rpcClient() {
  const chain = config.chain;
  const rootUrl = config.chain.id === shape.id ? 'shape-mainnet' : 'shape-sepolia';

  return createPublicClient({
    chain,
    transport: http(`https://${rootUrl}.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`),
    batch: {
      multicall: true,
    },
  });
}
