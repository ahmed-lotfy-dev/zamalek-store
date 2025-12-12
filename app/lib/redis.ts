import IORedis from "ioredis";

const globalForRedis = global as unknown as { redis: IORedis };

export const getRedisConnection = () => {
  if (!globalForRedis.redis) {
    globalForRedis.redis = new IORedis({
      host: process.env.REDIS_HOST || "127.0.0.1",
      port: parseInt(process.env.REDIS_PORT || "6379"),
      password: process.env.REDIS_PASSWORD || undefined,
      maxRetriesPerRequest: null,
    });
  }
  return globalForRedis.redis;
};

// For backward compatibility
export const connection = new Proxy({} as IORedis, {
  get(target, prop) {
    const redis = getRedisConnection();
    const value = redis[prop as keyof IORedis];
    if (typeof value === "function") {
      return value.bind(redis);
    }
    return value;
  },
});
