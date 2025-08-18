import { Request, Response } from "express";
import { ProductCategory } from "@/models/index.ts";
import { categorySeedData } from "@/helper/index.ts";
import logger from "@/config/logger.ts";
import {
  success,
  error as errResponse,
} from "../middleware/responseHandler.ts";

export default {
  getAll: async (_req: Request, res: Response) => {
    try {
      const categories = await ProductCategory.findAll();
      if (categories.length === 0) {
        logger.error("Categories not found");
        return errResponse(res, "Categories not found", 404);
      }

      logger.info("Categories fetched successfully");
      return success(res, "Categories fetched successfully", categories);
    } catch (err) {
      logger.error("Error fetching categories", { err });
      return errResponse(res, "Error fetching categories");
    }
  },
  getById: async (req: Request, res: Response) => {
    const { categoryId } = req.params;
    logger.info("Fetching category by ID", { categoryId });
    try {
      const category = await ProductCategory.findByPk(categoryId);

      if (!category) {
        logger.warn("Category not found", { categoryId });
        return errResponse(res, "Category not found", 404);
      }
      logger.info("Category fetched successfully", { category });
      return success(res, "Category fetched successfully", category);
    } catch (err) {
      logger.error("Error fetching category", { err });
      return errResponse(res, "Error fetching category");
    }
  },
  add: async (req: Request, res: Response) => {
    const categories = req.body;
    logger.info("Adding categories", { categories });
    try {
      if (!Array.isArray(categories) || categories.length === 0) {
        logger.warn("Invalid input: Provide an array of categories");
        return errResponse(
          res,
          "Invalid input: Provide an array of categories",
          400
        );
      }

      const _add = await ProductCategory.bulkCreate(categories);
      logger.info("Categories added successfully", { categories });
      return success(res, "Categories added successfully", _add);
    } catch (err) {
      logger.error("Error adding categories", { err });
      return errResponse(res, "Error adding categories");
    }
  },
  update: async (req: Request, res: Response) => {
    const { name, description } = req.body;
    const { categoryId } = req.params;
    logger.info("Updating category", { categoryId, name, description });
    try {
      const category = await ProductCategory.findByPk(categoryId);
      if (category) {
        await category.update({
          name,
          description,
        });
        logger.info("Category updated successfully", { category });
        return success(res, "Category updated successfully", category);
      } else {
        logger.warn("Category not found", { categoryId });
        return errResponse(res, "Category not found", 404);
      }
    } catch (err) {
      logger.error("Error updating category", { err });
      return errResponse(res, "Error updating category");
    }
  },
  delete: async (req: Request, res: Response) => {
    const { categoryId } = req.params;
    logger.info("Deleting category", { categoryId });
    try {
      const category = await ProductCategory.findByPk(categoryId);
      if (category) {
        await category.destroy();
        logger.info("Category deleted successfully", { category });
        return success(res, "Category deleted successfully", null);
      } else {
        logger.warn("Category not found", { categoryId });
        return errResponse(res, "Category not found", 404);
      }
    } catch (err) {
      logger.error("Error deleting category", { err });
      return errResponse(res, "Error deleting category");
    }
  },
  seed: async (_req: Request, res: Response) => {
    logger.info("Seeding categories");
    try {
      const _seed = await ProductCategory.bulkCreate(categorySeedData);

      logger.info("Categories seeded successfully");
      return success(res, "Categories seeded successfully", _seed);
    } catch (err) {
      logger.error("Error seeding categories", { err });
      return errResponse(res, "Error seeding categories");
    }
  },
};
