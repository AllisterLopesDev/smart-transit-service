const { success, failure } = require("../../utils/response");
const routesService = require("../../services/routesService");
const logger = require("../../utils/logger");
const stopsService = require("../../services/stopsService");
const {
  OK,
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  CONFLICT,
  INTERNAL_SERVER_ERROR,
} = require("../../constants/httpStatusCodes");

exports.getAllRoutes = async (req, res) => {
  try {
    //pagination and filters can be handled here
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    const filters = {
      page,
      limit,
      origin: req.query.origin,
      destination: req.query.destination,
      is_active: req.query.is_active,
    };

    const routes = await routesService.getAllRoutesFilters(filters);
    return res.json(success(
      {
      page,
      limit,
      total: routes.length,
      routes,
    },
      "Fetched routes with pagination and filtering successfully"));
      
  } catch (err) {
    // log error using project's logger if available; fall back to console
    logger.error("[Routes Controller] getAllRoutes error", err);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(failure("internal_error", "Failed to fetch routes"));
  }
};

exports.getRouteById = async (req, res) => {
  const { id } = req.params;
  try {
    const route = await routesService.getById(id);
    if (!route)
      return res
        .status(NOT_FOUND)
        .json(failure("not_found", `Route ${id} not found`, NOT_FOUND));
    return res.json(
      success(route, `Fetched route with ID: ${id} successfully`)
    );
  } catch (err) {
    logger.error("[Routes Controller] getRouteById error", err);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(failure("internal_error", "Failed to fetch route"));
  }
};

exports.createRoute = async (req, res) => {
  const createdBy = req.user.sub;
  logger.info(`[ROUTES] create route requested by ${createdBy}`);

  const payload = req.body || {};
  const { route_code, origin, destination } = payload;

  const existingRoute = await routesService.getRouteByRouteCode(route_code);
  if (existingRoute) {
    logger.error(`[ROUTES] Route with code ${route_code} already exists`);
    return res
      .status(CONFLICT)
      .json(
        failure(
          "conflict",
          `Route with code ${route_code} already exists`,
          CONFLICT
        )
      );
  }

  logger.info(`[ROUTES] checking if origin and destination stops exist`);
  const originStop = await stopsService.getById(origin);
  const destinationStop = await stopsService.getById(destination);

  if (!originStop) {
    logger.error(`[ROUTES] origin stop does not exist with ID ${origin}`);
    return res
      .status(BAD_REQUEST)
      .json(
        failure("invalid_origin", "Origin stop does not exist", BAD_REQUEST)
      );
  }

  if (!destinationStop) {
    logger.error(
      `[ROUTES] destination stop does not exist with ID ${destination}`
    );
    return res
      .status(BAD_REQUEST)
      .json(
        failure(
          "invalid_destination",
          "Destination stop does not exist",
          BAD_REQUEST
        )
      );
  }

  try {
    const created = await routesService.createRoute(payload, createdBy);
    return res.status(CREATED).json(success(created, "Route created"));
  } catch (err) {
    logger.error("[ROUTES] error while persisting route", err);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(
        failure(
          "internal_error",
          "Failed to create route",
          INTERNAL_SERVER_ERROR
        )
      );
  }
};
