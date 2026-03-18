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
  async rewrites() {
    return [
      {
        // /stream/** 요청을 stream.asinna.store로 프록시 (CORS 우회)
        source: '/stream/:path*',
        destination: 'https://stream.asinna.store/:path*',
      },
      {
        // /gcs-proxy/** 요청을 commondatastorage.googleapis.com으로 프록시 (CORS 우회)
        source: '/gcs-proxy/:path*',
        destination: 'https://commondatastorage.googleapis.com/:path*',
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
        hostname: '*.kakaocdn.net', // 카카오 프로필
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
