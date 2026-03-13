import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        // /stream/** 요청을 stream.asinna.store로 프록시 (CORS 우회)
        source: '/stream/:path*',
        destination: 'https://stream.asinna.store/:path*',
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
        protocol: 'http',
        hostname: 'k.kakaocdn.net', // 카카오 프로필
      },
      {
        protocol: 'https',
        hostname: 'stream.asinna.store', // 썸네일용
      },
    ],
  },
  reactCompiler: true,
};

export default nextConfig;
