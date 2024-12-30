import { Request, Response } from "express";
import User from "../models/User.model.ts";
import bcrypt from "bcryptjs";

export default {
  register: async (req: Request, res: Response) => {
    const { name: userName, email, password } = req.body;

    try {
      const existingUser = await User.findOne({ where: { email: email } });

      if (existingUser) {
        return res
          .status(409)
          .json({ error: "email already used for register" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        name: userName,
        email,
        password: hashedPassword,
      });

      res.status(201).json(user);
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ error: "Error registering user" });
    }
  },

  logout: async (req: Request, res: Response) => {
    try {
      req.session.destroy();
      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      console.error("Error logging out:", error);
      res.status(500).json({ error: "Error logging out" });
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email: email } });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (!isPasswordCorrect) {
        return res.status(401).json({ error: "Incorrect password" });
      }
      req.session.user = {
        userId: user.id,
        name: user.name,
        email: user.email,
      };
      res.status(200).json({ message: "Logged in successfully" });
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ error: "Error logging in" });
    }
  },

  getSession: (req: Request, res: Response) => {
    if (!req.session.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const user = req.session.user;
    if (!user) {
      return res.status(500).json({ error: "Session data is corrupted" });
    }
    res.status(200).json({ user });
  },
};
