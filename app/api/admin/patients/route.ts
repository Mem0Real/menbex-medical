import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// List patients
export async function GET() {
  try {
    await requireAdmin();

    const patients = await prisma.patient.findMany({
      include: {
        user: true,
        appointments: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(patients);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
}

