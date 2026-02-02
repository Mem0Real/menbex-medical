import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password, role, fullName } = body;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return NextResponse.json(
      { error: "User already exists" },
      { status: 400 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      role,
      patient:
        role === "PATIENT"
          ? {
              create: {
                fullName,
              },
            }
          : undefined,
      doctor:
        role === "DOCTOR"
          ? {
              create: {
                fullName,
                specialty: "General",
                licenseNo: "PENDING",
                availability: {},
              },
            }
          : undefined,
    },
  });

  return NextResponse.json({ id: user.id });
}
