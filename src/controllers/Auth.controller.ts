// import { Request, Response } from "express";
import { Context } from "hono";
import User from "@/models/User.model.ts";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "@/helper/helper.ts";
import { verify } from "jsonwebtoken";
import RefreshToken from "@/models/RefreshToken.model.ts";

export default {
  register: async (c: Context) => {
    const { name, email, password } = await c.req.json();

    try {
      const existingUser = await User.findOne({ where: { email: email } });

      if (existingUser) {
        c.status(409);
        return c.json({ error: "email already used for register" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        // isLoggedIn: false,
      });

      c.status(201);
      c.json({ user });
    } catch (error) {
      console.error("Error registering user:", error);
      c.status(500);
      c.json({ error: "Error registering user" });
    }
  },

  login: async (c: Context) => {
    try {
      const { email, password } = await c.req.json();

      const user = await User.findOne({
        where: { email },
      });

      if (!user) {
        c.status(404);
        return c.json({ error: "User not found" });
      }

      if (!(await bcrypt.compare(password, user.password))) {
        c.status(401);
        return c.json({ error: "Incorrect password" });
      }

      // if (user.isLoggedIn) {
      //   return res.status(401).json({ error: "User is already logged in" });
      // }

      // Update isLoggedIn to true
      // await User.update({ isLoggedIn: true }, { where: { id: user.id } });

      const accessToken = generateAccessToken(user.id);
      const refreshToken = await generateRefreshToken(user.id);

      c.status(200);
      c.json({
        accessToken,
        refreshToken,
      });
    } catch (err) {
      console.error("Error logging in:", err);
      c.status(500);
      c.json({ error: "Error logging in" });
    }
  },

  refresh: async (c: Context) => {
    const { refreshToken } = await c.req.json();
    if (!refreshToken) {
      c.status(401);
      return c.json({ error: "Refresh token not found" });
    }

    try {
      const decoded = verify(refreshToken, Deno.env.get("REFRESH_SECRET"));
      const storedToken = await RefreshToken.findOne({
        where: { token: refreshToken },
      });

      if (!storedToken || storedToken.userId !== decoded.userId) {
        c.status(403);
        return c.json({
          error: "Refresh token is invalid or has been expired",
        });
      }

      const accessToken = generateAccessToken(decoded.userId);
      c.status(200);
      c.json({ accessToken });
    } catch (err) {
      console.error("Error refreshing token:", err);
      c.status(403);
      c.json({
        error: "Refresh token is invalid or has been expired",
      });
    }
  },

  logout: async (c: Context) => {
    const { refreshToken } = await c.req.json();
    if (!refreshToken) {
      c.status(401);
      return c.json({ error: "Refresh token not found" });
    }

    try {
      await RefreshToken.destroy({ where: { token: refreshToken } });
      c.status(200);
      c.json({ message: "Logged out successfully" });
    } catch (err) {
      console.error("Error logging out:", err);
      c.status(500);
      c.json({ error: "Error logging out" });
    }
  },
};
