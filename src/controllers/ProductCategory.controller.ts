import { Request, Response } from "express";
import { ProductCategory } from "@/models/index.ts";
import { categorySeedData } from "@/helper/index.ts";

export default {
  getAll: async (_req: Request, res: Response) => {
    try {
      const categories = await ProductCategory.findAll();
      if (!categories) {
        return res.status(404).json({ error: "Categories not found" });
      }

      res.status(200).json(categories);
    } catch (err) {
      console.log("Error fetching data:", err);
      res.status(500).json({ error: "Error fetching data" });
    }
  },
  getById: async (req: Request, res: Response) => {
    const { categoryId } = req.params;
    try {
      const category = await ProductCategory.findByPk(categoryId);

      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.status(200).json(category);
    } catch (err) {
      console.log("Error fetching individual category:", err);
      res
        .status(500)
        .json({ error: "Error fetching individual category data" });
    }
  },
  add: async (req: Request, res: Response) => {
    const categories = req.body;
    try {
      if (!Array.isArray(categories) || categories.length === 0) {
        return res
          .status(400)
          .json({ error: "Invalid input: Provide an array of categories" });
      }

      const _add = await ProductCategory.bulkCreate(categories);
      res.status(201).json({ message: "Category added successfully" });
    } catch (err) {
      console.log("Error adding category:", err);
      res.status(500).json({ error: "Error adding category" });
    }
  },
  update: async (req: Request, res: Response) => {
    const { name, description } = req.body;
    const { categoryId } = req.params;
    try {
      const category = await ProductCategory.findByPk(categoryId);
      if (category) {
        await category.update({
          name,
          description,
        });
        res.status(200).json({ message: "Category updated successfully" });
      } else {
        res.status(404).json({ error: "Category not found" });
      }
    } catch (err) {
      console.log("Error updating category:", err);
      res.status(500).json({ error: "Error updating category" });
    }
  },
  delete: async (req: Request, res: Response) => {
    const { categoryId } = req.params;
    try {
      const category = await ProductCategory.findByPk(categoryId);
      if (category) {
        await category.destroy();
        res.status(200).json({ message: "Category deleted successfully" });
      } else {
        res.status(404).json({ error: "Category not found" });
      }
    } catch (err) {
      console.log("Error deleting category:", err);
      res.status(500).json({ error: "Error deleting category" });
    }
  },
  seed: async (req: Request, res: Response) => {
    try {
      const _seed = await ProductCategory.bulkCreate(categorySeedData);

      res.status(201).json({ message: "Categories seeded successfully" });
    } catch (err) {
      console.log("Error seeding categories:", err);
      res.status(500).json({ error: "Error seeding categories " + err });
    }
  },
};
