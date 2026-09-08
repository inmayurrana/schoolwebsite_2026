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

    const updated = await prisma.document.update({
      where: { id },
      data: {
        title: body.title,
        category: body.category,
        docNumber: body.docNumber,
        fileUrl: body.fileUrl,
        fileSize: body.fileSize,
        targetAudience: body.targetAudience,
        isPublic: body.isPublic !== undefined ? Boolean(body.isPublic) : undefined,
      },
    });

    await logAuditAction({
      userId: user.id,
      userName: user.name || "Admin",
      action: "UPDATE_DOCUMENT",
      entity: "Document",
      entityId: id,
      details: `Updated document: "${updated.title}" (${updated.category})`,
    });

    return NextResponse.json({ success: true, document: updated });
  } catch (error: any) {
    console.error("Update document error:", error);
    return NextResponse.json({ error: "Failed to update document" }, { status: 500 });
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
    const existing = await prisma.document.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    await prisma.document.delete({ where: { id } });

    await logAuditAction({
      userId: user.id,
      userName: user.name || "Admin",
      action: "DELETE_DOCUMENT",
      entity: "Document",
      entityId: id,
      details: `Deleted document: "${existing.title}"`,
    });

    return NextResponse.json({ success: true, message: "Document deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to delete document" }, { status: 500 });
  }
}
