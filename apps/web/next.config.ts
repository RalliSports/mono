/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['a.espncdn.com', 'static.wikifutbol.com', 'upload.wikimedia.org'],
  },
  output: 'standalone',
}

module.exports = nextConfig
