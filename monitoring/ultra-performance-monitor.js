// 🚀 ウルトラシンク パフォーマンス監視システム
// 異次元通販の全システム監視・最適化

const { performance } = require('perf_hooks');
const EventEmitter = require('events');
const fs = require('fs').promises;

class UltraPerformanceMonitor extends EventEmitter {
  constructor() {
    super();
    this.metrics = {
      database: {
        connectionPool: { active: 0, idle: 0, waiting: 0 },
        queryTimes: [],
        slowQueries: [],
        errorCount: 0
      },
      cache: {
        hitRate: 0,
        missRate: 0,
        memoryUsage: 0,
        redisConnections: 0
      },
      api: {
        requestCount: 0,
        responseTime: [],
        errorRate: 0,
        throughput: 0
      },
      system: {
        cpuUsage: 0,
        memoryUsage: 0,
        diskUsage: 0,
        networkIO: 0
      }
    };

    this.alerts = [];
    this.benchmarks = {
      targetResponseTime: 100,  // 100ms
      maxCacheMemory: 512,      // 512MB
      maxCpuUsage: 80,          // 80%
      maxDbConnections: 80      // 80% of pool
    };

    this.isMonitoring = false;
    this.monitoringInterval = null;
    
    this.initializeMonitoring();
  }

  // 🔥 監視システム初期化
  async initializeMonitoring() {
    console.log('🚀 Ultra Performance Monitor Initializing...');
    
    // パフォーマンス計測開始
    this.startSystemMonitoring();
    
    // アラートシステム設定
    this.setupAlerts();
    
    // レポート生成設定
    this.scheduleReports();
    
    console.log('🔥 Ultra Performance Monitor Active!');
  }

  // 🚀 システム監視開始
  startSystemMonitoring() {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.monitoringInterval = setInterval(() => {
      this.collectMetrics();
    }, 5000); // 5秒間隔

    console.log('📊 System monitoring started (5s interval)');
  }

  // 🔥 メトリクス収集
  async collectMetrics() {
    try {
      // システムメトリクス
      await this.collectSystemMetrics();
      
      // データベースメトリクス
      await this.collectDatabaseMetrics();
      
      // キャッシュメトリクス
      await this.collectCacheMetrics();
      
      // APIメトリクス
      await this.collectApiMetrics();
      
      // パフォーマンスチェック
      this.performanceCheck();
      
    } catch (error) {
      console.error('Metrics collection error:', error);
    }
  }

  // 🚀 システムメトリクス収集
  async collectSystemMetrics() {
    const usage = process.cpuUsage();
    const memUsage = process.memoryUsage();
    
    this.metrics.system = {
      cpuUsage: Math.round((usage.user + usage.system) / 1000000), // マイクロ秒→秒
      memoryUsage: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
      diskUsage: await this.getDiskUsage(),
      networkIO: await this.getNetworkIO(),
      timestamp: Date.now()
    };
  }

  // 🔥 データベースメトリクス収集
  async collectDatabaseMetrics() {
    try {
      const { dbPool } = require('../config/database');
      
      this.metrics.database = {
        connectionPool: {
          active: dbPool.totalCount - dbPool.idleCount,
          idle: dbPool.idleCount,
          waiting: dbPool.waitingCount
        },
        queryTimes: this.getAverageQueryTime(),
        slowQueries: this.getSlowQueries(),
        errorCount: this.getDatabaseErrors(),
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Database metrics error:', error);
    }
  }

  // 🚀 キャッシュメトリクス収集
  async collectCacheMetrics() {
    try {
      const ultraCache = require('../services/ultra-cache');
      const stats = ultraCache.getStats();
      
      this.metrics.cache = {
        hitRate: stats.memory.hitRate || 0,
        missRate: 100 - (stats.memory.hitRate || 0),
        memoryUsage: stats.memory.keys * 0.001, // 概算MB
        redisConnections: 1, // 簡易実装
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Cache metrics error:', error);
    }
  }

  // 🔥 API メトリクス収集
  collectApiMetrics() {
    // リクエストカウンターから取得（実装例）
    this.metrics.api = {
      requestCount: this.getRequestCount(),
      responseTime: this.getAverageResponseTime(),
      errorRate: this.getErrorRate(),
      throughput: this.getThroughput(),
      timestamp: Date.now()
    };
  }

  // 🚀 パフォーマンスチェック
  performanceCheck() {
    const alerts = [];
    
    // レスポンス時間チェック
    const avgResponseTime = this.getAverageResponseTime();
    if (avgResponseTime > this.benchmarks.targetResponseTime) {
      alerts.push({
        type: 'PERFORMANCE',
        level: 'WARNING',
        message: `Response time ${avgResponseTime}ms exceeds target ${this.benchmarks.targetResponseTime}ms`,
        timestamp: Date.now()
      });
    }

    // CPU使用率チェック
    if (this.metrics.system.cpuUsage > this.benchmarks.maxCpuUsage) {
      alerts.push({
        type: 'SYSTEM',
        level: 'CRITICAL',
        message: `CPU usage ${this.metrics.system.cpuUsage}% exceeds limit ${this.benchmarks.maxCpuUsage}%`,
        timestamp: Date.now()
      });
    }

    // データベース接続プールチェック
    const dbUsage = (this.metrics.database.connectionPool.active / 50) * 100;
    if (dbUsage > this.benchmarks.maxDbConnections) {
      alerts.push({
        type: 'DATABASE',
        level: 'WARNING',
        message: `DB connection usage ${dbUsage}% exceeds limit ${this.benchmarks.maxDbConnections}%`,
        timestamp: Date.now()
      });
    }

    // キャッシュヒット率チェック
    if (this.metrics.cache.hitRate < 80) {
      alerts.push({
        type: 'CACHE',
        level: 'INFO',
        message: `Cache hit rate ${this.metrics.cache.hitRate}% is below optimal (80%+)`,
        timestamp: Date.now()
      });
    }

    // アラート処理
    alerts.forEach(alert => this.handleAlert(alert));
  }

  // 🔥 アラート処理
  handleAlert(alert) {
    this.alerts.push(alert);
    console.log(`🚨 ALERT [${alert.level}] ${alert.type}: ${alert.message}`);
    
    // 重要度に応じて通知
    if (alert.level === 'CRITICAL') {
      this.emit('critical-alert', alert);
      this.triggerEmergencyOptimization();
    }
  }

  // 🚀 緊急最適化
  async triggerEmergencyOptimization() {
    console.log('🔥 EMERGENCY OPTIMIZATION TRIGGERED!');
    
    try {
      // キャッシュクリア
      const ultraCache = require('../services/ultra-cache');
      await ultraCache.invalidate('*');
      
      // データベース接続プール最適化
      const { dbPool } = require('../config/database');
      await dbPool.end();
      
      // ガベージコレクション強制実行
      if (global.gc) {
        global.gc();
      }
      
      console.log('🚀 Emergency optimization completed');
    } catch (error) {
      console.error('Emergency optimization failed:', error);
    }
  }

  // 🔥 パフォーマンスレポート生成
  generatePerformanceReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        overall_status: this.getOverallStatus(),
        critical_alerts: this.alerts.filter(a => a.level === 'CRITICAL').length,
        performance_score: this.calculatePerformanceScore()
      },
      metrics: this.metrics,
      recommendations: this.generateRecommendations(),
      benchmarks: this.benchmarks
    };

