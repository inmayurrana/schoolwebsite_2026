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

    const updated = await prisma.galleryAlbum.update({
      where: { id },
      data: {
        title: body.title,
        category: body.category,
        description: body.description,
        coverImage: body.coverImage,
        isFeatured: body.isFeatured !== undefined ? Boolean(body.isFeatured) : undefined,
      },
      include: { items: true },
    });

    await logAuditAction({
      userId: user.id,
      userName: user.name || "Admin",
      action: "UPDATE_ALBUM",
      entity: "GalleryAlbum",
      entityId: id,
      details: `Updated gallery album: "${updated.title}"`,
    });

    return NextResponse.json({ success: true, album: updated });
  } catch (error: any) {
    console.error("Update album error:", error);
    return NextResponse.json({ error: "Failed to update album" }, { status: 500 });
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
    const existing = await prisma.galleryAlbum.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Album not found" }, { status: 404 });
    }

    await prisma.galleryAlbum.delete({ where: { id } });

    await logAuditAction({
      userId: user.id,
      userName: user.name || "Admin",
      action: "DELETE_ALBUM",
      entity: "GalleryAlbum",
      entityId: id,
      details: `Deleted gallery album: "${existing.title}"`,
    });

    return NextResponse.json({ success: true, message: "Album deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to delete album" }, { status: 500 });
  }
}
