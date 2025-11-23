const { generateToken } = require("../utils/jwt");
const { success, failure } = require("../utils/response");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const { v4: uuidv4 } = require("uuid");
const pool = require("../db/index");
const usersService = require("../services/userService");
const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  OK,
} = require("../constants/httpStatusCodes");

// Register Controller
exports.register = async (req, res) => {
  try {
    // Validate input fields
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn("[REGISTER] Validation failed");
      return res
        .status(BAD_REQUEST)
        .json(failure("bad_request", errors.array(), BAD_REQUEST));
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
    const existingUser = await usersService.findUserByEmailOrPhone(
      email,
      full_phone
    );
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
      return res
        .status(BAD_REQUEST)
        .json(failure("bad_request", errors.array(), BAD_REQUEST));
    }

    const { email, password } = req.body;

    const existingUser = await usersService.findByEmail(email);

    if (!existingUser) {
      logger.error(`[LOGIN] user ${email} does not exist`);
      return res
        .status(NOT_FOUND)
        .json(failure("not_found", `user ${email} not found`, NOT_FOUND));
    }

    if (existingUser.status === "inactive") {
      logger.warn(`[LOGIN] user ${email} is inactive`);
      return res
        .status(BAD_REQUEST)
        .json(
          failure("inactive_user", "User account is inactive", BAD_REQUEST)
        );
    }

    logger.info("[LOGIN] authenticating users credentials");
    const isMatch = await bcrypt.compare(password, existingUser.password_hash);
    if (!isMatch) {
      return res
        .status(BAD_REQUEST)
        .json(
          failure("invalid_credentials", "invalid credentials", BAD_REQUEST)
        );
    }

    // Generate token
    logger.info("[LOGIN] Authentication success, generating access token");
    const token = generateToken({
      sub: existingUser.id,
      email: existingUser.email,
    });

    // Return success response
    logger.info(`[LOGIN] Login request successful for user ${existingUser.id}`);
    return res
      .status(OK)
      .json(success({ access_token: token }, "User logged in successfully"));
  } catch (error) {
    logger.error("[LOGIN] Login Error:", error);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(
        failure(
          "internal_server_error",
          "Internal server error",
          INTERNAL_SERVER_ERROR
        )
      );
  }
};
