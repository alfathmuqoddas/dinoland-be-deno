import { Request, Response } from "express";
import { MyBuild } from "@/models/index.ts";
import logger from "@/config/logger.ts";

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

      if (builds.length === 0) {
        logger.warn("Builds not found", { userId });
        return res.status(404).json({ error: "Builds not found" });
      }

      logger.info("Builds fetched successfully", { builds });
      return res.status(200).json(builds);
    } catch (error) {
      logger.error("Error fetching builds", { error });
      return res
        .status(500)
        .json({ message: "Error retrieving builds", error });
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
        return res.status(404).json({ message: "Build not found" });
      } else {
        logger.info("Build fetched successfully", { build });
        return res.status(200).json(build);
      }
    } catch (error) {
      logger.error("Error fetching build", { error });
      return res.status(500).json({ message: "Error retrieving build", error });
    }
  },
  createMyBuild: async (req: Request, res: Response) => {
    const { id: userId } = req.user;
    const { name, description } = req.body;
    logger.info("Creating build", { name, description, userId });
    try {
      if (!name || !description) {
        logger.warn("Name and description are required");
        return res
          .status(400)
          .json({ message: "Name and description are required" });
      }
      const _build = await MyBuild.create({
        userId,
        name,
        description,
      });
      logger.info("Build created successfully", { build: _build });
      return res.status(201).json({ message: "Build created successfully" });
    } catch (error) {
      logger.error("Error creating build", { error });
      return res.status(500).json({ message: "Error creating build", error });
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
        return res.status(200).json({ message: "Build updated successfully" });
      } else {
        logger.warn("Build not found", { buildId, userId });
        return res.status(404).json({ message: "Build not found" });
      }
    } catch (error) {
      logger.error("Error updating build", { error });
      return res.status(500).json({ message: "Error updating build ", error });
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
        return res.status(200).json({ message: "Build successfully deleted" });
      } else {
        logger.warn("Build not found", { buildId, userId });
        return res.status(404).json({ message: "Build not found" });
      }
    } catch (error) {
      logger.error("Error deleting build", { error });
      return res.status(500).json({ message: "Error deleting build", error });
    }
  },
};
