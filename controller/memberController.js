import { asyncHandler } from "../utils/asyncHandler.js";
import { PrismaClient } from "@prisma/client";
import { generateImageUrl } from "../utils/generateImageUrl.js";
import { deleteImgFile } from "../utils/deleteImgFile.js";
const prisma = new PrismaClient();

const getAllMembers = asyncHandler(async (req, res) => {
  const members = await prisma.member.findMany();
  res.status(200).json({ data: members });
});

const getOneMember = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const member = await prisma.member.findUnique({
    where: {
      id: id,
    },
  });
  res.status(200).json({ data: member });
});

const createMember = asyncHandler(async (req, res) => {
  let { name, designation } = req.body;

  const fileUrl = generateImageUrl(req);
  const member = await prisma.member.create({
    data: {
      name,
      designation,
      img: fileUrl,
    },
  });
  res.status(200).json({ data: member });
});

const updateMember = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let { name, designation } = req.body;
  console.log(req.body, "updateMember");
  const fileUrl = generateImageUrl(req);

  const member = await prisma.member.update({
    where: {
      id: id,
    },
    data: {
      name,
      designation,
      img: fileUrl || undefined,
    },
  });
  res.status(200).json({ data: member });
});

const deleteMember = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const member = await prisma.member.delete({
    where: {
      id: id,
    },
  });

  deleteImgFile(req, member.img);
  res.status(200).json({ data: member });
});

export {
  getAllMembers,
  getOneMember,
  createMember,
  updateMember,
  deleteMember,
};
