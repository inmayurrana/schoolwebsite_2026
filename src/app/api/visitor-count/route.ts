import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Active visitor session tracking in memory
// Using globalThis to preserve state across dev reloads
const globalForVisitors = globalThis as unknown as {
  activeVisitorsMap?: Map<string, number>;
};

const activeVisitorsMap =
  globalForVisitors.activeVisitorsMap || new Map<string, number>();

if (process.env.NODE_ENV !== "production") {
  globalForVisitors.activeVisitorsMap = activeVisitorsMap;
}

const ACTIVE_WINDOW_MS = 2 * 60 * 1000; // 2 minutes active window

function cleanupAndCount(clientKey?: string): number {
  const now = Date.now();
  const cutoff = now - ACTIVE_WINDOW_MS;

  if (clientKey) {
    activeVisitorsMap.set(clientKey, now);
  }

  for (const [id, lastSeen] of activeVisitorsMap.entries()) {
    if (lastSeen < cutoff) {
      activeVisitorsMap.delete(id);
    }
  }

  return Math.max(1, activeVisitorsMap.size);
}

function getClientKey(req: Request, explicitId?: string): string {
  if (explicitId && typeof explicitId === "string" && explicitId.trim().length > 0) {
    return explicitId.trim();
  }
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";
  const userAgent = req.headers.get("user-agent") || "unknown";
  return `${ip}_${userAgent.slice(0, 30)}`;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const cid = searchParams.get("cid") || undefined;
    const clientKey = getClientKey(req, cid);
    const liveOnline = cleanupAndCount(clientKey);

    const todayStr = new Date().toISOString().split("T")[0];

    const [totalSetting, todayCountSetting, todayDateSetting] = await Promise.all([
      prisma.siteSetting.findUnique({ where: { key: "actual_visitor_count" } }),
      prisma.siteSetting.findUnique({ where: { key: "actual_today_count" } }),
      prisma.siteSetting.findUnique({ where: { key: "actual_today_date" } }),
    ]);

    const totalVisitors = totalSetting ? parseInt(totalSetting.value, 10) || 1 : 1;
    let todayVisitors = 1;

    if (todayDateSetting && todayDateSetting.value === todayStr) {
      todayVisitors = todayCountSetting ? parseInt(todayCountSetting.value, 10) || 1 : 1;
    } else {
      todayVisitors = 1;
    }

    return NextResponse.json({
      success: true,
      totalVisitors,
      todayVisitors,
      liveOnline,
    });
  } catch (error: any) {
    console.error("Visitor count GET error:", error);
    return NextResponse.json({
      success: true,
      totalVisitors: 1,
      todayVisitors: 1,
      liveOnline: 1,
    });
  }
}

export async function POST(req: Request) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      // empty body is fine
    }

    const clientKey = getClientKey(req, body.clientId);
    const liveOnline = cleanupAndCount(clientKey);

    const todayStr = new Date().toISOString().split("T")[0];

    // Read current actual visit metrics
    const [totalSetting, todayCountSetting, todayDateSetting] = await Promise.all([
      prisma.siteSetting.findUnique({ where: { key: "actual_visitor_count" } }),
      prisma.siteSetting.findUnique({ where: { key: "actual_today_count" } }),
      prisma.siteSetting.findUnique({ where: { key: "actual_today_date" } }),
    ]);

    const currentTotal = totalSetting ? parseInt(totalSetting.value, 10) || 1 : 1;
    const newTotal = currentTotal + 1;

    let newToday = 1;
    if (todayDateSetting && todayDateSetting.value === todayStr) {
      const currentToday = todayCountSetting ? parseInt(todayCountSetting.value, 10) || 1 : 1;
      newToday = currentToday + 1;
    }

    await prisma.$transaction([
      prisma.siteSetting.upsert({
        where: { key: "actual_visitor_count" },
        update: { value: newTotal.toString() },
        create: {
          key: "actual_visitor_count",
          value: newTotal.toString(),
          category: "GENERAL",
          description: "Actual verified total website visitors",
        },
      }),
      prisma.siteSetting.upsert({
        where: { key: "actual_today_count" },
        update: { value: newToday.toString() },
        create: {
          key: "actual_today_count",
          value: newToday.toString(),
          category: "GENERAL",
          description: "Actual verified today website visitors",
        },
      }),
      prisma.siteSetting.upsert({
        where: { key: "actual_today_date" },
        update: { value: todayStr },
        create: {
          key: "actual_today_date",
          value: todayStr,
          category: "GENERAL",
          description: "Date of today visitor count",
        },
      }),
      prisma.siteSetting.upsert({
        where: { key: "visitor_count" },
        update: { value: newTotal.toString() },
        create: {
          key: "visitor_count",
          value: newTotal.toString(),
          category: "GENERAL",
          description: "Total website visitors counter",
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      totalVisitors: newTotal,
      todayVisitors: newToday,
      liveOnline,
    });
  } catch (error: any) {
    console.error("Visitor count POST error:", error);
    return NextResponse.json({ success: false, error: "Failed to increment" }, { status: 500 });
  }
}
