const Pool = require('pg').Pool

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});


const getById = async (id) => {

  try {
    const results = await pool.query('SELECT * FROM phone WHERE phone_id = $1', [id]);
    if(results.rows[0]) {
      return results.rows[0];
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }

}

const getAll = async () => {

  try {
    const results = await pool.query('SELECT * FROM phone');
    return results.rows;
  } catch (error) {
    throw error;
  }

}

const create = async ({ alias, number }) => {

  try {
    const result = await pool.query('INSERT INTO phone("alias", number, created_on) VALUES ($1, $2, $3) RETURNING phone_id', [alias, number, new Date()]);
    return result.rows[0].phone_id;
  } catch (error) {
    throw error;
  }

}

module.exports = {
  create,
  getById,
  getAll
}