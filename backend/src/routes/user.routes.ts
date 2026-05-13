import { Router } from "express";
import {
  getmyprofile,
  getpublicProfile,
  updateProfile,
  uploadAvatar,
} from "../controllers/user.controller";
import { protect } from "../middlewares/auth.middleware";
import { upload } from "../config/cloudinary";

const router = Router();

router.get("/me", protect, getmyprofile);
router.put("/me", protect, updateProfile);
router.post("/me/avatar", protect, upload.single("avatar"), uploadAvatar);

router.get("/:username", getpublicProfile);

export default router;
