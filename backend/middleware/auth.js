const { verifyToken } = require("../utils/jwt");
const { failure } = require("../utils/response");
const logger = require("../utils/logger");

function authMiddleware(req, res, next) {
  logger.info("[AUTH] validating token...");

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    logger.warn("[AUTH] Authorization header missing or malformed");
    return res
      .status(401)
      .json(
        failure(
          "AUTH_HEADER_MISSING",
          "Authorization header missing or malformed",
          401
        )
      );
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyToken(token);
    req.user = payload;
    logger.info(
      `[AUTH] token is valid, user authenticated:", ${JSON.stringify(payload)}`
    );
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      logger.warn("[AUTH] Token has expired");
      return res
        .status(401)
        .json(failure("TOKEN_EXPIRED", "Token has expired", 401));
    }

    if (error.name === "JsonWebTokenError") {
      logger.warn("[AUTH] Token is invalid");
      return res
        .status(401)
        .json(failure("INVALID_TOKEN", "Invalid token", 401));
    }

    logger.error("[AUTH] Error verifying token:", error);
    return res
      .status(500)
      .json(failure("INTERNAL_SERVER_ERROR", "Internal server error", 500));
  }
}

module.exports = authMiddleware;
