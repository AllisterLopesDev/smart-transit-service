const {generateToken} = require("../utils/jwt");
const { success } = require("../utils/response");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const pool = require("../dbconfig/db");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

// Login Controller
exports.login = async (req, res) => {
  try {
    // Validate input fields
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: errors.array(),
      });
    }
    const { email, password } = req.body;
    // Check if user exists
    const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ status: "error", message: "Invalid credentials" });
    }
    const user = userResult.rows[0];

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ status: "error", message: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken({
        id: user.id,
        email: user.email,
    });

    // Return success response
    return res
      .status(200)
      .json(success({ access_token: token }, "User logged in successfully"));
  }
    catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      status: "error",
      message: "Server error during login",
    });
  }

  //login timestamp update 
  await pool.query(
    "UPDATE users SET last_login = NOW() WHERE id = $1",
    [user.id]
  );
};