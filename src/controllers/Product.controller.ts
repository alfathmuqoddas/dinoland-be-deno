import { Request, Response } from "express";
import { Product, ProductCategory } from "@/models/index.ts";
import { Op } from "sequelize";
import { productSeedData } from "@/helper/index.ts";

export default {
  getAll: async (req: Request, res: Response) => {
    const { sortBy, sortOrder, categoryId, q } = req.query;

    try {
      const whereClause: any = {};
      if (categoryId || q) {
        whereClause[Op.or] = [
          categoryId ? { categoryId } : {},
          q ? { name: { [Op.like]: `%${q}%` } } : {},
        ];
      }
      const products = await Product.findAll({
        where: whereClause,
        order: [[sortBy || "createdAt", sortOrder || "ASC"]],
        include: [
          {
            model: ProductCategory,
            as: "category",
            attributes: ["name"],
          },
        ],
      });

      if (!products) {
        return res.status(404).json({ error: "Products not found" });
      }

      res.status(200).json(products);
    } catch (err) {
      console.log("Error fetching data:", err);
      res.status(500).json({ error: "Error fetching data" });
    }
  },
  getById: async (req: Request, res: Response) => {
    const { productId } = req.params;
    try {
      const product = await Product.findByPk(productId);

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.status(200).json(product);
    } catch (err) {
      console.log("Error fetching individual product:", err);
      res.status(500).json({ error: "Error fetching individual product data" });
    }
  },
  add: async (req: Request, res: Response) => {
    const products = req.body;
    try {
      if (!Array.isArray(products) || products.length === 0) {
        return res
          .status(400)
          .json({ error: "Invalid input: Provide an array of products" });
      }

      // Check if all products have a valid categoryId and if the category exists
      for (const product of products) {
        if (!product.categoryId) {
          return res
            .status(400)
            .json({
              error: "Invalid input: Each product must have a categoryId",
            });
        }

        const category = await ProductCategory.findByPk(product.categoryId);
        if (!category) {
          return res
            .status(404)
            .json({
              error: `Category with ID ${product.categoryId} not found`,
            });
        }
      }

      const addedProducts = await Product.bulkCreate(products); // Store the result
      res
        .status(201)
        .json({
          message: "Products added successfully",
          products: addedProducts,
        }); // Include added products
    } catch (err) {
      console.error("Error adding products:", err); // Use console.error for errors
      res.status(500).json({ error: "Error adding products" }); // More descriptive error message
    }
  },
  update: async (req: Request, res: Response) => {
    const { name, description, price, image, categoryId } = req.body;
    const { productId } = req.params;
    try {
      const product = await Product.findByPk(productId);
      if (product) {
        await product.update({
          name,
          description,
          price,
          image,
          categoryId,
        });
        res.status(200).json({ message: "Product updated successfully" });
      } else {
        res.status(404).json({ error: "Product not found" });
      }
    } catch (err) {
      console.log("Error updating product:", err);
      res.status(500).json({ error: "Error updating product" });
    }
  },
  delete: async (req: Request, res: Response) => {
    const { productId } = req.params;
    try {
      const product = await Product.findByPk(productId);
      if (product) {
        await product.destroy();
        res.status(200).json({ message: "Product deleted successfully" });
      } else {
        res.status(404).json({ error: "Product not found" });
      }
    } catch (err) {
      console.log("Error deleting product:", err);
      res.status(500).json({ error: "Error deleting product" });
    }
  },
  seed: async (_req: Request, res: Response) => {
    try {
      const _seed = await Product.bulkCreate(productSeedData);
      res.status(201).json({ message: "Products seeded successfully" });
    } catch (err) {
      console.log("Error seeding products:", err);
      res.status(500).json({ error: "Error seeding products " + err });
    }
  },
};
