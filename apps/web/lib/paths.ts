import { config } from '@/lib/config';

const explorerUrl = config.chain.testnet
  ? 'https://sepolia.shapescan.xyz/'
  : 'https://shapescan.xyz';

export const paths = {
  home: '/',
  create: '/create',
  repo: 'https://github.com/shape-network/assembly',
  shape: 'https://shape.network',
  otom: config.chain.testnet ? 'https://testnet.otom.xyz' : 'https://otom.xyz',
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
    config.chain.testnet
      ? `https://dev-otoms.s3.us-east-1.amazonaws.com/assembly-items/item-${String(itemId)}-tier-${tier}.svg`
      : `https://prod-otoms.s3.us-east-1.amazonaws.com/assembly-items/item-${String(itemId)}-tier-${tier}.svg`,
  explorer: {
    home: explorerUrl,
    block: (blockNumber: number) => `${explorerUrl}/block/${blockNumber}`,
    transaction: (hash: string) => `${explorerUrl}/tx/${hash}`,
    address: (address: string) => `${explorerUrl}/address/${address}`,
  },
} as const;
