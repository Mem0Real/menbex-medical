import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// List resources (public folder)
export async function GET() {
  return NextResponse.json(await prisma.resource.findMany());
}
