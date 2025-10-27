const { success } = require("../../utils/response");

exports.getAllRoutes = (req, res) => {
  res.json(success([], "Fetched all routes successfully"));
};

exports.getRouteById = (req, res) => {
  const { id } = req.params;
  res.json(success({ id }, `Fetched route with ID: ${id} successfully`));
};

exports.createRoute = (req, res) => {
  const payload = req.body;
  // return created resource (id placeholder)
  res
    .status(201)
    .json(success({ id: "new-route-id", ...payload }, "Route created"));
};
