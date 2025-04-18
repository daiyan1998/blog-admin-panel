import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

export const deleteImgFile = (req, imagePath) => {
  console.log(imagePath);
  const relativePath = imagePath.replace(
    `${req.protocol}://${req.get("host")}/`,
    ""
  );
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
