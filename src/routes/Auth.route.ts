import AuthController from "@/controllers/Auth.controller.ts";
import { Hono } from "hono";

const router = new Hono();

router.post("/login", AuthController.login);
router.post("/register", AuthController.register);
router.post("/logout", AuthController.logout);
router.post("/refresh", AuthController.refresh);

export default router;