    return report;
  }

  // 🚀 パフォーマンススコア計算
  calculatePerformanceScore() {
    let score = 100;
    
    // レスポンス時間スコア
    const avgResponseTime = this.getAverageResponseTime();
    if (avgResponseTime > this.benchmarks.targetResponseTime) {
      score -= Math.min(30, (avgResponseTime - this.benchmarks.targetResponseTime) / 10);
    }
    
    // キャッシュヒット率スコア
    const hitRate = this.metrics.cache.hitRate;
    if (hitRate < 80) {
      score -= (80 - hitRate) * 0.5;
    }
    
    // システムリソーススコア
    if (this.metrics.system.cpuUsage > 70) {
      score -= (this.metrics.system.cpuUsage - 70) * 0.5;
    }
    
    return Math.max(0, Math.round(score));
  }

  // 🔥 改善提案生成
  generateRecommendations() {
    const recommendations = [];
    
    if (this.getAverageResponseTime() > this.benchmarks.targetResponseTime) {
      recommendations.push('Consider implementing additional caching layers');
      recommendations.push('Optimize database queries and add indexes');
    }
    
    if (this.metrics.cache.hitRate < 80) {
      recommendations.push('Increase cache TTL for frequently accessed data');
      recommendations.push('Implement cache warming strategies');
    }
    
    if (this.metrics.system.cpuUsage > 70) {
      recommendations.push('Consider horizontal scaling');
      recommendations.push('Optimize CPU-intensive operations');
    }
    
    return recommendations;
  }

  // 🚀 ユーティリティメソッド
  getAverageResponseTime() {
    const times = this.metrics.api.responseTime;
    return times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0;
  }

  getRequestCount() {
    return this.metrics.api.requestCount || 0;
  }

  getErrorRate() {
    return this.metrics.api.errorRate || 0;
  }

  getThroughput() {
    return this.metrics.api.throughput || 0;
  }

  getOverallStatus() {
    const criticalAlerts = this.alerts.filter(a => a.level === 'CRITICAL').length;
    if (criticalAlerts > 0) return 'CRITICAL';
    
    const score = this.calculatePerformanceScore();
    if (score >= 90) return 'EXCELLENT';
    if (score >= 80) return 'GOOD';
    if (score >= 70) return 'WARNING';
    return 'POOR';
  }

  async getDiskUsage() {
    try {
      const stats = await fs.stat('.');
      return Math.round(stats.size / 1024 / 1024); // MB
    } catch {
      return 0;
    }
  }

  async getNetworkIO() {
    // 簡易実装
    return Math.random() * 100;
  }

  getAverageQueryTime() {
    return this.metrics.database.queryTimes || [];
  }

  getSlowQueries() {
    return this.metrics.database.slowQueries || [];
  }

  getDatabaseErrors() {
    return this.metrics.database.errorCount || 0;
  }

  // 🔥 レポートスケジューリング
  scheduleReports() {
    // 1分毎にパフォーマンスレポート
    setInterval(() => {
      const report = this.generatePerformanceReport();
      console.log(`📊 Performance Score: ${report.summary.performance_score}/100 (${report.summary.overall_status})`);
    }, 60000);
  }

  setupAlerts() {
    // アラート設定は既に performanceCheck で実装済み
  }

  // 🚀 監視停止
  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.isMonitoring = false;
      console.log('📊 Performance monitoring stopped');
    }
  }
}

// 🔥 シングルトンインスタンス
const ultraMonitor = new UltraPerformanceMonitor();

module.exports = ultraMonitor;