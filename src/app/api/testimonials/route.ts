import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { appCache } from "@/lib/cache";
import {
  TestimonialItem,
  TestimonialsConfig,
  DEFAULT_TESTIMONIALS,
  DEFAULT_CONFIG,
} from "@/types/testimonials";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [rawTestimonials, rawConfig] = await Promise.all([
      prisma.siteSetting.findUnique({ where: { key: "testimonials_json" } }),
      prisma.siteSetting.findUnique({ where: { key: "testimonials_config_json" } }),
    ]);

    let testimonials: TestimonialItem[] = DEFAULT_TESTIMONIALS;
    if (rawTestimonials?.value) {
      try {
        const parsed = JSON.parse(rawTestimonials.value);
        if (Array.isArray(parsed) && parsed.length > 0) {
          testimonials = parsed;
        }
      } catch (_) {}
    }

    let config: TestimonialsConfig = DEFAULT_CONFIG;
    if (rawConfig?.value) {
      try {
        const parsed = JSON.parse(rawConfig.value);
        if (parsed && typeof parsed === "object") {
          config = { ...DEFAULT_CONFIG, ...parsed };
        }
      } catch (_) {}
    }

    const response = NextResponse.json({
      success: true,
      testimonials,
      config,
      timestamp: Date.now(),
    });

    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
    );

    return response;
  } catch (error: any) {
    console.error("Testimonials GET error:", error);
    return NextResponse.json({
      success: true,
      testimonials: DEFAULT_TESTIMONIALS,
      config: DEFAULT_CONFIG,
    });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized: Admin login required" }, { status: 401 });
    }

    const body = await req.json();
    const { testimonials, config } = body;

    if (!Array.isArray(testimonials)) {
      return NextResponse.json({ error: "Testimonials must be an array" }, { status: 400 });
    }

    // Save testimonials
    await prisma.siteSetting.upsert({
      where: { key: "testimonials_json" },
      update: {
        value: JSON.stringify(testimonials),
      },
      create: {
        key: "testimonials_json",
        value: JSON.stringify(testimonials),
        category: "GENERAL",
        description: "Parent & Alumni Voices testimonials data array",
      },
    });

    // Save config & UI effects
    if (config && typeof config === "object") {
      await prisma.siteSetting.upsert({
        where: { key: "testimonials_config_json" },
        update: {
          value: JSON.stringify(config),
        },
        create: {
          key: "testimonials_config_json",
          value: JSON.stringify(config),
          category: "GENERAL",
          description: "Parent & Alumni Voices section settings & UI effects",
        },
      });
    }

    // Invalidate RAM cache
    appCache.invalidateAll();

    // Audit Log
    try {
      await prisma.auditLog.create({
        data: {
          userId: user.id || null,
          userName: user.name || "Administrator",
          action: "UPDATE_TESTIMONIALS",
          entity: "Setting",
          details: `Updated ${testimonials.length} Parent & Alumni Voices testimonials and UI effects.`,
        },
      });
    } catch (_) {}

    return NextResponse.json({
      success: true,
      message: "Parent & Alumni Voices updated live on website.",
      testimonials,
      config,
      timestamp: Date.now(),
    });
  } catch (error: any) {
    console.error("Testimonials POST error:", error);
    return NextResponse.json({ error: error.message || "Failed to update testimonials" }, { status: 500 });
  }
}
