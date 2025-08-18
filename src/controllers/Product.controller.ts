import { Request, Response } from "express";
import { Product, ProductCategory } from "@/models/index.ts";
import { Op } from "sequelize";
import { productSeedData } from "@/helper/index.ts";
import logger from "@/config/logger.ts";
import {
  success,
  error as errResponse,
} from "../middleware/responseHandler.ts";

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
        logger.warn("No products found", {
          categoryId,
          q,
          page,
          pageSize,
          sortBy,
          sortOrder,
        });
        return errResponse(res, "Products not found", 404);
      }

      logger.info("Products fetched successfully", {
        totalRecords: count,
        totalPages: Math.ceil(count / pageSize),
        currentPage: page,
      });
      return success(res, "Products fetched successfully", {
        products,
        totalRecords: count,
        totalPages: Math.ceil(count / pageSize),
        currentPage: page,
      });
    } catch (err) {
      logger.error("Error fetching data", { err });
      return errResponse(res, "Error fetching data");
    }
  },
  getById: async (req: Request, res: Response) => {
    const { productId } = req.params;
    logger.info("Fetching product by ID", { productId });
    try {
      const product = await Product.findByPk(productId);

      if (!product) {
        logger.warn("Product not found", { productId });
        return errResponse(res, "Product not found", 404);
      }

      logger.info("Product fetched successfully", { product });
      return success(res, "Product fetched successfully", product);
    } catch (err) {
      logger.error("Error fetching individual product", { productId, err });
      return errResponse(res, "Error fetching individual product data");
    }
  },
  getByProductIds: async (req: Request, res: Response) => {
    const { productIds } = req.body;

    logger.info("Fetching multiple products by IDs", { productIds });

    try {
      if (!Array.isArray(productIds) || productIds.length === 0) {
        logger.warn("Invalid input: productIds must be a non-empty array");
        return errResponse(res, "productIds must be a non-empty array", 400);
      }
      const products = await Product.findAll({
        where: {
          id: productIds,
        },
      });
      if (products.length === 0) {
        logger.warn("Products not found", { productIds });
        return errResponse(res, "Products not found", 404);
      }
      logger.info("Products fetched successfully", { products });
      return success(res, "Products fetched successfully", products);
    } catch (err) {
      console.log("Error fetching data:", { err });
      return errResponse(res, "Error fetching data");
    }
  },

  add: async (req: Request, res: Response) => {
    const products = req.body;

    logger.info("Adding products", { products });

    if (!Array.isArray(products) || products.length === 0) {
      logger.warn("Invalid input: Provide an array of products");
      return errResponse(
        res,
        "Invalid input: Provide an array of products",
        400
      );
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
      return errResponse(res, validationErrors.toString(), 400);
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
        return errResponse(
          res,
          `Categories not found: ${invalidCategories.join(", ")}`,
          404
        );
      }

      // Bulk create products
      const addedProducts = await Product.bulkCreate(products);

      logger.info("Products added successfully", {
        total: addedProducts.length,
        productIds: addedProducts.map((p) => p.id),
      });

      return success(res, "Products added successfully", { addedProducts });
    } catch (err) {
      logger.error("Error adding products", { err });
      return errResponse(res, "Error adding products");
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
        return success(res, "Product updated successfully", product);
      } else {
        logger.warn("Product not found", { productId });
        return errResponse(res, "Product not found", 404);
      }
    } catch (err) {
      logger.error("Error updating product", { err });
      return errResponse(res, "Error updating product");
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
        return success(res, "Product deleted successfully", null);
      } else {
        logger.warn("Product not found", { productId });
        return errResponse(res, "Product not found", 404);
      }
    } catch (err) {
      logger.error("Error deleting product", { err });
      return errResponse(res, "Error deleting product");
    }
  },
  seed: async (_req: Request, res: Response) => {
    try {
      const _seed = await Product.bulkCreate(productSeedData);
      logger.info("Products seeded successfully");
      return success(res, "Products seeded successfully", _seed);
    } catch (err) {
      logger.error("Error seeding products", { err });
      return errResponse(res, "Error seeding products");
    }
  },
};
