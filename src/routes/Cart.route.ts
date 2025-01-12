import CartController from "@/controllers/Cart.controller.ts";
import { Router } from "express";

const router = Router();

router.get("/", CartController.getCartItems);
router.post("/", CartController.addToCart);
router.post("/update/:productId", CartController.updateCartItemQuantity);
router.post("/delete/:productId", CartController.deleteCartItem);

export default router;
