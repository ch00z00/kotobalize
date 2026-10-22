import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kotobalize.s3.ap-northeast-1.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 's3.ap-northeast-1.amazonaws.com',
        pathname: '/kotobalize/**',
      },
    ],
  },
};

export default nextConfig;
