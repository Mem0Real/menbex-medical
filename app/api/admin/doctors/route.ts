import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { hash } from "bcrypt";

// Show all docs
export async function GET() {
  try {
    await requireAdmin();
    return NextResponse.json(await prisma.doctor.findMany());
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
}

// Create new doctor user
export async function POST(req: Request) {
  try {
    await requireAdmin();
    const { email, password, fullName, specialty, licenseNo, availability } =
      await req.json();

    const passwordHash = await hash(password, 10);

    const doctor = await prisma.doctor.create({
      data: {
        fullName,
        specialty,
        licenseNo,
        availability,
        user: {
          create: {
            email,
            passwordHash,
            role: "DOCTOR",
          },
        },
      },
    });

    return NextResponse.json(doctor);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
