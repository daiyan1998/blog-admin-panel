import express from "express";
import {
  createTag,
  getAllTags,
  getOneTag,
  deleteTag,
  updateTag,
} from "../controller/tagController.js";

const router = express.Router();

router.get("/", getAllTags);
router.get("/:id", getOneTag);
router.post("/", createTag);
router.patch("/:id", updateTag);
router.delete("/:id", deleteTag);

export default router;
