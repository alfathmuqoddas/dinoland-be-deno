import CartController from "@/controllers/Cart.controller.ts";
import { Router } from "express";

const router = Router();

const { getCartItems, addToCart, updateCartItem } = CartController;

router.get("/", getCartItems);
router.post("/", addToCart);
router.post("/update/:productId", updateCartItem);

export default router;
