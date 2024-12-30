import { Request, Response, Next } from "express";

const checkLoggedIn = (req: Request, res: Response, next: Next) => {
  if (req.session.user) {
    return res
      .status(200)
      .json({ message: "User already logged in", user: req.session.user });
  }
  next();
};

export default checkLoggedIn;
