import { z } from "zod";

export const blogSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  content: z.string().min(10, "Content must be at least 10 characters long"),
  published: z.boolean().optional(),
  categoryId: z.string().optional(),
  tags: z
    .array(
      z.object({
        name: z.string().min(1, "Tag name must be at least 1 character long"),
        id: z.string(),
      })
    )
    .optional(),
});
