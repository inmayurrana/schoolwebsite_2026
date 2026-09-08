import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { logAuditAction } from "@/lib/audit";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const notice = await prisma.notice.findUnique({ where: { id } });
    if (!notice) {
      return NextResponse.json({ error: "Notice not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, notice });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch notice" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();
    const { id } = await params;
    const data = await req.json();

    const existing = await prisma.notice.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Notice not found" }, { status: 404 });
    }

    const updated = await prisma.notice.update({
      where: { id },
      data: {
        text: data.text !== undefined ? data.text.trim() : undefined,
        link: data.link !== undefined ? data.link.trim() : undefined,
        badge: data.badge !== undefined ? data.badge.trim() : undefined,
        priority: data.priority !== undefined ? Number(data.priority) : undefined,
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : undefined,
      },
    });

    await logAuditAction({
      userId: user?.id,
      userName: user?.name || "Administrator",
      action: "UPDATE_NOTICE",
      entity: "Notice",
      entityId: id,
      details: `Updated notice: "${updated.text}"`,
    });

    return NextResponse.json({ success: true, notice: updated });
  } catch (error: any) {
    console.error("Update notice error:", error);
    return NextResponse.json({ error: error.message || "Failed to update notice" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();
    const { id } = await params;

    const existing = await prisma.notice.findUnique({ where: { id } });
    if (!existing) {
      // If already deleted or not found, treat as success so client can clean up UI
      return NextResponse.json({ success: true, message: "Notice already removed" });
    }

    await prisma.notice.delete({ where: { id } });

    await logAuditAction({
      userId: user?.id,
      userName: user?.name || "Administrator",
      action: "DELETE_NOTICE",
      entity: "Notice",
      entityId: id,
      details: `Deleted notice: "${existing.text}"`,
    });

    return NextResponse.json({ success: true, message: "Notice deleted successfully" });
  } catch (error: any) {
    console.error("Delete notice error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete notice" }, { status: 500 });
  }
}
