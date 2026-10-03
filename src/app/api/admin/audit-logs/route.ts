import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const take = Math.min(Math.max(parseInt(searchParams.get("take") || "100", 10), 10), 300);
    const action = searchParams.get("action");
    const entity = searchParams.get("entity");
    const search = searchParams.get("search");

    const where: any = {};
    if (action && action !== "ALL") {
      where.action = action;
    }
    if (entity && entity !== "ALL") {
      where.entity = entity;
    }
    if (search) {
      where.OR = [
        { userName: { contains: search } },
        { action: { contains: search } },
        { entity: { contains: search } },
        { details: { contains: search } },
        { ipAddress: { contains: search } },
      ];
    }

    const logs = await prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            avatar: true,
            department: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      logs,
      count: logs.length,
    });
  } catch (error: any) {
    console.error("Audit logs API error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch audit logs" }, { status: 500 });
  }
}
