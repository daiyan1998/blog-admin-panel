import { z } from "zod";

const Max_IMAGE_SIZE = 5 * 1024 * 1024; // 5 mb
const VALID_IMAGE_TYPES = ["jpg", "png", "jpeg", "webp"];

export const getBlogSchema = () =>
  z.object({
    title: z.string().trim().min(5, {
      message: "Title must be at least 5 characters",
    }),
    content: z.string().trim().min(10, {
      message: "Content must be at least 10 characters",
    }),
    author: z.string().trim().min(2, {
      message: "Author must be at least 2 characters",
    }),
    categoryId: z.any(),
    coverImage: z
      .any()
      .optional()
      .refine((file) => !file || file.size <= Max_IMAGE_SIZE, {
        message: `Image must be at least ${Max_IMAGE_SIZE} bytes`,
      })
      .refine(
        (file) =>
          !file || VALID_IMAGE_TYPES.includes(file.type.split("/").pop()),
        {
          message: `Invalid image type. Only ${VALID_IMAGE_TYPES.join(", ")} are allowed`,
        }
      ),
    images: z.any().optional(),
  });
