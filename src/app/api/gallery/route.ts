import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const albums = await prisma.galleryAlbum.findMany({
      include: {
        items: {
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, albums });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch gallery" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    if (!data.title) {
      return NextResponse.json({ error: "Album title is required" }, { status: 400 });
    }

    const slug = (data.title as string)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") + "-" + Date.now().toString().slice(-4);

    const album = await prisma.galleryAlbum.create({
      data: {
        title: data.title,
        slug,
        category: data.category || "Campus",
        description: data.description || "",
        coverImage: data.coverImage || "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800",
        isFeatured: Boolean(data.isFeatured),
      },
    });

    // If items provided
    if (data.items && Array.isArray(data.items) && data.items.length > 0) {
      for (let i = 0; i < data.items.length; i++) {
        const item = data.items[i];
        await prisma.galleryItem.create({
          data: {
            albumId: album.id,
            type: item.type || "IMAGE",
            url: item.url,
            title: item.title || "",
            caption: item.caption || "",
            sortOrder: i + 1,
          },
        });
      }
    }

    return NextResponse.json({ success: true, album });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to create album" }, { status: 500 });
  }
}
