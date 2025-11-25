const userService = require("../services/userService");
const { failure } = require("../utils/response");
const logger = require("../utils/logger");

async function loadUser(req, res, next) {
  const userId = req.user.sub;

  if (!userId) {
    logger.warn("[AUTH] missing user id in token");
    return res
      .status(401)
      .json(failure("missing_id", "Authenticated user id missing", 401));
  }

  try {
    const user = await userService.getById(userId);
    if (!user) {
      logger.warn(`[AUTH] user not found: ${userId}`);
      return res
        .status(401)
        .json(failure("not_found", "Authenticated user not found", 401));
    }

    // attach full user to req (do not overwrite token claims accidentally)
    req.user = { ...req.user, ...user };
    next();
  } catch (err) {
    logger.error("[AUTH] loadUser error", err);
    return res
      .status(500)
      .json(failure("internal_error", "Failed to validate user", 500));
  }
}

module.exports = loadUser;
