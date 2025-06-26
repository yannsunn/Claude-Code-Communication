// 🎬 アニメーションパフォーマンステストシステム
// 60FPS達成検証・最適化テスト

class AnimationPerformanceTester {
  constructor() {
    this.testResults = {
      frameRate: [],
      animationDurations: [],
      memoryUsage: [],
      gpuUsage: [],
      cpuUsage: []
    };
    this.isTestRunning = false;
    this.testStartTime = 0;
    this.frameCount = 0;
    this.lastFrameTime = 0;
  }

  // 🚀 パフォーマンステスト開始
  async startPerformanceTest() {
    this.isTestRunning = true;
    this.testStartTime = performance.now();
    
    await this.testFrameRate();
    await this.testAnimationSmootness();
    await this.testMemoryUsage();
    await this.testResponsiveness();
    
    return this.generateReport();
  }

  // 🔥 フレームレートテスト
  async testFrameRate() {
    return new Promise((resolve) => {
      const frames = [];
      let lastTime = performance.now();
      let frameCount = 0;
      
      const measureFrame = (currentTime) => {
        frameCount++;
        const deltaTime = currentTime - lastTime;
        
        if (deltaTime > 0) {
          frames.push(1000 / deltaTime);
        }
        
        lastTime = currentTime;
        
        if (frameCount < 60) { // 1秒間測定
          requestAnimationFrame(measureFrame);
        } else {
          const avgFPS = frames.reduce((a, b) => a + b, 0) / frames.length;
          this.testResults.frameRate.push({
            average: avgFPS,
            min: Math.min(...frames),
            max: Math.max(...frames),
            samples: frames.length
          });
          resolve();
        }
      };
      
      requestAnimationFrame(measureFrame);
    });
  }

  // 🌟 アニメーション滑らかさテスト
  async testAnimationSmootness() {
    const testElement = this.createTestElement();
    document.body.appendChild(testElement);
    
    return new Promise((resolve) => {
      const startTime = performance.now();
      let frameDrops = 0;
      let lastFrameTime = startTime;
      
      // アニメーション実行
      testElement.style.transition = 'transform 1s ease-in-out';
      testElement.style.transform = 'translateX(300px) translateZ(0)';
      
      const checkSmootness = (currentTime) => {
        const deltaTime = currentTime - lastFrameTime;
        
        // 20ms以上の遅延をフレームドロップとして検出
        if (deltaTime > 20) {
          frameDrops++;
        }
        
        lastFrameTime = currentTime;
        
        if (currentTime - startTime < 1000) {
          requestAnimationFrame(checkSmootness);
        } else {
          this.testResults.animationDurations.push({
            frameDrops,
            smoothness: Math.max(0, 100 - (frameDrops * 5)) // スムーズネススコア
          });
          
          document.body.removeChild(testElement);
          resolve();
        }
      };
      
      requestAnimationFrame(checkSmootness);
    });
  }

  // 🚀 メモリ使用量テスト
  async testMemoryUsage() {
    if (!performance.memory) {
      this.testResults.memoryUsage.push({ supported: false });
      return;
    }
    
    const beforeMemory = performance.memory.usedJSHeapSize;
    
    // 複数アニメーション同時実行
    const elements = [];
    for (let i = 0; i < 20; i++) {
      const element = this.createTestElement();
      elements.push(element);
      document.body.appendChild(element);
    }
    
    // アニメーション実行
    elements.forEach((el, index) => {
      setTimeout(() => {
        el.style.transition = 'all 0.5s ease';
        el.style.transform = `translateX(${200 + index * 10}px) translateZ(0)`;
      }, index * 50);
    });
    
    // メモリ測定
    setTimeout(() => {
      const afterMemory = performance.memory.usedJSHeapSize;
      const memoryIncrease = (afterMemory - beforeMemory) / (1024 * 1024); // MB
      
      this.testResults.memoryUsage.push({
        supported: true,
        before: Math.round(beforeMemory / (1024 * 1024)),
        after: Math.round(afterMemory / (1024 * 1024)),
        increase: Math.round(memoryIncrease * 100) / 100
      });
      
      // 要素削除
      elements.forEach(el => document.body.removeChild(el));
    }, 2000);
  }

