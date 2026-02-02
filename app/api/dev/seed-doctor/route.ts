import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";

export async function POST() {
  const hashed = await hash("password123", 10);

  const doctor = await prisma.doctor.create({
    data: {
      fullName: "Doctor",
      specialty: "General",
      licenseNo: "DOC-123",
      availability: {
        timezone: "UTC",
        weekly: {
          monday: [{ start: "09:00", end: "17:00" }],
          tuesday: [{ start: "09:00", end: "17:00" }],
          thursday: [{ start: "09:00", end: "17:00" }],
        },
      },
      user: {
        create: {
          email: "doctor@doctor.com",
          passwordHash: hashed,
          role: "DOCTOR",
        },
      },
    },
  });

  return NextResponse.json(doctor);
}
