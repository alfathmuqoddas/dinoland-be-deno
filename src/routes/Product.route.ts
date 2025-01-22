import ProductController from "@/controllers/Product.controller.ts";
import passport from "passport";
import { Router } from "express";

const router = Router();

router.get("/", ProductController.getAll);
router.get("/sort", ProductController.sortBy);
router.get("/:productId", ProductController.getById);
router.post(
  "/add",
  passport.authenticate("jwt", { session: false }),
  ProductController.add
);
router.post(
  "/update/:productId",
  passport.authenticate("jwt", { session: false }),
  ProductController.update
);
router.post(
  "/delete/:productId",
  passport.authenticate("jwt", { session: false }),
  ProductController.delete
);

export default router;
