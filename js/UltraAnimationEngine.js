// 🎬 異次元通販 ウルトラアニメーションエンジン
// GPU加速・60FPS保証・滑らか動作システム

class UltraAnimationEngine {
  constructor() {
    this.frameRate = 0;
    this.lastFrameTime = performance.now();
    this.frameCount = 0;
    this.animationQueue = [];
    this.activeAnimations = new Map();
    this.isRunning = false;
    
    // GPU検出とパフォーマンス最適化
    this.gpuTier = this.detectGPUTier();
    this.optimizationLevel = this.determineOptimizationLevel();
    
    this.initializeEngine();
  }

  // 🚀 エンジン初期化
  initializeEngine() {
    this.setupPerformanceMonitoring();
    this.enableGPUAcceleration();
    this.startAnimationLoop();
  }

  // 🔥 GPU検出
  detectGPUTier() {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) return 1; // 基本レベル
    
    const renderer = gl.getParameter(gl.RENDERER).toLowerCase();
    
    if (renderer.includes('nvidia') || renderer.includes('amd')) {
      return 3; // 高性能GPU
    } else if (renderer.includes('intel')) {
      return 2; // 中性能GPU
    }
    
    return 1; // 基本GPU
  }

  // 🌟 最適化レベル決定
  determineOptimizationLevel() {
    const deviceMemory = navigator.deviceMemory || 4;
    const hardwareConcurrency = navigator.hardwareConcurrency || 4;
    
    if (this.gpuTier >= 3 && deviceMemory >= 8 && hardwareConcurrency >= 8) {
      return 'ultra'; // 最高設定
    } else if (this.gpuTier >= 2 && deviceMemory >= 4) {
      return 'high'; // 高設定
    } else {
      return 'balanced'; // バランス設定
    }
  }

  // 🚀 GPU加速有効化
  enableGPUAcceleration() {
    const style = document.createElement('style');
    style.textContent = `
      .gpu-optimized {
        will-change: transform, opacity;
        transform: translateZ(0);
        backface-visibility: hidden;
        perspective: 1000px;
        -webkit-transform-style: preserve-3d;
        transform-style: preserve-3d;
      }
    `;
    document.head.appendChild(style);
  }

  // 🔥 パフォーマンス監視
  setupPerformanceMonitoring() {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'measure' && entry.name.includes('animation')) {
          if (entry.duration > 16.67) { // 60FPS = 16.67ms per frame
            this.optimizePerformance();
          }
        }
      }
    });
    
    observer.observe({ entryTypes: ['measure'] });
  }

  // 🌟 メインアニメーションループ
  startAnimationLoop() {
    const animate = (currentTime) => {
      this.calculateFrameRate(currentTime);
      this.processAnimationQueue();
      this.updateActiveAnimations(currentTime);
      
      if (this.isRunning) {
        requestAnimationFrame(animate);
      }
    };
    
    this.isRunning = true;
    requestAnimationFrame(animate);
  }

  // 🚀 フレームレート計算
  calculateFrameRate(currentTime) {
    this.frameCount++;
    const deltaTime = currentTime - this.lastFrameTime;
    
    if (deltaTime >= 1000) { // 1秒毎に更新
      this.frameRate = Math.round((this.frameCount * 1000) / deltaTime);
      this.frameCount = 0;
      this.lastFrameTime = currentTime;
      
      // 60FPS以下の場合は最適化
      if (this.frameRate < 55) {
        this.emergencyOptimization();
      }
    }
  }

  // 🔥 緊急最適化
  emergencyOptimization() {
    // アニメーション品質を動的に調整
    document.querySelectorAll('.complex-animation').forEach(el => {
      el.style.animationDuration = '0.1s';
    });
    
    // エフェクト削減
    document.querySelectorAll('.heavy-effect').forEach(el => {
      el.style.filter = 'none';
      el.style.boxShadow = 'none';
    });
  }

  // 🌟 アニメーション追加
  addAnimation(element, options = {}) {
    const animationId = `anim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const animation = {
      id: animationId,
      element,
      type: options.type || 'fadeIn',
      duration: options.duration || 300,
      delay: options.delay || 0,
      easing: options.easing || 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      onComplete: options.onComplete || null,
      startTime: null,
      progress: 0
    };

    this.animationQueue.push(animation);
    return animationId;
  }

  // 🚀 アニメーションキュー処理
  processAnimationQueue() {
    const currentTime = performance.now();
    
    this.animationQueue.forEach((animation, index) => {
      if (currentTime >= (animation.delay + (animation.scheduledTime || 0))) {
        this.startAnimation(animation);
        this.animationQueue.splice(index, 1);
      }
    });
  }

  // 🔥 アニメーション開始
  startAnimation(animation) {
    animation.startTime = performance.now();
    this.activeAnimations.set(animation.id, animation);
    
    // GPU加速クラス追加
    animation.element.classList.add('gpu-optimized');
    
    // アニメーションタイプ別処理
    this.applyAnimationType(animation);
  }

  // 🌟 アニメーションタイプ適用
  applyAnimationType(animation) {
    const { element, type } = animation;
    
    switch (type) {
      case 'fadeIn':
        this.performFadeIn(element, animation);
        break;
      case 'slideIn':
        this.performSlideIn(element, animation);
        break;
      case 'bounce':
        this.performBounce(element, animation);
        break;
      case 'zoom':
        this.performZoom(element, animation);
        break;
      case 'rotate':
        this.performRotate(element, animation);
        break;
      default:
        this.performFadeIn(element, animation);
    }
  }

  // 🚀 フェードインアニメーション
  performFadeIn(element, animation) {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px) translateZ(0)';
    element.style.transition = `all ${animation.duration}ms ${animation.easing}`;
    
    requestAnimationFrame(() => {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0) translateZ(0)';
    });
  }

  // 🔥 スライドインアニメーション
  performSlideIn(element, animation) {
    const direction = animation.direction || 'left';
    const distance = animation.distance || 100;
    
    element.style.transform = `translateX(${direction === 'left' ? -distance : distance}px) translateZ(0)`;
    element.style.opacity = '0';
    element.style.transition = `all ${animation.duration}ms ${animation.easing}`;
    
    requestAnimationFrame(() => {
      element.style.transform = 'translateX(0) translateZ(0)';
      element.style.opacity = '1';
    });
  }

  // 🌟 バウンスアニメーション
  performBounce(element, animation) {
    element.style.transform = 'scale(0.3) translateZ(0)';
    element.style.opacity = '0';
    element.style.transition = `all ${animation.duration}ms cubic-bezier(0.68, -0.55, 0.265, 1.55)`;
    
    requestAnimationFrame(() => {
      element.style.transform = 'scale(1) translateZ(0)';
      element.style.opacity = '1';
    });
  }

  // 🚀 ズームアニメーション
  performZoom(element, animation) {
    element.style.transform = 'scale(0) translateZ(0)';
    element.style.opacity = '0';
    element.style.transition = `all ${animation.duration}ms ${animation.easing}`;
    
    requestAnimationFrame(() => {
      element.style.transform = 'scale(1) translateZ(0)';
      element.style.opacity = '1';
    });
  }

  // 🔥 回転アニメーション
  performRotate(element, animation) {
    const rotation = animation.rotation || 180;
    
    element.style.transform = `rotate(-${rotation}deg) scale(0.5) translateZ(0)`;
    element.style.opacity = '0';
    element.style.transition = `all ${animation.duration}ms ${animation.easing}`;
    
    requestAnimationFrame(() => {
      element.style.transform = 'rotate(0deg) scale(1) translateZ(0)';
      element.style.opacity = '1';
    });
  }

  // 🌟 アクティブアニメーション更新
  updateActiveAnimations(currentTime) {
    this.activeAnimations.forEach((animation, id) => {
      const elapsed = currentTime - animation.startTime;
      animation.progress = Math.min(elapsed / animation.duration, 1);
      
      if (animation.progress >= 1) {
        this.completeAnimation(animation);
        this.activeAnimations.delete(id);
      }
    });
  }

  // 🚀 アニメーション完了処理
  completeAnimation(animation) {
    // GPU加速クラス除去（メモリ最適化）
    animation.element.classList.remove('gpu-optimized');
    
    // will-changeプロパティ削除
    animation.element.style.willChange = 'auto';
    
    // 完了コールバック実行
    if (animation.onComplete) {
      animation.onComplete(animation.element);
    }
  }

  // 🔥 パフォーマンス最適化
  optimizePerformance() {
    // 重複アニメーション除去
    const elements = new Set();
    this.activeAnimations.forEach(animation => {
      if (elements.has(animation.element)) {
        this.activeAnimations.delete(animation.id);
      } else {
        elements.add(animation.element);
      }
    });
    
    // 最適化レベル調整
    if (this.frameRate < 45) {
      this.optimizationLevel = 'balanced';
    }
  }

  // 🌟 統計情報取得
  getPerformanceStats() {
    return {
      frameRate: this.frameRate,
      activeAnimations: this.activeAnimations.size,
      queuedAnimations: this.animationQueue.length,
      gpuTier: this.gpuTier,
      optimizationLevel: this.optimizationLevel,
      memoryUsage: performance.memory ? {
        used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024)
      } : null
    };
  }

  // 🚀 アニメーション停止
  stopAnimation(animationId) {
    if (this.activeAnimations.has(animationId)) {
      const animation = this.activeAnimations.get(animationId);
      this.completeAnimation(animation);
      this.activeAnimations.delete(animationId);
    }
  }

  // 🔥 エンジン停止
  stopEngine() {
    this.isRunning = false;
    this.activeAnimations.clear();
    this.animationQueue = [];
  }
}

// 🌟 便利関数エクスポート
const ultraAnimate = {
  engine: new UltraAnimationEngine(),
  
  fadeIn: (element, options = {}) => {
    return ultraAnimate.engine.addAnimation(element, { ...options, type: 'fadeIn' });
  },
  
  slideIn: (element, options = {}) => {
    return ultraAnimate.engine.addAnimation(element, { ...options, type: 'slideIn' });
  },
  
  bounce: (element, options = {}) => {
    return ultraAnimate.engine.addAnimation(element, { ...options, type: 'bounce' });
  },
  
  zoom: (element, options = {}) => {
    return ultraAnimate.engine.addAnimation(element, { ...options, type: 'zoom' });
  },
  
  rotate: (element, options = {}) => {
    return ultraAnimate.engine.addAnimation(element, { ...options, type: 'rotate' });
  },
  
  getStats: () => {
    return ultraAnimate.engine.getPerformanceStats();
  }
};

// 🚀 グローバル公開
if (typeof window !== 'undefined') {
  window.ultraAnimate = ultraAnimate;
}

export default ultraAnimate;