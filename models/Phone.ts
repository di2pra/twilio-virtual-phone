import { ErrorHandler } from '../helpers.js';
import pgClient from '../providers/pgClient.js';

type IPhone = {
  phone_id: number,
  fk_account_id: number,
  sid: string,
  phoneNumber: string,
  dateAddedToApp: string
}

export default class Phone {

  static getByAccount: (account_id: number) => Promise<IPhone[]> = async (account_id: number) => {

    try {
      const results = await pgClient.query('SELECT * FROM phone WHERE fk_account_id = $1', [account_id]);
      return results.rows;
    } catch (error) {
      throw new ErrorHandler(500, 'Internal DB Error')
    }

  }

  static getByNumber = async (phoneNumber: string) => {

    try {
      const results = await pgClient.query('SELECT * FROM phone WHERE "phoneNumber" = $1 LIMIT 1', [phoneNumber]);
      if (results.rows[0]) {
        return results.rows[0];
      } else {
        return null;
      }
    } catch (error) {
      throw new ErrorHandler(500, 'Internal DB Error')
    }

  }

  static add = async ({ fk_account_id, sid, phoneNumber }: { fk_account_id: number; sid: string, phoneNumber: string }) => {

    try {
      const result = await pgClient.query('INSERT INTO phone (fk_account_id, sid, "phoneNumber", "dateAddedToApp") VALUES ($1, $2, $3, $4) RETURNING phone_id', [fk_account_id, sid, phoneNumber, new Date()]);
      return result.rows[0].phone_id;
    } catch (error: any) {
      throw new ErrorHandler(500, 'Internal DB Error')
    }

  }

}