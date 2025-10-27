const express = require("express");
const router = express.Router();
const {
  getAllRoutes,
  getRouteById,
  createRoute,
} = require("../../controllers/v1/routesController");

router.get("/", getAllRoutes);
router.get("/:id", getRouteById);
router.post("/", createRoute);

module.exports = router;
