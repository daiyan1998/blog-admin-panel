import express from "express";
import {
  createUser,
  loginUser,
  logoutUser,
  getAllUsers,
  updateUser,
  deleteUser,
} from "../controller/userController.js";
import upload from "../middleware/photoUpload.js";
import { isAdmin } from "../middleware/auth.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", verifyJWT, getAllUsers);
router.post("/register", upload.single("img"), createUser);
router.post("/login", loginUser);
router.post("/logout", verifyJWT, logoutUser);
router.delete("/:id", verifyJWT, isAdmin, deleteUser);
router.patch("/:id", verifyJWT, upload.single("img"), updateUser);

export default router;
