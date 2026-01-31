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

async function getAllStops(page, limit) {
  // Parse and validate pagination parameters
  page = parseInt(page, 10) || 1;
  limit = parseInt(limit, 10) || 20;

  // Validate page and limit
  if (page < 1) page = 1;
  if (limit < 1 || limit > 100) limit = 20; // Max limit of 100

  const offset = (page - 1) * limit;
  const sql = `SELECT ${BASE_COLUMNS} FROM stops WHERE deleted_at IS NULL ORDER BY created_at DESC LIMIT $1 OFFSET $2`;
  const res = await db.query(sql, [limit, offset]);
  const stops = res.rows;

  // If no stops, return empty pagination object
  if (stops.length === 0) {
    return {
      stops: [],
      pagination: {},
    };
  }

  const totalRecords = await getTotalStopsCount();
  const totalPages = Math.ceil(totalRecords / limit);

  return {
    stops,
    pagination: {
      currentPage: page,
      pageSize: limit,
      totalRecords,
      totalPages,
    },
  };
}

async function getTotalStopsCount() {
  const sql = `SELECT COUNT(*) as total FROM stops WHERE deleted_at IS NULL`;
  const res = await db.query(sql);
  return parseInt(res.rows[0].total, 10);
}

module.exports = { getById, getAllStops, getTotalStopsCount };
