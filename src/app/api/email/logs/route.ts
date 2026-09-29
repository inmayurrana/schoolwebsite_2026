import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const query = searchParams.get("q");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "25", 10);
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (query) {
      where.OR = [
        { recipient: { contains: query } },
        { subject: { contains: query } },
        { submissionId: { contains: query } },
        { formSlug: { contains: query } },
      ];
    }

    const [logs, totalCount] = await Promise.all([
      (prisma as any).emailLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      (prisma as any).emailLog.count({ where }),
    ]);

    // Analytics calculation
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalSent, totalFailed, totalQueued, sentToday, sentThisMonth] = await Promise.all([
      (prisma as any).emailLog.count({ where: { status: "SENT" } }),
      (prisma as any).emailLog.count({ where: { status: "FAILED" } }),
      (prisma as any).emailLog.count({
        where: { status: { in: ["QUEUED", "SENDING", "RETRYING"] } },
      }),
      (prisma as any).emailLog.count({
        where: { status: "SENT", createdAt: { gte: startOfToday } },
      }),
      (prisma as any).emailLog.count({
        where: { status: "SENT", createdAt: { gte: startOfMonth } },
      }),
    ]);

    return NextResponse.json({
      success: true,
      logs,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit) || 1,
      },
      stats: {
        totalSent,
        totalFailed,
        totalQueued,
        sentToday,
        sentThisMonth,
      },
    });
  } catch (error: any) {
    console.error("GET email logs error:", error);
    return NextResponse.json({ error: error.message || "Failed to load logs" }, { status: 500 });
  }
}
