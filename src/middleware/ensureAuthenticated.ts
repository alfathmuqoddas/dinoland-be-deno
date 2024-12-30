import { Request, Response, Next } from "express";

const ensureAuthenticated = (req: Request, res: Response, next: Next) => {
  if (req.session.user) {
    return next();
  }
  res.status(401).json({ error: "Unauthorized" });
};

export default ensureAuthenticated;
