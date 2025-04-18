import express from "express";
import {
  getAllProjects,
  getOneProject,
  createProject,
  updateProject,
  deleteProject,
} from "../controller/projectController.js";

const router = express.Router();

router.get("/", getAllProjects);
router.get("/:id", getOneProject);
router.post("/", createProject);
router.patch("/:id", updateProject);
router.delete("/:id", deleteProject);

export default router;
