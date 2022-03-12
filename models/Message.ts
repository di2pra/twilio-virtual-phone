import { Pool } from 'pg';
import { ErrorHandler } from '../helpers.js';

export default class Message {

  pool: Pool

  constructor(pool: Pool) {
    this.pool = pool;
  }

  getById = async (id: number) => {

    try {
      const results = await this.pool.query('SELECT * FROM message_phone WHERE message_id = $1', [id]);

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

      const results = await this.pool.query('SELECT * FROM message_phone WHERE from_phone_id = $1 OR to_phone_id = $1', [phone_id]);

      return results.rows;
    } catch (error) {
      throw new ErrorHandler(500, 'Internal DB Error')
    }

  }

  getMessageByConversation = async (phone_id: number, contact_number: string) => {

    try {

      const results = await this.pool.query('SELECT * FROM message_phone WHERE (from_phone_id = $1 AND to_number = $2) OR (to_phone_id = $1 AND from_number = $2) ORDER BY created_on ASC', [phone_id, contact_number]);

      return results.rows;
    } catch (error) {
      throw new ErrorHandler(500, 'Internal DB Error')
    }

  }

  getAll = async () => {

    try {
      const results = await this.pool.query('SELECT * FROM message');
      return results.rows;
    } catch (error) {
      throw new ErrorHandler(500, 'Internal DB Error')
    }

  }

  getConversationListByPhoneId = async (phone_id: number) => {

    try {
      const result = await this.pool.query('SELECT conversation.contact_number, conversation.body, conversation.created_on FROM (SELECT DISTINCT ON (data_table.contact_number) data_table.contact_number, data_table.body, data_table.created_on FROM (SELECT (CASE WHEN from_phone_id = $1 THEN to_number WHEN to_phone_id = $1 THEN from_number END) as contact_number, body, created_on FROM message_phone WHERE from_phone_id = $1 OR to_phone_id = $1) data_table ORDER BY data_table.contact_number, data_table.created_on DESC) conversation ORDER BY conversation.created_on DESC', [phone_id]);
      return result.rows;
    } catch (error) {
      throw new ErrorHandler(500, 'Internal DB Error')
    }

  }

  create = async ({ from_number, to_number, body }: { from_number: string; to_number: string; body: string }) => {

    try {
      const result = await this.pool.query('INSERT INTO message(from_number, to_number, body, created_on) VALUES ($1, $2, $3, $4) RETURNING message_id', [from_number, to_number, body, new Date()]);
      return result.rows[0].message_id;
    } catch (error) {
      throw new ErrorHandler(500, 'Internal DB Error')
    }

  }

}