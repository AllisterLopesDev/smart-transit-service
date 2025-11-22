const { body } = require("express-validator");
const { ROUTE_CODE_REGEX } = require("../constants/regex");

const validateCreateRoute = [
  body("route_code")
    .exists()
    .withMessage("route_code is required")
    .bail()
    .matches(ROUTE_CODE_REGEX)
    .withMessage(
      "route_code must be 3 digits followed by an uppercase letter (e.g. 101A)"
    ),
  body("origin")
    .exists()
    .withMessage("origin is required")
    .bail()
    .isUUID(4)
    .withMessage("origin must be a valid UUID"),
  body("destination")
    .exists()
    .withMessage("destination is required")
    .bail()
    .isUUID(4)
    .withMessage("destination must be a valid UUID"),
  body("distance_km")
    .exists()
    .withMessage("distance_km is required")
    .bail()
    .isFloat({ gt: 0 })
    .withMessage("distance_km must be a positive number"),
  body("estimated_duration_minutes")
    .optional()
    .isInt({ gt: 0 })
    .withMessage("estimated_duration_minutes must be a positive integer"),
  // final middleware to handle validation result and normalize payload
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const msg = errors
        .array()
        .map((e) => `${e.param}: ${e.msg}`)
        .join("; ");
      return res.status(400).json(failure("validation_error", msg, 400));
    }

    next();
  },
];

module.exports = { validateCreateRoute };
