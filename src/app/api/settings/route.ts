import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { logAuditAction } from "@/lib/audit";

export async function GET() {
  try {
    const settings = await prisma.siteSetting.findMany();
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== "SUPER_ADMIN" && user.role !== "ADMIN" && user.role !== "PRINCIPAL")) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { settings } = await req.json();

    if (Array.isArray(settings)) {
      for (const item of settings) {
        await prisma.siteSetting.upsert({
          where: { key: item.key },
          update: { value: item.value },
          create: {
            key: item.key,
            value: item.value,
            category: item.category || "GENERAL",
            description: item.description || "",
          },
        });
      }
    }

    await logAuditAction({
      userId: user.id,
      userName: user.name,
      action: "UPDATE_SITE_SETTINGS",
      entity: "SiteSetting",
      details: "Updated site configurations",
    });

    return NextResponse.json({ success: true, message: "Settings updated" });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
