const express = require("express");
const router = express.Router();
const {
  getAllRoutes,
  getRouteById,
  createRoute,
} = require("../../controllers/v1/routesController");
const authMiddleware = require("../../middleware/auth");
const loadUser = require("../../middleware/loadUser");

router.use(authMiddleware);
router.use(loadUser);

router.get("/", getAllRoutes);
router.get("/:id", getRouteById);
router.post("/", createRoute);

module.exports = router;
