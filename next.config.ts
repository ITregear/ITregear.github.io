import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Since you have a custom domain (ivantregear.com), we don't need basePath/assetPrefix
  // If you were using GitHub Pages without custom domain, you'd need:
  // basePath: '/ITregear.github.io',
  // assetPrefix: '/ITregear.github.io/',
  
  // Disable server-side features for static export
  
  // Configure webpack for static assets
  webpack: (config) => {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    })
    return config
  }
}

export default nextConfig
