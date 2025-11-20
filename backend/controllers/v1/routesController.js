const { success, failure } = require("../../utils/response");
const routesService = require("../../services/routesService");
const logger = require("../../utils/logger");
const { log } = require("winston");

const routeCodeRegex = /^[0-9]{3}[A-Z]$/;
const uuidV4Regex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

exports.getAllRoutes = async (req, res) => {
  try {
    const routes = await routesService.getAllRoutes();
    return res.json(success(routes, "Fetched all routes successfully"));
  } catch (err) {
    // log error using project's logger if available; fall back to console
    logger.error("[Routes Controller] getAllRoutes error", err);
    return res
      .status(500)
      .json(failure("internal_error", "Failed to fetch routes"));
  }
};

exports.getRouteById = async (req, res) => {
  const { id } = req.params;
  try {
    const route = await routesService.getRouteById(id);
    if (!route)
      return res
        .status(404)
        .json(failure("not_found", `Route ${id} not found`, 404));
    return res.json(
      success(route, `Fetched route with ID: ${id} successfully`)
    );
  } catch (err) {
    logger.error("[Routes Controller] getRouteById error", err);
    return res
      .status(500)
      .json(failure("internal_error", "Failed to fetch route"));
  }
};

exports.createRoute = async (req, res) => {
  const payload = req.body || {};
  const { route_code, origin, destination, distance } = payload;
  const createdBy = req.user && req.user.id;

  if (!createdBy) {
    logger.warn("[ROUTES CONTROLLER] missing user id");
    return res
      .status(401)
      .json(failure("missing_user_id", "Authenticated user ID missing", 401));
  }

  try {
    const created = await routesService.createRoute(payload, createdBy);
    return res.status(201).json(success(created, "Route created"));
  } catch (err) {
    logger.error("[Routes Controller] createRoute error", err);
    // handle unique violation for route_code (Postgres err code 23505)
    if (err && err.code === "23505") {
      return res
        .status(409)
        .json(failure("conflict", "Route with this code already exists", 409));
    }
    return res
      .status(500)
      .json(failure("internal_error", "Failed to create route"));
  }
};
