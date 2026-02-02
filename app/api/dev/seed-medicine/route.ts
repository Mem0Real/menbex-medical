import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  const medicine = await prisma.medicine.createMany({
    data: [
      {
        name: "Paracetamol",
        description: "Pain relief",
        price: 100.0,
        stock: 10,
      },
      {
        name: "Adderal",
        description: "Mental Stress Cure",
        price: 240.0,
        stock: 5,
      },
      {
        name: "Penicillin",
        description: "Mild Pain relief",
        price: 56.0,
        stock: 46,
      },
    ],
    skipDuplicates: true,
  });

  return NextResponse.json(medicine);
}
