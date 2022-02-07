const Pool = require('pg').Pool
const { ErrorHandler } = require('./../helpers')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const getById = async (id) => {

  try {
    const results = await pool.query('SELECT * FROM call_phone WHERE call_id = $1', [id]);

    if(results.rows[0]) {
      return results.rows[0];
    } else {
      return null;
    }
    
  } catch (error) {
    throw new ErrorHandler(500, 'Internal DB Error')
  }

}


const getByPhoneId = async (phone_id) => {

  try {

    const results = await pool.query('SELECT * FROM call_phone WHERE from_phone_id = $1 OR to_phone_id = $1', [phone_id]);

    return results.rows;
  } catch (error) {
    throw new ErrorHandler(500, 'Internal DB Error')
  }

}

const getAll = async () => {

  try {
    const results = await pool.query('SELECT * FROM call');
    return results.rows;
  } catch (error) {
    throw new ErrorHandler(500, 'Internal DB Error')
  }

}

const create = async ({ from_number, to_number }) => {

  try {
    const result = await pool.query('INSERT INTO call(from_number, to_number, created_on) VALUES ($1, $2, $3) RETURNING call_id', [from_number, to_number, new Date()]);
    return result.rows[0].call_id;
  } catch (error) {
    throw new ErrorHandler(500, 'Internal DB Error')
  }

}

module.exports = {
  create,
  getById,
  getAll,
  getByPhoneId
}