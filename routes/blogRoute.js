import express from "express";
// import { createUser, loginUser } from "../controller/userController.js";
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getOneBlog,
  getSearchBlogs,
  updateOneBlog,
  getFilteredBlogs,
} from "../controller/blogController.js";
import { isAdmin } from "../middleware/auth.middleware.js";
import upload from "../middleware/photoUpload.js";
import { isManager } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", isAdmin, isManager, upload.single("coverImage"), createBlog);
router
  .get("/", getAllBlogs)
  .get("/search", getSearchBlogs)
  .get("/filter", getFilteredBlogs)
  .get("/:id", getOneBlog);
router.delete("/:id", isAdmin, deleteBlog);
router.patch("/:id", isAdmin, upload.single("coverImage"), updateOneBlog);

export default router;
