require("dotenv").config();
const express = require("express");
const app = express();

// Routes
const authRouter = require("./routes/auth");

// Middleware to parse JSON
app.use(express.json());

// Auth route
app.use("/auth", authRouter);

module.exports = app;
