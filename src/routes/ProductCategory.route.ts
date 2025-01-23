import ProductCategoryController from "@/controllers/ProductCategory.controller.ts";
import { Router } from "express";
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

export default router;
