// 🚀 Next.js Document Configuration - SEO最適化
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="ja">
        <Head>
          <meta name="description" content="異次元通販 - ウルトラシンク限界突破ショップ。次元を超えた究極の商品体験を提供。" />
          <meta name="keywords" content="異次元通販,ウルトラシンク,量子技術,次元突破,完全無敵セキュリティ" />
          <meta name="author" content="異次元通販開発チーム" />
          
          {/* Open Graph */}
          <meta property="og:title" content="異次元通販 - ウルトラシンク限界突破ショップ" />
          <meta property="og:description" content="次元を超えた究極の商品体験。量子技術とウルトラシンクが実現する完全無敵ショッピング。" />
          <meta property="og:type" content="website" />
          <meta property="og:image" content="/og-image.jpg" />
          
          {/* Twitter Card */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="異次元通販" />
          <meta name="twitter:description" content="次元を超えた究極の商品体験" />
          
          {/* Favicon */}
          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          
          {/* Performance Optimizations */}
          <link rel="dns-prefetch" href="//fonts.googleapis.com" />
          <link rel="preconnect" href="https://vitals.vercel-analytics.com" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;