import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

async function main() {
  // Create a user
  await prisma.user.deleteMany();

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync("12345678", salt);
  const user = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "a@a.com",
      password: hash,
      role: "ADMIN",
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
