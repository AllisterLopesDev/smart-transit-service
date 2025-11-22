const express = require("express");
const router = express.Router();
const {
  getAllRoutes,
  getRouteById,
  createRoute,
} = require("../../controllers/v1/routesController");
const authMiddleware = require("../../middleware/auth");
const loadUser = require("../../middleware/loadUser");
const { validateCreateRoute } = require("../../validation/routeValidation");

router.use(authMiddleware);
router.use(loadUser);

router.get("/", getAllRoutes);
router.get("/:id", getRouteById);
router.post("/", validateCreateRoute, createRoute);

module.exports = router;
