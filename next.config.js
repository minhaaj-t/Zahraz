/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['i.ibb.co', 'i.postimg.cc', 'api.imgbb.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.imgbb.com',
      },
      {
        protocol: 'https',
        hostname: '**.postimg.cc',
      },
      {
        protocol: 'https',
        hostname: '**.ibb.co',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  },
}

module.exports = nextConfig
