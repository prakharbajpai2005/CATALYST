// Redis caching utility for LLM responses
const redis = require('redis');
const crypto = require('crypto');

let client = null;

// Initialize Redis client
async function initRedis() {
  if (client) return client;
  
  try {
    client = redis.createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            console.error('❌ Redis: Max reconnection attempts reached');
            return new Error('Redis unavailable');
          }
          return Math.min(retries * 100, 3000);
        }
      }
    });

    client.on('error', (err) => {
      console.error('Redis error:', err);
    });

    client.on('connect', () => {
      console.log('✅ Redis connected');
    });

    await client.connect();
    return client;
  } catch (error) {
    console.error('❌ Redis initialization failed:', error.message);
    console.log('ℹ️  Running in NO-CACHE mode (Redis not available)');
    console.log('ℹ️  To enable caching: Install Redis and set REDIS_URL in .env');
    return null;
  }
}

// Generate hash for cache key
function hashObject(obj) {
  const str = typeof obj === 'string' ? obj : JSON.stringify(obj);
  return crypto.createHash('sha256').update(str).digest('hex');
}

// Cache wrapper with fallback
async function cacheWrapper(key, ttlSeconds, fetchFn) {
  const redisClient = await initRedis();
  
  // If Redis unavailable, just call function
  if (!redisClient) {
    const data = await fetchFn();
    return { data, fromCache: false, cacheAvailable: false };
  }

  try {
    // Try to get from cache
    const cached = await redisClient.get(key);
    if (cached) {
      console.log('✅ Cache HIT:', key.substring(0, 20) + '...');
      return { 
        data: JSON.parse(cached), 
        fromCache: true,
        cacheAvailable: true 
      };
    }
  } catch (err) {
    console.warn('⚠️  Cache read error:', err.message);
  }

  // Cache miss - fetch data
  console.log('❌ Cache MISS:', key.substring(0, 20) + '...');
  const data = await fetchFn();

  // Try to store in cache
  try {
    await redisClient.setEx(key, ttlSeconds, JSON.stringify(data));
    console.log('💾 Cached for', ttlSeconds, 'seconds');
  } catch (err) {
    console.warn('⚠️  Cache write error:', err.message);
  }

  return { data, fromCache: false, cacheAvailable: true };
}

// Get cache statistics
async function getCacheStats() {
  const redisClient = await initRedis();
  if (!redisClient) {
    return { available: false };
  }

  try {
    const info = await redisClient.info('stats');
    const keyspace = await redisClient.info('keyspace');
    
    return {
      available: true,
      info,
      keyspace
    };
  } catch (error) {
    return { available: false, error: error.message };
  }
}

// Clear cache by pattern
async function clearCache(pattern = '*') {
  const redisClient = await initRedis();
  if (!redisClient) {
    console.warn('⚠️  Cannot clear cache - Redis unavailable');
    return 0;
  }

  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length === 0) return 0;
    
    await redisClient.del(keys);
    console.log(`🗑️  Cleared ${keys.length} cache entries`);
    return keys.length;
  } catch (error) {
    console.error('❌ Cache clear error:', error.message);
    return 0;
  }
}

// Graceful shutdown
async function closeRedis() {
  if (client) {
    await client.quit();
    console.log('👋 Redis connection closed');
  }
}

module.exports = {
  initRedis,
  hashObject,
  cacheWrapper,
  getCacheStats,
  clearCache,
  closeRedis
};
