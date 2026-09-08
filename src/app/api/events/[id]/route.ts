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

    const updated = await prisma.event.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        venue: body.venue,
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        endDate: body.endDate ? new Date(body.endDate) : null,
        category: body.category,
        coverImage: body.coverImage,
        mediaType: body.mediaType || "IMAGE",
        videoUrl: body.videoUrl !== undefined ? body.videoUrl : undefined,
        isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : undefined,
      },
    });

    await logAuditAction({
      userId: user.id,
      userName: user.name || "Admin",
      action: "UPDATE_EVENT",
      entity: "Event",
      entityId: id,
      details: `Updated event: "${updated.title}"`,
    });

    return NextResponse.json({ success: true, event: updated });
  } catch (error: any) {
    console.error("Update event error:", error);
    return NextResponse.json({ error: error.message || "Failed to update event" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return PUT(req, { params });
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
    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    await prisma.event.delete({ where: { id } });

    await logAuditAction({
      userId: user.id,
      userName: user.name || "Admin",
      action: "DELETE_EVENT",
      entity: "Event",
      entityId: id,
      details: `Deleted event: "${existing.title}"`,
    });

    return NextResponse.json({ success: true, message: "Event deleted successfully" });
  } catch (error: any) {
    console.error("Delete event error:", error);
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}
