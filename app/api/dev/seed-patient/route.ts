import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";

const hashed = await hash("password123", 10); // plain password = "password123"

export async function POST() {
  const patient = await prisma.patient.create({
    data: {
      fullName: "Patient",
      user: {
        create: {
          email: "patient@patient.com",
          passwordHash: hashed, // temp hash
          role: "PATIENT",
        },
      },
    },
  });

  return NextResponse.json(patient);
}
