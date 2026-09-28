import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateFaviconBuffer } from "@/lib/faviconGenerator";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sizeParam = searchParams.get("size");
    const size = sizeParam ? parseInt(sizeParam, 10) : 64;

    // Load settings from db
    const settings = await prisma.siteSetting.findMany({
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
          ],
        },
      },
    });

    const settingsMap: Record<string, string> = {};
    settings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });

    const iconUrl = settingsMap["site_favicon_url"] || "/uploads/LOGO_c_72ead6e76f87.webp";
    const lightEffectEnabled = settingsMap["favicon_light_effect_enabled"] !== "false";
    const borderColor = settingsMap["favicon_border_color"] || "#F59E0B";
    const borderWidth = settingsMap["favicon_border_width"] ? parseFloat(settingsMap["favicon_border_width"]) : 2.5;
    const lightStyle = (settingsMap["favicon_light_style"] as any) || "glow";
    const glowIntensity = (settingsMap["favicon_glow_intensity"] as any) || "vibrant";
    const bgColor = settingsMap["favicon_bg_color"] || "#0A2540";
    const shape = (settingsMap["favicon_shape"] as any) || "rounded";

    const buffer = await generateFaviconBuffer({
      iconUrl,
      lightEffectEnabled,
      borderColor,
      borderWidth,
      lightStyle,
      glowIntensity,
      bgColor,
      shape,
      size,
    });

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=60, s-maxage=300",
      },
    });
  } catch (error: any) {
    console.error("Favicon route error:", error);
    return new NextResponse(null, { status: 500 });
  }
}
