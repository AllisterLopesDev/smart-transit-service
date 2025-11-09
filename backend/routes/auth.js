const express = require("express");
const router = express.Router();
const { register } = require("../controllers/authController");
const authMiddleware = require("../middleware/auth");
const { success } = require("../utils/response");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const {body, validationResult} = require("express-validator");



//validation rules
const registrationValidationRules = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("country_code").isLength({ min: 2, max: 2 }).withMessage("Country code must be 2 characters long"),
  body("phone_number").isLength({ min: 10 }).withMessage("Phone number must be at least 10 digits long"),
  body("full_phone_number").isLength({ min: 12 }).withMessage("Full phone number must be at least 10 digits long"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  body("date_of_birth").isISO8601().withMessage("Date of birth must be a valid date"),
  body("gender").isIn(["male", "female", "other"]).withMessage("Gender must be male, female, or other"),
  body("created_by").notEmpty().withMessage("Created by is required"),
];


//registration route
router.post("/register", registrationValidationRules, register );

// router.get("/protected", authMiddleware, (req, res) => {
//   res.json(success({ user: req.user }, "Protected route accessed"));
// });

module.exports = router;
