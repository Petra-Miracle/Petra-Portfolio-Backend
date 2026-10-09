import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import {
  galleryBulkInputSchema,
  galleryInputSchema,
  galleryUpdateSchema,
} from "../validators/gallery.schema";

export async function listGalleryItems(req: Request, res: Response): Promise<void> {
  const items = await prisma.galleryItem.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  res.json(items);
}

export async function createGalleryItem(req: Request, res: Response): Promise<void> {
  const data = galleryInputSchema.parse(req.body);
  const item = await prisma.galleryItem.create({ data });
  res.status(201).json(item);
}

export async function createGalleryItemsBulk(req: Request, res: Response): Promise<void> {
  const { items } = galleryBulkInputSchema.parse(req.body);
  const created = await prisma.$transaction(
    items.map((data) => prisma.galleryItem.create({ data })),
  );
  res.status(201).json(created);
}

export async function updateGalleryItem(req: Request, res: Response): Promise<void> {
  const data = galleryUpdateSchema.parse(req.body);
  const item = await prisma.galleryItem.update({
    where: { id: req.params.id },
    data,
  });
  res.json(item);
}

export async function deleteGalleryItem(req: Request, res: Response): Promise<void> {
  await prisma.galleryItem.delete({ where: { id: req.params.id } });
  res.status(204).send();
}
