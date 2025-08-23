import ProductCategoryController from "@/controllers/ProductCategory.controller.ts";
import { Router } from "express";
import ensureIsAdmin from "../middleware/ensureIsAdmin.ts";
import passport from "passport";

const router = Router();

const {
  getAll,
  getById,
  add: addProductCategory,
  update: updateProductCategory,
  delete: deleteProductCategory,
  seed,
} = ProductCategoryController;

router.get("/", getAll);
router.get("/:categoryId", getById);
router.post(
  "/add",
  passport.authenticate("jwt", { session: false }),
  ensureIsAdmin,
  addProductCategory
);
router.put(
  "/update/:categoryId",
  passport.authenticate("jwt", { session: false }),
  ensureIsAdmin,
  updateProductCategory
);
router.delete(
  "/delete/:categoryId",
  passport.authenticate("jwt", { session: false }),
  ensureIsAdmin,
  deleteProductCategory
);
router.post(
  "/seed",
  passport.authenticate("jwt", { session: false }),
  ensureIsAdmin,
  seed
);

export default router;
