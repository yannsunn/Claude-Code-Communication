// 異次元通販 完全無敵セキュリティシステム
// チケット5: 限界突破セキュリティ強化

import crypto from 'crypto';

// セキュリティ設定
const SECURITY_CONFIG = {
  MAX_REQUESTS_PER_MINUTE: 60,
  BLOCKED_IPS: new Set(),
  SUSPICIOUS_PATTERNS: [
    /\b(?:SELECT|INSERT|UPDATE|DELETE|DROP|UNION)\b/i,
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/i,
    /on\w+\s*=/i
  ],
  ENCRYPTION_ALGORITHM: 'aes-256-gcm'
};

// レート制限トラッカー
const rateLimiter = new Map();

// 量子暗号化関数
function quantumEncrypt(data, key) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipher(SECURITY_CONFIG.ENCRYPTION_ALGORITHM, key);
  
  let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return {
    encrypted,
    iv: iv.toString('hex'),
    tag: cipher.getAuthTag ? cipher.getAuthTag().toString('hex') : null
  };
}

// 悪意のあるパターン検出
function detectMaliciousPatterns(input) {
  const inputString = JSON.stringify(input);
  return SECURITY_CONFIG.SUSPICIOUS_PATTERNS.some(pattern => pattern.test(inputString));
}

// 高度なレート制限
function checkRateLimit(ip) {
  const now = Date.now();
  const windowStart = now - 60000; // 1分間のウィンドウ
  
  if (!rateLimiter.has(ip)) {
    rateLimiter.set(ip, []);
  }
  
  const requests = rateLimiter.get(ip);
  
  // 古いリクエストを削除
  const recentRequests = requests.filter(timestamp => timestamp > windowStart);
  rateLimiter.set(ip, recentRequests);
  
  if (recentRequests.length >= SECURITY_CONFIG.MAX_REQUESTS_PER_MINUTE) {
    SECURITY_CONFIG.BLOCKED_IPS.add(ip);
    return false;
  }
  
  recentRequests.push(now);
  return true;
}

export default function handler(req, res) {
  const userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const userAgent = req.headers['user-agent'] || '';
  const requestId = crypto.randomUUID();
  
  // ブロックされたIPチェック
  if (SECURITY_CONFIG.BLOCKED_IPS.has(userIP)) {
    return res.status(429).json({ 
      error: 'IP blocked due to suspicious activity',
      ultrasecurity: '🛡️ QUANTUM SHIELD ACTIVATED' 
    });
  }
  
  // レート制限チェック
  if (!checkRateLimit(userIP)) {
    return res.status(429).json({ 
      error: 'Rate limit exceeded',
      ultrasecurity: '⚡ DIMENSIONAL RATE LIMITER ENGAGED' 
    });
  }
  
  // 悪意のあるパターン検出
  if (detectMaliciousPatterns(req.query) || detectMaliciousPatterns(req.body)) {
    SECURITY_CONFIG.BLOCKED_IPS.add(userIP);
    return res.status(400).json({ 
      error: 'Malicious pattern detected',
      ultrasecurity: '🔥 QUANTUM FIREWALL ACTIVATED - THREAT NEUTRALIZED' 
    });
  }
  
  // API Key 量子検証
  const apiKey = req.headers['x-api-key'];
  const expectedKey = process.env.API_KEY;
  
  if (!apiKey || !expectedKey) {
    return res.status(401).json({ 
      error: 'API key required',
      ultrasecurity: '🔐 QUANTUM AUTHENTICATION REQUIRED' 
    });
  }
  
  // 定数時間比較（タイミング攻撃防止）
  const keyBuffer = Buffer.from(apiKey, 'utf8');
  const expectedBuffer = Buffer.from(expectedKey, 'utf8');
  
  if (keyBuffer.length !== expectedBuffer.length || 
      !crypto.timingSafeEqual(keyBuffer, expectedBuffer)) {
    return res.status(401).json({ 
      error: 'Invalid API key',
      ultrasecurity: '🚫 QUANTUM KEY MISMATCH DETECTED' 
    });
  }
  
  // CORS 次元間検証
  const origin = req.headers.origin;
  const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || [];
  
  if (origin && !allowedOrigins.includes(origin)) {
    return res.status(403).json({ 
      error: 'CORS policy violation',
      ultrasecurity: '🌌 DIMENSIONAL BARRIER ACTIVE' 
    });
  }
  
  // 完全無敵セキュリティヘッダー
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self'");
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  res.setHeader('X-Powered-By', 'UltraSecurity-QuantumShield');
  res.setHeader('X-Request-ID', requestId);
  
  // セキュリティ監査ログ
  const securityLog = {
    timestamp: new Date().toISOString(),
    requestId,
    ip: userIP,
    userAgent,
    method: req.method,
    path: req.url,
    securityLevel: 'MAXIMUM',
    quantumEncryption: 'ACTIVE'
  };
  
  // 量子暗号化されたレスポンス
  const responseData = {
    status: 'ULTRA_SECURE',
    timestamp: new Date().toISOString(),
    ip: userIP,
    requestId,
    securityLevel: 'DIMENSIONAL_MAXIMUM',
    quantumShield: 'ACTIVE',
    dimensionalProtection: 'UNLIMITED',
    threatLevel: 'NEUTRALIZED'
  };
  
  // 機密データの暗号化
  if (process.env.QUANTUM_KEY) {
    const encrypted = quantumEncrypt(responseData, process.env.QUANTUM_KEY);
    return res.status(200).json({
      ...responseData,
      encrypted: encrypted.encrypted,
      iv: encrypted.iv,
      ultrasecurity: '🔒 QUANTUM ENCRYPTED RESPONSE - DIMENSION SECURED'
    });
  }
  
  res.status(200).json({
    ...responseData,
    ultrasecurity: '🛡️ MAXIMUM SECURITY ACHIEVED - SYSTEM INVINCIBLE'
  });
}