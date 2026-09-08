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
    const article = await prisma.news.findUnique({ where: { id } });
    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, article });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch article" }, { status: 500 });
  }
}

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

    const updated = await prisma.news.update({
      where: { id },
      data: {
        title: body.title,
        excerpt: body.excerpt,
        content: body.content,
        coverImage: body.coverImage,
        mediaType: body.mediaType || "IMAGE",
        videoUrl: body.videoUrl !== undefined ? body.videoUrl : undefined,
        category: body.category,
        isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : undefined,
        isFeatured: body.isFeatured !== undefined ? Boolean(body.isFeatured) : undefined,
      },
    });

    await logAuditAction({
      userId: user.id,
      userName: user.name || "Admin",
      action: "UPDATE_NEWS",
      entity: "News",
      entityId: id,
      details: `Updated news article: "${updated.title}" (${updated.category}, Media: ${updated.mediaType})`,
    });

    return NextResponse.json({ success: true, news: updated });
  } catch (error: any) {
    console.error("Update news error:", error);
    return NextResponse.json({ error: error.message || "Failed to update news" }, { status: 500 });
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
    const existing = await prisma.news.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    await prisma.news.delete({ where: { id } });

    await logAuditAction({
      userId: user.id,
      userName: user.name || "Admin",
      action: "DELETE_NEWS",
      entity: "News",
      entityId: id,
      details: `Deleted news article: "${existing.title}"`,
    });

    return NextResponse.json({ success: true, message: "Article deleted successfully from database" });
  } catch (error: any) {
    console.error("Delete news error:", error);
    return NextResponse.json({ error: "Failed to delete news article" }, { status: 500 });
  }
}
