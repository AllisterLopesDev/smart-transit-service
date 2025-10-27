const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");

// All routes under /v1 require authentication
router.use(authMiddleware);

// Resource routers mounted under /v1
const routesResource = require("./v1/routes");
router.use("/routes", routesResource);

module.exports = router;
