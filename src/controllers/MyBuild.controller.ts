import { Request, Response } from "express";
import { MyBuild } from "@/models/index.ts";
import logger from "@/config/logger.ts";
import {
  success,
  error as errResponse,
} from "../middleware/responseHandler.ts";

export default {
  getMyBuilds: async (req: Request, res: Response) => {
    const { id: userId } = req.user;
    logger.info("Fetching all builds by userId", { userId });
    try {
      const builds = await MyBuild.findAll({
        where: {
          userId,
        },
      });

      logger.info("Builds fetched successfully", { builds });
      return success(res, "Builds fetched successfully", builds);
    } catch (error) {
      logger.error("Error fetching builds", { error });
      return errResponse(res, "Error fetching builds");
    }
  },
  getMyBuildById: async (req: Request, res: Response) => {
    const { id: userId } = req.user;
    const { id } = req.params;
    logger.info("Fetching build by ID", { id, userId });
    try {
      const build = await MyBuild.findOne({
        where: {
          id,
          userId,
        },
      });
      if (!build) {
        logger.warn("Build with not found", { id, userId });
        return errResponse(res, "Build not found", 404);
      } else {
        logger.info("Build fetched successfully", { build });
        return success(res, "Build fetched successfully", build);
      }
    } catch (error) {
      logger.error("Error fetching build", { error });
      return errResponse(res, `Error fetching build: ${error}`);
    }
  },
  createMyBuild: async (req: Request, res: Response) => {
    const { id: userId } = req.user;
    const { name, description } = req.body;
    logger.info("Creating build", { name, description, userId });
    try {
      if (!name || !description) {
        logger.warn("Name and description are required");
        return errResponse(res, "Name and description are required", 400);
      }
      const _build = await MyBuild.create({
        userId,
        name,
        description,
      });
      logger.info("Build created successfully", { build: _build });
      return success(res, "Build created successfully", _build);
    } catch (error) {
      logger.error("Error creating build", { error });
      return errResponse(res, `Error creating build: ${error}`);
    }
  },
  updateMyBuild: async (req: Request, res: Response) => {
    const { id: buildId } = req.params;
    const { id: userId } = req.user;
    const { name, description } = req.body;
    logger.info("Updating build", { buildId, name, description, userId });
    try {
      const build = await MyBuild.findOne({
        where: { id: buildId, userId },
      });
      if (build) {
        await build.update({
          name,
          description,
        });
        logger.info("Build updated successfully", { build });
        return success(res, "Build updated successfully", build);
      } else {
        logger.warn("Build not found", { buildId, userId });
        return errResponse(res, "Build not found", 404);
      }
    } catch (error) {
      logger.error("Error updating build", { error });
      return errResponse(res, `Error updating build: ${error}`);
    }
  },
  deleteMyBuild: async (req: Request, res: Response) => {
    const { id: buildId } = req.params;
    const { id: userId } = req.user;
    logger.info("Deleting build", { buildId, userId });
    try {
      const build = await MyBuild.findOne({ where: { id: buildId, userId } });
      if (build) {
        await build.destroy();
        logger.info("Build deleted successfully", { build });
        return success(res, "Build successfully deleted", null);
      } else {
        logger.warn("Build not found", { buildId, userId });
        return errResponse(res, "Build not found", 404);
      }
    } catch (error) {
      logger.error("Error deleting build", { error });
      return errResponse(res, `Error deleting build: ${error}`);
    }
  },
};
