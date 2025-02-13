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
          attributes: ["id", "name", "description", "price", "image"],
        },
      });

      if (!cartItem) {
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

      res.status(200).json({ totalPrice, totalQuantity, cartItem });
    } catch (err) {
      console.log("Error fetching cart:", err);
      res.status(500).json({ error: "Error fetching cart " + err });
    }
  },
  addToCart: async (req: Request, res: Response) => {
    const { productId, quantity } = req.body;
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

      res.status(201).json({
        message: "Product added to cart successfully",
        cartItem: newCartItem,
      });
    } catch (err) {
      console.log("Error adding to cart:", err);
      res.status(500).json({ message: "Error adding to cart " + err });
    }
  },
  updateCartItemQuantity: async (req: Request, res: Response) => {
    const { quantity } = req.body;
    const { productId } = req.params;
    const { id: userId } = req.user;
    try {
      const cartItem = await Cart.findOne({ where: { productId, userId } });
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
  incrementCartItemQuantity: async (req: Request, res: Response) => {
    const { productId } = req.params;
    const { id: userId } = req.user;
    try {
      const cartItem = await Cart.findOne({ where: { productId, userId } });
      if (cartItem) {
        await cartItem.increment("quantity", { by: 1 });
        res.status(200).json({ message: "Cart quantity updated successfully" });
      } else {
        res.status(404).json({ message: "Cart item not found" });
      }
    } catch (err) {
      console.log("Error updating cart quantity:", err);
      res.status(500).json({ message: "Error updating cart quantity" });
    }
  },
  decrementCartItemQuantity: async (req: Request, res: Response) => {
    const { productId } = req.params;
    const { id: userId } = req.user;
    try {
      const cartItem = await Cart.findOne({ where: { productId, userId } });
      // If the cart item doesn't exist, return a 404 error.
      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }

      // Prevent the quantity from going below 1.
      if (cartItem.quantity <= 1) {
        return res
          .status(400)
          .json({ message: "Cart item quantity cannot be less than 1" });
      }

      // Decrement the quantity by 1.
      await cartItem.decrement("quantity", { by: 1 });
      res.status(200).json({ message: "Cart quantity updated successfully" });
    } catch (err) {
      console.log("Error updating cart quantity:", err);
      res.status(500).json({ message: "Error updating cart quantity " + err });
    }
  },
  deleteCartItem: async (req: Request, res: Response) => {
    const { productId } = req.params;
    const { id: userId } = req.user;
    try {
      const cartItem = await Cart.findOne({ where: { productId, userId } });
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
