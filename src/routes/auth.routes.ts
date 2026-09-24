import { Router } from "express";
import { login } from "../controllers/auth.controller";
import { asyncHandler } from "../utils/asyncHandler";
import { loginRateLimit } from "../middleware/rateLimit";

export const authRouter = Router();

authRouter.post("/login", loginRateLimit, asyncHandler(login));
