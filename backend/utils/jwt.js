const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

console.log("token expires in seconds:", JWT_EXPIRES_IN);

function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

function decodeToken(token) {
  return jwt.decode(token);
}

function extractUserId(token) {
  const payload = verifyToken(token);
  return payload && payload.userId ? payload.userId : null;
}

module.exports = { generateToken, verifyToken, decodeToken, extractUserId };
