import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const jobs = await prisma.jobOpening.findMany({
      include: {
        applications: {
          select: { id: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, jobs });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    const job = await prisma.jobOpening.create({
      data: {
        title: data.title,
        department: data.department || "Academic",
        qualification: data.qualification || "",
        experience: data.experience || "",
        type: data.type || "FULL_TIME",
        vacancies: Number(data.vacancies) || 1,
        deadline: data.deadline ? new Date(data.deadline) : null,
        description: data.description || "",
        requirements: data.requirements || "",
        status: data.status || "OPEN",
      },
    });

    return NextResponse.json({ success: true, job });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
  }
}
