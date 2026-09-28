import { z } from "zod";

export const certificateInputSchema = z.object({
  title: z.string().min(1).max(200),
  issuer: z.string().min(1).max(200),
  year: z.number().int().optional().nullable(),
  credentialUrl: z.string().url().optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
  order: z.number().int().default(0),
});

export const certificateUpdateSchema = certificateInputSchema.partial();

export const certificateBulkInputSchema = z.object({
  items: z.array(certificateInputSchema).min(1).max(50),
});
