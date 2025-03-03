import { Request, Response } from "express";
import { Product, ProductCategory } from "@/models/index.ts";
import { Op } from "sequelize";
import { productSeedData } from "@/helper/index.ts";
import logger from "@/config/logger.ts";

export default {
  getAll: async (req: Request, res: Response) => {
    const { sortBy, sortOrder, categoryId, q } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 6;
    const offset = (page - 1) * pageSize;

    logger.info("Fetching products", {
      sortBy,
      sortOrder,
      categoryId,
      q,
      page,
      pageSize,
    });

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
        logger.warn("No products found", { categoryId, q });
        return res.status(404).json({ error: "Products not found" });
      }

      logger.info("Products fetched successfully", {
        totalRecords: count,
        totalPages: Math.ceil(count / pageSize),
        currentPage: page,
      });

      return res.status(200).json({
        products,
        totalRecords: count,
        totalPages: Math.ceil(count / pageSize),
        currentPage: page,
      });
    } catch (err) {
      logger.error("Error fetching data", { err });
      return res.status(500).json({ error: "Error fetching data" });
    }
  },
  getById: async (req: Request, res: Response) => {
    const { productId } = req.params;
    logger.info("Fetching product by ID", { productId });
    try {
      const product = await Product.findByPk(productId);

      if (!product) {
        logger.warn("Product not found", { productId });
        return res.status(404).json({ error: "Product not found" });
      }

      logger.info("Product fetched successfully", { product });
      return res.status(200).json(product);
    } catch (err) {
      logger.error("Error fetching individual product", { err });
      return res
        .status(500)
        .json({ error: "Error fetching individual product data" });
    }
  },
  getByProductIds: async (req: Request, res: Response) => {
    const { productIds } = req.body;

    logger.info("Fetching multiple products by IDs", { productIds });

    try {
      if (!Array.isArray(productIds) || productIds.length === 0) {
        logger.warn("Invalid input: productIds must be a non-empty array");
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
        logger.warn("Products not found", { productIds });
        return res.status(404).json({ error: "Products not found" });
      }
      logger.info("Products fetched successfully", { products });
      return res.status(200).json(products);
    } catch (err) {
      console.log("Error fetching data:", err);
      return res.status(500).json({ error: "Error fetching data" });
    }
  },

  add: async (req: Request, res: Response) => {
    const products = req.body;

    logger.info("Adding products", { products });

    if (!Array.isArray(products) || products.length === 0) {
      logger.warn("Invalid input: Provide an array of products");
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
      logger.warn("Product validation failed", { errors: validationErrors });
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
        logger.warn("Category validation failed", { invalidCategories });
        return res.status(404).json({
          error: `Categories not found: ${invalidCategories.join(", ")}`,
        });
      }

      // Bulk create products
      const addedProducts = await Product.bulkCreate(products);

      logger.info("Products added successfully", {
        total: addedProducts.length,
        productIds: addedProducts.map((p) => p.id),
      });

      return res.status(201).json({
        message: "Products added successfully",
        products: addedProducts,
      });
    } catch (err) {
      logger.error("Error adding products", { err });
      return res.status(500).json({ error: "Error adding products" });
    }
  },

  update: async (req: Request, res: Response) => {
    const { name, description, price, image, categoryId } = req.body;
    const { productId } = req.params;

    logger.info("Updating product", {
      productId,
      name,
      description,
      price,
      image,
      categoryId,
    });

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
        logger.info("Product updated successfully", { product });
        return res
          .status(200)
          .json({ message: "Product updated successfully" });
      } else {
        logger.warn("Product not found", { productId });
        return res.status(404).json({ error: "Product not found" });
      }
    } catch (err) {
      logger.error("Error updating product", { err });
      return res.status(500).json({ error: "Error updating product" });
    }
  },
  delete: async (req: Request, res: Response) => {
    const { productId } = req.params;
    logger.info("Deleting product", { productId });
    try {
      const product = await Product.findByPk(productId);
      if (product) {
        await product.destroy();
        logger.info("Product deleted successfully", { product });
        return res
          .status(200)
          .json({ message: "Product deleted successfully" });
      } else {
        logger.warn("Product not found", { productId });
        return res.status(404).json({ error: "Product not found" });
      }
    } catch (err) {
      logger.error("Error deleting product", { err });
      return res.status(500).json({ error: "Error deleting product" });
    }
  },
  seed: async (_req: Request, res: Response) => {
    try {
      const _seed = await Product.bulkCreate(productSeedData);
      logger.info("Products seeded successfully");
      return res.status(201).json({ message: "Products seeded successfully" });
    } catch (err) {
      logger.error("Error seeding products", { err });
      return res.status(500).json({ error: "Error seeding products " + err });
    }
  },
};
