import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  const patient = await prisma.patient.create({
    data: {
      fullName: "Test Patient",
      user: {
        create: {
          email: "patient@test.com",
          passwordHash: "hashed-password", // temp hash
          role: "PATIENT",
        },
      },
    },
  });

  return NextResponse.json(patient);
}
