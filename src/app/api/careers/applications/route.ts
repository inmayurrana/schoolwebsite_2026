import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const applications = await prisma.jobApplication.findMany({
      include: {
        job: {
          select: {
            id: true,
            title: true,
            department: true,
          },
        },
      },
      orderBy: { appliedAt: "desc" },
    });

    return NextResponse.json({ success: true, applications });
  } catch (error: any) {
    console.error("Applications GET error:", error);
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
  }
}
