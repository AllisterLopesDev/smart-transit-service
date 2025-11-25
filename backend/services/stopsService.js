const db = require("../db");

const BASE_COLUMNS = [
  "id",
  "code",
  "name",
  "latitude",
  "longitude",
  "address",
  "is_active",
].join(", ");

async function getById(id) {
  const sql = `SELECT ${BASE_COLUMNS} FROM stops WHERE id = $1 AND deleted_at IS NULL`;
  const res = await db.query(sql, [id]);
  return res.rows[0] || null;
}

module.exports = { getById };
