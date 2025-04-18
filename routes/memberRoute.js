import express from "express";

import {
  getAllMembers,
  getOneMember,
  createMember,
  updateMember,
  deleteMember,
} from "../controller/memberController.js";
import upload from "../middleware/photoUpload.js";

const router = express.Router();

router.get("/", getAllMembers);
router.get("/:id", getOneMember);
router.post("/", upload.single("image"), createMember);
router.patch("/:id", upload.single("image"), updateMember);
router.delete("/:id", deleteMember);

export default router;
