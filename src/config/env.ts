import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(16),
  FRONTEND_URL: z.string().min(1).default("http://localhost:3000"),
  PORT: z.string().default("4000"),
});

export const env = envSchema.parse(process.env);
