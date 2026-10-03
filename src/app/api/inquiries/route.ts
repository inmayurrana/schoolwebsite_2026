import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { logAuditAction, resolveRealClientIp } from "@/lib/audit";
import { emailService } from "@/lib/email/emailService";

// Public: Submit inquiry
export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.name || !data.email || !data.phone) {
      return NextResponse.json({ error: "Name, email, and phone are required" }, { status: 400 });
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
        studentGrade: data.studentGrade || null,
        inquiryType: data.inquiryType || "GENERAL",
        subject: data.subject || "General Inquiry",
        message: data.message || "Request for information",
        status: "NEW",
      },
    });

    const clientIp = await resolveRealClientIp(req);

    // 1. Audit Log inquiry submission with real public IP
    await logAuditAction({
      req,
      userName: inquiry.name,
      action: "SUBMIT_INQUIRY",
      entity: "Inquiry",
      entityId: inquiry.id,
      message: `Visitor "${inquiry.name}" submitted inquiry: "${inquiry.subject}" (Phone: ${inquiry.phone}, Email: ${inquiry.email})`,
      metadata: {
        inquiryId: inquiry.id,
        name: inquiry.name,
        email: inquiry.email,
        phone: inquiry.phone,
        studentGrade: inquiry.studentGrade || "N/A",
        inquiryType: inquiry.inquiryType,
        subject: inquiry.subject,
        message: inquiry.message,
        clientIp,
      },
    });

    // 2. Dispatch New Inquiry Alert Email to Admin
    try {
      const setting = await prisma.siteSetting.findUnique({
        where: { key: "admin_email_alerts" },
      });
      let recipients = "admin@cismandi.edu.in, principal@cismandi.edu.in";
      let alertEnabled = true;

      if (setting?.value) {
        try {
          const parsed = JSON.parse(setting.value);
          if (parsed.alert_recipients) recipients = parsed.alert_recipients;
          if (parsed.alert_new_contact !== undefined) alertEnabled = parsed.alert_new_contact;
        } catch (_) {}
      }

      if (alertEnabled) {
        const recipientList = recipients.split(",").map((r) => r.trim()).filter(Boolean);
        if (recipientList.length > 0) {
          const istTime = new Date().toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            dateStyle: "full",
            timeStyle: "medium",
          });

          const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
              <div style="background: linear-gradient(135deg, #1e3a8a, #2563eb); padding: 22px; color: #ffffff;">
                <span style="background: rgba(255,255,255,0.2); font-size: 11px; font-weight: bold; padding: 4px 10px; border-radius: 20px; text-transform: uppercase;">New Visitor Lead</span>
                <h2 style="margin: 10px 0 0 0; font-size: 20px; color: #ffffff;">New Parent / Visitor Inquiry</h2>
                <p style="margin: 4px 0 0 0; font-size: 13px; color: #bfdbfe;">A new inquiry has been received through the school portal.</p>
              </div>
              <div style="padding: 22px; color: #1e293b;">
                <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                  <tr><td style="padding: 6px 0; color: #64748b; width: 130px;"><strong>Name:</strong></td><td style="padding: 6px 0; font-weight: bold;">${inquiry.name}</td></tr>
                  <tr><td style="padding: 6px 0; color: #64748b;"><strong>Phone:</strong></td><td style="padding: 6px 0;"><a href="tel:${inquiry.phone}">${inquiry.phone}</a></td></tr>
                  <tr><td style="padding: 6px 0; color: #64748b;"><strong>Email:</strong></td><td style="padding: 6px 0;"><a href="mailto:${inquiry.email}">${inquiry.email}</a></td></tr>
                  <tr><td style="padding: 6px 0; color: #64748b;"><strong>Subject:</strong></td><td style="padding: 6px 0; font-weight: 600;">${inquiry.subject}</td></tr>
                  <tr><td style="padding: 6px 0; color: #64748b;"><strong>Type & Grade:</strong></td><td style="padding: 6px 0;">${inquiry.inquiryType} ${inquiry.studentGrade ? `(${inquiry.studentGrade})` : ""}</td></tr>
                  <tr><td style="padding: 8px 0; color: #64748b; vertical-align: top;"><strong>Message:</strong></td><td style="padding: 8px 0; background: #f8fafc; border-radius: 6px; padding: 10px;">${inquiry.message}</td></tr>
                  <tr><td style="padding: 6px 0; color: #64748b;"><strong>Visitor Real IP:</strong></td><td style="padding: 6px 0; font-family: monospace;">${clientIp}</td></tr>
                  <tr><td style="padding: 6px 0; color: #64748b;"><strong>Submitted At:</strong></td><td style="padding: 6px 0;">${istTime}</td></tr>
                </table>
              </div>
            </div>
          `;

          await emailService.sendEmail({
            to: recipientList,
            subject: `🔔 New Visitor Inquiry: ${inquiry.name} - ${inquiry.subject}`,
            html: emailHtml,
            text: `New Inquiry from ${inquiry.name} (${inquiry.phone}, ${inquiry.email}): ${inquiry.subject}\nMessage: ${inquiry.message}`,
          });
        }
      }
    } catch (mailErr) {
      console.error("New inquiry email alert error:", mailErr);
    }

    return NextResponse.json({ success: true, inquiry });
  } catch (error: any) {
    console.error("Submit inquiry error:", error);
    return NextResponse.json({ error: "Failed to submit inquiry", details: error?.message || String(error) }, { status: 500 });
  }
}

// Admin: Get inquiries (supports filtering non-deleted vs deleted)
export async function GET(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const view = searchParams.get("view"); // "active" | "deleted" | "all"

    const whereClause: any = {};
    if (view === "deleted") {
      whereClause.status = "DELETED";
    } else if (view === "all") {
      // return all
    } else {
      // Default: active / non-deleted only
      whereClause.status = { not: "DELETED" };
    }

    const [inquiries, activeCount, deletedCount] = await Promise.all([
      prisma.inquiry.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
      }),
      prisma.inquiry.count({
        where: {
          status: { not: "DELETED" },
        },
      }),
      prisma.inquiry.count({
        where: {
          status: "DELETED",
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      inquiries,
      stats: {
        activeCount,
        deletedCount,
        totalCount: activeCount + deletedCount,
      },
    });
  } catch (error: any) {
    console.error("Fetch inquiries error:", error);
    return NextResponse.json({ error: "Failed to fetch inquiries" }, { status: 500 });
  }
}
