import winston from "winston";
const { combine, timestamp, json } = winston.format;

// Define ELK-friendly log format
const logFormat = combine(
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  json(), // Logs in JSON format for ELK
);

// Create Winston logger
const logger = winston.createLogger({
  level: "info",
  format: logFormat,
  transports: [new winston.transports.Console()],
});

export default logger;
