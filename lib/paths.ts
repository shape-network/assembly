import { config } from '@/lib/config';
import { shape } from 'viem/chains';

export const otomsBucket = config.chainId === shape.id ? 'prod-otoms' : 'dev-otoms';

export const paths = {
  home: '/',
  repo: 'https://github.com/shape-network/assembly',
  shape: 'https://shape.network',
  otom: 'https://otom.xyz',
  api: {
    ownedMolecules: '/api/owned-molecules',
    craftableItems: '/api/craftable-items',
  },
  images: (identifier: string) => ({
    token: `https://${otomsBucket}.s3.us-east-1.amazonaws.com/otoms/${identifier}-token.png`,
    chip: `https://${otomsBucket}.s3.us-east-1.amazonaws.com/otoms/${identifier}-chip.png`,
  }),
};
