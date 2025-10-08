const { generateToken } = require("../utils/jwt");
const { success } = require("../utils/response");

// dummy user validation for demo
exports.register = (req, res) => {
  // register user logic here
  const user = { username: req.body.username };
  const token = generateToken({ username: user.username });

  res.json(success({ access_token: token }, "User registered successfully"));
};
