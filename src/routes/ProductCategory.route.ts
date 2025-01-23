import ProductCategoryController from "@/controllers/ProductCategory.controller.ts";
import { Router } from "express";

const router = Router();

router.get("/", ProductCategoryController.getAll);
router.get("/:categoryId", ProductCategoryController.getById);
router.post("/add", ProductCategoryController.add);
router.post("/update/:categoryId", ProductCategoryController.update);
router.post("/delete/:categoryId", ProductCategoryController.delete);

export default router;
