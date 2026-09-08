import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { logAuditAction } from "@/lib/audit";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "true";

    let notices = await prisma.notice.findMany({
      where: all ? undefined : { isActive: true },
      orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
    });

    if (notices.length === 0) {
      const defaults = [
        { text: "🌟 Admissions Open for Session 2025-2026: Nursery to Grade XI (Science, Commerce, Humanities)", link: "/admissions/apply", badge: "Admissions 2025-26", priority: 50 },
        { text: "🏆 Cambridge Mandi Robotics Team Wins National STEM Olympiad 2025 Gold Medal in New Delhi", link: "/news", badge: "Olympiad & Laurels", priority: 40 },
        { text: "📅 Annual Cultural Extravaganza 'Udaan 2025' scheduled for next month — Book your visitor pass", link: "/events", badge: "Events", priority: 30 },
        { text: "📄 CBSE Mandatory Public Disclosure SARAS Documents for Session 2025-26 updated", link: "/mandatory-disclosure", badge: "CBSE", priority: 20 },
        { text: "🏅 100% CBSE Class X & XII Board Exam Pass Rate with 42 State Distinctions", link: "/results", badge: "Academics", priority: 10 },
      ];

      for (const d of defaults) {
        await prisma.notice.create({ data: d });
      }

      notices = await prisma.notice.findMany({
        where: all ? undefined : { isActive: true },
        orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
      });
    }

    return NextResponse.json({ success: true, notices });
  } catch (error: any) {
    console.error("Fetch notices error:", error);
    return NextResponse.json({ error: "Failed to fetch notices" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    const data = await req.json();

    if (!data.text || !data.text.trim()) {
      return NextResponse.json({ error: "Notice text is required" }, { status: 400 });
    }

    const notice = await prisma.notice.create({
      data: {
        text: data.text.trim(),
        link: data.link ? data.link.trim() : "/news",
        badge: data.badge ? data.badge.trim() : "Notice Board",
        priority: Number(data.priority) || 0,
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
      },
    });

    await logAuditAction({
      userId: user?.id,
      userName: user?.name || "Administrator",
      action: "CREATE_NOTICE",
      entity: "Notice",
      entityId: notice.id,
      details: `Created notice alert: "${notice.text}" -> ${notice.link}`,
    });

    return NextResponse.json({ success: true, notice });
  } catch (error: any) {
    console.error("Create notice error:", error);
    return NextResponse.json({ error: error.message || "Failed to create notice" }, { status: 500 });
  }
}
