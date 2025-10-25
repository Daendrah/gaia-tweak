import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['three'],
  output: 'export',
  distDir: 'out',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
