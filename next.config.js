/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'i.postimg.cc',
      'i.ibb.co', // ImgBB CDN
      'ibb.co', // ImgBB
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.ibb.co',
      },
      {
        protocol: 'https',
        hostname: '**.imgbb.com',
      },
    ],
  },
  reactStrictMode: true,
  // Output configuration for Vercel
  output: 'standalone',
};

// Export the configuration using CommonJS syntax
module.exports = nextConfig;
