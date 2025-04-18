import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../utils/asyncHandler.js";

const prisma = new PrismaClient();

const getAllTags = asyncHandler(async (req, res) => {
  const tags = await prisma.tag.findMany();
  res.status(200).json({ data: tags });
});

const getOneTag = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const tag = await prisma.tag.findUnique({
    where: {
      id: id,
    },
  });
  res.status(200).json({ data: tag });
});

const createTag = asyncHandler(async (req, res) => {
  let { name } = req.body;
  const tag = await prisma.tag.create({
    data: {
      name,
    },
  });
  res.status(200).json({ data: tag });
});

const deleteTag = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const tag = await prisma.tag.delete({
    where: {
      id: id,
    },
  });
  res.status(200).json({ data: tag });
});

const updateTag = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let { name } = req.body;
  const tag = await prisma.tag.update({
    where: {
      id: id,
    },
    data: {
      name,
    },
  });
  res.status(200).json({ data: tag });
});

export { getAllTags, getOneTag, createTag, deleteTag, updateTag };
