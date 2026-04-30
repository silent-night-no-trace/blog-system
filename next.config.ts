import type { NextConfig } from "next";
const { withContentlayer } = require('next-contentlayer')

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
};

export default withContentlayer(nextConfig);
