import { Request, Response } from "express";
import {
  MyBuildItem,
  Product,
  ProductCategory,
  MyBuild,
} from "@/models/index.ts";

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
        return res
          .status(403)
          .json({ error: "User does not have access to this build" });
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
      if (!items) {
        return res.status(404).json({ error: "Build items not found" });
      }
      res.status(200).json(items);
    } catch (err) {
      console.log("Error fetching data:", err);
      res.status(500).json({ error: "Error fetching data " + err });
    }
  },
  add: async (req: Request, res: Response) => {
    const { buildId } = req.params;
    const { productId } = req.body;

    try {
      //ensure user has build with buildId and userId
      const build = await MyBuild.findOne({
        where: {
          id: buildId,
          userId: req.user.id,
        },
      });

      if (!build) {
        return res
          .status(403)
          .json({ error: "User does not have access to this build" });
      }
      // Ensure the product exists
      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      // Prevent adding the same product to the build twice
      const existingBuildItem = await MyBuildItem.findOne({
        where: { buildId, productId },
      });
      if (existingBuildItem) {
        return res.status(400).json({ error: "Build item already exists" });
      }

      // Create the new build item
      await MyBuildItem.create({ buildId, productId });
      return res.status(201).json({ message: "Build item added successfully" });
    } catch (error) {
      console.error("Error adding build item:", error);
      return res.status(500).json({ error: "Error adding build item" });
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
        return res
          .status(403)
          .json({ error: "User does not have access to this build" });
      }
      const item = await MyBuildItem.findOne({
        where: {
          buildId,
          productId,
        },
      });
      if (item) {
        await item.destroy();
        res.status(200).json({ message: "Build item deleted successfully" });
      } else {
        res.status(404).json({ error: "Build item not found" });
      }
    } catch (err) {
      console.log("Error deleting build item:", err);
      res.status(500).json({ error: "Error deleting build item " + err });
    }
  },
};
