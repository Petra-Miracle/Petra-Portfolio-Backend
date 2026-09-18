import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { settingsUpdateSchema } from "../validators/settings.schema";

const SETTINGS_ID = "singleton";

export async function getSettings(req: Request, res: Response): Promise<void> {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: SETTINGS_ID },
  });
  res.json({ cvUrl: settings?.cvUrl ?? null });
}

export async function updateSettings(req: Request, res: Response): Promise<void> {
  const data = settingsUpdateSchema.parse(req.body);
  const settings = await prisma.siteSettings.upsert({
    where: { id: SETTINGS_ID },
    create: { id: SETTINGS_ID, ...data },
    update: data,
  });
  res.json({ cvUrl: settings.cvUrl });
}
