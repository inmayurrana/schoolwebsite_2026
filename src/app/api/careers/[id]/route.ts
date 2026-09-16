import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await req.json();

    const updated = await prisma.jobOpening.update({
      where: { id },
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

    return NextResponse.json({ success: true, job: updated });
  } catch (error: any) {
    console.error("Job PUT error:", error);
    return NextResponse.json({ error: error.message || "Failed to update job opening" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.jobOpening.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Job DELETE error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete job opening" }, { status: 500 });
  }
}
