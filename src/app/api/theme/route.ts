import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    let theme = await prisma.themeConfig.findFirst({
      where: { isActive: true },
    });

    if (!theme) {
      theme = await prisma.themeConfig.create({
        data: {
          name: "Cambridge Royal Gold & Deep Navy",
          primaryColor: "#0A2540",
          secondaryColor: "#0066FF",
          accentColor: "#F4B400",
          darkBgColor: "#030816",
          cardBgColor: "#0f172a",
          textColor: "#FFFFFF",
          glassOpacity: 0.85,
          glowIntensity: 1.0,
          fontFamily: "Inter",
          borderRadius: "1.5rem",
          isActive: true,
        },
      });
    }

    return NextResponse.json({ theme });
  } catch (error: any) {
    console.error("Theme GET error:", error);
    return NextResponse.json({ error: "Failed to fetch theme" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireAuth();
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await req.json();

    const existing = await prisma.themeConfig.findFirst({
      where: { isActive: true },
    });

    let theme;
    if (existing) {
      theme = await prisma.themeConfig.update({
        where: { id: existing.id },
        data: {
          name: data.name || existing.name,
          primaryColor: data.primaryColor || existing.primaryColor,
          secondaryColor: data.secondaryColor || existing.secondaryColor,
          accentColor: data.accentColor || existing.accentColor,
          darkBgColor: data.darkBgColor || existing.darkBgColor,
          cardBgColor: data.cardBgColor || existing.cardBgColor,
          textColor: data.textColor || existing.textColor,
          glassOpacity: data.glassOpacity !== undefined ? parseFloat(data.glassOpacity) : existing.glassOpacity,
          glowIntensity: data.glowIntensity !== undefined ? parseFloat(data.glowIntensity) : existing.glowIntensity,
          fontFamily: data.fontFamily || existing.fontFamily,
          borderRadius: data.borderRadius || existing.borderRadius,
          logoMode: data.logoMode || existing.logoMode,
          logoImageUrl: data.logoImageUrl !== undefined ? data.logoImageUrl : existing.logoImageUrl,
          logoHeight: data.logoHeight !== undefined ? parseInt(data.logoHeight) : existing.logoHeight,
          customCss: data.customCss !== undefined ? data.customCss : existing.customCss,
          headerButtonsJson: data.headerButtonsJson !== undefined ? data.headerButtonsJson : existing.headerButtonsJson,
        },
      });
    } else {
      theme = await prisma.themeConfig.create({
        data: {
          name: data.name || "Custom Theme",
          primaryColor: data.primaryColor || "#0A2540",
          secondaryColor: data.secondaryColor || "#0066FF",
          accentColor: data.accentColor || "#F4B400",
          darkBgColor: data.darkBgColor || "#030816",
          cardBgColor: data.cardBgColor || "#0f172a",
          textColor: data.textColor || "#FFFFFF",
          glassOpacity: data.glassOpacity !== undefined ? parseFloat(data.glassOpacity) : 0.85,
          glowIntensity: data.glowIntensity !== undefined ? parseFloat(data.glowIntensity) : 1.0,
          fontFamily: data.fontFamily || "Inter",
          borderRadius: data.borderRadius || "1.5rem",
          logoMode: data.logoMode || "TEXT_AND_ICON",
          logoImageUrl: data.logoImageUrl || null,
          logoHeight: data.logoHeight ? parseInt(data.logoHeight) : 48,
          customCss: data.customCss || null,
          headerButtonsJson: data.headerButtonsJson || null,
          isActive: true,
        },
      });
    }

    // Record audit log entry in database
    await prisma.auditLog.create({
      data: {
        userId: auth.id,
        userName: auth.name || "Administrator",
        action: "THEME_UPDATE",
        entity: "ThemeConfig",
        entityId: theme.id,
        details: `Saved theme and visual configuration "${theme.name}" in database. Primary: ${theme.primaryColor}, Logo: ${theme.logoMode}.`,
      },
    });

    return NextResponse.json({ success: true, theme });
  } catch (error: any) {
    console.error("Theme POST error:", error);
    return NextResponse.json({ error: error.message || "Failed to update theme" }, { status: 500 });
  }
}
