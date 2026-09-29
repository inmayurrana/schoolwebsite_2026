import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { emailService } from "@/lib/email/emailService";

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { to, subject, message } = await req.json();

    if (!to || !to.includes("@")) {
      return NextResponse.json({ error: "A valid recipient email is required" }, { status: 400 });
    }

    const result = await emailService.sendTestEmail(
      to.trim(),
      subject || "Website Email Delivery Test",
      message || "This is a test email sent from the Cambridge International School CMS."
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Test send error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to send test email",
        provider: "Unknown",
      },
      { status: 500 }
    );
  }
}
