import { prisma } from "@/lib/prisma";
import { AuthOptions, getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions as AuthOptions);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await context.params;

  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: { doctor: true },
  });

  if (!appointment) {
    return NextResponse.json(
      { error: "Appointment not found" },
      { status: 404 },
    );
  }

  // Access control
  const isAdmin = session.user.role === "ADMIN";
  const isDoctor =
    session.user.role === "DOCTOR" &&
    appointment.doctor.userId === session.user.id;

  if (!isAdmin && !isDoctor) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { summary, followUpNotes } = await req.json();

  const consultation = await prisma.consultation.upsert({
    where: { appointmentId: appointment.id },
    update: { summary, followUpNotes },
    create: {
      appointmentId: appointment.id,
      summary,
      followUpNotes,
    },
  });

  return NextResponse.json(consultation);
}
