import { Router } from "express";
import {
  createGalleryItem,
  createGalleryItemsBulk,
  deleteGalleryItem,
  listGalleryItems,
  updateGalleryItem,
} from "../controllers/gallery.controller";
import { requireAdmin } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";

export const galleryRouter = Router();

galleryRouter.get("/", asyncHandler(listGalleryItems));
galleryRouter.post("/", requireAdmin, asyncHandler(createGalleryItem));
galleryRouter.post("/bulk", requireAdmin, asyncHandler(createGalleryItemsBulk));
galleryRouter.put("/:id", requireAdmin, asyncHandler(updateGalleryItem));
galleryRouter.delete("/:id", requireAdmin, asyncHandler(deleteGalleryItem));
