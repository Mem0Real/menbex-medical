import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AuthOptions, getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// Doctor can ONLY see assigned patients
// HIPAA/GDPR compliant
export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions as AuthOptions);
  if (!session || session.user.role !== "DOCTOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const doctor = await prisma.doctor.findUnique({
    where: { userId: session.user.id },
  });

  const hasAccess = await prisma.appointment.findFirst({
    where: {
      doctorId: doctor!.id,
      patientId: params.id,
    },
  });

  if (!hasAccess) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const patient = await prisma.patient.findUnique({
    where: { id: params.id },
    include: {
      visits: true,
      prescriptions: true,
      labResults: true,
      medications: true,
    },
  });

  return NextResponse.json(patient);
}
