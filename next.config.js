/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🚀 Vercel最適化設定
  output: 'standalone',
  
  // 🔥 パフォーマンス最適化
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  
  // 🌟 画像最適化
  images: {
    domains: ['via.placeholder.com'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // 🚀 Webpack最適化
  webpack: (config, { dev, isServer }) => {
    // プロダクション最適化
    if (!dev) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /node_modules/,
            priority: 20
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
            enforce: true
          }
        }
      };
    }
    
    return config;
  },
  
  // 🔥 実験的機能
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
  
  // 🌌 セキュリティヘッダー
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          }
        ]
      }
    ];
  },
  
  // 🚀 リダイレクト設定
  async redirects() {
    return [
      {
        source: '/shop',
        destination: '/',
        permanent: true,
      }
    ];
  }
};

// Bundle Analyzer（開発時のみ）
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);