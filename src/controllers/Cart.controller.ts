import { Request, Response } from "express";
import { Cart, Product } from "@/models/index.ts";

export default {
  getCartItems: async (req: Request, res: Response) => {
    // const { cartId } = req.params;
    try {
      const cartItem = await Cart.findAll({
        where: { userId: req.user.id },
        include: {
          model: Product,
          as: "items",
        },
      });

      if (!cartItem) {
        return res.status(404).json({ error: "Cart not found" });
      }

      res.status(200).json(cartItem);
    } catch (err) {
      console.log("Error fetching cart:", err);
      res.status(500).json({ error: "Error fetching cart" });
    }
  },
  addToCart: async (req: Request, res: Response) => {
    const { productId, quantity } = req.body;
    // const { cartId } = req.params;
    try {
      const _cartItem = await Cart.create({
        userId: req.user.id,
        productId,
        quantity,
      });
      res.status(201).json({ message: "Added to cart successfully" });
    } catch (err) {
      console.log("Error adding to cart:", err);
      res.status(500).json({ error: "Error adding to cart" });
    }
  },
  updateCartItemQuantity: async (req: Request, res: Response) => {
    const { quantity } = req.body;
    const { productId } = req.params;
    try {
      const cartItem = await Cart.findByPk(productId);
      if (cartItem) {
        await cartItem.update({ quantity });
        res.status(200).json({ message: "Cart quantity updated successfully" });
      } else {
        res.status(404).json({ error: "Cart item not found" });
      }
    } catch (err) {
      console.log("Error updating cart quantity:", err);
      res.status(500).json({ error: "Error updating cart quantity" });
    }
  },
  deleteCartItem: async (req: Request, res: Response) => {
    const { productId } = req.params;
    try {
      const cartItem = await Cart.findByPk(productId);
      if (cartItem) {
        await cartItem.destroy();
        res.status(200).json({ message: "Cart item deleted successfully" });
      } else {
        res.status(404).json({ error: "Cart item not found" });
      }
    } catch (err) {
      console.log("Error deleting cart item:", err);
      res.status(500).json({ error: "Error deleting cart item" });
    }
  },
};
