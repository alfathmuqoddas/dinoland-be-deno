import MyBuildController from "@/controllers/MyBuild.controller.ts";
import { Router } from "express";

const router = Router();

const {
  getMyBuilds,
  getMyBuildById,
  createMyBuild,
  updateMyBuild,
  deleteMyBuild,
} = MyBuildController;

router.get("/", getMyBuilds); // get all builds
router.get("/:id", getMyBuildById); // get a specific build
router.post("/", createMyBuild); // create a new build
router.put("/:id", updateMyBuild); // update a build
router.delete("/:id", deleteMyBuild); // delete a build

export default router;
