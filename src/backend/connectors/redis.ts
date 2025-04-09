import { Redis } from 'ioredis'

import { environment } from '../config'
import { log } from '../logger'

const redisClientSingleton = (): Redis => new Redis(
  environment.REDIS_URL
)

declare global {
  // eslint-disable-next-line no-var -- var is used to merge with the global namespace
  var redis: ReturnType<typeof redisClientSingleton> | undefined
}

const redis = globalThis.redis ?? redisClientSingleton()
const logger = log.getSubLogger({ name: 'redis' })

export { redis }

export async function healthCheck (): Promise<boolean> {
  try {
    await redis.ping()
    return true
  } catch (error) {
    logger.error('Redis healthcheck failed: %O', error)
    return false
  }
}

if (process.env.NODE_ENV !== 'production') {
  globalThis.redis = redis
}
