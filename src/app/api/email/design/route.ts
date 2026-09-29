import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let setting = await (prisma as any).emailDesignSetting.findFirst();
    if (!setting) {
      setting = await (prisma as any).emailDesignSetting.create({
        data: {
          schoolName: "Cambridge International School, Mandi",
          schoolLogo: "/images/crest.png",
          primaryColor: "#0A2540",
          secondaryColor: "#0066FF",
          headerText: "Cambridge International School, Mandi",
          footerText: "This is an automated notification from Cambridge International School CMS.",
          address: "Lunapani, Tehsil Balh, Distt Mandi, H.P. - 175021",
          phone: "+91 98050 39389",
          website: "https://cismandi.edu.in",
          socialLinksJson: "{}",
        },
      });
    }

    return NextResponse.json({ success: true, setting });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load email design settings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const existing = await (prisma as any).emailDesignSetting.findFirst();

    const payload = {
      schoolName: body.schoolName || "Cambridge International School, Mandi",
      schoolLogo: body.schoolLogo || "/images/crest.png",
      primaryColor: body.primaryColor || "#0A2540",
      secondaryColor: body.secondaryColor || "#0066FF",
      headerText: body.headerText || null,
      footerText: body.footerText || null,
      address: body.address || null,
      phone: body.phone || null,
      website: body.website || null,
      socialLinksJson: body.socialLinksJson || "{}",
    };

    let updated;
    if (existing) {
      updated = await (prisma as any).emailDesignSetting.update({
        where: { id: existing.id },
        data: payload,
      });
    } else {
      updated = await (prisma as any).emailDesignSetting.create({
        data: payload,
      });
    }

    try {
      await prisma.auditLog.create({
        data: {
          userName: user.name || user.email,
          action: "UPDATE_EMAIL_DESIGN",
          entity: "EmailDesignSetting",
          entityId: updated.id,
          details: `Updated email branding and design tokens`,
        },
      });
    } catch (_) {}

    return NextResponse.json({ success: true, setting: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to save design settings" }, { status: 500 });
  }
}
