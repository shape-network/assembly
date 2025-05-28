import { config } from '@/lib/config';
import { shape, shapeSepolia } from 'viem/chains';

export const paths = {
  home: '/',
  create: '/create',
  repo: 'https://github.com/shape-network/assembly',
  shape: 'https://shape.network',
  otom: config.chainId === shape.id ? 'https://otom.xyz' : 'https://testnet.otom.xyz',
  docs: {
    assembly: 'https://docs.shape.network/building-on-shape/onchain-compatible/assembly',
    itemCreation:
      'https://docs.shape.network/building-on-shape/onchain-compatible/assembly#step-by-step-guides-for-creating-different-items-for-assembly',
  },
  api: {
    ownedOtomItems: '/api/owned-otom-items',
    craftableItems: '/api/craftable-items',
    ownedItems: '/api/owned-items',
    item: '/api/item',
  },
  assemblyItemImage: (itemId: bigint, tier: number) =>
    config.chainId === shape.id
      ? `https://prod-otoms.s3.us-east-1.amazonaws.com/assembly-items/item-${String(itemId)}-tier-${tier}.svg`
      : `https://dev-otoms.s3.us-east-1.amazonaws.com/assembly-items/item-${String(itemId)}-tier-${tier}.svg`,
  explorer: {
    home: (chainId: number) => {
      return chainId === shapeSepolia.id
        ? '`https://sepolia.shapescan.xyz/`'
        : 'https://shapescan.xyz';
    },
    block: (blockNumber: number, chainId: number) => {
      const base =
        chainId === shapeSepolia.id ? 'https://sepolia.shapescan.xyz/' : 'https://shapescan.xyz';
      return `${base}/block/${blockNumber}`;
    },
    transaction: (hash: string, chainId: number) => {
      const base =
        chainId === shapeSepolia.id ? 'https://sepolia.shapescan.xyz/' : 'https://shapescan.xyz';
      return `${base}/tx/${hash}`;
    },
    address: (address: string, chainId: number) => {
      const base =
        chainId === shapeSepolia.id ? 'https://sepolia.shapescan.xyz/' : 'https://shapescan.xyz';
      return `${base}/address/${address}`;
    },
  },
} as const;
