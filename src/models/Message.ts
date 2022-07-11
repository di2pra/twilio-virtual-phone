import { ErrorHandler } from '../helpers.js';
import pgClient from '../providers/pgClient.js';

export default class Message {

  static getById = async (message_id: number) => {

    try {

      const results = await pgClient.query('SELECT * FROM message WHERE message_id = $1', [message_id]);

      if (results.rows[0]) {
        return results.rows[0];
      } else {
        return null;
      }

    } catch (error: any) {
      throw new ErrorHandler(500, 'Internal DB Error')
    }

  }

  static getMessageByConversation = async (phone_sid: string, contact_number: string) => {

    try {

      const results = await pgClient.query('SELECT * FROM message WHERE (from_sid = $1 AND to_number = $2) OR (to_sid = $1 AND from_number = $2) ORDER BY created_on ASC', [phone_sid, contact_number]);

      return results.rows;
    } catch (error) {
      throw new ErrorHandler(500, 'Internal DB Error')
    }

  }

  static getConversationListByPhoneSid = async (phone_sid: string) => {

    try {
      const result = await pgClient.query('SELECT conversation.contact_number, conversation.body, conversation.created_on FROM ( SELECT DISTINCT ON (data_table.contact_number) data_table.contact_number, data_table.body, data_table.created_on FROM ( SELECT ( CASE WHEN from_sid = $1 THEN to_number WHEN to_sid = $1 THEN from_number END ) as contact_number, body, created_on FROM message WHERE from_sid = $1 OR to_sid = $1 ) data_table ORDER BY data_table.contact_number, data_table.created_on DESC ) conversation ORDER BY conversation.created_on DESC', [phone_sid]);
      return result.rows;
    } catch (error: any) {
      throw new ErrorHandler(500, 'Internal DB Error')
    }

  }

  static create = async ({ from_number, from_sid, to_number, to_sid, body }: { from_number: string; from_sid?: string; to_number: string; to_sid?: string; body: string }) => {

    try {
      const result = await pgClient.query('INSERT INTO message(from_sid, from_number, to_sid, to_number, body, created_on) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING message_id', [from_sid || null, from_number, to_sid || null, to_number, body]);

      return await this.getById(result.rows[0].message_id);

    } catch (error: any) {
      throw new ErrorHandler(500, 'Internal DB Error')
    }

  }

}