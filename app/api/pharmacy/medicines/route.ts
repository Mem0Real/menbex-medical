import { prisma } from "@/lib/prisma";
import { AuthOptions, getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const query = url.searchParams.get("query") || "";

    const medicines = await prisma.medicine.findMany({
      where: {
        name: { contains: query, mode: "insensitive" },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(medicines);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Create
export async function POST(req: Request) {
  const session = await getServerSession(authOptions as AuthOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const { name, description, price, stock } = await req.json();
  if (!name || price == null || stock == null) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const medicine = await prisma.medicine.create({
    data: { name, description, price, stock },
  });

  return NextResponse.json(medicine);
}

// Update
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions as AuthOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const { id, name, description, price, stock } = await req.json();
  if (!name || price == null || stock == null) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const medicine = await prisma.medicine.update({
    where: { id: id },
    data: { name, description, price, stock },
  });

  return NextResponse.json(medicine);
}

// Delete
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions as AuthOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const { id } = await req.json();
  if (!id) {
    return NextResponse.json(
      { error: "Could not find the selected medicine" },
      { status: 400 },
    );
  }

  const medicine = await prisma.medicine.delete({
    where: { id: id },
  });

  return NextResponse.json(medicine);
}
