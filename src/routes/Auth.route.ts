import AuthController from "@/controllers/Auth.controller.ts";
import { Router } from "express";
import ensureIsAdmin from "../middleware/ensureIsAdmin.ts";
import passport from "passport";

const router = Router();

const { login, register, logout, refresh, isAdmin } = AuthController;

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.post("/refresh", refresh);
router.get(
  "/isAdmin",
  passport.authenticate("jwt", { session: false }),
  ensureIsAdmin,
  isAdmin
);

export default router;
