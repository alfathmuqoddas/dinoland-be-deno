import { Request, Response, Next } from "express";

//middleware to check if jwt has admin role
const ensureIsCustomer = (req: Request, res: Response, next: Next) => {
  if (!req.user || req.user.role !== "customer") {
    return res.status(403).json({ message: "Forbidden: Customer only" });
  }
  next();
};

export default ensureIsCustomer;
