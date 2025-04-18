export const generateImageUrl = (req) => {
  const filePath = req.file?.path.replace(/\\/, "/");
  return filePath;
};
