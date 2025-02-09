import { Request, Response } from "express";
import { Order, OrderItem, Product, Cart } from "@/models/index.ts";
import sequelize from "../../db.js";

export default {
  getOrder: async (req: Request, res: Response) => {
    const { id: userId } = req.user;

    try {
      const orders = await Order.findAll({
        where: { userId },
        include: [
          {
            model: OrderItem,
            include: [Product],
          },
        ],
      });
      if (!orders) {
        return res.status(404).json({ error: "Orders not found" });
      }
      res.status(200).json(orders);
    } catch (err) {
      console.log("Error fetching orders:", err);
      res.status(500).json({ error: "Error fetching orders" });
    }
  },

  getOrderById: async (req: Request, res: Response) => {
    const { id: userId } = req.user;
    const { id } = req.params;
    try {
      const order = await Order.findOne({
        where: { userId, id },
        include: [
          {
            model: OrderItem,
            include: [Product],
          },
        ],
      });
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.status(200).json(order);
    } catch (err) {
      console.log("Error fetching order:", err);
      res.status(500).json({ error: "Error fetching order" });
    }
  },
  addOrder: async (req: Request, res: Response) => {
    const transaction = await sequelize.transaction();
    try {
      const { id: userId } = req.user;
      const { shippingAddressId, paymentMethod } = req.body;

      //fetch cart items
      const cartItems = await Cart.findAll({
        where: { userId },
        include: [Product],
      });
      if (cartItems.length === 0) {
        return res.status(400).json({ error: "Cart is empty" });
      }

      //calculate total price
      const totalPrice = cartItems.reduce((acc, item) => {
        return acc + item.items.price * item.quantity;
      }, 0);

      //create order
      const order = await Order.create(
        { userId, status: "pending", totalPrice },
        { transaction }
      );

      //create order items
      for (const cartItem of cartItems) {
        await OrderItem.create(
          {
            orderId: order.id,
            productId: cartItem.productId,
            quantity: cartItem.quantity,
            price: cartItem.items.price,
          },
          { transaction }
        );
      }

      await Cart.destroy({ where: { userId }, transaction });

      await transaction.commit();
      res.status(201).json({ message: "Order added successfully", order });
    } catch (err) {
      console.log("Error adding order:", err);
      await transaction.rollback();
      res.status(500).json({ error: "Error adding order " + err });
    }
  },
};
