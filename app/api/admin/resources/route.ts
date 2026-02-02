import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Admin create resource
export async function POST(req: Request) {
  try {
    await requireAdmin();
    const { title, type, filePath } = await req.json();

    return NextResponse.json(
      await prisma.resource.create({ data: { title, type, filePath } })
    );
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
}
