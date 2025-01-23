import { Request, Response, Next } from "express";

export const checkRequestMethods = (allowedMethods: string[]) => {
  return (req: Request, res: Response, next: Next) => {
    if (!allowedMethods.includes(req.method)) {
      return res
        .status(405)
        .json({ error: `Method ${req.method} Not Allowed` });
    }
    next();
  };
};
