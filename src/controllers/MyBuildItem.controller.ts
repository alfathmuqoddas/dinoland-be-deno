import { Request, Response } from "express";
import {
  MyBuildItem,
  Product,
  ProductCategory,
  MyBuild,
} from "@/models/index.ts";
import logger from "@/config/logger.ts";
import {
  success,
  error as errResponse,
} from "../middleware/responseHandler.ts";

export default {
  getMyBuildItems: async (req: Request, res: Response) => {
    const { buildId } = req.params;
    try {
      const build = await MyBuild.findOne({
        where: {
          id: buildId,
          userId: req.user.id,
        },
      });
      if (!build) {
        logger.warn("User does not have access to this build", {
          buildId,
          userId: req.user.id,
        });
        return errResponse(res, "User does not have access to this build", 403);
      }

      const items = await MyBuildItem.findAll({
        where: {
          buildId,
        },
        include: [
          {
            model: Product,
            as: "product",
            attributes: [
              "id",
              "name",
              "description",
              "price",
              "image",
              "categoryId",
            ],
            include: [
              {
                model: ProductCategory,
                as: "category",
                attributes: ["name"],
              },
            ],
          },
        ],
      });
      logger.info("Fetched build items", { buildId });
      return success(res, "Fetched build items", items);
    } catch (err) {
      logger.error("Error fetching build items", { err });
      return errResponse(res, `Error fetching build items: ${err}`, 500);
    }
  },
  add: async (req: Request, res: Response) => {
    const { buildId } = req.params;
    const { productId } = req.body;

    try {
      // Validate that the build belongs to the authenticated user
      const build = await MyBuild.findOne({
        where: {
          id: buildId,
          userId: req.user.id,
        },
      });
      if (!build) {
        logger.warn("User does not have access to this build", {
          buildId,
          userId: req.user.id,
        });
        return errResponse(res, "User does not have access to this build", 403);
      }

      // Validate that the product exists
      const product = await Product.findByPk(productId);
      if (!product) {
        logger.warn("Product not found", { buildId, productId });
        return errResponse(
          res,
          `Product with buildId ${buildId} and productId ${productId} not found`,
          404
        );
      }

      // Check if there is an existing build item in the same build that has a product
      // with the same categoryId as the new product.
      const existingBuildItem = await MyBuildItem.findOne({
        where: { buildId },
        include: [
          {
            model: Product,
            as: "product",
            where: { categoryId: product.categoryId },
          },
        ],
      });

      if (existingBuildItem) {
        // Replace the existing product with the new one
        await existingBuildItem.update({ productId });
        logger.info("Updated build item with new product", {
          buildId,
          productId,
        });
        return success(
          res,
          "Build item updated successfully",
          existingBuildItem
        );
      }

      // Otherwise, create a new build item if no product in the same category exists.
      await MyBuildItem.create({ buildId, productId });
      logger.info("Created new build item", { buildId, productId });
      return success(res, "Build item created successfully", null);
    } catch (err) {
      logger.error("Error adding build item", { err });
      return errResponse(res, `Error adding build item: ${err}`, 500);
    }
  },
  delete: async (req: Request, res: Response) => {
    const { buildId } = req.params;
    const { productId } = req.body;
    try {
      const build = await MyBuild.findOne({
        where: {
          id: buildId,
          userId: req.user.id,
        },
      });
      if (!build) {
        logger.warn("User does not have access to this build", {
          buildId,
          productId,
          userId: req.user.id,
        });
        return errResponse(res, "User does not have access to this build", 403);
      }
      const item = await MyBuildItem.findOne({
        where: {
          buildId,
          productId,
        },
      });
      if (item) {
        await item.destroy();
        logger.info("Deleted build item", { buildId, productId });
        return success(res, "Build item deleted successfully", null);
      } else {
        logger.warn("Build item not found", { buildId, productId });
        return errResponse(res, "Build item not found", 404);
      }
    } catch (err) {
      logger.error("Error deleting build item", { err, buildId, productId });
      return errResponse(res, `Error deleting build item: ${err}`, 500);
    }
  },
};
