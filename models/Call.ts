import { Pool } from 'pg';
import { ErrorHandler } from '../helpers.js';

export default class Call {

  pool: Pool

  constructor(pool: Pool) {
    this.pool = pool;
  }

  getById = async (id: number) => {

    try {
      const results = await this.pool.query('SELECT * FROM call_phone WHERE call_id = $1', [id]);

      if (results.rows[0]) {
        return results.rows[0];
      } else {
        return null;
      }

    } catch (error) {
      throw new ErrorHandler(500, 'Internal DB Error')
    }

  }


  getByPhoneId = async (phone_id: number) => {

    try {

      const results = await this.pool.query('SELECT * FROM call_phone WHERE from_phone_id = $1 OR to_phone_id = $1 ORDER BY created_on DESC', [phone_id]);

      return results.rows;
    } catch (error) {
      throw new ErrorHandler(500, 'Internal DB Error')
    }

  }

  getAll = async () => {

    try {
      const results = await this.pool.query('SELECT * FROM call');
      return results.rows;
    } catch (error) {
      throw new ErrorHandler(500, 'Internal DB Error')
    }

  }

  create = async ({ from_number, to_number }: { from_number: string; to_number: string }) => {

    try {
      const result = await this.pool.query('INSERT INTO call(from_number, to_number, created_on) VALUES ($1, $2, $3) RETURNING call_id', [from_number, to_number, new Date()]);
      return result.rows[0].call_id;
    } catch (error) {
      throw new ErrorHandler(500, 'Internal DB Error')
    }

  }

  delete = async (id: number) => {

    try {
      const result = await this.pool.query('DELETE FROM call WHERE call_id = $1', [id]);
      return id;
    } catch (error) {
      throw new ErrorHandler(500, 'Internal DB Error')
    }

  }

}