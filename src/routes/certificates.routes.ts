import { Router } from "express";
import {
  createCertificate,
  createCertificatesBulk,
  deleteCertificate,
  listCertificates,
  updateCertificate,
} from "../controllers/certificates.controller";
import { requireAdmin } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";

export const certificatesRouter = Router();

certificatesRouter.get("/", asyncHandler(listCertificates));
certificatesRouter.post("/", requireAdmin, asyncHandler(createCertificate));
certificatesRouter.post("/bulk", requireAdmin, asyncHandler(createCertificatesBulk));
certificatesRouter.put("/:id", requireAdmin, asyncHandler(updateCertificate));
certificatesRouter.delete("/:id", requireAdmin, asyncHandler(deleteCertificate));
