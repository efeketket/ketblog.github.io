/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  },
  experimental: {
    serverComponentsExternalPackages: ['jsonwebtoken', 'jws']
  }
}

module.exports = nextConfig 