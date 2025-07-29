import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'thumb.all-ingame.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
