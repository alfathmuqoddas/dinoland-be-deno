import ShippingAddressController from "../controllers/ShippingAddress.controller.ts";
import { Router } from "express";

const router = Router();

const {
  getShippingAddress,
  getShippingAddressById,
  addShippingAddress,
  updateShippingAddress,
  deleteShippingAddress,
} = ShippingAddressController;

router.get("/", getShippingAddress);
router.get("/:id", getShippingAddressById);
router.post("/", addShippingAddress);
router.put("/update/:id", updateShippingAddress);
router.delete("/delete/:id", deleteShippingAddress);

export default router;
