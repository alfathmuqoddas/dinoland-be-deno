import { Request, Response } from "express";
import { User, RefreshToken } from "@/models/index.ts";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "@/helper/helper.ts";
import { verify } from "jsonwebtoken";

export default {
  register: async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    try {
      const existingUser = await User.findOne({ where: { email: email } });

      if (existingUser) {
        return res
          .status(409)
          .json({ error: "email already used for register" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        // isLoggedIn: false,
      });

      res.status(201).json({ user });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ error: "Error registering user" });
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({
        where: { email },
      });

      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      if (!(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: "Incorrect password" });
      }

      // if (user.isLoggedIn) {
      //   return res.status(401).json({ error: "User is already logged in" });
      // }

      // Update isLoggedIn to true
      // await User.update({ isLoggedIn: true }, { where: { id: user.id } });

      const accessToken = generateAccessToken(user.id);
      const refreshToken = await generateRefreshToken(user.id);

      res.status(200).json({
        accessToken,
        refreshToken,
      });
    } catch (err) {
      console.error("Error logging in:", err);
      res.status(500).json({ error: "Error logging in" });
    }
  },

  refresh: async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(401).json({ error: "Refresh token not found" });

    try {
      const decoded = verify(refreshToken, Deno.env.get("REFRESH_SECRET"));
      const storedToken = await RefreshToken.findOne({
        where: { token: refreshToken },
      });

      if (!storedToken || storedToken.userId !== decoded.userId) {
        return res
          .status(403)
          .json({ error: "Refresh token is invalid or has been expired" });
      }

      const accessToken = generateAccessToken(decoded.userId);
      res.status(200).json({ accessToken });
    } catch (err) {
      console.error("Error refreshing token:", err);
      res.status(403).json({
        error: "Refresh token is invalid or has been expired",
      });
    }
  },

  logout: async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(401).json({ error: "Refresh token not found" });

    try {
      await RefreshToken.destroy({ where: { token: refreshToken } });
      res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
      console.error("Error logging out:", err);
      res.status(500).json({ error: "Error logging out" });
    }
  },
};
