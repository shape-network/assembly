import { config } from '@/lib/config';
import { shape } from 'viem/chains';

export const otomsBucket = config.chainId === shape.id ? 'prod-otoms' : 'dev-otoms';

export const paths = {
  home: '/',
  shape: 'https://shape.network',
  otom: 'https://otom.xyz',
  api: {
    inventory: '/api/inventory',
  },
  images: (identifier: string) => ({
    token: `https://${otomsBucket}.s3.us-east-1.amazonaws.com/otoms/${identifier}-token.png`,
    chip: `https://${otomsBucket}.s3.us-east-1.amazonaws.com/otoms/${identifier}-chip.png`,
  }),
};
