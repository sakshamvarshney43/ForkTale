import { Router } from "express";
import {
  rateEnding,
  deleteRating,
  getEndingRatings,
  getMyRating,
} from "../controllers/rating.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router({ mergeParams: true });

router.get("/:publishingId/ratings", getEndingRatings);
router.get("/:publishingId/rating/me", protect, getMyRating);
router.post("/:publishingId/ratings", protect, rateEnding);
router.delete("/:publishingId/ratings", protect, deleteRating);

export default router;
