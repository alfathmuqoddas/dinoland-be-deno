import UserController from "@/controllers/User.controller.ts";
import express from "express";

const router = express.Router();

router.get("/seed", UserController.seedUser);
router.get("/", UserController.getAllUser);
router.get("/:id", UserController.getUserByUserId);

export default router;
