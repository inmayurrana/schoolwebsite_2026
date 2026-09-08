import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { logAuditAction } from "@/lib/audit";

export async function GET() {
  try {
    const achievements = await prisma.achievement.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, achievements });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch achievements" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    const achievement = await prisma.achievement.create({
      data: {
        studentName: data.studentName,
        grade: data.grade,
        title: data.title,
        category: data.category || "ACADEMIC",
        year: data.year || "2024-2025",
        rank: data.rank || "",
        description: data.description || "",
        photoUrl:
          data.photoUrl ||
          "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400",
        mediaType: data.mediaType || "IMAGE",
        videoUrl: data.videoUrl || null,
        isFeatured: Boolean(data.isFeatured),
      },
    });

    await logAuditAction({
      userId: user.id,
      userName: user.name || "Admin",
      action: "CREATE_ACHIEVEMENT",
      entity: "Achievement",
      entityId: achievement.id,
      details: `Created achievement award: "${achievement.title}" for ${achievement.studentName}`,
    });

    return NextResponse.json({ success: true, achievement });
  } catch (error: any) {
    console.error("Create achievement error:", error);
    return NextResponse.json({ error: "Failed to create achievement" }, { status: 500 });
  }
}
