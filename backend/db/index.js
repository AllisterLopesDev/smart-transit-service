const { Pool } = require('pg');
require('dotenv').config();

// Pool will read from environment variables (DATABASE_URL or PGHOST/PGUSER etc.)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || undefined,
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
