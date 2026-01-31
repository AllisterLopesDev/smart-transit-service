const { success, failure } = require("../../utils/response");
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

exports.getAllStops = async (req, res) => {
  try {
    const { page, limit, code, name, is_active, facilities, created_by } =
      req.query;

    // Collect filters (only include provided keys)
    const filters = {
      code,
      name,
      is_active,
      facilities,
      created_by,
    };

    // Log input filters for debugging (stringify because logger uses printf message)
    logger.info(
      `[Stops Controller] getAllStops - request filters ${JSON.stringify(
        filters
      )}`
    );
    const result = await stopsService.getAllStops(page, limit, filters);

    return res.json(success(result, "Fetched all stops successfully"));
  } catch (err) {
    // log error using project's logger if available; fall back to console
    logger.error("[Stops Controller] getAllStops error", err);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(failure("internal_error", "Failed to fetch stops"));
  }
};
