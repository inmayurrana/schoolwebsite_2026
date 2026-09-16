import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await req.json();

    const updated = await prisma.jobApplication.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, application: updated });
  } catch (error: any) {
    console.error("Application status PATCH error:", error);
    return NextResponse.json({ error: error.message || "Failed to update application status" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.jobApplication.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Application DELETE error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete application" }, { status: 500 });
  }
}
