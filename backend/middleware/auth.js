const { verifyToken } = require("../utils/jwt");

function authMiddleware(req, res, next) {
  console.log("validating token...");

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Authorization header missing or malformed" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyToken(token);

    if (!payload) {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.user = payload;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token has expired" });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }

    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = authMiddleware;
