import { Request, Response } from "express";
import { User, RefreshToken } from "@/models/index.ts";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "@/helper/index.ts";
import { decryptRefreshToken } from "../helper/index.ts";
import logger from "@/config/logger.ts";
import {
  success,
  error as errResponse,
} from "../middleware/responseHandler.ts";

export default {
  register: async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body;

    logger.info("Registering user", { name, email });

    try {
      const existingUser = await User.findOne({ where: { email: email } });

      if (existingUser) {
        logger.warn("Registration failed: Email already in use", { email });
        return errResponse(res, "email already used for register", 409);
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

      return success(res, "User registered successfully", { user });
    } catch (error) {
      logger.error("Error registering user", { error });
      return errResponse(res, "Error registering user");
    }
  },

  login: async (req: Request, res: Response) => {
    // 1. Destructure email and password from the request body first
    const { email, password } = req.body;

    // 2. Initial check for missing fields for an immediate 400 response
    if (!email || !password) {
      logger.warn("Login attempt failed: Email or password not provided");
      return errResponse(res, "Email or password not provided", 400); // 400 Bad Request
    }

    logger.info("Login attempt for email", { email });

    try {
      // 3. Find the user
      const user = await User.findOne({
        where: { email },
      });

      const invalidCredentialsMessage = "Invalid credentials";

      if (!user) {
        logger.warn("Login failed: User not found", { email });
        return errResponse(res, invalidCredentialsMessage, 401); // 401 Unauthorized
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        logger.warn("Login failed: Incorrect password", { email });
        return errResponse(res, invalidCredentialsMessage, 401); // 401 Unauthorized
      }

      const accessToken = await generateAccessToken(user.id, user.role);
      const refreshToken = await generateRefreshToken(user.id, user.role);

      logger.info("User logged in successfully", {
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      // 6. Return success response
      return success(res, "User logged in successfully", {
        accessToken,
        refreshToken,
      });
    } catch (err) {
      // 7. Handle database or token generation errors
      logger.error("Error during login process", { err });
      return errResponse(res, "An error occurred during login", 500); // 500 Internal Server Error
    }
  },

  refresh: async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    logger.info("Refreshing token", { refreshToken });
    if (!refreshToken) {
      logger.warn("Refresh token not found");
      return errResponse(res, "Refresh token not found", 401);
    }

    try {
      const { decoded } = decryptRefreshToken(refreshToken);
      const storedToken = await RefreshToken.findOne({
        where: { token: refreshToken },
      });

      if (!storedToken || storedToken.userId !== decoded.userId) {
        logger.warn("Refresh token is invalid or has been expired", {
          refreshToken,
          userId: decoded.userId,
        });
        return errResponse(
          res,
          "Refresh token is invalid or has been expired",
          403
        );
      }

      const accessToken = generateAccessToken(decoded.userId, decoded.userRole);
      logger.info("Token refreshed successfully", { accessToken });
      return success(res, "Token refreshed successfully", {
        newAccessToken: accessToken,
      });
    } catch (err) {
      logger.error("Error refreshing token", { err });
      return errResponse(res, "Error refreshing token", 403);
    }
  },

  logout: async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    logger.info("Logging out", { refreshToken });
    if (!refreshToken) {
      logger.warn("Refresh token not found");
      return errResponse(res, "Refresh token not found", 401);
    }

    try {
      await RefreshToken.destroy({ where: { token: refreshToken } });
      logger.info("User logged out successfully");
      return success(res, "Logged out successfully", null);
    } catch (err) {
      logger.error("Error logging out", { err });
      return errResponse(res, "Error logging out");
    }
  },
  isAdmin: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        logger.warn("Unauthorized access attempt: No user found in request.");
        return errResponse(res, "Unauthorized: User not found", 401);
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

      return success(res, "", { isAdmin });
    } catch (err) {
      logger.error("Error checking admin status", { err });
      return errResponse(res, "Error checking admin status");
    }
  },
};
