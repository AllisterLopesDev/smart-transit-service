const app = require("./app");
const logger = require("./utils/logger");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.debug(`Server running on http://localhost:${PORT}`);
  logger.info(`Started express server on port: ${PORT}`);
});
