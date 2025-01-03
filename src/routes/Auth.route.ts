import AuthController from "@/controllers/Auth.controller.ts";
import express from "express";

const router = express.Router();

router.post("/login", AuthController.login);
router.post("/register", AuthController.register);
router.post("/logout", AuthController.logout);
router.get("/session", AuthController.getSession);

export default router;
