import { Router } from "express";
import MyBuildItemController from "@/controllers/MyBuildItem.controller.ts";

const router = Router();

router.get("/:buildId", MyBuildItemController.getMyBuildItems);
router.post("/:buildId", MyBuildItemController.add);
router.post("/delete/:buildId", MyBuildItemController.delete);

export default router;
