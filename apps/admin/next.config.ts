import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: false,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos', // 썸네일 테스트용
      },
      {
        protocol: 'https',
        hostname: 'stream.asinna.store',
      },
    ],
  },
  /* config options here */
  reactCompiler: true,
};

export default nextConfig;
