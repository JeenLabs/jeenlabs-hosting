import { Global, Module } from '@nestjs/common';
import Redis from 'ioredis';

export const REDIS_CLIENT = 'REDIS_CLIENT';
export const REDIS_QUEUE = 'REDIS_QUEUE';
export const REDIS_CACHE = 'REDIS_CACHE';
export const REDIS_SESSION = 'REDIS_SESSION';

function createRedis(url: string, db: number): Redis {
  return new Redis(url, {
    db,
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
  });
}

@Global()
@Module({
  providers: [
    {
      provide: REDIS_QUEUE,
      useFactory: () => createRedis(process.env.REDIS_URL ?? 'redis://localhost:6379', 0),
    },
    {
      provide: REDIS_CACHE,
      useFactory: () => createRedis(process.env.REDIS_URL ?? 'redis://localhost:6379', 1),
    },
    {
      provide: REDIS_SESSION,
      useFactory: () => createRedis(process.env.REDIS_URL ?? 'redis://localhost:6379', 2),
    },
    {
      provide: REDIS_CLIENT,
      useExisting: REDIS_QUEUE,
    },
  ],
  exports: [REDIS_CLIENT, REDIS_QUEUE, REDIS_CACHE, REDIS_SESSION],
})
export class RedisModule {}
