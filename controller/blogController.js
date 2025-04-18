import { searchBlogs } from "../database/blog.db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { PrismaClient } from "@prisma/client";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import { generateImageUrl } from "../utils/generateImageUrl.js";
import { blogSchema } from "../zodSchemas/blogSchema.js";

const prisma = new PrismaClient();

/*
 @desc    Create new blog
 @route   POST /api/v1/blogs
 @access  Private/Admin
*/
const createBlog = asyncHandler(async (req, res) => {
  let { title, author, content, categoryId, tags } = blogSchema.parse(req.body);
  const user = req.user;

  const fileUrl = generateImageUrl(req);

  console.log(user, "user blogController");

  console.log(fileUrl, "fileUrl");
  console.log(req.body, "body");

  const blog = await prisma.blog.create({
    data: {
      user: {
        connect: {
          id: user.id,
        },
      },
      title,
      author,
      content,
      category: categoryId
        ? {
            connect: {
              id: categoryId,
            },
          }
        : undefined,
      coverImage: fileUrl,
      tags: tags?.length
        ? {
            create: tags.map((tag) => ({
              tag: {
                connect: { id: tag.id },
              },
            })),
          }
        : undefined,
    },
  });

  res.status(201).json({ message: "Blog created successfully", data: blog });
});

/*
 @desc    Get all blogs
 @route   GET /api/v1/blogs
 @access  Public
*/
const getAllBlogs = asyncHandler(async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 4;
  const skip = (page - 1) * limit;
  const categoryId = req.query.categoryId;
  const tagId = req.query.tagId;

  // Build the query condition
  let whereCondition = {};
  if (categoryId) {
    whereCondition.categoryId = categoryId;
  }

  if (tagId) {
    whereCondition.tags = {
      some: {
        tagId: tagId,
      },
    };
  }

  // Count total blogs (with optional category filter)
  let count = await prisma.blog.count({
    where: whereCondition,
  });

  let blogs = await prisma.blog.findMany({
    skip: skip,
    take: limit,
    where: whereCondition,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  // Fallback: If no blogs match both categoryId and tagId, filter by categoryId only
  if (blogs.length === 0 && categoryId && tagId) {
    whereCondition = {
      categoryId: categoryId,
    };

    count = await prisma.blog.count({
      where: whereCondition,
    });

    blogs = await prisma.blog.findMany({
      skip: skip,
      take: limit,
      where: whereCondition,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  }

  const pages = Math.ceil(count / limit);

  res.status(200).json({
    data: blogs,
    pages,
  });
});

/*
 @desc        Get one blog
 @route       GET /api/v1/blogs/:id
 @access      Public
*/
const getOneBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const blog = await prisma.blog.findUnique({
    where: {
      id: id,
    },
    include: {
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  res.status(200).json({ message: "Blog fetched successfully", data: blog });
});

/*
 @desc        Delete blog
 @route       DELETE /api/v1/blogs/:id
 @access      Private/Admin
*/
const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const blog = await prisma.blog.findFirst({
    where: {
      id: id,
    },
  });
  const coverImage = blog.coverImage;

  const deleteFile = (imagePath) => {
    const relativePath = imagePath.replace(
      `${req.protocol}://${req.get("host")}/`,
      ""
    );
    if (relativePath === "undefined") return;
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const fullPath = path.join(__dirname, "..", relativePath);

    fs.unlink(fullPath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      } else {
        console.info("File deleted successfully");
      }
    });
  };

  if (coverImage) {
    deleteFile(coverImage);
  }

  await prisma.blog.delete({
    where: {
      id: id,
    },
  });
  res.status(200).json({ message: "Blog deleted successfully" });
});

/*
 @desc        Update blog
 @route       PUT /api/v1/blogs/:id
 @access      Private/Admin
*/
const updateOneBlog = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { title, author, content, categoryId, tags } = blogSchema.parse(
    req.body
  );
  const { id } = req.params;
  const user = req.user;

  let fileUrl;

  if (req.file) {
    fileUrl = generateImageUrl(req);
  }

  console.log(fileUrl, "fileUrl updateOneBlog");

  const existingBlog = await prisma.blog.findUnique({
    where: { id },
  });

  if (!existingBlog) {
    return res.status(404).json({ message: "Blog not found" });
  }

  const updateData = {
    title: title || existingBlog.title,
    author: author || existingBlog.author,
    content: content || existingBlog.content,
    categoryId: categoryId ?? existingBlog.categoryId,
    coverImage: fileUrl ?? existingBlog.coverImage,
  };

  if (Array.isArray(tags)) {
    updateData.tags = {
      deleteMany: {},
      create: tags.map((tag) => ({ tagId: tag.id })),
    };
  }

  const updatedBlog = await prisma.blog.update({
    where: { id },
    data: updateData,
  });

  res
    .status(200)
    .json({ message: "Blog updated successfully", data: updatedBlog });
});

/*
 @desc        Search blog
 @route       GET /api/v1/blogs
 @access      Public
*/
const getSearchBlogs = asyncHandler(async (req, res) => {
  const { keyword } = req.query;
  const result = await searchBlogs(keyword);
  res.status(200).json({ data: result });
});

const getFilteredBlogs = asyncHandler(async (req, res) => {
  const { category } = req.query;
  console.log(category);

  const filteredBlogs = await prisma.blog.findMany({
    where: {
      categoryId: category,
    },
  });
  res.status(200).json({ success: true, data: filteredBlogs });
});

export {
  createBlog,
  getAllBlogs,
  getOneBlog,
  deleteBlog,
  updateOneBlog,
  getSearchBlogs,
  getFilteredBlogs,
};
