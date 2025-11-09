const express = require("express");
const { login } = require("../controllers/loginController");
const { body } = require("express-validator");
const router = express.Router();

// validation rules
const loginValidationRules = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Login route
router.post("/login", loginValidationRules, login);

module.exports = router;
