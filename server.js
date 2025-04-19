import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import userRoute from "./routes/userRoute.js";
import blogRoute from "./routes/blogRoute.js";
import memberRoute from "./routes/memberRoute.js";
import projectRoute from "./routes/projectRoute.js";
import mailRoute from "./routes/mailRoutes.js";
import categoryRoute from "./routes/categoryRoute.js";
import tagRoute from "./routes/tagRoute.js";
import commentRoute from "./routes/commentRoute.js";

import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { verifyJWT } from "./middleware/auth.middleware.js";
import upload from "./middleware/photoUpload.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const port = 8000 || 8001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware Configuration
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(cookieParser());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Main Routes
app.use("/api/v1/blogs", verifyJWT, blogRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/members", verifyJWT, memberRoute);
app.use("/api/v1/projects", verifyJWT, projectRoute);
app.use("/api/v1/mails", mailRoute);
app.use("/api/v1/categories", verifyJWT, categoryRoute);
app.use("/api/v1/tags", verifyJWT, tagRoute);
app.use("/api/v1/comments", verifyJWT, commentRoute);

app.post("/api/v1/upload", upload.single("img"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
    req.file.filename
  }`;
  res.status(200).json({ imageUrl });
});
app.get("/api/v1", (req, res) => {
  res.send("Server is up and running");
});

app.use(express.static(path.join(__dirname, "frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

app.listen(port, (error) => {
  console.info(`App listening at ${req.protocol}://${req.get("host")}:${port}`);

  if (error) {
    console.error("Error occurred", error);
  }
});
