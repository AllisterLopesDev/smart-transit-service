const express = require("express");
const router = express.Router();
const { register } = require("../controllers/authController");
const authMiddleware = require("../middleware/auth");
const { success } = require("../utils/response");

router.post("/register", register);

router.get("/protected", authMiddleware, (req, res) => {
  res.json(success({ user: req.user }, "Protected route accessed"));
});

module.exports = router;
