import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['localhost'], // Add your image domains here
    // If you also need to support production domain, add it here
    // For example: ['localhost', 'your-production-domain.com']
  },
};

export default nextConfig;
