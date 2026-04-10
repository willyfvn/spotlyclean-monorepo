/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@spotlyclean/convex',
    '@spotlyclean/types',
    '@spotlyclean/utils',
    '@spotlyclean/ui',
  ],
}

module.exports = nextConfig
