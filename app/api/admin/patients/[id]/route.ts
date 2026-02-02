import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// View full patient record
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();

    const { id } = await context.params;

    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        visits: { include: { doctor: true } },
        prescriptions: true,
        labResults: true,
        medications: true,
      },
    });

    return NextResponse.json(patient);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
}
