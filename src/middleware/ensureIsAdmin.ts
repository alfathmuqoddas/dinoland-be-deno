import { Request, Response, Next } from "express";

//middleware to check if jwt has admin role
const ensureIsAdmin = (req: Request, res: Response, next: Next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Admins only" });
  }
  next();
};

export default ensureIsAdmin;
