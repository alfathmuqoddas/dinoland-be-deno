import ProductController from "@/controllers/Product.controller.ts";
import passport from "passport";
import ensureIsAdmin from "../middleware/ensureIsAdmin.ts";
import { Router } from "express";

const router = Router();

const {
  getAll,
  getById,
  getByProductIds,
  add: addProduct,
  update: updateProduct,
  delete: deleteProduct,
  seed,
} = ProductController;

router.get("/", getAll);
router.get("/:productId", getById);
router.post("/bulkSearch", getByProductIds);
router.post(
  "/add",
  passport.authenticate("jwt", { session: false }),
  ensureIsAdmin,
  addProduct
);
router.put(
  "/update/:productId",
  passport.authenticate("jwt", { session: false }),
  ensureIsAdmin,
  updateProduct
);
router.delete(
  "/delete/:productId",
  passport.authenticate("jwt", { session: false }),
  ensureIsAdmin,
  deleteProduct
);
router.post(
  "/seed",
  passport.authenticate("jwt", { session: false }),
  ensureIsAdmin,
  seed
);

export default router;
