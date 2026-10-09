import { z } from "zod";

export const galleryInputSchema = z.object({
  caption: z.string().min(1).max(200),
  imageUrl: z.string().url(),
  year: z.number().int().optional().nullable(),
  order: z.number().int().default(0),
});

export const galleryUpdateSchema = galleryInputSchema.partial();

export const galleryBulkInputSchema = z.object({
  items: z.array(galleryInputSchema).min(1).max(50),
});
