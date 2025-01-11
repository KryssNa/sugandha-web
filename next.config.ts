import type { NextConfig } from "next";
const fs = require('fs');
const path = require('path');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/products/images/**',
      },
    ],
    unoptimized: true, // Disable image optimization
  },
  serverRuntimeConfig: {
    httpsOptions: {
      key: fs.readFileSync(path.join(process.cwd(), 'certificates/localhost-key.pem')),
      cert: fs.readFileSync(path.join(process.cwd(), 'certificates/localhost.pem')),
    },
  },
  reactStrictMode: true,
  webpack: (config, { dev }) => {
    if (dev) {
      // Enable polling in development for faster updates
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
  // ignoreBuildErrors: true,

  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint errors
  },
  typescript: {
    ignoreBuildErrors: true, // Ignore TypeScript errors
  },
  
};

export default nextConfig;
