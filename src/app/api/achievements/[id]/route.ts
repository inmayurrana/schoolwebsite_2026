import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { logAuditAction } from "@/lib/audit";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const updated = await prisma.achievement.update({
      where: { id },
      data: {
        studentName: body.studentName,
        grade: body.grade,
        title: body.title,
        category: body.category,
        year: body.year,
        rank: body.rank,
        description: body.description,
        photoUrl: body.photoUrl,
        mediaType: body.mediaType || "IMAGE",
        videoUrl: body.videoUrl !== undefined ? body.videoUrl : undefined,
        isFeatured: body.isFeatured !== undefined ? Boolean(body.isFeatured) : undefined,
      },
    });

    await logAuditAction({
      userId: user.id,
      userName: user.name || "Admin",
      action: "UPDATE_ACHIEVEMENT",
      entity: "Achievement",
      entityId: id,
      details: `Updated achievement: "${updated.title}" for ${updated.studentName}`,
    });

    return NextResponse.json({ success: true, achievement: updated });
  } catch (error: any) {
    console.error("Update achievement error:", error);
    return NextResponse.json({ error: "Failed to update achievement" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.achievement.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Achievement not found" }, { status: 404 });
    }

    await prisma.achievement.delete({ where: { id } });

    await logAuditAction({
      userId: user.id,
      userName: user.name || "Admin",
      action: "DELETE_ACHIEVEMENT",
      entity: "Achievement",
      entityId: id,
      details: `Deleted achievement: "${existing.title}" for ${existing.studentName}`,
    });

    return NextResponse.json({ success: true, message: "Achievement deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to delete achievement" }, { status: 500 });
  }
}
