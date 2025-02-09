import ProductCategoryController from "@/controllers/ProductCategory.controller.ts";
import { Router } from "express";
import ensureIsAdmin from "../middleware/ensureIsAdmin";
import passport from "passport";

const router = Router();

router.get("/", ProductCategoryController.getAll);
router.get("/:categoryId", ProductCategoryController.getById);
router.post(
  "/add",
  passport.authenticate("jwt", { session: false }),
  ProductCategoryController.add
);
router.post(
  "/update/:categoryId",
  passport.authenticate("jwt", { session: false }),
  ProductCategoryController.update
);
router.post(
  "/delete/:categoryId",
  passport.authenticate("jwt", { session: false }),
  ProductCategoryController.delete
);
router.post(
  "/seed",
  passport.authenticate("jwt", { session: false }),
  ensureIsAdmin,
  ProductCategoryController.seed
);

export default router;
