import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();

    const [patients, doctors, appointments, activePrescriptions] =
      await Promise.all([
        prisma.patient.count(),
        prisma.doctor.count(),
        prisma.appointment.count(),
        prisma.prescription.count({ where: { status: "ACTIVE" } }),
      ]);

    return NextResponse.json({
      patients,
      doctors,
      appointments,
      activePrescriptions,
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
}
