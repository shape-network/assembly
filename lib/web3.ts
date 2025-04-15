'use client';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { http } from 'viem';
import { shape, shapeSepolia } from 'viem/chains';

export const wagmiConfig = getDefaultConfig({
  appName: 'Assembly',
  ssr: true,
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string,
  chains: [shape, shapeSepolia],
  transports: {
    [shape.id]: http(`https://shape-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`, {
      batch: true,
    }),
    [shapeSepolia.id]: http(`https://shape-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`, {
      batch: true,
    }),
  },
});
