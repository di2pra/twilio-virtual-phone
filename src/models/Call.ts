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


  static getByPhoneSid = async (phone_sid: string) => {

    try {

      const results = await pgClient.query('SELECT * FROM call WHERE from_sid = $1 OR to_sid = $1 ORDER BY created_on DESC', [phone_sid]);

      return results.rows;
    } catch (error: any) {
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

  static create = async ({ from_number, to_number, from_sid, to_sid }: { from_number: string; to_number: string, from_sid?: string, to_sid?: string }) => {

    try {
      const result = await pgClient.query('INSERT INTO call(from_number, to_number, from_sid, to_sid, created_on) VALUES ($1, $2, $3, $4, $5) RETURNING call_id', [from_number, to_number, from_sid, to_sid, new Date()]);
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