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


async function getAllRoutesFilters(params) {
  const {page, limit, origin, destination, is_active} = params;

  const offset = (page - 1) * limit;

  let conditions = [];
  let values = [];
  let idx = 1;

  if (source) {
    conditions.push(`origin ILIKE $${idx++}`);
    values.push(source);
  }

  if (destination) {
    conditions.push(`destination ILIKE $${idx++}`);
    values.push(destination);
  }

  if (is_active !== undefined) {
    conditions.push(`is_active = $${idx++}`);
    values.push(is_active);
  }

  let whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")} AND deleted_at IS NULL` : `WHERE deleted_at IS NULL`;

  const query = `
    SELECT * FROM routes
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT $${idx++} OFFSET $${idx}
  `;

  const res = await db.query(query, [...values, limit, offset]);
  return res.rows;
}


module.exports = {
  getAllRoutes,
  getById,
  createRoute,
  getRouteByRouteCode,
  getAllRoutesFilters,
};
