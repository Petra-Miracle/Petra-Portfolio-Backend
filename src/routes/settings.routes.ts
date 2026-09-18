import { Router } from "express";
import { getSettings, updateSettings } from "../controllers/settings.controller";
import { requireAdmin } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";

export const settingsRouter = Router();

settingsRouter.get("/", asyncHandler(getSettings));
settingsRouter.put("/", requireAdmin, asyncHandler(updateSettings));
