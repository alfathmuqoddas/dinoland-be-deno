import { Router, Request, Response } from "express";

const router = Router();

router.get("/protected", (req: Request, res: Response) => {
  res.status(200).json({ message: "Protected route", userId: req.user.id });
});

export default router;
