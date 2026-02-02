import { hash } from "bcrypt";
import { prisma } from "@/lib/prisma";

const hashed = await hash("password123", 10); // plain password = "password123"

const user = await prisma.user.create({
  data: {
    email: "admin@test.com",
    passwordHash: hashed,
    role: "ADMIN",
  },
});
