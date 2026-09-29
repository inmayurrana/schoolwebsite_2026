import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { emailService } from "@/lib/email/emailService";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const config = await emailService.getConfig(false);
    return NextResponse.json({ success: true, config });
  } catch (error: any) {
    console.error("GET email config error:", error);
    return NextResponse.json({ error: error.message || "Failed to load config" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const updated = await emailService.saveConfig(body, user.name || user.email);

    return NextResponse.json({
      success: true,
      message: "Email configuration saved successfully",
      config: updated,
    });
  } catch (error: any) {
    console.error("POST email config error:", error);
    return NextResponse.json({ error: error.message || "Failed to save config" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { isEnabled } = await req.json();
    const updated = await emailService.saveConfig({ isEnabled }, user.name || user.email);

    return NextResponse.json({
      success: true,
      message: isEnabled ? "Email delivery enabled" : "Email delivery paused",
      isEnabled: updated.isEnabled,
      config: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to toggle email delivery" }, { status: 500 });
  }
}
