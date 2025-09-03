import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['a.espncdn.com', 'static.wikifutbol.com', 'upload.wikimedia.org', 'utfs.io', '6oy9epeia2.ufs.sh'],
  },
  output: 'standalone',
  webpack: (config: { resolve: { alias: Record<string, string> } }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'ua-parser-js': require.resolve('ua-parser-js'),
    }
    return config
  },
}

export default nextConfig
