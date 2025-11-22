const { generateToken } = require("../utils/jwt");
const { success } = require("../utils/response");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const { v4: uuidv4 } = require("uuid");
const pool = require("../db/index");
const { findUserByEmailOrPhone } = require("../services/userService");
const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

// Register Controller
exports.register = async (req, res) => {
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

    const {
      name,
      email,
      country_code,
      phone_number,
      full_phone,
      password,
      date_of_birth,
      gender,
    } = req.body;

    // Check if user already exists
    const existingUser = await findUserByEmailOrPhone(email, full_phone);
    if (existingUser) {
      return res
        .status(400)
        .json({ status: "error", message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user record
    const newUser = {
      name,
      email,
      country_code,
      phone_number,
      full_phone,
      password_hash: hashedPassword,
      date_of_birth,
      gender,
    };

    await pool.query(
      `INSERT INTO users 
        ( name, email, country_code, phone_number, full_phone, password_hash, date_of_birth, gender, status, is_verified)
      VALUES 
        ($1,$2,$3,$4,$5,$6,$7,$8,'active', false)`,
      [
        newUser.name,
        newUser.email,
        newUser.country_code,
        newUser.phone_number,
        newUser.full_phone,
        newUser.password_hash,
        newUser.date_of_birth,
        newUser.gender,
      ]
    );

    // Return success response
    return res.status(201).json(success(null, "User registered successfully"));
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({
      status: "error",
      message: "Server error",
      error: err.message,
    });
  }
};

// Login Controller
exports.login = async (req, res) => {
  try {
    // Validate input fields
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn("[LOGIN] Validation failed");
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: errors.array(),
      });
    }
    const { email, password } = req.body;
    // Check if user exists
    const userResult = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (userResult.rows.length === 0) {
      logger.warn("[LOGIN] Invalid credentials for email: " + email);
      return res
        .status(400)
        .json({ status: "error", message: "Invalid credentials" });
    }
    const user = userResult.rows[0];

    logger.info("[LOGIN] Authenticating user");
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid credentials" });
    }

    // Generate token
    logger.info("[LOGIN] Authentication success, generating access token");
    const token = generateToken({
      sub: user.id,
      email: user.email,
    });

    // Return success response
    logger.info("[LOGIN] Login request successful for user " + user.id);
    return res
      .status(200)
      .json(success({ access_token: token }, "User logged in successfully"));
  } catch (error) {
    logger.error("[LOGIN] Login Error:", error);
    return res.status(500).json({
      status: "error",
      message: "Server error during login",
    });
  }

  //login timestamp update
  await pool.query("UPDATE users SET last_login = NOW() WHERE id = $1", [
    user.id,
  ]);
};
