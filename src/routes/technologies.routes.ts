import { Router } from "express";
import {
  createTechnology,
  deleteTechnology,
  listTechnologies,
  updateTechnology,
} from "../controllers/technologies.controller";
import { requireAdmin } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";

export const technologiesRouter = Router();

technologiesRouter.get("/", asyncHandler(listTechnologies));
technologiesRouter.post("/", requireAdmin, asyncHandler(createTechnology));
technologiesRouter.put("/:id", requireAdmin, asyncHandler(updateTechnology));
technologiesRouter.delete("/:id", requireAdmin, asyncHandler(deleteTechnology));
