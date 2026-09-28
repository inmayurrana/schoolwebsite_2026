import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { logAuditAction } from "@/lib/audit";
import { appCache } from "@/lib/cache";
import { writeFaviconToPublic } from "@/lib/faviconGenerator";

export async function GET() {
  try {
    const rawSettings = await prisma.siteSetting.findMany();
    const settingsMap: Record<string, string> = {};
    if (Array.isArray(rawSettings)) {
      rawSettings.forEach((s) => {
        settingsMap[s.key] = s.value;
      });
    }

    const response = NextResponse.json({
      success: true,
      settings: rawSettings,
      settingsMap,
    });
    response.headers.set(
      "Cache-Control",
      "no-cache, no-store, must-revalidate"
    );
    return response;
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    const role = (user?.role || "") as string;
    if (!user || (role !== "SUPER_ADMIN" && role !== "ADMIN" && role !== "PRINCIPAL")) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { settings } = await req.json();

    if (Array.isArray(settings)) {
      let faviconChanged = false;
      for (const item of settings) {
        if (item.key.includes("favicon") || item.key === "site_favicon_url") {
          faviconChanged = true;
        }
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

      if (faviconChanged) {
        try {
          const allFaviconSettings = await prisma.siteSetting.findMany({
            where: {
              key: {
                in: [
                  "site_favicon_url",
                  "favicon_light_effect_enabled",
                  "favicon_border_color",
                  "favicon_border_width",
                  "favicon_light_style",
                  "favicon_glow_intensity",
                  "favicon_bg_color",
                  "favicon_shape",
                  "favicon_icon_scale",
                ],
              },
            },
          });
          const favMap: Record<string, string> = {};
          allFaviconSettings.forEach((s) => (favMap[s.key] = s.value));
          await writeFaviconToPublic({
            iconUrl: favMap["site_favicon_url"],
            lightEffectEnabled: favMap["favicon_light_effect_enabled"] !== "false",
            borderColor: favMap["favicon_border_color"] || "#F59E0B",
            borderWidth: favMap["favicon_border_width"] ? parseFloat(favMap["favicon_border_width"]) : 2.5,
            lightStyle: (favMap["favicon_light_style"] as any) || "glow",
            glowIntensity: (favMap["favicon_glow_intensity"] as any) || "vibrant",
            bgColor: favMap["favicon_bg_color"] || "#0A2540",
            shape: (favMap["favicon_shape"] as any) || "rounded",
            iconScale: favMap["favicon_icon_scale"] ? parseFloat(favMap["favicon_icon_scale"]) : 0.72,
          });
        } catch (favErr) {
          console.error("Failed to auto-write favicon to public:", favErr);
        }
      }
    }

    // Invalidate settings in cache immediately
    appCache.invalidate("settings");

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
