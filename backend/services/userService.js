const db = require("../db");

const BASE_COLUMNS = ["id", "name", "email", "status", "is_verified"].join(
  ", "
);

async function getById(id) {
  const sql = `SELECT ${BASE_COLUMNS} FROM users WHERE id = $1 AND deleted_at IS NULL`;
  const res = await db.query(sql, [id]);
  return res.rows[0] || null;
}

module.exports = { getById };
