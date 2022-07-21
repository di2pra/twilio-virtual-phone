import { ErrorHandler } from '../helpers.js';
import pgClient from '../providers/pgClient.js';

export type IAccount = {
  account_id: number;
  username: string;
  account_sid: string;
  auth_token: string;
  key_sid: string;
  key_secret: string;
  twiml_app_sid: string;
  created_on: Date;
  updated_on: Date;
}

export default class Account {

  static redactData = (data: IAccount) => {
    return {
      ...data,
      ...{
        auth_token: "**********************",
        key_secret: "**********************"
      }
    } as IAccount
  }

  static getRedactedById: (account_id: number) => Promise<IAccount | null> = async (account_id: number) => {

    try {
      const results = await pgClient.query('SELECT * FROM account WHERE account_id = $1', [account_id]);

      if (results.rows[0]) {
        return Account.redactData(results.rows[0]);
      } else {
        return null
      }

    } catch (error: any) {
      throw new ErrorHandler(500, `Internal DB Error : ${error.message}`)
    }

  }

  static getById: (account_id: number) => Promise<IAccount | null> = async (account_id: number) => {

    try {
      const results = await pgClient.query('SELECT * FROM account WHERE account_id = $1', [account_id]);
      if (results.rows[0]) {
        return results.rows[0];
      } else {
        return null
      }

    } catch (error: any) {
      throw new ErrorHandler(500, `Internal DB Error : ${error.message}`)
    }

  }

  static getRedactedByUsername: (username: string) => Promise<IAccount | null> = async (username: string) => {

    try {
      const results = await pgClient.query('SELECT * FROM account WHERE username = $1', [username]);

      if (results.rows[0]) {
        return Account.redactData(results.rows[0]) as IAccount;
      } else {
        return null
      }

    } catch (error: any) {
      throw new ErrorHandler(500, `Internal DB Error : ${error.message}`)
    }

  }

  static getByUsername: (username: string) => Promise<IAccount | null> = async (username: string) => {

    try {

      const results = await pgClient.query('SELECT * FROM account WHERE username = $1', [username]);

      if (results.rows[0]) {
        return results.rows[0] as IAccount;
      } else {
        return null
      }

    } catch (error: any) {
      throw new ErrorHandler(500, `Internal DB Error : ${error.message}`)
    }

  }

  static create = async ({ username, account_sid, auth_token, key_sid, key_secret }: { username: string, account_sid: string, auth_token: string, key_sid: string, key_secret: string }) => {

    try {
      const result = await pgClient.query('INSERT INTO account(username, account_sid, auth_token, key_sid, key_secret, created_on, updated_on) VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING account_id', [username, account_sid, auth_token, key_sid, key_secret]);
      return result.rows[0].account_id;
    } catch (error: any) {
      throw new ErrorHandler(500, `Internal DB Error : ${error.message}`)
    }

  }

  static updateTwimlAppByUsername = async ({ username, twiml_app_sid }: { username: string, twiml_app_sid: string }) => {

    try {
      const result = await pgClient.query('UPDATE account SET twiml_app_sid = $1, updated_on = NOW() WHERE username = $2 RETURNING account_id', [twiml_app_sid, username]);
      return result.rows[0].account_id;
    } catch (error: any) {
      throw new ErrorHandler(500, `Internal DB Error : ${error.message}`)
    }

  }

}