// Simplified cache wrapper - Redis disabled for cleaner logs
const crypto = require('crypto');

/**
 * Generate hash for cache keys
 */
function hashObject(obj) {
  const str = typeof obj === 'string' ? obj : JSON.stringify(obj);
  return crypto.createHash('sha256').update(str).digest('hex').substring(0, 16);
}

/**
 * Cache wrapper - currently bypassed (no Redis)
 * Just executes the function directly without caching
 */
async function cacheWrapper(key, ttlSeconds, fetchFn) {
  // Simply execute the function without caching
  const data = await fetchFn();
  return { data, fromCache: false, cacheAvailable: false };
}

/**
 * Get cache statistics - disabled
 */
async function getCacheStats() {
  return {
    available: false,
    message: 'Caching disabled'
  };
}

/**
 * Clear cache - disabled
 */
async function clearCache(pattern = '*') {
  return 0;
}

module.exports = {
  cacheWrapper,
  hashObject,
  getCacheStats,
  clearCache
};
