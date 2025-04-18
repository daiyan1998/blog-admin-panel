import { asyncHandler } from "../utils/asyncHandler.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const getAllProjects = asyncHandler(async (req, res) => {
  const projects = await prisma.project.findMany();
  res.status(200).json({ data: projects });
});

const getOneProject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const project = await prisma.project.findUnique({
    where: {
      id: id,
    },
  });
  res.status(200).json({ data: project });
});

const createProject = asyncHandler(async (req, res) => {
  let { title, description, category, techStack } = req.body;
  const project = await prisma.project.create({
    data: {
      title,
      description,
      category,
      techStack,
    },
  });
  res.status(200).json({ data: project });
});

const updateProject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let { title, description, category, techStack } = req.body;
  const project = await prisma.project.update({
    where: {
      id: id,
    },
    data: {
      title,
      description,
      category,
      techStack,
    },
  });
  res.status(200).json({ data: project });
});

const deleteProject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const project = await prisma.project.delete({
    where: {
      id: id,
    },
  });
  res.status(200).json({ data: project });
});

export {
  getAllProjects,
  getOneProject,
  createProject,
  updateProject,
  deleteProject,
};
