const express = require("express");
const router = express.Router();
const { register } = require("../controllers/authController");
const authMiddleware = require("../middleware/auth");
const { success } = require("../utils/response");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const {body, validationResult} = require("express-validator");
const { registrationValidationRules } = require("../validation/authValidation");


//registration route
router.post("/register", registrationValidationRules, register );

// router.get("/protected", authMiddleware, (req, res) => {
//   res.json(success({ user: req.user }, "Protected route accessed"));
// });

module.exports = router;
