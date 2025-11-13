const { generateToken } = require("../utils/jwt");
const { success } = require("../utils/response");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const { v4: uuidv4 } = require("uuid");
const pool = require("../db/index");
const { findUserByEmailOrPhone } = require("../service/userService");

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
      gender
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
      id: uuidv4(),
      name,
      email,
      country_code,
      phone_number,
      full_phone,
      password_hash: hashedPassword,
      date_of_birth,
      gender
    };

    await pool.query(
      `INSERT INTO users 
        (id, name, email, country_code, phone_number, full_phone, password_hash, date_of_birth, gender, created_at, status, is_verified)
      VALUES 
        ($1,$2,$3,$4,$5,$6,$7,$8,$9, NOW(), 'active', false)`,
      [
        newUser.id,
        newUser.name,
        newUser.email,
        newUser.country_code,
        newUser.phone_number,
        newUser.full_phone,
        newUser.password_hash,
        newUser.date_of_birth,
        newUser.gender
      ]
    );
    
    // Return success response
    return res
      .status(201)
      .json(success(null, "User registered successfully"));
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({
      status: "error",
      message: "Server error",
      error: err.message,
    });
  }
};
