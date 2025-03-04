import { Request, Response } from "express";
import { Cart, Product } from "@/models/index.ts";
import logger from "@/config/logger.ts";

export default {
  getCartItems: async (req: Request, res: Response) => {
    // const { cartId } = req.params;
    logger.info("Fetching cart items");
    try {
      const cartItem = await Cart.findAll({
        where: { userId: req.user.id },
        include: {
          model: Product,
          as: "items",
          attributes: ["id", "name", "description", "price", "image"],
        },
      });

      if (cartItem.length === 0) {
        logger.warn("Cart not found");
        return res.status(404).json({ error: "Cart not found" });
      }

      const { totalPrice, totalQuantity } = cartItem.reduce(
        (acc, item: any) => {
          return {
            totalPrice: acc.totalPrice + item.items.price * item.quantity,
            totalQuantity: acc.totalQuantity + item.quantity,
          };
        },
        { totalPrice: 0, totalQuantity: 0 }
      );

      logger.info("Cart fetched successfully", {
        totalPrice,
        totalQuantity,
      });
      return res.status(200).json({ totalPrice, totalQuantity, cartItem });
    } catch (error) {
      logger.error("Error fetching cart", { error });
      return res.status(500).json({ message: "Error fetching cart ", error });
    }
  },
  addToCart: async (req: Request, res: Response) => {
    const { productId, quantity } = req.body;
    logger.info("Adding to cart", { productId, quantity });

    try {
      const [cartItem, created] = await Cart.findOrCreate({
        where: { userId: req.user.id, productId },
        defaults: { userId: req.user.id, productId, quantity },
      });

      if (!created) {
        cartItem.quantity += quantity;
        await cartItem.save();
        logger.info("Product already in cart, quantity updated", {
          productId,
          quantity,
          cartItem,
        });
        return res.status(200).json({
          message: "Product already in cart, quantity updated",
          cartItem,
        });
      }

      logger.info("Product added to cart successfully", {
        productId,
        quantity,
        cartItem,
      });
      return res
        .status(201)
        .json({ message: "Product added to cart successfully", cartItem });
    } catch (error) {
      logger.error("Error adding to cart", { error });
      return res.status(500).json({ message: "Error adding to cart", error });
    }
  },
  updateCartItem: async (req: Request, res: Response) => {
    const { productId } = req.params;
    const { quantity, action } = req.body; // `action` can be 'set', 'increment', 'decrement', or 'delete'
    const { id: userId } = req.user;

    logger.info(`Updating cart item`, { productId, action, quantity, userId });

    try {
      const cartItem = await Cart.findOne({ where: { productId, userId } });

      if (!cartItem && action !== "set") {
        logger.warn("Cart item not found", { productId, userId });
        return res.status(404).json({ message: "Cart item not found" });
      }

      switch (action) {
        case "set":
          if (cartItem) {
            await cartItem.update({ quantity });
          } else {
            await Cart.create({ userId, productId, quantity });
          }
          logger.info("Cart item quantity set successfully", {
            productId,
            quantity,
          });
          return res
            .status(200)
            .json({ message: "Cart quantity set successfully" });

        case "increment":
          await cartItem?.increment("quantity", { by: 1 });
          logger.info("Cart item quantity incremented", { productId });
          break;

        case "decrement":
          if (cartItem && cartItem.quantity <= 1) {
            await cartItem.destroy();
            logger.info("Cart item deleted due to quantity reaching zero", {
              productId,
            });
            return res
              .status(200)
              .json({ message: "Cart item deleted successfully" });
          }
          await cartItem?.decrement("quantity", { by: 1 });
          logger.info("Cart item quantity decremented", { productId });
          break;

        case "delete":
          await cartItem?.destroy();
          logger.info("Cart item deleted", { productId });
          return res
            .status(200)
            .json({ message: "Cart item deleted successfully" });

        default:
          logger.warn("Invalid action", { action });
          return res.status(400).json({ message: "Invalid action" });
      }

      return res
        .status(200)
        .json({ message: "Cart item updated successfully" });
    } catch (error) {
      logger.error("Error updating cart item", { error });
      return res
        .status(500)
        .json({ message: "Error updating cart item", error });
    }
  },
};
