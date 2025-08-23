import { Request, Response } from "express";
import { User } from "@/models/index.ts";
import logger from "@/config/logger.ts";
import {
  success,
  error as errResponse,
} from "../middleware/responseHandler.ts";
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
        },
        {
          name: "Juan",
          email: "juan@gmail.com",
          password: await bcrypt.hash("password", 10),
          role: "admin",
        },
        {
          name: "Carlos",
          email: "carlos@gmail.com",
          password: await bcrypt.hash("password", 10),
          role: "customer",
        },
        {
          name: "Dominique",
          email: "dominique@gmail.com",
          password: await bcrypt.hash("password", 10),
          role: "customer",
        },
      ];
      await User.bulkCreate(users);

      logger.info("Users seeded successfully");
      return success(res, "Users seeded successfully", null);
    } catch (error) {
      logger.error("Error seeding data", { error });
      return errResponse(res, "Error seeding data");
    }
  },

  getAllUser: async (_req: Request, res: Response) => {
    logger.info("Fetching all users");
    try {
      const users = await User.findAll();

      if (users.length === 0) {
        logger.warn("Users not found");
        return errResponse(res, "Users not found", 404);
      }

      logger.info("Users fetched successfully");
      return success(res, "Users fetched successfully", users);
    } catch (err) {
      console.log("Error fetching data:", err);
      return errResponse(res, "Error fetching data");
    }
  },

  getUserByUserId: async (req: Request, res: Response) => {
    const { id } = req.params;
    logger.info("Fetching user by ID", { id });
    try {
      const user = await User.findOne({ where: { email: id } });

      if (!user) {
        logger.warn("User not found", { id });
        return errResponse(res, "User not found", 404);
      }

      logger.info("User fetched successfully", { user });
      return success(res, "User fetched successfully", user);
    } catch (err) {
      logger.error("Error fetching individual user", { err });
      return errResponse(res, "Error fetching individual user data");
    }
  },
};
