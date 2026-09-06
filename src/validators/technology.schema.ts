import { z } from "zod";

export const technologyInputSchema = z.object({
  name: z.string().min(1).max(100),
  category: z.enum(["GENERAL", "AI"]).default("GENERAL"),
  icon: z.string().max(255).optional().nullable(),
  order: z.number().int().default(0),
});

export const technologyUpdateSchema = technologyInputSchema.partial();
