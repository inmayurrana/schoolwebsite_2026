import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const jobs = await prisma.jobOpening.findMany({
      include: {
        applications: {
          select: { id: true, applicantName: true, status: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, jobs });
  } catch (error: any) {
    console.error("Failed to fetch jobs:", error);
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.title) {
      return NextResponse.json({ error: "Job title is required" }, { status: 400 });
    }

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
    console.error("Job POST error:", error);
    return NextResponse.json({ error: error.message || "Failed to create job opening" }, { status: 500 });
  }
}
