/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'github.com', 'avatars.githubusercontent.com'],
    unoptimized: true
  },
  experimental: {
    serverComponentsExternalPackages: ['jsonwebtoken', 'jws']
  }
}

module.exports = nextConfig 