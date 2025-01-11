import { Router, Request, Response } from "express";

const router = Router();

router.get("/protected", (_req: Request, res: Response) => {
  res.status(200).json({ message: "Protected route" });
});

export default router;
