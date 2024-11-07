/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['i.postimg.cc'], // Add any additional domains as needed
  },
  reactStrictMode: true,
};

// Export the configuration using CommonJS syntax
module.exports = nextConfig;
