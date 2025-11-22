const db = require("../db");

const BASE_COLUMNS = ["id", "name", "email", "status", "is_verified"].join(
  ", "
);

async function getById(id) {
  const sql = `SELECT ${BASE_COLUMNS} FROM users WHERE id = $1 AND deleted_at IS NULL`;
  const res = await db.query(sql, [id]);
  return res.rows[0] || null;
}

async function findUserByEmailOrPhone(email, full_phone) {
  const sql = `SELECT ${BASE_COLUMNS} FROM users WHERE email = $1 OR full_phone = $2 AND deleted_at IS NULL`;
  const existingUser = await db.query(sql, [email, full_phone]);
  return existingUser.rows[0] || null;
}

module.exports = { getById, findUserByEmailOrPhone };
