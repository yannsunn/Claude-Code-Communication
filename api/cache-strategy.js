// 異次元通販 ウルトラキャッシュ戦略 API
// チケット2&4: API応答速度向上 + 限界突破キャッシュシステム

const cache = new Map();
const cacheStats = {
  hits: 0,
  misses: 0,
  totalRequests: 0,
  avgResponseTime: 0,
  totalResponseTime: 0
};

// キャッシュ設定
const CACHE_CONFIG = {
  TTL: 300000, // 5分
  MAX_SIZE: 1000,
  COMPRESSION_THRESHOLD: 1024 // 1KB以上で圧縮
};

// データ圧縮関数
function compressData(data) {
  const jsonString = JSON.stringify(data);
  if (jsonString.length > CACHE_CONFIG.COMPRESSION_THRESHOLD) {
    return {
      compressed: true,
      data: Buffer.from(jsonString).toString('base64'),
      originalSize: jsonString.length
    };
  }
  return { compressed: false, data, originalSize: jsonString.length };
}

// データ展開関数
function decompressData(cachedItem) {
  if (cachedItem.compressed) {
    const jsonString = Buffer.from(cachedItem.data, 'base64').toString();
    return JSON.parse(jsonString);
  }
  return cachedItem.data;
}

// キャッシュクリーンアップ
function cleanupCache() {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now > value.expires) {
      cache.delete(key);
    }
  }
  
  // サイズ制限チェック
  if (cache.size > CACHE_CONFIG.MAX_SIZE) {
    const entries = Array.from(cache.entries())
      .sort((a, b) => a[1].lastAccessed - b[1].lastAccessed)
      .slice(0, Math.floor(CACHE_CONFIG.MAX_SIZE * 0.2)); // 20%削除
    
    entries.forEach(([key]) => cache.delete(key));
  }
}

export default function handler(req, res) {
  const requestStart = performance.now();
  cacheStats.totalRequests++;
  
  // 🚀 応答速度向上のためのヘッダー最適化
  res.setHeader('Cache-Control', 'private, max-age=300, stale-while-revalidate=60');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Powered-By', 'UltraSync-API-Engine-v2.0');
  res.setHeader('X-Response-Time', Date.now());
  res.setHeader('Connection', 'keep-alive');
  
  const { method, query } = req;
  const cacheKey = `${method}:${JSON.stringify(query)}`;
  
  if (method === 'GET') {
    // キャッシュ確認
    const cached = cache.get(cacheKey);
    if (cached && Date.now() < cached.expires) {
      cacheStats.hits++;
      cached.lastAccessed = Date.now();
      
      const data = decompressData(cached);
      const responseTime = performance.now() - requestStart;
      
      // 🚀 応答時間統計更新
      cacheStats.totalResponseTime += responseTime;
      cacheStats.avgResponseTime = cacheStats.totalResponseTime / cacheStats.totalRequests;
      
      return res.status(200).json({
        data,
        cache: {
          hit: true,
          hitRate: (cacheStats.hits / cacheStats.totalRequests * 100).toFixed(2) + '%',
          compression: cached.compressed ? 'enabled' : 'disabled',
          originalSize: cached.originalSize,
          responseTime: responseTime.toFixed(2) + 'ms',
          avgResponseTime: cacheStats.avgResponseTime.toFixed(2) + 'ms'
        },
        ultrasync: '🚀 ULTRA SPEED - CACHE HIT ACHIEVED'
      });
    }
    
    cacheStats.misses++;
    
    // 異次元商品データ生成（キャッシュミス時）
    const dimensionalProducts = {
      products: [
        {
          id: 'ultra-sync-001',
          name: '次元突破通信デバイス',
          price: 99999,
          dimension: '第7次元',
          power: 'UNLIMITED',
          cache_optimized: true
        },
        {
          id: 'security-shield-max',
          name: '完全無敵セキュリティシールド',
          price: 888888,
          protection: 'ABSOLUTE',
          quantum_encrypted: true
        }
      ],
      metadata: {
        timestamp: new Date().toISOString(),
        dimension: 'Multi-Dimensional Commerce',
        security_level: 'MAXIMUM'
      }
    };
    
    // キャッシュに保存
    const compressedData = compressData(dimensionalProducts);
    cache.set(cacheKey, {
      ...compressedData,
      expires: Date.now() + CACHE_CONFIG.TTL,
      lastAccessed: Date.now(),
      created: Date.now()
    });
    
    // 定期クリーンアップ
    if (Math.random() < 0.1) {
      cleanupCache();
    }
    
    const responseTime = performance.now() - requestStart;
    
    // 🚀 応答時間統計更新
    cacheStats.totalResponseTime += responseTime;
    cacheStats.avgResponseTime = cacheStats.totalResponseTime / cacheStats.totalRequests;
    
    return res.status(200).json({
      data: dimensionalProducts,
      cache: {
        hit: false,
        hitRate: (cacheStats.hits / cacheStats.totalRequests * 100).toFixed(2) + '%',
        compression: compressedData.compressed ? 'enabled' : 'disabled',
        originalSize: compressedData.originalSize,
        responseTime: responseTime.toFixed(2) + 'ms',
        avgResponseTime: cacheStats.avgResponseTime.toFixed(2) + 'ms'
      },
      ultrasync: '⚡ ULTRA GENERATED - DATA CREATED AT QUANTUM SPEED'
    });
  }
  
  if (method === 'DELETE' && query.action === 'clear-cache') {
    cache.clear();
    cacheStats.hits = 0;
    cacheStats.misses = 0;
    cacheStats.totalRequests = 0;
    
    return res.status(200).json({
      message: 'キャッシュクリア完了',
      ultrasync: '🧹 CACHE CLEARED - READY FOR NEXT DIMENSION'
    });
  }
  
  // キャッシュ統計情報
  if (method === 'GET' && query.stats === 'true') {
    return res.status(200).json({
      stats: {
        ...cacheStats,
        hitRate: (cacheStats.hits / cacheStats.totalRequests * 100).toFixed(2) + '%',
        cacheSize: cache.size,
        maxSize: CACHE_CONFIG.MAX_SIZE,
        avgResponseTime: cacheStats.avgResponseTime.toFixed(2) + 'ms',
        performance: cacheStats.avgResponseTime < 10 ? 'EXCELLENT' : 
                    cacheStats.avgResponseTime < 50 ? 'GOOD' : 'NEEDS_OPTIMIZATION'
      },
      ultrasync: '📊 ULTRA PERFORMANCE ANALYTICS - QUANTUM METRICS'
    });
  }
  
  res.status(405).json({ error: 'Method not allowed' });
}