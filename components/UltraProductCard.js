// 🚀 異次元通販 ウルトラ商品カード コンポーネント
// チケット1: フロントエンド最適化 - 限界突破パフォーマンス

import React, { memo, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import '../styles/UltraProductCard.css';

// 🔥 React.memo で不要な再レンダリングを完全防止
const UltraProductCard = memo(({ product, onAddToCart, onQuickView }) => {
  // 🚀 useMemo で価格計算を最適化
  const formattedPrice = useMemo(() => {
    if (!product?.price) return '価格未設定';
    
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0
    }).format(product.price);
  }, [product?.price]);

  // 🔥 useCallback でイベントハンドラーを最適化
  const handleAddToCart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.(product);
  }, [product, onAddToCart]);

  const handleQuickView = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(product);
  }, [product, onQuickView]);

  // 🚀 在庫状況の最適化判定
  const stockStatus = useMemo(() => {
    const stock = product?.stock || 0;
    if (stock <= 0) return { text: '在庫切れ', class: 'out-of-stock', color: '#ff4444' };
    if (stock <= 5) return { text: '残りわずか', class: 'low-stock', color: '#ff8800' };
    return { text: '在庫あり', class: 'in-stock', color: '#44ff44' };
  }, [product?.stock]);

  // 🔥 次元レベル表示の最適化
  const dimensionLevel = useMemo(() => {
    const level = product?.dimension_level || 1;
    return '⭐'.repeat(Math.min(level, 5));
  }, [product?.dimension_level]);

  if (!product) {
    return (
      <div className="ultra-product-card loading">
        <div className="loading-animation">⚡ 次元データ読み込み中...</div>
      </div>
    );
  }

  return (
    <article className="ultra-product-card" data-product-id={product.id}>
      {/* 🚀 Next.js最適化画像 */}
      <motion.div 
        className="product-image-container"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <Image
          src={product.image || '/api/placeholder/400/300'}
          alt={product.name}
          width={400}
          height={300}
          className="product-image"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R"
          priority={false}
          loading="lazy"
        />
        
        {/* 🔥 次元レベル表示 */}
        <div className="dimension-badge">
          {dimensionLevel}
        </div>
        
        {/* 🚀 在庫状況バッジ */}
        <div 
          className={`stock-badge ${stockStatus.class}`}
          style={{ backgroundColor: stockStatus.color }}
        >
          {stockStatus.text}
        </div>
      </div>

      {/* 🔥 商品情報セクション */}
      <div className="product-info">
        <h3 className="product-name" title={product.name}>
          {product.name}
        </h3>
        
        <div className="product-price">
          {formattedPrice}
        </div>
        
        {/* 🚀 商品の特殊能力 */}
        {product.special_abilities && (
          <div className="special-abilities">
            {product.special_abilities.map((ability, index) => (
              <span key={index} className="ability-tag">
                {ability}
              </span>
            ))}
          </div>
        )}
        
        {/* 🔥 評価スコア */}
        {product.rating && (
          <div className="rating">
            <span className="stars">
              {'★'.repeat(Math.floor(product.rating))}
              {'☆'.repeat(5 - Math.floor(product.rating))}
            </span>
            <span className="rating-score">({product.rating})</span>
          </div>
        )}
      </div>

      {/* 🚀 アクションボタン */}
      <div className="product-actions">
        <button
          className="btn-quick-view"
          onClick={handleQuickView}
          disabled={!product.available}
        >
          🔍 クイックビュー
        </button>
        
        <button
          className="btn-add-cart"
          onClick={handleAddToCart}
          disabled={!product.available || stockStatus.class === 'out-of-stock'}
        >
          🛒 カートに追加
        </button>
      </div>

    </article>
  );
});

UltraProductCard.displayName = 'UltraProductCard';

export default UltraProductCard;