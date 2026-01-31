const db = require("../db");
const logger = require("../utils/logger");

const BASE_COLUMNS = [
  "id",
  "code",
  "name",
  "latitude",
  "longitude",
  "address",
  "facilities",
  "is_active",
  "created_by",
  "created_at",
  "updated_by",
  "updated_at",
].join(", ");

async function getById(id) {
  const sql = `SELECT ${BASE_COLUMNS} FROM stops WHERE id = $1 AND deleted_at IS NULL`;
  const res = await db.query(sql, [id]);
  return res.rows[0] || null;
}

async function getAllStops(page, limit, filters = {}) {
  // Parse and validate pagination parameters
  page = parseInt(page, 10) || 1;
  limit = parseInt(limit, 10) || 20;

  // Validate page and limit
  if (page < 1) page = 1;
  if (limit < 1 || limit > 100) limit = 20; // Max limit of 100

  // Build WHERE clauses from filters
  const whereClauses = ["deleted_at IS NULL"];
  const params = [];

  if (filters.code) {
    params.push(filters.code);
    whereClauses.push(`code = $${params.length}`);
  }

  if (filters.name) {
    params.push(`%${filters.name}%`);
    whereClauses.push(`name ILIKE $${params.length}`);
  }

  if (filters.is_active !== undefined) {
    const val = filters.is_active === true || filters.is_active === "true";
    params.push(val);
    whereClauses.push(`is_active = $${params.length}`);
  }

  if (filters.facilities) {
    // allow comma-separated or array
    const arr = Array.isArray(filters.facilities)
      ? filters.facilities
      : String(filters.facilities)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);

    if (arr.length) {
      params.push(arr);
      whereClauses.push(`facilities && $${params.length}::text[]`);
    }
  }

  if (filters.created_by) {
    params.push(filters.created_by);
    whereClauses.push(`created_by = $${params.length}`);
  }

  const whereSql = whereClauses.join(" AND ");

  const offset = (page - 1) * limit;

  // Build query params for data (filters params + limit + offset)
  const dataParams = params.concat([limit, offset]);
  const dataSql = `SELECT ${BASE_COLUMNS} FROM stops WHERE ${whereSql} ORDER BY created_at DESC LIMIT $${
    params.length + 1
  } OFFSET $${params.length + 2}`;

  // Log the final data query and parameters for monitoring (stringify for printf logger)
  logger.info(
    `[stopsService] data query sql=${dataSql} params=${JSON.stringify(
      dataParams
    )}`
  );
  const res = await db.query(dataSql, dataParams);
  const stops = res.rows;

  // If no stops, return empty pagination object
  if (stops.length === 0) {
    return {
      stops: [],
      pagination: {},
    };
  }

  // Count total matching records using same filters
  const countSql = `SELECT COUNT(*) as total FROM stops WHERE ${whereSql}`;
  // Log the count query and parameters as well
  // Log the count query and parameters as well (stringify for printf logger)
  logger.info(
    `[stopsService] count query sql=${countSql} params=${JSON.stringify(
      params
    )}`
  );
  const countRes = await db.query(countSql, params);
  const totalRecords = parseInt(countRes.rows[0].total, 10);
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
