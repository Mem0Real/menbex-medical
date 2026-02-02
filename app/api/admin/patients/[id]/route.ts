import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// View full patient record
export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    const patient = await prisma.patient.findUnique({
      where: { id: params.id },
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
