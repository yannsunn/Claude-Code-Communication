// 🚀 ウルトラシンク データベース接続プール設定
const { Pool } = require('pg');
const Redis = require('redis');

// PostgreSQL 接続プール設定（爆速化仕様）
const dbPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // 🔥 ウルトラシンク接続プール設定
  max: 50,           // 最大接続数：50（高負荷対応）
  min: 10,           // 最小接続数：10（常時待機）
  idleTimeoutMillis: 30000,  // アイドルタイムアウト：30秒
  connectionTimeoutMillis: 5000,  // 接続タイムアウト：5秒
  acquireTimeoutMillis: 60000,    // 取得タイムアウト：60秒
  
  // 🚀 パフォーマンス最適化設定
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  application_name: 'ultra_sync_ecommerce',
  
  // 🔥 接続品質向上設定
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
});

// Redis キャッシュ設定（異次元速度）
const redisClient = Redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  retry_strategy: (options) => {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      return new Error('Redis server refused connection');
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      return new Error('Redis retry time exhausted');
    }
    if (options.attempt > 10) {
      return undefined;
    }
    return Math.min(options.attempt * 100, 3000);
  }
});

// 🚀 ウルトラシンク クエリ実行関数
async function executeQuery(sql, params = []) {
  const client = await dbPool.connect();
  try {
    const start = Date.now();
    const result = await client.query(sql, params);
    const duration = Date.now() - start;
    
    // パフォーマンスログ（100ms以上の場合警告）
    if (duration > 100) {
      console.warn(`⚡ Slow Query Detected: ${duration}ms - ${sql.substring(0, 100)}...`);
    }
    
    return result;
  } finally {
    client.release();
  }
}

// 🔥 キャッシュ付きクエリ実行
async function cachedQuery(cacheKey, sql, params = [], ttl = 300) {
  try {
    // キャッシュから取得試行
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      
      return JSON.parse(cached);
    }
    
    // DBから取得
    const result = await executeQuery(sql, params);
    
    // キャッシュに保存
    await redisClient.setex(cacheKey, ttl, JSON.stringify(result.rows));
    
    
    return result.rows;
  } catch (error) {
    console.error('Cache query error:', error);
    // キャッシュエラー時はDBから直接取得
    const result = await executeQuery(sql, params);
    return result.rows;
  }
}

// 🚀 バッチ処理最適化関数
async function batchInsert(table, records, batchSize = 1000) {
  const batches = [];
  for (let i = 0; i < records.length; i += batchSize) {
    batches.push(records.slice(i, i + batchSize));
  }
  
  
  
  for (const batch of batches) {
    const values = batch.map((_, index) => 
      `(${batch[0].map((_, colIndex) => `$${index * batch[0].length + colIndex + 1}`).join(', ')})`
    ).join(', ');
    
    const flatValues = batch.flat();
    const sql = `INSERT INTO ${table} VALUES ${values}`;
    
    await executeQuery(sql, flatValues);
  }
}

module.exports = {
  dbPool,
  redisClient,
  executeQuery,
  cachedQuery,
  batchInsert
};