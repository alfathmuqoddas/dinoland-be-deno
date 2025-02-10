import OrderController from "@/controllers/Order.controller.ts";
import { Router } from "express";
import ensureIsAdmin from "../middleware/ensureIsAdmin.ts";

const router = Router();

router.get("/", OrderController.getOrder);
router.get("/:id", OrderController.getOrderById);
router.post("/", OrderController.addOrder);
router.put("/:id", ensureIsAdmin, OrderController.updateOrder);

export default router;
