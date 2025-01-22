import { Request, Response } from "express";
import { Product } from "@/models/index.ts";

export default {
  getAll: async (_req: Request, res: Response) => {
    try {
      const products = await Product.findAll();

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

      const add = await Product.bulkCreate(products);
      res.status(201).json({ message: "Product added successfully" });
    } catch (err) {
      console.log("Error adding product:", err);
      res.status(500).json({ error: "Error adding product" });
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
  sortBy: async (req: Request, res: Response) => {
    const { sortBy, sortOrder } = req.query;
    try {
      const products = await Product.findAll({
        order: [[sortBy, sortOrder || "ASC"]],
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
};
