import { RedisClientType } from '@redis/client';
import { createClient } from 'redis';

class Redis {
  private static client: RedisClientType;

  static async getClient() {
    if (Redis.client && Redis.client.isOpen) {
      return Redis.client;
    }

    Redis.client = createClient({
      url: (process.env.NODE_ENV === 'development') ? process.env.REDIS_URL : process.env.REDIS_TLS_URL,
      socket: {
        tls: true,
        rejectUnauthorized: false
      }
    });

    Redis.client.on('error', err => {
      console.log('Redis Error ' + err);
    });

    await Redis.client.connect();

    return Redis.client;
  }
}

export default Redis;