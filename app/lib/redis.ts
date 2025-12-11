import IORedis from "ioredis";

let redisConnection: IORedis | null = null;

export const getRedisConnection = () => {
  if (!redisConnection) {
    redisConnection = new IORedis({
      host: process.env.REDIS_HOST || "localhost",
      port: parseInt(process.env.REDIS_PORT || "6379"),
      password: process.env.REDIS_PASSWORD, // Add password support
      maxRetriesPerRequest: null,
      lazyConnect: true, // Don't connect immediately
    });
  }
  return redisConnection;
};

// For backward compatibility
export const connection = new Proxy({} as IORedis, {
  get(target, prop) {
    return getRedisConnection()[prop as keyof IORedis];
  },
});
