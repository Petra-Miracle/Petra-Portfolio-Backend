import { z } from "zod";

export const settingsUpdateSchema = z.object({
  cvUrl: z.string().url().nullable(),
});
