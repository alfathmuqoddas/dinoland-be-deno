// src/utils/responseHandler.js

import { Response } from "express";

export const success = (
  res: Response,
  message: string,
  data: any,
  statusCode = 200
) => {
  return res.status(statusCode).json({
    status: "success",
    message,
    data,
  });
};

export const error = (res: Response, message: string, statusCode = 500) => {
  return res.status(statusCode).json({
    status: "error",
    message,
    data: null,
  });
};
