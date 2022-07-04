import { ErrorHandler } from '../helpers.js';
import pgClient from '../providers/pgClient.js';

export default class Phone {

  static getByNumber = async (number: string) => {

    try {
      const results = await pgClient.query('SELECT * FROM phone WHERE number = $1 LIMIT 1', [number]);
      if (results.rows[0]) {
        return results.rows[0];
      } else {
        return null;
      }
    } catch (error) {
      throw new ErrorHandler(500, 'Internal DB Error')
    }

  }

  static add = async ({ fk_account_id, sid, number }: { fk_account_id: number; sid: string, number: string }) => {

    try {
      const result = await pgClient.query('INSERT INTO phone (fk_account_id, sid, number, created_on) VALUES ($1, $2, $3) RETURNING phone_id', [fk_account_id, sid, number, new Date()]);
      return result.rows[0].phone_id;
    } catch (error) {
      throw new ErrorHandler(500, 'Internal DB Error')
    }

  }

}