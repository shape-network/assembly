'use client';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { http } from 'viem';
import { mainnet, shape, shapeSepolia } from 'viem/chains';

const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY;

export const wagmiConfig = getDefaultConfig({
  appName: 'Assembly',
  ssr: true,
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string,
  chains: [shape, shapeSepolia, mainnet],
  transports: {
    [shape.id]: http(`https://shape-mainnet.g.alchemy.com/v2/${alchemyKey}`, {
      batch: true,
    }),
    [shapeSepolia.id]: http(`https://shape-sepolia.g.alchemy.com/v2/${alchemyKey}`, {
      batch: true,
    }),
    [mainnet.id]: http(`https://eth-mainnet.g.alchemy.com/v2/${alchemyKey}`, {
      batch: true,
    }),
  },
});
