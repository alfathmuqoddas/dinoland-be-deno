import { Request, Response } from "express";
import { User } from "@/models/index.ts";
import bcrypt from "bcryptjs";

export default {
  seedUser: async (_req: Request, res: Response) => {
    try {
      const users = [
        {
          name: "Manny",
          email: "manny@gmail.com",
          password: await bcrypt.hash("password", 10),
          role: "admin",
          isLoggedIn: false,
        },
        {
          name: "Juan",
          email: "juan@gmail.com",
          password: await bcrypt.hash("password", 10),
          role: "admin",
          isLoggedIn: false,
        },
        {
          name: "Carlos",
          email: "carlos@gmail.com",
          password: await bcrypt.hash("password", 10),
          role: "customer",
          isLoggedIn: false,
        },
        {
          name: "Dominique",
          email: "dominique@gmail.com",
          password: await bcrypt.hash("password", 10),
          role: "customer",
          isLoggedIn: false,
        },
      ];
      await User.bulkCreate(users);

      res.status(201).json({ message: "Seed data inserted successfully" });
    } catch (error) {
      console.error("Error seeding data:", error);
      res.status(500).json({ error: "Failed to seed data" });
    }
  },

  getAllUser: async (_req: Request, res: Response) => {
    try {
      const users = await User.findAll();

      if (users.length === 0) {
        return res.status(404).json({ error: "Users not found" });
      }

      res.status(200).json(users); // Changed status to 200 for successful retrieval
    } catch (err) {
      console.log("Error fetching data:", err);
      res.status(500).json({ error: "Error fetching data" });
    }
  },

  getUserByUserId: async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const user = await User.findOne({ where: { email: id } });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json(user); // Changed status to 200 for successful retrieval
    } catch (err) {
      console.log("Error fetching individual user:", err);
      res.status(500).json({ error: "Error fetching individual user data" });
    }
  },
};
