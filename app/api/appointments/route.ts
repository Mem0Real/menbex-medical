import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { APPOINTMENT_DURATION } from "@/lib/appointmentRules";
import { ConsultationType } from "@/prisma/generated/client";
import { requireDoctor } from "@/lib/auth";

// List logged doctor's appointments
export async function GET() {
  try {
    const session = await requireDoctor();

    const appointments = await prisma.appointment.findMany({
      where: {
        id: session.user.id,
      },
    });

    return NextResponse.json(appointments);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { doctorId, patientId, scheduledAt } = body;
    const consultation = body.consultation as ConsultationType;

    if (!doctorId || !patientId || !scheduledAt || !consultation) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const start = new Date(scheduledAt);
    const end = new Date(
      start.getTime() + APPOINTMENT_DURATION[consultation] * 60000,
    );

    const appointment = await prisma.$transaction(async (tx) => {
      const conflict = await tx.appointment.findFirst({
        where: {
          doctorId,
          status: { not: "CANCELLED" },
          scheduledAt: {
            lt: end,
            gte: new Date(start.getTime() - 60 * 60000),
          },
        },
      });

      if (conflict) {
        throw new Error("Time slot already booked");
      }

      return tx.appointment.create({
        data: {
          doctorId,
          patientId,
          scheduledAt: start,
          consultation,
          status: "BOOKED",
        },
      });
    });

    return NextResponse.json(appointment);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 },
    );
  }
}
