import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { AuthOptions } from "next-auth";

export async function GET() {
  const session = await getServerSession(authOptions as AuthOptions);
  if (!session)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const patient = await prisma.patient.findUnique({
    where: { userId: session.user.id },
    include: { visits: { include: { doctor: true } } }, // include doctor info
  });

  if (!patient)
    return NextResponse.json({ error: "Patient not found" }, { status: 404 });

  return NextResponse.json(patient.visits);
}
