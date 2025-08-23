import UserController from "@/controllers/User.controller.ts";
import express from "express";

const router = express.Router();

const { seedUser, getAllUser, getUserByUserId } = UserController;

router.post("/seed", seedUser);
router.get("/", getAllUser);
router.get("/:id", getUserByUserId);

export default router;
