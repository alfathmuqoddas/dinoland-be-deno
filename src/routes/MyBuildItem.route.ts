import { Router } from "express";
import MyBuildItemController from "@/controllers/MyBuildItem.controller.ts";

const router = Router();

const {
  getMyBuildItems,
  add,
  delete: deleteMyBuildItem,
} = MyBuildItemController;

router.get("/:buildId", getMyBuildItems);
router.post("/:buildId", add);
router.post("/delete/:buildId", deleteMyBuildItem);

export default router;
