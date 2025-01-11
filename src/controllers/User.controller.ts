// import { Request, Response } from "express";
import { Context } from "hono";
import User from "../models/User.model.ts";

export default {
  seedUser: async (c: Context) => {
    try {
      const users = [
        {
          name: "Manny",
          email: "manny@gmail.com",
          password: "password",
          isLoggedIn: false,
        },
        {
          name: "Juan",
          email: "juan@gmail.com",
          password: "password",
          isLoggedIn: false,
        },
        {
          name: "Carlos",
          email: "carlos@gmail.com",
          password: "password",
          isLoggedIn: false,
        },
        {
          name: "Dominique",
          email: "dominique@gmail.com",
          password: "password",
          isLoggedIn: false,
        },
      ];
      await User.bulkCreate(users);

      c.status(201);
      return c.json({ message: "Seed data inserted successfully" });
    } catch (error) {
      console.error("Error seeding data:", error);
      c.status(500);
      return c.json({ error: "Failed to seed data" });
    }
  },

  getAllUser: async (c: Context) => {
    try {
      const users = await User.findAll();

      c.status(200);
      return c.json(users); // Changed status to 200 for successful retrieval
    } catch (err) {
      console.log("Error fetching data:", err);
      c.status(500);
      return c.json({ error: "Error fetching data" });
    }
  },

  getUserByUserId: async (c: Context) => {
    const id = c.req.param("id");
    try {
      const user = await User.findOne({ where: { email: id } });

      if (!user) {
        c.status(404);
        return c.json({ error: "User not found" });
      }
      c.status(200);
      return c.json(user); // Changed status to 200 for successful retrieval
    } catch (err) {
      console.log("Error fetching individual user:", err);
      c.status(500);
      return c.json({ error: "Error fetching individual user data" });
    }
  },
};
