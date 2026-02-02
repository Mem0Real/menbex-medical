import { hash } from "bcrypt";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const hashed = await hash("password123", 10); // plain password = "password123"

export async function POST() {
  const user = await prisma.user.create({
    data: {
      email: "admin@test.com",
      passwordHash: hashed,
      role: "ADMIN",
    },
  });

  return NextResponse.json(user);
}
