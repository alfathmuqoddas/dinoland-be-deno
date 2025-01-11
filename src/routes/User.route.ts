import UserController from "@/controllers/User.controller.ts";
// import express from "express";
import { Hono } from "hono";

const router = new Hono();

router.get("/seed", UserController.seedUser);
router.get("/", UserController.getAllUser);
router.get("/:id", UserController.getUserByUserId);

export default router;
