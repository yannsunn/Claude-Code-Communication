// 🚀 最適化済みウルトラユーティリティ - 統合版
// 重複コード統合・デッドコード削除による最適化

export const createOptimizedCache = (config = {}) => {
  const cache = new Map();
  const ttl = config.ttl || 300000;
  
  return {
    get: (key) => {
      const item = cache.get(key);
      if (item && Date.now() < item.expires) return item.data;
      cache.delete(key);
      return null;
    },
    set: (key, data) => {
      cache.set(key, { data, expires: Date.now() + ttl });
    },
    clear: () => cache.clear(),
    size: () => cache.size
  };
};

export const debounce = (func, delay = 300) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), delay);
  };
};

export const formatPrice = (price) => {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    minimumFractionDigits: 0
  }).format(price);
};

export const compressData = (data) => {
  const str = JSON.stringify(data);
  return str.length > 1024 ? btoa(str) : str;
};

export default { createOptimizedCache, debounce, formatPrice, compressData };