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
    const { page, limit } = req.query;
    const result = await stopsService.getAllStops(page, limit);

    return res.json(success(result, "Fetched all stops successfully"));
  } catch (err) {
    // log error using project's logger if available; fall back to console
    logger.error("[Stops Controller] getAllStops error", err);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(failure("internal_error", "Failed to fetch stops"));
  }
};
