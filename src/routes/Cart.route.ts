import CartController from "@/controllers/Cart.controller.ts";
import { Router } from "express";

const router = Router();

router.get("/", CartController.getCartItems);
router.post("/", CartController.addToCart);
router.post("/update/:productId", CartController.updateCartItemQuantity);
router.post("/increment/:productId", CartController.incrementCartItemQuantity);
router.post("/decrement/:productId", CartController.decrementCartItemQuantity);
router.delete("/delete/:productId", CartController.deleteCartItem);

export default router;
