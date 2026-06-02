import { Router } from "express";
import {
  publishBranch,
  UnpublishBranch,
  getPublishedEndings,
  readEnding,
} from "../controllers/publish.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router({ mergeParams: true });

router.get("/endings/:publishingId", protect, readEnding);
router.get("/:storyId/endings", getPublishedEndings);
router.post("/:storyId/publish", protect, publishBranch);
router.put(
  "/:storyId/endings/:publishingId/unpublish",
  protect,
  UnpublishBranch,
);

export default router;
