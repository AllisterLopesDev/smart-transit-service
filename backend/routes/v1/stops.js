const express = require("express");
const router = express.Router();
const { getAllStops } = require("../../controllers/v1/stopsController");
const loadUser = require("../../middleware/loadUser");

router.use(loadUser);

router.get("/", getAllStops);

module.exports = router;
