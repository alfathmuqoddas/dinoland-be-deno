import CartController from "@/controllers/Cart.controller.ts";
import { Router } from "express";

const router = Router();

router.get("/getCartItems", CartController.getCartItems);
router.post("/addToCart", CartController.addToCart);
router.post(
  "/updateCartItemQuantity/:productId",
  CartController.updateCartItemQuantity
);
router.post("/deleteCartItem/:productId", CartController.deleteCartItem);

export default router;
