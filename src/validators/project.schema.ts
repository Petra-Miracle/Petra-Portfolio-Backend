import { z } from "zod";

export const projectInputSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  type: z.enum(["PROJECT", "COMPETITION"]).default("PROJECT"),
  techStack: z.array(z.string()).default([]),
  demoUrl: z.string().url().optional().nullable(),
  repoUrl: z.string().url().optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
  result: z.string().max(200).optional().nullable(),
  year: z.number().int().optional().nullable(),
  order: z.number().int().default(0),
});

export const projectUpdateSchema = projectInputSchema.partial();
