const { verifyToken } = require("../utils/jwt");
const { failure } = require("../utils/response");

function authMiddleware(req, res, next) {
  console.log("validating token...");

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
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
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json(failure("TOKEN_EXPIRED", "Token has expired", 401));
    }

    if (error.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json(failure("INVALID_TOKEN", "Invalid token", 401));
    }

    return res
      .status(500)
      .json(failure("INTERNAL_SERVER_ERROR", "Internal server error", 500));
  }
}

module.exports = authMiddleware;
