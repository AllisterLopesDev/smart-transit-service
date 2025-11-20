const db = require("../db");

const BASE_COLUMNS = [
  "id",
  "route_code",
  "origin",
  "destination",
  "distance_km",
  "estimated_duration_minutes",
  "is_active",
  "created_by",
  "created_at",
  "updated_at",
].join(", ");

async function getAllRoutes() {
  const sql = `SELECT ${BASE_COLUMNS} FROM routes WHERE deleted_at IS NULL ORDER BY created_at DESC`;
  const res = await db.query(sql);
  return res.rows;
}

async function getRouteById(id) {
  const sql = `SELECT ${BASE_COLUMNS} FROM routes WHERE id = $1 AND deleted_at IS NULL`;
  const res = await db.query(sql, [id]);
  return res.rows[0] || null;
}

async function createRoute(payload) {
  // Accept only expected fields to avoid SQL injection via column names
  const {
    route_code,
    origin,
    destination,
    distance_km = null,
    estimated_duration_minutes = null,
    is_active = true,
    created_by,
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

module.exports = { getAllRoutes, getRouteById, createRoute };
