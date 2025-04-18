import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

const prisma = new PrismaClient();

const createComment = asyncHandler(async (req, res) => {
  const { content, blogId, parentCommentId } = req.body;
  const userId = req.user.id;
  //   const blogId = req.params.blogId;

  const comment = await prisma.comment.create({
    data: {
      content,
      userId,
      blogId,
      parentCommentId: parentCommentId || null,
    },
  });

  res.status(200).json({
    success: true,
    message: "Comment created successfully",
    data: comment,
  });
});

const getCommentsByBlogId = asyncHandler(async (req, res) => {
  const { blogId } = req.params;

  // const comments = await prisma.comment.findMany({
  //   where: {
  //     blogId: blogId,
  //     parentCommentId: null,
  //   },
  //   select: {
  //     replies: true,
  //     user: true,
  //     parentCommentId: true,
  //   },
  //   // include: {
  //   //   user: {
  //   //     select: {
  //   //       id: true,
  //   //       name: true,
  //   //     },
  //   //   },
  //   //   replies: {
  //   //     include: {
  //   //       user: {
  //   //         select: {
  //   //           id: true,
  //   //           name: true,
  //   //         },
  //   //       },
  //   //     },
  //   //   },
  //   // },
  // });

  // Function to recursively build the tree

  const comments = await prisma.comment.findMany({
    where: { blogId },
    include: {
      user: { select: { id: true, name: true } },
      replies: {
        include: {
          user: { select: { id: true, name: true } },
          replies: {
            include: {
              user: { select: { id: true, name: true } },
            },
          },
        },
      },
    },
  });
  const buildTree = (parentId) => {
    return comments
      .filter((comment) => comment.parentCommentId === parentId)
      .map((comment) => ({
        ...comment,
        replies: buildTree(comment.id),
      }));
  };

  // Get only the top-level comments and build the tree
  const nestedComments = buildTree(null);

  res.status(200).json({
    success: true,
    message: "Comments fetched successfully",
    data: nestedComments,
  });
});

const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (comment.userId !== userId) {
    throw new ApiError(403, "You are not authorized to update this comment");
  }

  const updatedComment = await prisma.comment.update({
    where: { id: commentId },
    data: { content },
  });

  res.status(200).json({
    success: true,
    message: "Comment updated successfully",
  });
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  console.log(commentId);
  const userId = req.user.id;

  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
  });

  console.log("commetn,", comment);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (comment.userId !== userId) {
    throw new ApiError(403, "You are not authorized to delete this comment");
  }

  const deleteReplies = async (commentId) => {
    const replies = await prisma.comment.findMany({
      where: {
        parentCommentId: commentId,
      },
    });

    for (let reply of replies) {
      await deleteReplies(reply.id);
    }

    await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });
  };

  await deleteReplies(commentId);

  res.status(200).json({
    success: true,
    message: "Comment deleted successfully",
  });
});

export { createComment, getCommentsByBlogId, updateComment, deleteComment };
