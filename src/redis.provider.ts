import Redis from 'ioredis';
import { Global, Module } from '@nestjs/common';

const redis = new Redis({
  host: process.env.HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT!) || 6379,
});

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS',
      useValue: redis,
    },
  ],
  exports: ['REDIS'],
})
export class RedisModule {}
