import { config } from '@/lib/config';
import { shape } from 'viem/chains';

export const paths = {
  home: '/',
  repo: 'https://github.com/shape-network/assembly',
  shape: 'https://shape.network',
  otom: config.chainId === shape.id ? 'https://otom.xyz' : 'https://testnet.otom.xyz',
  docs: 'https://docs.shape.network/building-on-shape/onchain-compatible/assembly',
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
} as const;
