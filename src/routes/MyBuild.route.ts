import MyBuildController from "@/controllers/MyBuild.controller.ts";
import { Router } from "express";

const router = Router();

router.get("/", MyBuildController.getMyBuilds); // get all builds
router.get("/:id", MyBuildController.getMyBuildById); // get a specific build
router.post("/", MyBuildController.createMyBuild); // create a new build
router.put("/:id", MyBuildController.updateMyBuild); // update a build
router.delete("/:id", MyBuildController.deleteMyBuild); // delete a build

export default router;
