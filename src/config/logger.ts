import winston from "winston";
import "winston-daily-rotate-file";

// Define ELK-friendly log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.json() // Logs in JSON format for ELK
);

// Configure daily log rotation
const dailyRotateFileTransport = new winston.transports.DailyRotateFile({
  filename: "logs/app-%DATE%.log", // Logs stored as logs/app-YYYY-MM-DD.log
  datePattern: "YYYY-MM-DD",
  maxFiles: "14d", // Keep logs for 14 days
  zippedArchive: true, // Optional: Compress old logs
});

// Create Winston logger
const logger = winston.createLogger({
  level: "info", // Default log level
  format: logFormat,
  transports: [
    new winston.transports.Console(), // Log to console for debugging
    dailyRotateFileTransport, // Save logs to rotating files
  ],
});

export default logger; // ES6 export
