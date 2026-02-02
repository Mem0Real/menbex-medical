import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { APPOINTMENT_DURATION } from "@/lib/appointmentRules";
import { calculateAvailableSlots } from "@/lib/availability";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const doctorId = searchParams.get("doctorId");
  const date = searchParams.get("date");

  if (!doctorId || !date) {
    return NextResponse.json(
      { error: "doctorId and date required" },
      { status: 400 }
    );
  }

  const doctor = await prisma.doctor.findUnique({
    where: { id: doctorId },
    include: {
      appointments: {
        where: {
          scheduledAt: {
            gte: new Date(`${date}T00:00:00`),
            lt: new Date(`${date}T23:59:59`),
          },
          status: { not: "CANCELLED" },
        },
      },
    },
  });

  if (!doctor) {
    return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
  }

  const slots = calculateAvailableSlots(
    doctor.availability as any,
    doctor.appointments,
    date
  );

  return NextResponse.json(slots);
}
