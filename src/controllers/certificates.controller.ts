import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import {
  certificateBulkInputSchema,
  certificateInputSchema,
  certificateUpdateSchema,
} from "../validators/certificate.schema";

export async function listCertificates(req: Request, res: Response): Promise<void> {
  const certificates = await prisma.certificate.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  res.json(certificates);
}

export async function createCertificate(req: Request, res: Response): Promise<void> {
  const data = certificateInputSchema.parse(req.body);
  const certificate = await prisma.certificate.create({ data });
  res.status(201).json(certificate);
}

export async function createCertificatesBulk(req: Request, res: Response): Promise<void> {
  const { items } = certificateBulkInputSchema.parse(req.body);
  const certificates = await prisma.$transaction(
    items.map((data) => prisma.certificate.create({ data })),
  );
  res.status(201).json(certificates);
}

export async function updateCertificate(req: Request, res: Response): Promise<void> {
  const data = certificateUpdateSchema.parse(req.body);
  const certificate = await prisma.certificate.update({
    where: { id: req.params.id },
    data,
  });
  res.json(certificate);
}

export async function deleteCertificate(req: Request, res: Response): Promise<void> {
  await prisma.certificate.delete({ where: { id: req.params.id } });
  res.status(204).send();
}
