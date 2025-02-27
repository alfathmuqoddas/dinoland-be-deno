import { Request, Response } from "express";
import { Product, ProductCategory } from "@/models/index.ts";
import { Op } from "sequelize";
import { productSeedData } from "@/helper/index.ts";

export default {
  getAll: async (req: Request, res: Response) => {
    const { sortBy, sortOrder, categoryId, q } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 6;
    const offset = (page - 1) * pageSize;

    try {
      const whereClause: any = {};
      if (categoryId || q) {
        whereClause[Op.or] = [
          categoryId ? { categoryId } : {},
          q ? { name: { [Op.like]: `%${q}%` } } : {},
        ];
      }
      const { count, rows: products } = await Product.findAndCountAll({
        where: whereClause,
        order: [[sortBy || "createdAt", sortOrder || "ASC"]],
        limit: pageSize,
        offset,
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

      res.status(200).json({
        products,
        totalRecords: count,
        totalPages: Math.ceil(count / pageSize),
        currentPage: page,
      });
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
  getByProductIds: async (req: Request, res: Response) => {
    const { productIds } = req.body;

    try {
      if (!Array.isArray(productIds) || productIds.length === 0) {
        return res
          .status(400)
          .json({ error: "productIds must be a non-empty array" });
      }
      const products = await Product.findAll({
        where: {
          id: productIds,
        },
      });
      if (products.length === 0) {
        return res.status(404).json({ error: "Products not found" });
      }
      return res.status(200).json(products);
    } catch (err) {
      console.log("Error fetching data:", err);
      res.status(500).json({ error: "Error fetching data" });
    }
  },

  add: async (req: Request, res: Response) => {
    const products = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res
        .status(400)
        .json({ error: "Invalid input: Provide an array of products" });
    }

    // Validate products
    const validationErrors: string[] = [];
    const categoryIds = new Set<number>();

    for (const product of products) {
      if (!product.name)
        validationErrors.push("Each product must have a name.");
      if (!product.description)
        validationErrors.push("Each product must have a description.");
      if (product.price == null)
        validationErrors.push("Each product must have a price.");
      if (!product.categoryId) {
        validationErrors.push("Each product must have a categoryId.");
      } else {
        categoryIds.add(product.categoryId); // Collect unique category IDs for batch lookup
      }
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({ error: validationErrors });
    }

    try {
      // Check if all category IDs exist in one query (efficient)
      const existingCategories = await ProductCategory.findAll({
        where: { id: Array.from(categoryIds) },
        attributes: ["id"],
      });

      const existingCategoryIds = new Set(
        existingCategories.map((cat) => cat.id)
      );
      const invalidCategories = Array.from(categoryIds).filter(
        (id) => !existingCategoryIds.has(id)
      );

      if (invalidCategories.length > 0) {
        return res.status(404).json({
          error: `Categories not found: ${invalidCategories.join(", ")}`,
        });
      }

      // Bulk create products
      const addedProducts = await Product.bulkCreate(products);

      res.status(201).json({
        message: "Products added successfully",
        products: addedProducts,
      });
    } catch (err) {
      console.error("Error adding products:", err);
      res.status(500).json({ error: "Error adding products" });
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
