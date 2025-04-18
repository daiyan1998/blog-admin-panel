import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../utils/asyncHandler.js";

const prisma = new PrismaClient();

const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await prisma.category.findMany();
  res.status(200).json({ data: categories });
});

const getOneCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await prisma.category.findUnique({
    where: {
      id: id,
    },
  });
  res.status(200).json({ data: category });
});

const createCategory = asyncHandler(async (req, res) => {
  let { name } = req.body;
  const category = await prisma.category.create({
    data: {
      name,
    },
  });
  res.status(200).json({ data: category });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await prisma.category.delete({
    where: {
      id: id,
    },
  });
  res.status(200).json({ data: category });
});

const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let { name } = req.body;
  const category = await prisma.category.update({
    where: {
      id: id,
    },
    data: {
      name,
    },
  });
  res.status(200).json({ data: category });
});

export {
  getAllCategories,
  getOneCategory,
  createCategory,
  deleteCategory,
  updateCategory,
};
