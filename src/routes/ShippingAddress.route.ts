import ShippingAddressController from "../controllers/ShippingAddress.controller.ts";
import { Router } from "express";

const router = Router();

router.get("/", ShippingAddressController.getShippingAddress);
router.get("/:id", ShippingAddressController.getShippingAddressById);
router.post("/", ShippingAddressController.addShippingAddress);
router.post("/update/:id", ShippingAddressController.updateShippingAddress);
router.post("/delete/:id", ShippingAddressController.deleteShippingAddress);

export default router;
