require("dotenv").config();
const express = require("express");
const app = express();

// Routes
// const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");

// Middleware to parse JSON
app.use(express.json());

// Routes

// app.use("/", indexRouter);
app.use("/auth", authRouter);

module.exports = app;
