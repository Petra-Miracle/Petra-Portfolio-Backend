import { NextFunction, Request, Response } from "express";
import { AdminTokenPayload, verifyAdminToken } from "../utils/jwt";

export interface AuthenticatedRequest extends Request {
  admin?: AdminTokenPayload;
}

export function requireAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or invalid Authorization header" });
    return;
  }

  const token = header.slice("Bearer ".length);

  try {
    req.admin = verifyAdminToken(token);
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
