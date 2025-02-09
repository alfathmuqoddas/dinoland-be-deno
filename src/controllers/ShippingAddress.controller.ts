import { Request, Response } from "express";
import { ShippingAddress } from "@/models/index.ts";

export default {
  getShippingAddress: async (req: Request, res: Response) => {
    const { id: userId } = req.user;
    try {
      const shippingAddress = await ShippingAddress.findAll({
        where: { userId },
      });

      if (!shippingAddress) {
        return res.status(404).json({ error: "Shipping address not found" });
      }
      res.status(200).json(shippingAddress);
    } catch (err) {
      console.log("Error fetching shipping address:", err);
      res.status(500).json({ error: "Error fetching shipping address" });
    }
  },
  getShippingAddressById: async (req: Request, res: Response) => {
    const { id: userId } = req.user;
    const { id } = req.params;
    try {
      const shippingAddress = await ShippingAddress.findOne({
        where: { userId, id },
      });

      if (!shippingAddress) {
        return res.status(404).json({ error: "Shipping address not found" });
      }
      res.status(200).json(shippingAddress);
    } catch (err) {
      console.log("Error fetching shipping address:", err);
      res.status(500).json({ error: "Error fetching shipping address" });
    }
  },
  addShippingAddress: async (req: Request, res: Response) => {
    const {
      addressName,
      addressLine1,
      addressLine2,
      city,
      state,
      zipCode,
      country,
    } = req.body;
    const { id: userId } = req.user;
    try {
      const existingShippingAddress = await ShippingAddress.findOne({
        where: { userId },
      });

      if (existingShippingAddress) {
        return res
          .status(409)
          .json({ error: "Shipping address already exists" });
      }

      const _newShippingAddress = await ShippingAddress.create({
        userId,
        addressName,
        addressLine1,
        addressLine2,
        city,
        state,
        zipCode,
        country,
      });

      res.status(201).json({ message: "Shipping address added successfully" });
    } catch (err) {
      console.log("Error adding shipping address:", err);
      res.status(500).json({ error: "Error adding shipping address " + err });
    }
  },
  updateShippingAddress: async (req: Request, res: Response) => {
    const {
      addressName,
      addressLine1,
      addressLine2,
      city,
      state,
      zipCode,
      country,
    } = req.body;
    const { id: userId } = req.user;
    const { id } = req.params;
    try {
      const shippingAddress = await ShippingAddress.findOne({
        where: { userId, id },
      });

      if (!shippingAddress) {
        return res.status(404).json({ error: "Shipping address not found" });
      }

      await shippingAddress.update({
        addressName,
        addressLine1,
        addressLine2,
        city,
        state,
        zipCode,
        country,
      });

      res
        .status(200)
        .json({ message: "Shipping address updated successfully" });
    } catch (err) {
      console.log("Error updating shipping address:", err);
      res.status(500).json({ error: "Error updating shipping address" });
    }
  },
  deleteShippingAddress: async (req: Request, res: Response) => {
    const { id: userId } = req.user;
    const { id } = req.params;
    try {
      const shippingAddress = await ShippingAddress.findOne({
        where: { userId, id },
      });

      if (!shippingAddress) {
        return res.status(404).json({ error: "Shipping address not found" });
      }

      await shippingAddress.destroy();

      res
        .status(200)
        .json({ message: "Shipping address deleted successfully" });
    } catch (err) {
      console.log("Error deleting shipping address:", err);
      res.status(500).json({ error: "Error deleting shipping address" });
    }
  },
};
