import morgan, { StreamOptions } from "morgan";
import logger from "@/config/logger.ts";
import { Request, Response } from "express";

// Define the stream for logging (Winston integration)
const stream: StreamOptions = {
  write: (message: string) => {
    logger.info(JSON.parse(message)); // Send logs to Winston
  },
};

// Define a custom Morgan format (ELK-friendly JSON)
const morganMiddleware = morgan(
  (tokens: any, req: Request, res: Response) => {
    return JSON.stringify({
      timestamp: tokens.date(req, res, "iso"),
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      status: Number(tokens.status(req, res)), // Ensure it's a number
      responseTime: `${tokens["response-time"](req, res)} ms`,
      userAgent: req.headers["user-agent"],
    });
  },
  { stream }
);

export default morganMiddleware;
