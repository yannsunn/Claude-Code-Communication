// 🚀 異次元通販 ウルトラパフォーマンス フック
// チケット1: フロントエンド最適化 - パフォーマンス監視とメモリ最適化

import { useCallback, useEffect, useRef, useState } from 'react';

// 🔥 パフォーマンス監視フック
export const useUltraPerformance = (componentName = 'Unknown') => {
  const [metrics, setMetrics] = useState({
    renderTime: 0,
    memoryUsage: 0,
    renderCount: 0,
    lastRender: null
  });
  
  const renderStartTime = useRef(0);
  const renderCountRef = useRef(0);

  // 🚀 レンダリング開始時刻を記録
  const startRender = useCallback(() => {
    renderStartTime.current = performance.now();
  }, []);

  // 🔥 レンダリング完了時刻を記録とメトリクス更新
  const endRender = useCallback(() => {
    const renderTime = performance.now() - renderStartTime.current;
    renderCountRef.current += 1;
    
    // メモリ使用量取得（利用可能な場合）
    const memoryUsage = performance.memory ? 
      performance.memory.usedJSHeapSize / 1024 / 1024 : 0;
    
    setMetrics(prev => ({
      renderTime: renderTime,
      memoryUsage: memoryUsage,
      renderCount: renderCountRef.current,
      lastRender: new Date().toISOString()
    }));
    
    // 🚀 パフォーマンス警告（5ms以上で警告）
    if (renderTime > 5) {
      
    }
    
    // 🔥 レンダリング完了ログ
    
  }, [componentName]);

  return {
    metrics,
    startRender,
    endRender
  };
};

// 削除: 未使用のuseVirtualScrollフック

// 🔥 デバウンス処理フック
export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
};

// 削除: 未使用のuseIntersectionObserverフック

// 🔥 非同期処理状態管理フック
export const useAsyncState = (initialState = null) => {
  const [state, setState] = useState({
    data: initialState,
    loading: false,
    error: null
  });
  
  const execute = useCallback(async (asyncFunction) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await asyncFunction();
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      setState(prev => ({ ...prev, loading: false, error }));
      throw error;
    }
  }, []);
  
  const reset = useCallback(() => {
    setState({ data: initialState, loading: false, error: null });
  }, [initialState]);
  
  return {
    ...state,
    execute,
    reset
  };
};

// 削除: 未使用のuseMemoryMonitorフック

// 削除: 未使用のuseBatchフック

// 🚀 ローカルストレージ最適化フック
export const useOptimizedLocalStorage = (key, initialValue = null) => {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      
      return initialValue;
    }
  });
  
  const setStoredValue = useCallback((newValue) => {
    try {
      setValue(newValue);
      localStorage.setItem(key, JSON.stringify(newValue));
      
    } catch (error) {
      
    }
  }, [key]);
  
  const removeStoredValue = useCallback(() => {
    try {
      setValue(initialValue);
      localStorage.removeItem(key);
      
    } catch (error) {
      
    }
  }, [key, initialValue]);
  
  return [value, setStoredValue, removeStoredValue];
};

export default {
  useUltraPerformance,
  useDebounce,
  useAsyncState,
  useOptimizedLocalStorage
};