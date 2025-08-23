import OrderController from "@/controllers/Order.controller.ts";
import { Router } from "express";
import ensureIsAdmin from "../middleware/ensureIsAdmin.ts";

const router = Router();

const { getOrder, getOrderById, addOrder, updateOrder } = OrderController;

router.get("/", getOrder);
router.get("/:id", getOrderById);
router.post("/", addOrder);
router.put("/:id", ensureIsAdmin, updateOrder);

export default router;
