import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { logAuditAction } from "@/lib/audit";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const featuredOnly = searchParams.get("featured") === "true";

    const where: any = {};
    if (category && category !== "ALL") where.category = category;
    if (featuredOnly) where.isFeatured = true;

    const news = await prisma.news.findMany({
      where,
      orderBy: { publishedAt: "desc" },
    });

    return NextResponse.json({ success: true, news });
  } catch (error: any) {
    console.error("Fetch news error:", error);
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    if (!data.title || !data.content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    const slug =
      (data.title as string)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") +
      "-" +
      Date.now().toString().slice(-4);

    const news = await prisma.news.create({
      data: {
        title: data.title,
        slug,
        excerpt: data.excerpt || data.title.substring(0, 150),
        content: data.content,
        coverImage:
          data.coverImage ||
          "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800",
        mediaType: data.mediaType || "IMAGE",
        videoUrl: data.videoUrl || null,
        category: data.category || "Announcements",
        isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
        isFeatured: Boolean(data.isFeatured),
        author: user.name || "Admin Office",
      },
    });

    await logAuditAction({
      userId: user.id,
      userName: user.name || "Admin",
      action: "CREATE_NEWS",
      entity: "News",
      entityId: news.id,
      details: `Published news article: "${news.title}" (${news.category}, Media: ${news.mediaType})`,
    });

    return NextResponse.json({ success: true, news });
  } catch (error: any) {
    console.error("Create news error:", error);
    return NextResponse.json({ error: "Failed to create news" }, { status: 500 });
  }
}
