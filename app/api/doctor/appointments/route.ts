import { prisma } from "@/lib/prisma";
import { AuthOptions, getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

// Doctor only sees their own appointments
export async function GET() {
  const session = await getServerSession(authOptions as AuthOptions);
  if (!session || session.user.role !== "DOCTOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const doctor = await prisma.doctor.findUnique({
    where: { userId: session.user.id },
  });

  if (!doctor) {
    return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
  }

  const appointments = await prisma.appointment.findMany({
    where: { doctorId: doctor.id },
    include: {
      patient: {
        select: {
          id: true,
          fullName: true,
          dateOfBirth: true,
        },
      },
    },
    orderBy: { scheduledAt: "asc" },
  });

  return NextResponse.json(appointments);
}
