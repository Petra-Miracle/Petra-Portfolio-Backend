import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import {
  technologyInputSchema,
  technologyUpdateSchema,
} from "../validators/technology.schema";

export async function listTechnologies(req: Request, res: Response): Promise<void> {
  const technologies = await prisma.technology.findMany({
    orderBy: [{ order: "asc" }, { name: "asc" }],
  });
  res.json(technologies);
}

export async function createTechnology(req: Request, res: Response): Promise<void> {
  const data = technologyInputSchema.parse(req.body);
  const technology = await prisma.technology.create({ data });
  res.status(201).json(technology);
}

export async function updateTechnology(req: Request, res: Response): Promise<void> {
  const data = technologyUpdateSchema.parse(req.body);
  const technology = await prisma.technology.update({
    where: { id: req.params.id },
    data,
  });
  res.json(technology);
}

export async function deleteTechnology(req: Request, res: Response): Promise<void> {
  await prisma.technology.delete({ where: { id: req.params.id } });
  res.status(204).send();
}
