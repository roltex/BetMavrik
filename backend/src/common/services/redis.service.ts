import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly redis: Redis | null = null;
  private readonly logger = new Logger(RedisService.name);

  constructor() {
    const redisUrl = process.env.REDIS_URL;
    
    if (!redisUrl) {
      this.logger.warn('⚠️ REDIS_URL not found. Redis features will be disabled.');
      return;
    }

    try {
      this.redis = new Redis(redisUrl, {
        maxRetriesPerRequest: 3,
        lazyConnect: true,
        connectTimeout: 10000,
        commandTimeout: 5000,
      });
      
      this.redis.on('connect', () => {
        this.logger.log('✅ Redis connected successfully');
      });
      
      this.redis.on('error', (error) => {
        this.logger.error('❌ Redis connection error:', error.message);
      });
      
    } catch (error) {
      this.logger.error('❌ Failed to initialize Redis:', error.message);
    }
  }

  async onModuleDestroy() {
    if (this.redis) {
      await this.redis.quit();
    }
  }

  getClient(): Redis | null {
    return this.redis;
  }

  async get(key: string): Promise<string | null> {
    if (!this.redis) {
      this.logger.warn(`Redis not available for GET ${key}`);
      return null;
    }
    return await this.redis.get(key);
  }

  async set(key: string, value: string): Promise<void> {
    if (!this.redis) {
      this.logger.warn(`Redis not available for SET ${key}`);
      return;
    }
    await this.redis.set(key, value);
  }

  async lpush(key: string, value: string): Promise<void> {
    if (!this.redis) {
      this.logger.warn(`Redis not available for LPUSH ${key}`);
      return;
    }
    await this.redis.lpush(key, value);
  }

  async lrange(key: string, start: number, stop: number): Promise<string[]> {
    if (!this.redis) {
      this.logger.warn(`Redis not available for LRANGE`);
      return [];
    }
    return await this.redis.lrange(key, start, stop);
  }
} 