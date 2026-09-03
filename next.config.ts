import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/github_profile',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
