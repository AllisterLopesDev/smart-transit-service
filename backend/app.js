require("dotenv").config();
const express = require("express");
const app = express();

// Routes
const authRouter = require("./routes/auth");
const v1Router = require("./routes/v1");

// Middleware to parse JSON
app.use(express.json());

// Public routes
app.use("/auth", authRouter);

// Protected routes
app.use("/v1", v1Router);

module.exports = app;
