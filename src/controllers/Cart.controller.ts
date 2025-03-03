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

      const totalPrice = cartItem.reduce(
        (acc: number, item: any) => acc + item.items.price * item.quantity,
        0
      );

      const totalQuantity = cartItem.reduce(
        (acc: number, item: any) => acc + item.quantity,
        0
      );

      logger.info("Cart fetched successfully", {
        totalPrice,
        totalQuantity,
        cartItem,
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
      // Check if the product is already in the user's cart
      const existingCartItem = await Cart.findOne({
        where: {
          userId: req.user.id,
          productId: productId, // Same product for this user
        },
      });

      if (existingCartItem) {
        // If you want to update the quantity instead of adding a new item
        existingCartItem.quantity += quantity; // Adjust as needed
        await existingCartItem.save();

        logger.info("Product already in cart, quantity updated", {
          productId,
          quantity,
          cartItem: existingCartItem,
        });
        return res.status(200).json({
          message: "Product already in cart, quantity updated",
          cartItem: existingCartItem,
        });
      }

      // If the product is not in the cart, create a new entry
      const newCartItem = await Cart.create({
        userId: req.user.id,
        productId,
        quantity,
      });

      logger.info("Product added to cart successfully", {
        productId,
        quantity,
        cartItem: newCartItem,
      });

      return res.status(201).json({
        message: "Product added to cart successfully",
        cartItem: newCartItem,
      });
    } catch (error) {
      logger.error("Error adding to cart", { error });
      return res.status(500).json({ message: "Error adding to cart", error });
    }
  },
  updateCartItemQuantity: async (req: Request, res: Response) => {
    const { quantity } = req.body;
    const { productId } = req.params;
    const { id: userId } = req.user;
    logger.info("Updating cart quantity", { productId, quantity, userId });
    try {
      const cartItem = await Cart.findOne({ where: { productId, userId } });
      if (cartItem) {
        await cartItem.update({ quantity });
        logger.info("Cart quantity updated successfully", { cartItem });
        return res
          .status(200)
          .json({ message: "Cart quantity updated successfully" });
      } else {
        logger.warn("Cart item not found", { productId, userId });
        return res.status(404).json({ message: "Cart item not found" });
      }
    } catch (error) {
      logger.error("Error updating cart quantity", { error });
      return res
        .status(500)
        .json({ message: "Error updating cart quantity", error });
    }
  },
  incrementCartItemQuantity: async (req: Request, res: Response) => {
    const { productId } = req.params;
    const { id: userId } = req.user;
    logger.info("Incrementing cart quantity", { productId, userId });
    try {
      const cartItem = await Cart.findOne({ where: { productId, userId } });
      if (cartItem) {
        await cartItem.increment("quantity", { by: 1 });
        logger.info("Cart quantity updated successfully", { cartItem });
        return res
          .status(200)
          .json({ message: "Cart quantity updated successfully" });
      } else {
        logger.warn("Cart item not found", { productId, userId });
        return res.status(404).json({ message: "Cart item not found" });
      }
    } catch (error) {
      logger.error("Error updating cart quantity", { error });
      return res
        .status(500)
        .json({ message: "Error updating cart quantity", error });
    }
  },
  decrementCartItemQuantity: async (req: Request, res: Response) => {
    const { productId } = req.params;
    const { id: userId } = req.user;
    logger.info("Decrementing cart quantity", { productId, userId });
    try {
      const cartItem = await Cart.findOne({ where: { productId, userId } });
      // If the cart item doesn't exist, return a 404 error.
      if (!cartItem) {
        logger.warn("Cart item not found", { productId, userId });
        return res.status(404).json({ message: "Cart item not found" });
      }

      // Prevent the quantity from going below 1.
      if (cartItem.quantity < 2) {
        await cartItem.destroy();
        logger.info("Cart item successfully deleted", { cartItem });
        return res
          .status(400)
          .json({ message: "Cart item successfully deleted" });
      }

      // Decrement the quantity by 1.
      await cartItem.decrement("quantity", { by: 1 });
      logger.info("Cart quantity updated successfully", { cartItem });
      return res
        .status(200)
        .json({ message: "Cart quantity updated successfully" });
    } catch (error) {
      logger.error("Error updating cart quantity", { error });
      res.status(500).json({ message: "Error updating cart quantity", error });
    }
  },
  deleteCartItem: async (req: Request, res: Response) => {
    const { productId } = req.params;
    const { id: userId } = req.user;
    logger.info("Deleting cart item", { productId, userId });
    try {
      const cartItem = await Cart.findOne({ where: { productId, userId } });
      if (cartItem) {
        await cartItem.destroy();
        logger.info("Cart item deleted successfully", { cartItem });
        return res
          .status(200)
          .json({ message: "Cart item deleted successfully" });
      } else {
        logger.warn("Cart item not found", { productId, userId });
        return res.status(404).json({ message: "Cart item not found" });
      }
    } catch (error) {
      logger.error("Error deleting cart item", { error });
      return res
        .status(500)
        .json({ message: "Error deleting cart item", error });
    }
  },
};
