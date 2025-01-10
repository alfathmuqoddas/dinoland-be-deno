import AuthController from "@/controllers/Auth.controller.ts";
import { Router } from "express";

const router = Router();

router.post("/login", AuthController.login);
router.post("/register", AuthController.register);
router.post("/logout", AuthController.logout);
router.post("/refresh", AuthController.refresh);

export default router;
