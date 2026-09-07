import { Router } from "express";
import { uploadImage } from "../controllers/uploads.controller";
import { requireAdmin } from "../middleware/auth";
import { upload } from "../middleware/upload";
import { asyncHandler } from "../utils/asyncHandler";

export const uploadsRouter = Router();

uploadsRouter.post(
  "/",
  requireAdmin,
  upload.single("file"),
  asyncHandler(uploadImage)
);
