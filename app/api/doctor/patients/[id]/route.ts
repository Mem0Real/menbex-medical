import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AuthOptions, getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// Doctor can ONLY see assigned patients
// HIPAA/GDPR compliant
export async function GET(
  _: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions as AuthOptions);
  if (!session || session.user.role !== "DOCTOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await context.params;

  const doctor = await prisma.doctor.findUnique({
    where: { userId: session.user.id },
  });

  const hasAccess = await prisma.appointment.findFirst({
    where: {
      doctorId: doctor!.id,
      patientId: id,
    },
  });

  if (!hasAccess) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const patient = await prisma.patient.findUnique({
    where: { id },
    include: {
      visits: true,
      prescriptions: true,
      labResults: true,
      medications: true,
    },
  });

  return NextResponse.json(patient);
}
