import { Request, Response } from "express";
import { MyBuildItem, Product, ProductCategory } from "@/models/index.ts";

export default {
  getMyBuildItems: async (req: Request, res: Response) => {
    const { buildId } = req.params;
    try {
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
      //make sure the productId exist in product
      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      const _item = await MyBuildItem.create({
        buildId,
        productId,
      });
      res.status(201).json({ message: "Build item added successfully" });
    } catch (err) {
      console.log("Error adding build item:", err);
      res.status(500).json({ error: "Error adding build item " + err });
    }
  },
  delete: async (req: Request, res: Response) => {
    const { buildId } = req.params;
    const { productId } = req.body;
    try {
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
