import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

const DEFAULT_EMAIL_ALERTS = {
  alert_new_contact: true,
  alert_new_admission: true,
  alert_new_career: true,
  alert_new_event_rsvp: true,
  alert_new_feedback: true,
  alert_system_error: true,
  alert_backup_failure: true,
  alert_delivery_failure: true,
  alert_recipients: "admin@cismandi.edu.in, principal@cismandi.edu.in",
  alert_digest_mode: "INSTANT", // INSTANT, HOURLY, DAILY
};

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const setting = await prisma.siteSetting.findUnique({
      where: { key: "admin_email_alerts" },
    });

    let alerts = DEFAULT_EMAIL_ALERTS;
    if (setting?.value) {
      try {
        alerts = { ...DEFAULT_EMAIL_ALERTS, ...JSON.parse(setting.value) };
      } catch (_) {}
    }

    return NextResponse.json({ success: true, alerts });
  } catch (error: any) {
    console.error("GET email alerts error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to load email alerts" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const updatedAlerts = { ...DEFAULT_EMAIL_ALERTS, ...body };

    await prisma.siteSetting.upsert({
      where: { key: "admin_email_alerts" },
      update: {
        value: JSON.stringify(updatedAlerts),
        category: "COMMUNICATIONS",
        description: "Administrative email alert triggers and notification preferences",
      },
      create: {
        key: "admin_email_alerts",
        value: JSON.stringify(updatedAlerts),
        category: "COMMUNICATIONS",
        description: "Administrative email alert triggers and notification preferences",
      },
    });

    try {
      await prisma.auditLog.create({
        data: {
          userName: user.name || user.email,
          action: "UPDATE_EMAIL_ALERTS",
          entity: "SiteSetting",
          entityId: "admin_email_alerts",
          details: `Updated Administrative Email Alerts and Notification Triggers`,
        },
      });
    } catch (_) {}

    return NextResponse.json({ success: true, alerts: updatedAlerts });
  } catch (error: any) {
    console.error("POST email alerts error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save email alerts" },
      { status: 500 }
    );
  }
}
