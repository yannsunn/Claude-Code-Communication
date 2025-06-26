// 🚀 ウルトラシンク 異次元キャッシュシステム
const Redis = require('redis');
const NodeCache = require('node-cache');

class UltraCacheManager {
  constructor() {
    // 🔥 レベル1: メモリキャッシュ（超高速）
    this.memoryCache = new NodeCache({
      stdTTL: 60,           // デフォルト60秒
      checkperiod: 120,     // 2分毎にクリーンアップ
      maxKeys: 10000,       // 最大10,000キー
    });

    // 🚀 レベル2: Redisキャッシュ（高速分散）
    this.redisClient = Redis.createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      retry_strategy: (options) => Math.min(options.attempt * 100, 3000)
    });

    // 🔥 キャッシュ戦略設定
    this.strategies = {
      // 商品情報（頻繁アクセス）
      product: { memory: 300, redis: 1800 },      // 5分/30分
      // カテゴリ情報（中頻度）
      category: { memory: 600, redis: 3600 },     // 10分/1時間
      // ユーザー情報（セッション依存）
      user: { memory: 180, redis: 900 },          // 3分/15分
      // 在庫情報（リアルタイム重要）
      inventory: { memory: 30, redis: 120 },      // 30秒/2分
      // 検索結果（計算コスト高）
      search: { memory: 300, redis: 1200 },       // 5分/20分
      // 統計データ（重計算）
      analytics: { memory: 900, redis: 7200 },    // 15分/2時間
    };
  }

  // 🚀 ウルトラ取得（L1→L2→DB の順）
  async get(key, type = 'product') {
    try {
      // L1: メモリキャッシュチェック
      const memoryResult = this.memoryCache.get(key);
      if (memoryResult !== undefined) {
        
        return memoryResult;
      }

      // L2: Redisキャッシュチェック
      const redisResult = await this.redisClient.get(key);
      if (redisResult) {
        const parsed = JSON.parse(redisResult);
        // L1キャッシュにも保存（次回の超高速アクセス用）
        this.memoryCache.set(key, parsed, this.strategies[type].memory);
        
        return parsed;
      }

      
      return null;
    } catch (error) {
      
      return null;
    }
  }

  // 🔥 ウルトラ保存（L1+L2 同時保存）
  async set(key, value, type = 'product') {
    try {
      const strategy = this.strategies[type];
      
      // L1: メモリキャッシュに保存
      this.memoryCache.set(key, value, strategy.memory);
      
      // L2: Redisキャッシュに保存
      await this.redisClient.setex(key, strategy.redis, JSON.stringify(value));
      
      
      return true;
    } catch (error) {
      
      return false;
    }
  }

  // 🚀 インテリジェント削除（関連キー一括削除）
  async invalidate(pattern) {
    try {
      // L1: メモリキャッシュクリア
      if (pattern === '*') {
        this.memoryCache.flushAll();
      } else {
        // パターンマッチングで削除
        const keys = this.memoryCache.keys();
        keys.forEach(key => {
          if (key.includes(pattern)) {
            this.memoryCache.del(key);
          }
        });
      }

      // L2: Redis パターン削除
      const redisKeys = await this.redisClient.keys(`*${pattern}*`);
      if (redisKeys.length > 0) {
        await this.redisClient.del(...redisKeys);
      }

      
      return true;
    } catch (error) {
      
      return false;
    }
  }

  // 🚀 ウォームアップ（事前キャッシュ）
  async warmup(keyValuePairs, type = 'product') {
    
    
    const promises = keyValuePairs.map(({ key, value }) => 
      this.set(key, value, type)
    );
    
    await Promise.all(promises);
    
  }

  // 🔥 統計情報取得
  getStats() {
    const memoryStats = this.memoryCache.getStats();
    return {
      memory: {
        keys: memoryStats.keys,
        hits: memoryStats.hits,
        misses: memoryStats.misses,
        hitRate: memoryStats.hits / (memoryStats.hits + memoryStats.misses) * 100
      },
      strategies: this.strategies
    };
  }

  // 🚀 バッチ取得（複数キー一括処理）
  async mget(keys, type = 'product') {
    const results = {};
    const missedKeys = [];

    // L1 バッチチェック
    keys.forEach(key => {
      const value = this.memoryCache.get(key);
      if (value !== undefined) {
        results[key] = value;
      } else {
        missedKeys.push(key);
      }
    });

    // L2 バッチ取得
    if (missedKeys.length > 0) {
      const redisResults = await this.redisClient.mget(...missedKeys);
      missedKeys.forEach((key, index) => {
        if (redisResults[index]) {
          const parsed = JSON.parse(redisResults[index]);
          results[key] = parsed;
          // L1にも保存
          this.memoryCache.set(key, parsed, this.strategies[type].memory);
        }
      });
    }

    
    return results;
  }
}

// 🚀 シングルトンインスタンス
const ultraCache = new UltraCacheManager();

module.exports = ultraCache;