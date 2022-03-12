import { Pool } from 'pg';
import { ErrorHandler } from '../helpers.js';

export default class Phone {

  pool: Pool

  constructor(pool: Pool) {
    this.pool = pool;
  }


  getById = async (id: number) => {

    try {
      const results = await this.pool.query('SELECT * FROM phone WHERE phone_id = $1', [id]);
      if (results.rows[0]) {
        return results.rows[0];
      } else {
        return null;
      }
    } catch (error) {
      throw new ErrorHandler(500, 'Internal DB Error')
    }

  }

  getAll = async () => {

    try {
      const results = await this.pool.query('SELECT * FROM phone ORDER BY phone_id DESC');
      return results.rows;
    } catch (error) {
      throw new ErrorHandler(500, 'Internal DB Error')
    }

  }

  create = async ({ alias, number }: { alias: string; number: string }) => {

    try {
      const result = await this.pool.query('INSERT INTO phone("alias", number, created_on) VALUES ($1, $2, $3) RETURNING phone_id', [alias, number, new Date()]);
      return result.rows[0].phone_id;
    } catch (error) {
      throw new ErrorHandler(500, 'Internal DB Error')
    }

  }

  updateById = async ({ id, alias }: { id: number; alias: string }) => {

    try {
      const result = await this.pool.query('UPDATE phone SET "alias" = $1 WHERE phone_id = $2 RETURNING phone_id', [alias, id]);
      return result.rows[0].phone_id;
    } catch (error) {
      throw new ErrorHandler(500, 'Internal DB Error')
    }

  }

  deleteById = async (id : number) => {

    try {
      await this.pool.query('DELETE FROM phone WHERE phone_id = $1', [id]);
      return id;
    } catch (error) {
      throw new ErrorHandler(500, 'Internal DB Error')
    }

  }

}