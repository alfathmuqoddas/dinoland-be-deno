import OrderController from "@/controllers/Order.controller.ts";
import { Router } from "express";

const router = Router();

router.get("/", OrderController.getOrder);
router.get("/:id", OrderController.getOrderById);
router.post("/", OrderController.addOrder);

export default router;
