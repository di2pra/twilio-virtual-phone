import { ErrorHandler } from '../helpers.js';
import pgClient from '../providers/pgClient.js';

export default class Call {

  static getById = async (id: number) => {

    try {
      const results = await pgClient.query('SELECT * FROM call_phone WHERE call_id = $1', [id]);

      if (results.rows[0]) {
        return results.rows[0];
      } else {
        return null;
      }

    } catch (error) {
      throw new ErrorHandler(500, 'Internal DB Error')
    }

  }


  static getByPhoneId = async (phone_id: number) => {

    try {

      const results = await pgClient.query('SELECT * FROM call_phone WHERE from_phone_id = $1 OR to_phone_id = $1 ORDER BY created_on DESC', [phone_id]);

      return results.rows;
    } catch (error) {
      throw new ErrorHandler(500, 'Internal DB Error')
    }

  }

  static getAll = async () => {

    try {
      const results = await pgClient.query('SELECT * FROM call');
      return results.rows;
    } catch (error) {
      throw new ErrorHandler(500, 'Internal DB Error')
    }

  }

  static create = async ({ from_number, to_number }: { from_number: string; to_number: string }) => {

    try {
      const result = await pgClient.query('INSERT INTO call(from_number, to_number, created_on) VALUES ($1, $2, $3) RETURNING call_id', [from_number, to_number, new Date()]);
      return result.rows[0].call_id;
    } catch (error) {
      throw new ErrorHandler(500, 'Internal DB Error')
    }

  }

  static delete = async (id: number) => {

    try {
      const result = await pgClient.query('DELETE FROM call WHERE call_id = $1', [id]);
      return id;
    } catch (error) {
      throw new ErrorHandler(500, 'Internal DB Error')
    }

  }

}