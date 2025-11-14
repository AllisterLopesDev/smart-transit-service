const express = require("express");
const { login } = require("../controllers/authController");
const { body } = require("express-validator");
const router = express.Router();
const { loginValidationRules } = require("../validation/authValidation");

// Login route
router.post("/login", loginValidationRules, login);

module.exports = router;
