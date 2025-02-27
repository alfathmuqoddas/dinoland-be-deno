import { Request, Response } from "express";
import { MyBuild } from "@/models/index.ts";

export default {
  getMyBuilds: async (req: Request, res: Response) => {
    const { id: userId } = req.user;
    try {
      const builds = await MyBuild.findAll({
        where: {
          userId,
        },
      });

      if (builds.length === 0) {
        return res.status(404).json({ error: "Builds not found" });
      }

      res.status(200).json(builds);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving builds" });
    }
  },
  getMyBuildById: async (req: Request, res: Response) => {
    const { id: userId } = req.user;
    const { id } = req.params;
    try {
      const build = await MyBuild.findOne({
        where: {
          id,
          userId,
        },
      });
      if (!build) {
        res.status(404).json({ message: "Build not found" });
      } else {
        res.status(200).json(build);
      }
    } catch (error) {
      res.status(500).json({ message: "Error retrieving build" });
    }
  },
  createMyBuild: async (req: Request, res: Response) => {
    const { id: userId } = req.user;
    const { name, description } = req.body;
    try {
      if (!name || !description) {
        return res
          .status(400)
          .json({ message: "Name and description are required" });
      }
      const build = await MyBuild.create({
        userId,
        name,
        description,
      });
      res.status(201).json({ message: "Build created successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error creating build " + error });
    }
  },
  updateMyBuild: async (req: Request, res: Response) => {
    const { id: buildId } = req.params;
    const { id: userId } = req.user;
    const { name, description } = req.body;
    try {
      const build = await MyBuild.findOne({
        where: { id: buildId, userId },
      });
      if (build) {
        await build.update({
          name,
          description,
        });
        res.status(200).json({ message: "Build updated successfully" });
      } else {
        res.status(404).json({ message: "Build not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error updating build" });
    }
  },
  deleteMyBuild: async (req: Request, res: Response) => {
    const { id: buildId } = req.params;
    const { id: userId } = req.user;
    try {
      const build = await MyBuild.findOne({ where: { id: buildId, userId } });
      if (build) {
        await build.destroy();
        res.status(200).json({ message: "Build successfully deleted" });
      } else {
        res.status(404).json({ message: "Build not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error deleting build" });
    }
  },
};
