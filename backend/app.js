require("dotenv").config();
const express = require("express");
const app = express();

// Routes
// const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const loginRouter = require("./routes/login");

// Middleware to parse JSON
app.use(express.json());

// login route
app.use("/auth", loginRouter);

// Other routes

// app.use("/", indexRouter);
app.use("/auth", authRouter);

module.exports = app;
