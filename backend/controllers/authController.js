const { generateToken } = require("../utils/jwt");
const { success } = require("../utils/response");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const { v4: uuidv4 } = require("uuid");
const pool = require("../dbconfig/db");

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
      created_by,
    } = req.body;

    // Check if user already exists
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1 OR full_phone = $2",
      [email, full_phone]
    );

    if (existingUser.rows.length > 0) {
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
      gender,
      created_by,
    };

    await pool.query(
      `INSERT INTO users 
        (id, name, email, country_code, phone_number, full_phone, password_hash, date_of_birth, gender, created_by, created_at, status, is_verified)
      VALUES 
        ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10, NOW(), 'active', false)`,
      [
        newUser.id,
        newUser.name,
        newUser.email,
        newUser.country_code,
        newUser.phone_number,
        newUser.full_phone,
        newUser.password_hash,
        newUser.date_of_birth,
        newUser.gender,
        newUser.created_by,
      ]
    );

    // Generate token
    const token = generateToken({
      id: newUser.id,
      email: newUser.email,
    });

    // Return success response
    return res
      .status(201)
      .json(success({ access_token: token }, "User registered successfully"));
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({
      status: "error",
      message: "Server error",
      error: err.message,
    });
  }

  // const token = generateToken(user);

  // res.json(success({ access_token: token }, "User registered successfully"));
};
