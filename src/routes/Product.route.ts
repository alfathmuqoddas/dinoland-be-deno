import ProductController from "@/controllers/Product.controller.ts";
import passport from "passport";
import ensureIsAdmin from "../middleware/ensureIsAdmin.ts";
import { Router } from "express";

const router = Router();

router.get("/", ProductController.getAll);
router.get("/:productId", ProductController.getById);
router.post("/bulkSearch", ProductController.getByProductIds);
router.post(
  "/add",
  passport.authenticate("jwt", { session: false }),
  ensureIsAdmin,
  ProductController.add
);
router.post(
  "/update/:productId",
  passport.authenticate("jwt", { session: false }),
  ensureIsAdmin,
  ProductController.update
);
router.post(
  "/delete/:productId",
  passport.authenticate("jwt", { session: false }),
  ensureIsAdmin,
  ProductController.delete
);
router.post(
  "/seed",
  passport.authenticate("jwt", { session: false }),
  ensureIsAdmin,
  ProductController.seed
);

export default router;
