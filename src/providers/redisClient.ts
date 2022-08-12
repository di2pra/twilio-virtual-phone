import { RedisClientType } from '@redis/client';
import { createClient } from 'redis';

class Redis {
  private static client: RedisClientType;
  private static connectionTimeout: NodeJS.Timeout

  static throwTimeoutError() {
    this.connectionTimeout = setTimeout(() => {
      throw new Error('Redis connection failed');
    }, 10000);
  }

  static async getClient() {
    if (Redis.client && Redis.client.isOpen) {
      console.log(`returning opened client`);
      return Redis.client;
    }

    Redis.client = createClient({
      url: (process.env.NODE_ENV === 'development') ? process.env.REDIS_URL : process.env.REDIS_TLS_URL,
      socket: {
        tls: true,
        rejectUnauthorized: false
      }
    });

    Redis.client.on('connect', () => {
      console.log('Redis - Connection status: connected');
      clearTimeout(this.connectionTimeout);
    });
    Redis.client.on('end', () => {
      console.log('Redis - Connection status: disconnected');
      this.throwTimeoutError();
    });
    Redis.client.on('reconnecting', () => {
      console.log('Redis - Connection status: reconnecting');
      clearTimeout(this.connectionTimeout);
    });
    Redis.client.on('error', (err) => {
      //console.log('Redis - Connection status: error ', { err });
      this.throwTimeoutError();
    });

    await Redis.client.connect();

    return Redis.client;
  }
}

export default Redis;