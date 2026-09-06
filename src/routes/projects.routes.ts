import { Router } from "express";
import {
  createProject,
  deleteProject,
  listProjects,
  updateProject,
} from "../controllers/projects.controller";
import { requireAdmin } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";

export const projectsRouter = Router();

projectsRouter.get("/", asyncHandler(listProjects));
projectsRouter.post("/", requireAdmin, asyncHandler(createProject));
projectsRouter.put("/:id", requireAdmin, asyncHandler(updateProject));
projectsRouter.delete("/:id", requireAdmin, asyncHandler(deleteProject));
