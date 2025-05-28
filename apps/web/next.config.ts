import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.externals.push('pino-pretty');
    return config;
  },
  images: {
    remotePatterns: [
      { hostname: 'oldschool.runescape.wiki' },
      { hostname: 'prod-otoms.s3.us-east-1.amazonaws.com' },
      { hostname: 'dev-otoms.s3.us-east-1.amazonaws.com' },
      { hostname: 'arweave.net' },
      { hostname: 'example.com' },
      { hostname: 'QmPMLjtHvrKEicZaG7pVccpmaYks1WL4oWaoQko7VBj5Cm' },
      { hostname: 'i2.seadn.io' },
    ],
  },
};

export default nextConfig;
