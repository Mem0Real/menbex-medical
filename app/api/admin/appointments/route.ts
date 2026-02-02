import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// List all
export async function GET() {
  try {
    await requireAdmin();

    const appointments = await prisma.appointment.findMany({
      orderBy: { scheduledAt: "desc" },
      include: {
        patient: true,
        doctor: true,
      },
    });

    return NextResponse.json(appointments);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
}

// Cancel
export async function POST(req: Request) {
  try {
    await requireAdmin();
    const { appointmentId } = await req.json();

    const updated = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: "CANCELLED" },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
}
