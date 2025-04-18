import express from "express";
import {
  createComment,
  getCommentsByBlogId,
  updateComment,
  deleteComment,
} from "../controller/commentController.js";
const router = express.Router();

router.post("/", createComment);
router.get("/:blogId", getCommentsByBlogId);
router.put("/:commentId", updateComment);
router.delete("/:commentId", deleteComment);

export default router;
