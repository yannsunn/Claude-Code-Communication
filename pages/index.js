// 🚀 異次元通販 メインページ - Vercelデプロイ対応版
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { motion } from 'framer-motion';
import UltraProductCard from '../components/UltraProductCard';

const DimensionalCommerce = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // 🔥 異次元商品データ
  const dimensionalProducts = [
    {
      id: 'ultra-sync-001',
      name: '次元突破通信デバイス',
      price: 99999,
      image: '/api/placeholder/400/300',
      dimension_level: 5,
      stock: 10,
      available: true,
      special_abilities: ['量子通信', '次元跳躍', '時空操作'],
      rating: 4.9
    },
    {
      id: 'security-shield-max',
      name: '完全無敵セキュリティシールド',
      price: 888888,
      image: '/api/placeholder/400/300',
      dimension_level: 7,
      stock: 3,
      available: true,
      special_abilities: ['量子暗号化', '多次元バリア', '脅威無効化'],
      rating: 5.0
    },
    {
      id: 'performance-booster',
      name: 'ウルトラパフォーマンスブースター',
      price: 77777,
      image: '/api/placeholder/400/300',
      dimension_level: 4,
      stock: 15,
      available: true,
      special_abilities: ['超高速化', 'メモリ最適化', 'CPU増強'],
      rating: 4.8
    },
    {
      id: 'cache-engine-ultra',
      name: '異次元キャッシュエンジン',
      price: 55555,
      image: '/api/placeholder/400/300',
      dimension_level: 6,
      stock: 8,
      available: true,
      special_abilities: ['瞬間記憶', '時間圧縮', 'データ予知'],
      rating: 4.7
    }
  ];

  useEffect(() => {
    // 🚀 商品データロード
    setTimeout(() => {
      setProducts(dimensionalProducts);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAddToCart = (product) => {
    console.log(`🛒 カートに追加: ${product.name}`);
    // ここで実際のカート処理を実装
  };

  const handleQuickView = (product) => {
    console.log(`🔍 クイックビュー: ${product.name}`);
    // ここで商品詳細モーダルを実装
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Head>
        <title>異次元通販 - ウルトラシンク限界突破ショップ</title>
        <meta name="description" content="次元を超えた究極の商品体験。ウルトラシンク技術で実現する完全無敵ショッピング。" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="dimensional-commerce">
        {/* 🌟 ヘッダー */}
        <motion.header 
          className="hero-header"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="container">
            <h1 className="hero-title">
              🚀 異次元通販
              <span className="subtitle">ウルトラシンク限界突破ショップ</span>
            </h1>
            <p className="hero-description">
              次元を超えた究極の商品体験。量子技術とウルトラシンクが実現する完全無敵ショッピング。
            </p>
          </div>
        </motion.header>

        {/* 🔍 検索セクション */}
        <motion.section 
          className="search-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="container">
            <div className="search-box">
              <input
                type="text"
                placeholder="🔍 異次元商品を検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
        </motion.section>

        {/* 🛍️ 商品一覧 */}
        <motion.main 
          className="products-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <div className="container">
            <h2 className="section-title">✨ 異次元商品ラインナップ</h2>
            
            {loading ? (
              <div className="loading-container">
                <motion.div 
                  className="loading-spinner"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  ⚡
                </motion.div>
                <p>次元データ読み込み中...</p>
              </div>
            ) : (
              <div className="products-grid">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                  >
                    <UltraProductCard
                      product={product}
                      onAddToCart={handleAddToCart}
                      onQuickView={handleQuickView}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.main>

        {/* 🎯 フッター */}
        <motion.footer 
          className="footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <div className="container">
            <p>&copy; 2025 異次元通販 - ウルトラシンク限界突破システム</p>
            <p>🚀 完全無敵セキュリティ | ⚡ 超高速配送 | 🌌 多次元サポート</p>
          </div>
        </motion.footer>
      </div>

      {/* Vercel Analytics & Speed Insights */}
      <Analytics />
      <SpeedInsights />

      <style jsx>{`
        .dimensional-commerce {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .hero-header {
          padding: 80px 0;
          text-align: center;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: bold;
          margin-bottom: 16px;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }

        .subtitle {
          display: block;
          font-size: 1.5rem;
          color: #ffd700;
          margin-top: 8px;
        }

        .hero-description {
          font-size: 1.2rem;
          max-width: 600px;
          margin: 0 auto;
          opacity: 0.9;
          line-height: 1.6;
        }

        .search-section {
          padding: 40px 0;
        }

        .search-box {
          display: flex;
          justify-content: center;
        }

        .search-input {
          width: 100%;
          max-width: 500px;
          padding: 16px 24px;
          font-size: 1.1rem;
          border: none;
          border-radius: 50px;
          background: rgba(255, 255, 255, 0.9);
          color: #333;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
        }

        .search-input:focus {
          outline: none;
          transform: scale(1.02);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
        }

        .products-section {
          padding: 60px 0 80px;
        }

        .section-title {
          font-size: 2.5rem;
          text-align: center;
          margin-bottom: 50px;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }

        .loading-container {
          text-align: center;
          padding: 100px 0;
        }

        .loading-spinner {
          font-size: 4rem;
          margin-bottom: 20px;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 30px;
          margin-top: 40px;
        }

        .footer {
          background: rgba(0, 0, 0, 0.3);
          padding: 40px 0;
          text-align: center;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .footer p {
          margin: 8px 0;
          opacity: 0.8;
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }
          
          .subtitle {
            font-size: 1.2rem;
          }
          
          .products-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          
          .container {
            padding: 0 15px;
          }
        }
      `}</style>
    </>
  );
};

export default DimensionalCommerce;