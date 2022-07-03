import { ErrorHandler } from '../helpers.js';
import pgClient from '../providers/pgClient.js';

export default class Configuration {

  static getLast = async () => {

    try {
      const results = await pgClient.query('SELECT * FROM configuration ORDER BY configuration_id DESC LIMIT 1');
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

  static create = async ({ version, data }: { version: number; data: string }) => {

    try {
      const result = await pgClient.query('INSERT INTO configuration("version", data, created_on) VALUES ($1, $2, $3)', [version, data, new Date()]);
      return this.getLast();
    } catch (error) {
      throw new ErrorHandler(500, 'Internal DB Error')
    }

  }

}