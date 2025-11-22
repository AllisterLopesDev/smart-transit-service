const { success, failure } = require("../../utils/response");
const routesService = require("../../services/routesService");
const logger = require("../../utils/logger");
const stopsService = require("../../services/stopsService");

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
  const { route_code, origin, destination, distance_km } = payload;
  logger.info(`[ROUTES] create route requested by ${req.user.sub}`);
  const createdBy = req.user.sub;

  const existingRoute = await routesService.getRouteByRouteCode(route_code);
  if (existingRoute) {
    logger.error(`[ROUTES] route already exists by route_code ${route_code}`);
    return res
      .status(409)
      .json(failure("conflict", "Route with this code already exists", 409));
  }

  logger.info(`[ROUTES] checking if origin and destination exists as stops`);
  const originStop = await stopsService.getById(origin);
  const destinationStop = await stopsService.getById(destination);

  if (!originStop) {
    logger.error(`[ROUTES] origin stop does not exist with ID ${origin}`);
    return res
      .status(400)
      .json(failure("invalid_origin", "Origin stop does not exist", 400));
  }

  if (!destinationStop) {
    logger.error(
      `[ROUTES] destination stop does not exist with ID ${destination}`
    );
    return res
      .status(400)
      .json(
        failure("invalid_destination", "Destination stop does not exist", 400)
      );
  }

  try {
    const created = await routesService.createRoute(payload, createdBy);
    return res.status(201).json(success(created, "Route created"));
  } catch (err) {
    logger.error("[ROUTES] createRoute error", err);
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
