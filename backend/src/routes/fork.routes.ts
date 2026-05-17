import { Router } from "express";
import {
  forkStory,
  getStoryForks,
  getMyForks,
} from "../controllers/fork.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router({ mergeParams: true });

router.get("/my", protect, getMyForks);
router.post("/:storyId/fork", protect, forkStory);
router.get("/:storyId/forks", protect, getStoryForks);

export default router;
