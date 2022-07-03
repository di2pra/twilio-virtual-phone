import { ErrorHandler } from '../helpers.js';
import pgClient from '../providers/pgClient.js';

export default class Phone {

  static getById = async (id: number) => {

    try {
      const results = await pgClient.query('SELECT * FROM phone WHERE phone_id = $1', [id]);
      if (results.rows[0]) {
        return results.rows[0];
      } else {
        return null;
      }
    } catch (error) {
      throw new ErrorHandler(500, 'Internal DB Error')
    }

  }

  static getAll = async () => {

    try {
      const results = await pgClient.query('SELECT * FROM phone ORDER BY phone_id DESC');
      return results.rows;
    } catch (error) {
      throw new ErrorHandler(500, 'Internal DB Error')
    }

  }

  static create = async ({ alias, number }: { alias: string; number: string }) => {

    try {
      const result = await pgClient.query('INSERT INTO phone("alias", number, created_on) VALUES ($1, $2, $3) RETURNING phone_id', [alias, number, new Date()]);
      return result.rows[0].phone_id;
    } catch (error) {
      throw new ErrorHandler(500, 'Internal DB Error')
    }

  }

  static updateById = async ({ id, alias }: { id: number; alias: string }) => {

    try {
      const result = await pgClient.query('UPDATE phone SET "alias" = $1 WHERE phone_id = $2 RETURNING phone_id', [alias, id]);
      return result.rows[0].phone_id;
    } catch (error) {
      throw new ErrorHandler(500, 'Internal DB Error')
    }

  }

  static deleteById = async (id: number) => {

    try {
      await pgClient.query('DELETE FROM phone WHERE phone_id = $1', [id]);
      return id;
    } catch (error) {
      throw new ErrorHandler(500, 'Internal DB Error')
    }

  }

}