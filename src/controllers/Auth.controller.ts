import { Request, Response } from "express";
import { User, RefreshToken } from "@/models/index.ts";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "@/helper/index.ts";
import { verify } from "jsonwebtoken";
import logger from "@/config/logger.ts";

export default {
  register: async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body;

    logger.info("Registering user", { name, email });

    try {
      const existingUser = await User.findOne({ where: { email: email } });

      if (existingUser) {
        logger.warn("Registration failed: Email already in use", { email });
        return res
          .status(409)
          .json({ error: "email already used for register" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: role || "customer",
      });

      logger.info("User registered successfully", {
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      res.status(201).json({ user });
    } catch (error) {
      logger.error("Error registering user", { error });
      res.status(500).json({ error: "Error registering user" });
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      logger.info("Logging in", { email });

      const user = await User.findOne({
        where: { email },
      });

      if (!email || !password) {
        logger.warn("Login attempt failed: Email or password not provided");
        return res
          .status(400)
          .json({ error: "Email or password not provided" });
      }

      if (!user) {
        logger.warn("Login failed: User not found", { email });
        return res.status(401).json({ error: "User not found" });
      }

      if (!(await bcrypt.compare(password, user.password))) {
        logger.warn("Login failed: Incorrect password", { email });
        return res.status(401).json({ error: "Incorrect password" });
      }

      // if (user.isLoggedIn) {
      //   return res.status(401).json({ error: "User is already logged in" });
      // }

      // Update isLoggedIn to true
      // await User.update({ isLoggedIn: true }, { where: { id: user.id } });

      const accessToken = await generateAccessToken(user.id, user.role);
      const refreshToken = await generateRefreshToken(user.id, user.role);

      logger.info("User logged in successfully", {
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      res.status(200).json({
        accessToken,
        refreshToken,
      });
    } catch (err) {
      logger.error("Error logging in", { err });
      res.status(500).json({ error: "Error logging in" });
    }
  },

  refresh: async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    logger.info("Refreshing token", { refreshToken });
    if (!refreshToken) {
      logger.warn("Refresh token not found");
      return res.status(401).json({ error: "Refresh token not found" });
    }

    try {
      const decoded = verify(refreshToken, Deno.env.get("REFRESH_SECRET"));
      const storedToken = await RefreshToken.findOne({
        where: { token: refreshToken },
      });

      if (!storedToken || storedToken.userId !== decoded.userId) {
        logger.warn("Refresh token is invalid or has been expired", {
          refreshToken,
          userId: decoded.userId,
        });
        return res
          .status(403)
          .json({ error: "Refresh token is invalid or has been expired" });
      }

      const accessToken = generateAccessToken(decoded.userId, decoded.userRole);
      logger.info("Token refreshed successfully", { accessToken });
      res.status(200).json({ newAccessToken: accessToken });
    } catch (err) {
      logger.error("Error refreshing token", { err });
      res.status(403).json({
        error: "Refresh token is invalid or has been expired",
      });
    }
  },

  logout: async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    logger.info("Logging out", { refreshToken });
    if (!refreshToken) {
      logger.warn("Refresh token not found");
      return res.status(401).json({ error: "Refresh token not found" });
    }

    try {
      await RefreshToken.destroy({ where: { token: refreshToken } });
      logger.info("User logged out successfully");
      res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
      logger.error("Error logging out", { err });
      res.status(500).json({ error: "Error logging out" });
    }
  },
  isAdmin: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        logger.warn("Unauthorized access attempt: No user found in request.");
        return res.status(401).json({ error: "Unauthorized: User not found" });
      }

      const isAdmin = req.user.role === "admin";

      if (isAdmin) {
        logger.info("User has admin privileges", {
          userId: req.user.id,
          role: req.user.role,
        });
      } else {
        logger.warn("User does not have admin privileges", {
          userId: req.user.id,
          role: req.user.role,
        });
      }

      res.status(200).json({ isAdmin });
    } catch (err) {
      logger.error("Error checking admin status", { err });
      res.status(500).json({ error: "Error checking admin status" });
    }
  },
};
