// import { Router, Request, Response } from "express";
import passport from "passport";
import { Hono, Context } from "hono";

const router = new Hono();

router.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  (c: Context) => {
    c.status(200);
    return c.json({ message: "Protected route" });
  }
);

export default router;
