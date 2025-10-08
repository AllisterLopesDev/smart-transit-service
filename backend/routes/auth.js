const express = require("express");
const router = express.Router();
const { register } = require("../controllers/authController");
const authMiddleware = require("../middleware/auth");

router.post("/register", register);

router.get("/protected", authMiddleware, (req, res) => {
  res.json({ message: "you are authenticated", user: req.user });
});

module.exports = router;
