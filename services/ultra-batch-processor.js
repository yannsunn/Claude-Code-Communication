// 🚀 ウルトラシンク バッチ処理最適化システム
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const { dbPool, executeQuery } = require('../config/database');
const ultraCache = require('./ultra-cache');

class UltraBatchProcessor {
  constructor() {
    this.maxWorkers = Math.min(require('os').cpus().length, 8);
    this.activeWorkers = new Set();
    this.taskQueue = [];
    this.processingStats = {
      totalProcessed: 0,
      averageTime: 0,
      lastBatchTime: null
    };
  }

  // 🔥 大容量データ一括処理
  async processBulkOrders(orders, options = {}) {
    const {
      batchSize = 1000,
      maxRetries = 3,
      enableCache = true,
      parallel = true
    } = options;

    console.log(`🚀 Bulk Order Processing Started: ${orders.length} orders`);
    const startTime = Date.now();

    try {
      if (parallel && orders.length > batchSize * 2) {
        return await this.processParallel(orders, batchSize, 'orders');
      } else {
        return await this.processSequential(orders, batchSize, 'orders');
      }
    } catch (error) {
      console.error('Bulk processing failed:', error);
      throw error;
    } finally {
      const duration = Date.now() - startTime;
      this.updateStats(orders.length, duration);
      console.log(`🔥 Bulk Processing Completed in ${duration}ms`);
    }
  }

  // 🚀 並列処理実行
  async processParallel(data, batchSize, type) {
    const chunks = this.chunkArray(data, batchSize);
    const numWorkers = Math.min(this.maxWorkers, chunks.length);
    
    console.log(`🔥 Parallel Processing: ${chunks.length} batches across ${numWorkers} workers`);

    const workerPromises = [];
    const workersPerBatch = Math.ceil(chunks.length / numWorkers);

    for (let i = 0; i < numWorkers; i++) {
      const workerChunks = chunks.slice(i * workersPerBatch, (i + 1) * workersPerBatch);
      if (workerChunks.length > 0) {
        workerPromises.push(this.createWorker({
          chunks: workerChunks,
          type,
          workerId: i
        }));
      }
    }

    const results = await Promise.all(workerPromises);
    return results.flat();
  }

  // 🔥 ワーカー作成
  createWorker(data) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(__filename, {
        workerData: data
      });

      this.activeWorkers.add(worker);

      worker.on('message', (result) => {
        this.activeWorkers.delete(worker);
        resolve(result);
      });

      worker.on('error', (error) => {
        this.activeWorkers.delete(worker);
        reject(error);
      });

      worker.on('exit', (code) => {
        this.activeWorkers.delete(worker);
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });
    });
  }

  // 🚀 順次処理実行
  async processSequential(data, batchSize, type) {
    const batches = this.chunkArray(data, batchSize);
    const results = [];

    for (let i = 0; i < batches.length; i++) {
      console.log(`🔥 Processing batch ${i + 1}/${batches.length}`);
      const batchResult = await this.processBatch(batches[i], type);
      results.push(...batchResult);

      // メモリ管理のための小休止
      if (i % 10 === 0 && i > 0) {
        await this.sleep(100);
      }
    }

    return results;
  }

  // 🔥 単一バッチ処理
  async processBatch(batch, type) {
    switch (type) {
      case 'orders':
        return await this.processOrderBatch(batch);
      case 'products':
        return await this.processProductBatch(batch);
      case 'inventory':
        return await this.processInventoryBatch(batch);
      default:
        throw new Error(`Unknown batch type: ${type}`);
    }
  }

  // 🚀 注文バッチ処理
  async processOrderBatch(orders) {
    const sql = `
      INSERT INTO orders (user_id, product_id, quantity, unit_price, total_amount, status, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (id) DO UPDATE SET
        status = EXCLUDED.status,
        updated_at = NOW()
      RETURNING id, status
    `;

    const results = [];
    const client = await dbPool.connect();

    try {
      await client.query('BEGIN');

      for (const order of orders) {
        const values = [
          order.user_id,
          order.product_id,
          order.quantity,
          order.unit_price,
          order.total_amount,
          order.status || 'pending',
          order.created_at || new Date()
        ];

        const result = await client.query(sql, values);
        results.push(result.rows[0]);

        // キャッシュ無効化
        await ultraCache.invalidate(`user_orders_${order.user_id}`);
      }

      await client.query('COMMIT');
      console.log(`🔥 Order batch processed: ${results.length} orders`);
      return results;

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // 🚀 商品バッチ処理
  async processProductBatch(products) {
    const sql = `
      INSERT INTO products (name, description, price, category_id, stock_quantity, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (sku) DO UPDATE SET
        price = EXCLUDED.price,
        stock_quantity = EXCLUDED.stock_quantity,
        updated_at = NOW()
      RETURNING id, name, price
    `;

    const results = [];
    for (const product of products) {
      const values = [
        product.name,
        product.description,
        product.price,
        product.category_id,
        product.stock_quantity,
        product.status || 'active'
      ];

      const result = await executeQuery(sql, values);
      results.push(result.rows[0]);

      // 商品キャッシュ更新
      await ultraCache.set(`product_${product.id}`, result.rows[0], 'product');
    }

    console.log(`🔥 Product batch processed: ${results.length} products`);
    return results;
  }

  // 🚀 在庫バッチ処理
  async processInventoryBatch(inventoryItems) {
    const sql = `
      UPDATE inventory 
      SET quantity = $2, updated_at = NOW()
      WHERE product_id = $1
      RETURNING product_id, quantity
    `;

    const results = [];
    for (const item of inventoryItems) {
      const result = await executeQuery(sql, [item.product_id, item.quantity]);
      results.push(result.rows[0]);

      // 在庫キャッシュ更新
      await ultraCache.invalidate(`inventory_${item.product_id}`);
    }

    console.log(`🔥 Inventory batch processed: ${results.length} items`);
    return results;
  }

  // 🔥 配列チャンク分割
  chunkArray(array, chunkSize) {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  // 🚀 統計更新
  updateStats(processed, duration) {
    this.processingStats.totalProcessed += processed;
    this.processingStats.averageTime = 
      (this.processingStats.averageTime + duration) / 2;
    this.processingStats.lastBatchTime = new Date();
  }

  // 🔥 統計取得
  getStats() {
    return {
      ...this.processingStats,
      activeWorkers: this.activeWorkers.size,
      maxWorkers: this.maxWorkers,
      queueSize: this.taskQueue.length
    };
  }

  // 🚀 ユーティリティ
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// 🔥 ワーカースレッド処理
if (!isMainThread) {
  const { chunks, type, workerId } = workerData;
  
  (async () => {
    try {
      console.log(`🚀 Worker ${workerId} started: ${chunks.length} chunks`);
      const processor = new UltraBatchProcessor();
      const results = [];

      for (const chunk of chunks) {
        const result = await processor.processBatch(chunk, type);
        results.push(...result);
      }

      console.log(`🔥 Worker ${workerId} completed: ${results.length} processed`);
      parentPort.postMessage(results);
    } catch (error) {
      console.error(`Worker ${workerId} error:`, error);
      parentPort.postMessage({ error: error.message });
    }
  })();
}

module.exports = UltraBatchProcessor;