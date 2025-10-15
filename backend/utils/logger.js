const { createLogger, format, transports } = require("winston");
const LOG_LEVEL = process.env.LOG_LEVEL;

const logger = createLogger({
  level: LOG_LEVEL,
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    })
  ),
  transports: [new transports.Console()],
});

module.exports = logger;
