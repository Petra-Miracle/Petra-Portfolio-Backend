import { Prisma, ProjectType } from "@prisma/client";
import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { projectInputSchema, projectUpdateSchema } from "../validators/project.schema";

function parseTypeFilter(type: unknown): Prisma.ProjectWhereInput {
  if (type === "PROJECT" || type === "COMPETITION") {
    return { type: type as ProjectType };
  }
  return {};
}

export async function listProjects(req: Request, res: Response): Promise<void> {
  const where = parseTypeFilter(req.query.type);

  const projects = await prisma.project.findMany({
    where,
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  res.json(projects);
}

export async function createProject(req: Request, res: Response): Promise<void> {
  const data = projectInputSchema.parse(req.body);
  const project = await prisma.project.create({ data });
  res.status(201).json(project);
}

export async function updateProject(req: Request, res: Response): Promise<void> {
  const data = projectUpdateSchema.parse(req.body);
  const project = await prisma.project.update({
    where: { id: req.params.id },
    data,
  });
  res.json(project);
}

export async function deleteProject(req: Request, res: Response): Promise<void> {
  await prisma.project.delete({ where: { id: req.params.id } });
  res.status(204).send();
}
