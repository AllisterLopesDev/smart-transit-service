const db = require("../db");

const BASE_COLUMNS = [
  "id",
  "route_code",
  "origin",
  "destination",
  "distance_km",
  "estimated_duration_minutes",
  "is_active",
].join(", ");

async function getAllRoutes() {
  const sql = `SELECT ${BASE_COLUMNS} FROM routes WHERE deleted_at IS NULL ORDER BY created_at DESC`;
  const res = await db.query(sql);
  return res.rows;
}

async function getById(id) {
  const sql = `SELECT ${BASE_COLUMNS} FROM routes WHERE id = $1 AND deleted_at IS NULL`;
  const res = await db.query(sql, [id]);
  return res.rows[0] || null;
}

async function createRoute(payload, created_by) {
  // Accept only expected fields to avoid SQL injection via column names
  const {
    route_code,
    origin,
    destination,
    distance_km,
    estimated_duration_minutes,
    is_active = true,
  } = payload;

  const sql = `
    INSERT INTO routes (route_code, origin, destination, distance_km, estimated_duration_minutes, is_active, created_by)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING ${BASE_COLUMNS}
  `;

  const params = [
    route_code,
    origin,
    destination,
    distance_km,
    estimated_duration_minutes,
    is_active,
    created_by,
  ];
  const res = await db.query(sql, params);
  return res.rows[0];
}

async function getRouteByRouteCode(route_code) {
  const sql = `SELECT ${BASE_COLUMNS} FROM routes WHERE route_code = $1 AND deleted_at IS NULL`;
  const res = await db.query(sql, [route_code]);
  return res.rows[0] || null;
}

module.exports = {
  getAllRoutes,
  getById,
  createRoute,
  getRouteByRouteCode,
};
