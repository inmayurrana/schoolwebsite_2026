import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { appCache } from "@/lib/cache";

export const dynamic = "force-dynamic";

interface UiEffectsConfig {
  spotlightCards: boolean;
  magneticButtons: boolean;
  imageZoom: boolean;
  floatingHeader: boolean;
  slidingTabs: boolean;
  readingProgressBar: boolean;
  marqueeTicker: boolean;
  kineticTypography: boolean;
  spotlightGlowColor: string;
  photoLightBorderEffect: boolean;
  photoLightBorderMode: "spectrum" | "cyanGold" | "aurora" | "sunset";
}

const DEFAULT_UI_EFFECTS: UiEffectsConfig = {
  spotlightCards: true,
  magneticButtons: true,
  imageZoom: true,
  floatingHeader: true,
  slidingTabs: true,
  readingProgressBar: true,
  marqueeTicker: true,
  kineticTypography: true,
  spotlightGlowColor: "rgba(245, 158, 11, 0.22)",
  photoLightBorderEffect: true,
  photoLightBorderMode: "cyanGold",
};

export async function GET() {
  try {
    const cached = await appCache.getOrSet(
      "ui_effects_config",
      async () => {
        const setting = await prisma.siteSetting.findUnique({
          where: { key: "ui_effects_config" },
        });

        if (!setting || !setting.value) {
          return DEFAULT_UI_EFFECTS;
        }

        try {
          const parsed = JSON.parse(setting.value);
          // If nested config was saved, flatten it
          const raw = parsed.config ? parsed.config : parsed;
          return { ...DEFAULT_UI_EFFECTS, ...raw };
        } catch {
          return DEFAULT_UI_EFFECTS;
        }
      },
      300
    );

    const response = NextResponse.json({
      success: true,
      config: cached,
      effects: cached,
    });
    response.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    return response;
  } catch (error: any) {
    console.error("UI effects GET error:", error);
    return NextResponse.json({
      success: true,
      config: DEFAULT_UI_EFFECTS,
      effects: DEFAULT_UI_EFFECTS,
    });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const incoming = body.config || body.effects || body;
    const effectsData = { ...DEFAULT_UI_EFFECTS, ...incoming };

    const valueStr = JSON.stringify(effectsData);

    await prisma.siteSetting.upsert({
      where: { key: "ui_effects_config" },
      update: { value: valueStr },
      create: {
        key: "ui_effects_config",
        value: valueStr,
        category: "THEME",
        description: "Squarespace-style modern UI effects and motion configuration",
      },
    });

    appCache.invalidate("ui_effects_config");

    return NextResponse.json({
      success: true,
      config: effectsData,
      effects: effectsData,
    });
  } catch (error: any) {
    console.error("UI effects POST error:", error);
    return NextResponse.json({ success: false, error: "Failed to update UI effects" }, { status: 500 });
  }
}
