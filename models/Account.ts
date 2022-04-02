import { Pool } from 'pg';
import { ErrorHandler } from '../helpers.js';

export default class Account {

  pool: Pool

  constructor(pool: Pool) {
    this.pool = pool;
  }

  getById = async (account_id: number) => {

    try {
      const results = await this.pool.query('SELECT * FROM account WHERE account_id = $1', [account_id]);
      if (results.rows[0]) {
        return results.rows[0];
      } else {
        return null;
      }
    } catch (error) {
      throw new ErrorHandler(500, 'Internal DB Error')
    }

  }

  getByUsername = async (username: string) => {

    try {
      const results = await this.pool.query('SELECT * FROM account WHERE username = $1', [username]);
      if (results.rows[0]) {
        return results.rows[0];
      } else {
        return null;
      }
    } catch (error) {
      throw new ErrorHandler(500, 'Internal DB Error')
    }

  }

  create = async (username : string) => {

    try {
      const result = await this.pool.query('INSERT INTO account(username, created_on, updated_on) VALUES ($1, $2, $3) RETURNING account_id', [username, new Date(),new Date()]);
      return result.rows[0].account_id;
    } catch (error) {
      console.log(error)
      throw new ErrorHandler(500, 'Internal DB Error')
    }

  }

  updateByUsername = async ({ username, account_sid, api_key, api_secret, twimlAppId }: { username : string, account_sid : string, api_key : string, api_secret : string, twimlAppId : string }) => {

    try {
      const result = await this.pool.query('UPDATE account SET account_sid = $1, api_key = $2, api_secret = $3, twimlAppId = $4, updated_on = $5 WHERE user_id = $6 RETURNING account_id', [account_sid, api_key, api_secret, twimlAppId, new Date(), username]);
      return result.rows[0].account_id;
    } catch (error) {
      throw new ErrorHandler(500, 'Internal DB Error')
    }

  }

}