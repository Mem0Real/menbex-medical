import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  const doctor = await prisma.doctor.create({
    data: {
      fullName: "Dr Test",
      specialty: "General",
      licenseNo: "TEST-123",
      availability: {
        timezone: "UTC",
        weekly: {
          monday: [{ start: "09:00", end: "17:00" }],
          tuesday: [{ start: "09:00", end: "17:00" }],
        },
      },
      user: {
        create: {
          email: "doctor@test.com",
          passwordHash: "TEMP",
          role: "DOCTOR",
        },
      },
    },
  });

  return NextResponse.json(doctor);
}
