import { Pool } from 'pg';
import { ErrorHandler } from '../helpers.js';

export default class Configuration {

  pool: Pool

  constructor(pool: Pool) {
    this.pool = pool;
  }

  getLast = async () => {

    try {
      const results = await this.pool.query('SELECT * FROM configuration ORDER BY configuration_id DESC LIMIT 1');
      if (results.rows[0]) {
        return results.rows[0];
      } else {
        return null;
      }
    } catch (error) {

      console.log(error);

      throw new ErrorHandler(500, 'Internal DB Error')
    }

  }

  create = async ({ version, data }: { version: number; data: string }) => {

    try {
      const result = await this.pool.query('INSERT INTO configuration("version", data, created_on) VALUES ($1, $2, $3)', [version, data, new Date()]);
      return this.getLast();
    } catch (error) {
      throw new ErrorHandler(500, 'Internal DB Error')
    }

  }

}