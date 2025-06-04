import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.externals.push('pino-pretty');
    return config;
  },
  images: {
    remotePatterns: [
      { hostname: '*' }, // only way to render images from any domain
    ],
  },
  redirects: async () => {
    return [
      {
        source: '/docs',
        destination: 'https://docs.shape.network/building-on-shape/onchain-compatible/assembly',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
