import * as redis from 'redis';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly client: redis.RedisClientType;

  constructor(private readonly config: ConfigService) {
    this.client = redis.createClient({
      url: this.config.getOrThrow<string>('REDIS_URL'),
      socket: {
        connectTimeout: 5000,
        noDelay: true,
        keepAlive: 1000,
        reconnectStrategy: (retries) => Math.min(retries * 50, 500),
      },
      username: this.config.getOrThrow<string>('REDIS_USERNAME'),
      password: this.config.getOrThrow<string>('REDIS_PASSWORD'),
      name: this.config.getOrThrow<string>('REDIS_NAME'),
      database: this.config.get<number>('REDIS_DATABASE', 0),
    });

    this.client.on('error', (error) => {
      console.log('===== Redis error =====');
      console.log(error);
      console.log('===== Redis error =====');
    });

    this.client.on('connect', () => {
      console.log('===== Redis connected =====');
    });
  }

  async onModuleInit() {
    await this.client.connect();
    await this.client.configSet('notify-keyspace-events', 'Ex');
  }

  async onModuleDestroy() {
    await this.client.disconnect();
    console.log('===== Redis disconnected =====');
  }

  async setex(key: string, value: string, ttl: number): Promise<void> {
    await this.client.setEx(key, ttl, value);
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async getAll() {
    const keys = await this.client.keys('*');

    return Promise.all(
      keys.map(async (key) => ({
        token: key,
        user: await this.client.get(key),
        ttl: (await this.client.ttl(key)) || 0,
      })),
    );
  }
}