  // 🔥 レスポンシブ性テスト
  async testResponsiveness() {
    return new Promise((resolve) => {
      const testElement = this.createTestElement();
      testElement.style.cursor = 'pointer';
      document.body.appendChild(testElement);
      
      let clickResponses = [];
      let clickCount = 0;
      
      const handleClick = (event) => {
        const responseTime = performance.now() - event.timeStamp;
        clickResponses.push(responseTime);
        clickCount++;
        
        if (clickCount >= 5) {
          testElement.removeEventListener('click', handleClick);
          document.body.removeChild(testElement);
          
          this.testResults.cpuUsage.push({
            averageResponseTime: clickResponses.reduce((a, b) => a + b, 0) / clickResponses.length,
            maxResponseTime: Math.max(...clickResponses),
            samples: clickResponses
          });
          
          resolve();
        }
      };
      
      testElement.addEventListener('click', handleClick);
      
      // 自動クリック実行
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          testElement.click();
        }, i * 200);
      }
    });
  }

  // 🌟 テスト要素作成
  createTestElement() {
    const element = document.createElement('div');
    element.style.cssText = `
      position: fixed;
      top: 50px;
      left: 50px;
      width: 50px;
      height: 50px;
      background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
      border-radius: 50%;
      will-change: transform;
      transform: translateZ(0);
      backface-visibility: hidden;
      z-index: 9999;
    `;
    return element;
  }

  // 🚀 レポート生成
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      testDuration: performance.now() - this.testStartTime,
      results: this.testResults,
      performance: this.calculatePerformanceScore(),
      recommendations: this.generateRecommendations()
    };
    
    return report;
  }

  // 🔥 パフォーマンススコア計算
  calculatePerformanceScore() {
    let score = 100;
    
    // フレームレート評価
    if (this.testResults.frameRate.length > 0) {
      const avgFPS = this.testResults.frameRate[0].average;
      if (avgFPS < 60) {
        score -= (60 - avgFPS) * 2;
      }
    }
    
    // アニメーション滑らかさ評価
    if (this.testResults.animationDurations.length > 0) {
      const smoothness = this.testResults.animationDurations[0].smoothness;
      if (smoothness < 90) {
        score -= (90 - smoothness) * 0.5;
      }
    }
    
    // メモリ使用量評価
    if (this.testResults.memoryUsage.length > 0 && this.testResults.memoryUsage[0].supported) {
      const memoryIncrease = this.testResults.memoryUsage[0].increase;
      if (memoryIncrease > 5) { // 5MB以上の増加
        score -= memoryIncrease * 2;
      }
    }
    
    return Math.max(0, Math.round(score));
  }

  // 🌟 改善提案生成
  generateRecommendations() {
    const recommendations = [];
    
    if (this.testResults.frameRate.length > 0) {
      const avgFPS = this.testResults.frameRate[0].average;
      if (avgFPS < 55) {
        recommendations.push('フレームレートが低下しています。GPU加速の有効化を確認してください');
      }
      if (avgFPS < 45) {
        recommendations.push('重要：アニメーション品質を下げる、またはより軽量なエフェクトを使用してください');
      }
    }
    
    if (this.testResults.animationDurations.length > 0) {
      const frameDrops = this.testResults.animationDurations[0].frameDrops;
      if (frameDrops > 3) {
        recommendations.push('アニメーション中のフレームドロップが検出されました。will-changeプロパティの最適化を検討してください');
      }
    }
    
    if (this.testResults.memoryUsage.length > 0 && this.testResults.memoryUsage[0].supported) {
      const memoryIncrease = this.testResults.memoryUsage[0].increase;
      if (memoryIncrease > 10) {
        recommendations.push('メモリ使用量が大幅に増加しています。アニメーション終了後のクリーンアップを確認してください');
      }
    }
    
    if (recommendations.length === 0) {
      recommendations.push('優秀なパフォーマンスです！現在の最適化設定を維持してください');
    }
    
    return recommendations;
  }

  // 🚀 HTMLレポート生成
  generateHTMLReport(report) {
    return `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🎬 アニメーションパフォーマンステスト結果</title>
    <style>
        body { font-family: 'Segoe UI', sans-serif; margin: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
        .container { max-width: 1000px; margin: 0 auto; background: rgba(255,255,255,0.1); padding: 20px; border-radius: 12px; }
        .score { font-size: 3em; text-align: center; color: #ffd700; margin: 20px 0; }
        .metric { background: rgba(255,255,255,0.2); padding: 15px; margin: 10px 0; border-radius: 8px; }
        .recommendations { background: rgba(255,255,255,0.15); padding: 15px; border-radius: 8px; }
        .good { border-left: 4px solid #4CAF50; }
        .warning { border-left: 4px solid #ff9800; }
        .error { border-left: 4px solid #f44336; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎬 アニメーションパフォーマンステスト結果</h1>
        
        <div class="score">パフォーマンススコア: ${report.performance}/100</div>
        
        <div class="metric ${report.results.frameRate[0]?.average >= 55 ? 'good' : 'warning'}">
            <h3>🚀 フレームレート</h3>
            <p>平均FPS: ${report.results.frameRate[0]?.average.toFixed(1) || 'N/A'}</p>
            <p>最小FPS: ${report.results.frameRate[0]?.min.toFixed(1) || 'N/A'}</p>
            <p>最大FPS: ${report.results.frameRate[0]?.max.toFixed(1) || 'N/A'}</p>
        </div>
        
        <div class="metric ${report.results.animationDurations[0]?.smoothness >= 90 ? 'good' : 'warning'}">
            <h3>🌟 アニメーション滑らかさ</h3>
            <p>スムーズネススコア: ${report.results.animationDurations[0]?.smoothness || 'N/A'}/100</p>
            <p>フレームドロップ: ${report.results.animationDurations[0]?.frameDrops || 'N/A'}回</p>
        </div>
        
        <div class="metric good">
            <h3>💾 メモリ使用量</h3>
            <p>テスト前: ${report.results.memoryUsage[0]?.before || 'N/A'}MB</p>
            <p>テスト後: ${report.results.memoryUsage[0]?.after || 'N/A'}MB</p>
            <p>増加量: ${report.results.memoryUsage[0]?.increase || 'N/A'}MB</p>
        </div>
        
        <div class="recommendations">
            <h3>🔧 改善提案</h3>
            ${report.recommendations.map(rec => `<p>• ${rec}</p>`).join('')}
        </div>
        
        <p style="text-align: center; margin-top: 30px; opacity: 0.8;">
            テスト実行時刻: ${report.timestamp}<br>
            テスト時間: ${Math.round(report.testDuration)}ms
        </p>
    </div>
</body>
</html>`;
  }
}

// 🎬 テスト実行関数
async function runAnimationPerformanceTest() {
  const tester = new AnimationPerformanceTester();
  const report = await tester.startPerformanceTest();
  
  // HTMLレポート生成
  const htmlReport = tester.generateHTMLReport(report);
  
  // 結果表示
  const newWindow = window.open('', '_blank');
  newWindow.document.write(htmlReport);
  newWindow.document.close();
  
  return report;
}

// 🚀 グローバル公開
if (typeof window !== 'undefined') {
  window.runAnimationPerformanceTest = runAnimationPerformanceTest;
  window.AnimationPerformanceTester = AnimationPerformanceTester;
}

export { AnimationPerformanceTester, runAnimationPerformanceTest };