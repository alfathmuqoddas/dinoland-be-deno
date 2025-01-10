import passport from "passport";
import { Router, Request, Response } from "express";

const router = Router();

router.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  (req: Request, res: Response) => {
    res.status(200).json({ message: "Protected route" });
  }
);

export default router;
