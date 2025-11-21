const express = require("express");
const router = express.Router();
const { register } = require("../controllers/authController");
const authMiddleware = require("../middleware/auth");
const { success } = require("../utils/response");
const bcrypt = require("bcrypt");
const {body, validationResult} = require("express-validator");
const { registrationValidationRules } = require("../validation/authValidation");
const { loginValidationRules } = require("../validation/authValidation");
const { login } = require("../controllers/authController");


//registration route
router.post("/register", registrationValidationRules, register );

//login route
router.post("/login", loginValidationRules, login);

// router.get("/protected", authMiddleware, (req, res) => {
//   res.json(success({ user: req.user }, "Protected route accessed"));
// });

module.exports = router;
