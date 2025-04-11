import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { shape, shapeSepolia } from 'viem/chains';
import { http } from 'viem';

const transports = {
  [shape.id]: http(
    `https://shape-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`,
    { batch: true }
  ),
  [shapeSepolia.id]: http(
    `https://shape-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`,
    { batch: true }
  ),
};

export const config = getDefaultConfig({
  appName: 'Assembly',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string,
  chains: [shape, shapeSepolia],
  transports,
  ssr: true,
});
