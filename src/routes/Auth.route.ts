import AuthController from "@/controllers/Auth.controller.ts";
import { Router } from "express";
import ensureIsAdmin from "../middleware/ensureIsAdmin.ts";
import passport from "passport";

const router = Router();

router.post("/login", AuthController.login);
router.post("/register", AuthController.register);
router.post("/logout", AuthController.logout);
router.post("/refresh", AuthController.refresh);
router.get(
  "/isAdmin",
  passport.authenticate("jwt", { session: false }),
  ensureIsAdmin,
  AuthController.isAdmin
);

export default router;
