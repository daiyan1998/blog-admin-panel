import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const searchBlogs = async (query) => {
  if (!query.trim()) return [];

  const results = await prisma.blog.findMany({
    where: {
      OR: [
        {
          title: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          author: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          category: {
            is: {
              name: {
                contains: query,
                mode: "insensitive",
              },
            },
          },
        },
      ],
    },
  });

  return results;
};

export { searchBlogs };
