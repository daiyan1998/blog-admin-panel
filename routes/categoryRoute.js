import express from "express";
import {
  createCategory,
  getAllCategories,
  getOneCategory,
  deleteCategory,
  updateCategory,
} from "../controller/categoryController.js";

const router = express.Router();

router.get("/", getAllCategories);
router.get("/:id", getOneCategory);
router.post("/", createCategory);
router.patch("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;
