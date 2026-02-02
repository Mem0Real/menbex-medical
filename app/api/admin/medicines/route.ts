import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// List medicines
export async function GET() {
  try {
    await requireAdmin();
    return NextResponse.json(await prisma.medicine.findMany());
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
}

// Add medicine
export async function POST(req: Request) {
  try {
    await requireAdmin();
    const { name, description, price, stock } = await req.json();

    const medicine = await prisma.medicine.create({
      data: { name, description, price, stock },
    });

    return NextResponse.json(medicine);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
}
