import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { APPOINTMENT_DURATION } from "@/lib/appointmentRules";

export async function POST(req: Request) {
  try {
    const { appointmentId, newScheduledAt } = await req.json();

    if (!appointmentId || !newScheduledAt)
      return NextResponse.json(
        { error: "appointmentId and newScheduledAt required" },
        { status: 400 }
      );

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });
    if (!appointment)
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });

    // Check doctor availability
    const start = new Date(newScheduledAt);
    const end = new Date(
      start.getTime() + APPOINTMENT_DURATION[appointment.consultation] * 60000
    );

    const conflict = await prisma.appointment.findFirst({
      where: {
        doctorId: appointment.doctorId,
        status: { not: "CANCELLED" },
        scheduledAt: { lt: end, gte: start },
      },
    });

    if (conflict)
      return NextResponse.json({ error: "Time slot already booked" }, { status: 400 });

    // Update appointment
    const updated = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        scheduledAt: start,
        status: "RESCHEDULED",
      },
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
