import { Request, Response } from "express";
import { put } from "@vercel/blob";

export async function uploadImage(req: Request, res: Response): Promise<void> {
  const file = req.file;

  if (!file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }

  const filename = `projects/${Date.now()}-${file.originalname}`;

  const blob = await put(filename, file.buffer, {
    access: "public",
    contentType: file.mimetype,
  });

  res.status(201).json({ url: blob.url });
}
