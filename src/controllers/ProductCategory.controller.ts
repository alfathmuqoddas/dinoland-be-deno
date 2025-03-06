import { Request, Response } from "express";
import { ProductCategory } from "@/models/index.ts";
import { categorySeedData } from "@/helper/index.ts";
import logger from "@/config/logger.ts";

export default {
  getAll: async (_req: Request, res: Response) => {
    try {
      const categories = await ProductCategory.findAll();
      if (categories.length === 0) {
        logger.error("Categories not found");
        return res.status(404).json({ error: "Categories not found" });
      }

      logger.info("Categories fetched successfully");
      return res.status(200).json(categories);
    } catch (err) {
      logger.error("Error fetching categories", { err });
      return res.status(500).json({ error: "Error fetching categories" });
    }
  },
  getById: async (req: Request, res: Response) => {
    const { categoryId } = req.params;
    logger.info("Fetching category by ID", { categoryId });
    try {
      const category = await ProductCategory.findByPk(categoryId);

      if (!category) {
        logger.warn("Category not found", { categoryId });
        return res.status(404).json({ error: "Category not found" });
      }
      logger.info("Category fetched successfully", { category });
      return res.status(200).json(category);
    } catch (err) {
      logger.error("Error fetching category", { err });
      return res
        .status(500)
        .json({ error: "Error fetching individual category data" });
    }
  },
  add: async (req: Request, res: Response) => {
    const categories = req.body;
    logger.info("Adding categories", { categories });
    try {
      if (!Array.isArray(categories) || categories.length === 0) {
        logger.warn("Invalid input: Provide an array of categories");
        return res
          .status(400)
          .json({ error: "Invalid input: Provide an array of categories" });
      }

      const _add = await ProductCategory.bulkCreate(categories);
      logger.info("Categories added successfully", { categories });
      return res.status(201).json({ message: "Category added successfully" });
    } catch (err) {
      logger.error("Error adding categories", { err });
      return res.status(500).json({ error: "Error adding category" });
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
        return res
          .status(200)
          .json({ message: "Category updated successfully" });
      } else {
        logger.warn("Category not found", { categoryId });
        return res.status(404).json({ error: "Category not found" });
      }
    } catch (err) {
      logger.error("Error updating category", { err });
      return res.status(500).json({ error: "Error updating category" });
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
        return res
          .status(200)
          .json({ message: "Category deleted successfully" });
      } else {
        logger.warn("Category not found", { categoryId });
        return res.status(404).json({ error: "Category not found" });
      }
    } catch (err) {
      logger.error("Error deleting category", { err });
      return res.status(500).json({ error: "Error deleting category" });
    }
  },
  seed: async (_req: Request, res: Response) => {
    logger.info("Seeding categories");
    try {
      const _seed = await ProductCategory.bulkCreate(categorySeedData);

      logger.info("Categories seeded successfully");
      res.status(201).json({ message: "Categories seeded successfully" });
    } catch (err) {
      logger.error("Error seeding categories", { err });
      res.status(500).json({ error: "Error seeding categories " + err });
    }
  },
};
