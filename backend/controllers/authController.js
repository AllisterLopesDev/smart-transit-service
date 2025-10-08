const { generateToken } = require("../utils/jwt");

// dummy user validation for demo
exports.register = (req, res) => {
  // register user logic here
  const user = { username: req.body.username };
  const token = generateToken({ username: user.username });

  res.json({ access_token: token });
};
