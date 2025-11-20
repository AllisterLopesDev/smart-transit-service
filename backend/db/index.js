const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    // keep logging minimal here; project likely has a logger util
    // console.log('executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (err) {
    // rethrow for service/controller to handle
    throw err;
  }
}

module.exports = { query, pool };
