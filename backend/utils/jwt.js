const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN;
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN;

logger.debug(`access token expires in: ${JWT_ACCESS_EXPIRES_IN}`);
logger.debug(`refresh token expires in: ${JWT_REFRESH_EXPIRES_IN}`);

function generateToken(payload, expiry, type) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: expiry });
}

function generateTokens(payload) {
  const accessToken = generateToken(
    { ...payload, type: "access" },
    JWT_ACCESS_EXPIRES_IN
  );

  const refreshToken = generateToken(
    { ...payload, type: "refresh" },
    JWT_REFRESH_EXPIRES_IN
  );

  return {
    accessToken,
    refreshToken,
  };
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

function decodeToken(token) {
  return jwt.decode(token);
}

function extractUserId(token) {
  try {
    const payload = verifyToken(token);
    return payload && payload.userId ? payload.userId : null;
  } catch (err) {
    return null;
  }
}

module.exports = {
  generateTokens,
  verifyToken,
  decodeToken,
  extractUserId,
};
