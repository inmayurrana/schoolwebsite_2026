import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { logAuditAction } from "@/lib/audit";

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { startDate: "asc" },
    });
    return NextResponse.json({ success: true, events });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    if (!data.title || !data.startDate) {
      return NextResponse.json({ error: "Title and startDate are required" }, { status: 400 });
    }

    const slug =
      (data.title as string)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") +
      "-" +
      Date.now().toString().slice(-4);

    const event = await prisma.event.create({
      data: {
        title: data.title,
        slug,
        description: data.description || "",
        venue: data.venue || "Main Auditorium, CIS Mandi",
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        category: data.category || "Academic",
        coverImage:
          data.coverImage ||
          "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800",
        mediaType: data.mediaType || "IMAGE",
        videoUrl: data.videoUrl || null,
        isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
      },
    });

    await logAuditAction({
      userId: user.id,
      userName: user.name || "Admin",
      action: "CREATE_EVENT",
      entity: "Event",
      entityId: event.id,
      details: `Created event: "${event.title}" (${event.category})`,
    });

    return NextResponse.json({ success: true, event });
  } catch (error: any) {
    console.error("Create event error:", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
