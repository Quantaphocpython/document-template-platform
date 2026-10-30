import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@preview/core'],
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
};

export default nextConfig;
