import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { logAuditAction, resolveRealClientIp } from "@/lib/audit";
import { emailService } from "@/lib/email/emailService";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const existing = await prisma.inquiry.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    const updated = await prisma.inquiry.update({
      where: { id },
      data: {
        status: body.status !== undefined ? body.status : undefined,
        responseNotes: body.responseNotes !== undefined ? body.responseNotes : undefined,
      },
    });

    await logAuditAction({
      req,
      userId: user.id,
      userName: user.name || user.email,
      action: "UPDATE_INQUIRY_STATUS",
      entity: "Inquiry",
      entityId: id,
      message: `Updated inquiry status to "${body.status || updated.status}" for "${updated.name}" (${updated.subject})`,
      metadata: {
        inquiryId: id,
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        newStatus: body.status || updated.status,
        previousStatus: existing.status,
        responseNotes: body.responseNotes,
      },
    });

    return NextResponse.json({ success: true, inquiry: updated });
  } catch (error: any) {
    console.error("Update inquiry error:", error);
    return NextResponse.json({ error: "Failed to update inquiry" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const inquiry = await prisma.inquiry.findUnique({ where: { id } });

    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    // Soft delete: marks as deleted and preserves record in archive
    await prisma.inquiry.update({
      where: { id },
      data: {
        status: "DELETED",
        responseNotes: `Deleted on ${new Date().toISOString()} by ${user.name || user.email}`,
      },
    });

    const clientIp = await resolveRealClientIp(req);

    // 1. Permanent Audit Log with Real Public IP & full inquiry payload
    await logAuditAction({
      req,
      userId: user.id,
      userName: user.name || user.email,
      action: "DELETE_INQUIRY",
      entity: "Inquiry",
      entityId: id,
      message: `Deleted visitor inquiry from "${inquiry.name}" (Subject: "${inquiry.subject}", Phone: ${inquiry.phone}, Email: ${inquiry.email})`,
      metadata: {
        inquiryId: inquiry.id,
        name: inquiry.name,
        email: inquiry.email,
        phone: inquiry.phone,
        studentGrade: inquiry.studentGrade || "N/A",
        inquiryType: inquiry.inquiryType,
        subject: inquiry.subject,
        message: inquiry.message,
        statusBeforeDelete: inquiry.status,
        submittedAt: inquiry.createdAt.toISOString(),
        deletedBy: user.name || user.email,
        deletedAt: new Date().toISOString(),
        clientIp,
      },
    });

    // 2. Dispatch High-Priority Alert Email to Administrators
    try {
      const setting = await prisma.siteSetting.findUnique({
        where: { key: "admin_email_alerts" },
      });
      let recipients = "admin@cismandi.edu.in, principal@cismandi.edu.in";
      if (setting?.value) {
        try {
          const parsed = JSON.parse(setting.value);
          if (parsed.alert_recipients) recipients = parsed.alert_recipients;
        } catch (_) {}
      }

      const recipientList = recipients.split(",").map((r) => r.trim()).filter(Boolean);

      if (recipientList.length > 0) {
        const istTime = new Date().toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          dateStyle: "full",
          timeStyle: "medium",
        });

        const alertHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 14px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            <div style="background: linear-gradient(135deg, #b91c1c, #991b1b); padding: 24px; color: #ffffff;">
              <span style="background: rgba(255,255,255,0.25); font-size: 11px; font-weight: bold; padding: 4px 10px; border-radius: 20px; text-transform: uppercase; letter-spacing: 1px;">Security & Compliance Alert</span>
              <h1 style="margin: 12px 0 0 0; font-size: 21px; font-weight: 800; color: #ffffff;">⚠️ Visitor Inquiry Deleted</h1>
              <p style="margin: 6px 0 0 0; font-size: 13px; color: #fecaca;">A visitor inquiry record was removed from the live dashboard.</p>
            </div>
            
            <div style="padding: 24px; color: #1e293b;">
              <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 14px 16px; border-radius: 6px; margin-bottom: 22px;">
                <p style="margin: 0; font-size: 13px; color: #475569; line-height: 1.6;">
                  <strong>Action:</strong> <span style="color: #b91c1c; font-weight: bold;">DELETE_INQUIRY</span><br/>
                  <strong>Performed By:</strong> ${user.name || user.email} (${user.role || "Admin"})<br/>
                  <strong>Client Real Public IP:</strong> <span style="font-family: monospace; background: #e2e8f0; padding: 2px 6px; border-radius: 4px; font-weight: bold; color: #0f172a;">${clientIp}</span><br/>
                  <strong>Timestamp:</strong> ${istTime}
                </p>
              </div>

              <h3 style="margin: 0 0 12px 0; font-size: 15px; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">Deleted Inquiry Record Details</h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                <tbody>
                  <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="padding: 8px 0; color: #64748b; width: 140px;"><strong>Inquirer Name:</strong></td>
                    <td style="padding: 8px 0; color: #0f172a; font-weight: 700;">${inquiry.name}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="padding: 8px 0; color: #64748b;"><strong>Contact Phone:</strong></td>
                    <td style="padding: 8px 0; color: #0f172a;"><a href="tel:${inquiry.phone}" style="color: #2563eb; text-decoration: none;">${inquiry.phone}</a></td>
                  </tr>
                  <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="padding: 8px 0; color: #64748b;"><strong>Email Address:</strong></td>
                    <td style="padding: 8px 0; color: #0f172a;"><a href="mailto:${inquiry.email}" style="color: #2563eb; text-decoration: none;">${inquiry.email}</a></td>
                  </tr>
                  <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="padding: 8px 0; color: #64748b;"><strong>Category & Grade:</strong></td>
                    <td style="padding: 8px 0; color: #0f172a;">${inquiry.inquiryType} ${inquiry.studentGrade ? `(Grade ${inquiry.studentGrade})` : ""}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="padding: 8px 0; color: #64748b;"><strong>Subject:</strong></td>
                    <td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${inquiry.subject}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0 6px 0; color: #64748b; vertical-align: top;"><strong>Message Content:</strong></td>
                    <td style="padding: 10px 0 6px 0;">
                      <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 8px; color: #334155; line-height: 1.5;">
                        ${inquiry.message}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #64748b;"><strong>Original Submission:</strong></td>
                    <td style="padding: 8px 0; color: #64748b; font-size: 12px;">${new Date(inquiry.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST</td>
                  </tr>
                </tbody>
              </table>

              <div style="margin-top: 24px; padding: 16px; background: #f8fafc; border-radius: 8px; font-size: 12px; color: #64748b; text-align: center;">
                This record remains permanently archived in the <strong>Security & Audit Trail</strong> and can be inspected or restored from the CMS Inquiries Archive.
              </div>

              <div style="margin-top: 18px; font-size: 11px; color: #94a3b8; text-align: center;">
                Cambridge International School Mandi — Automated Administrative Notification
              </div>
            </div>
          </div>
        `;

        await emailService.sendEmail({
          to: recipientList,
          subject: `⚠️ Security Alert: Visitor Inquiry Deleted - ${inquiry.name} (${inquiry.subject})`,
          html: alertHtml,
          text: `SECURITY ALERT: Visitor inquiry deleted by ${user.name || user.email} from real IP ${clientIp}.\nInquirer: ${inquiry.name}\nPhone: ${inquiry.phone}\nEmail: ${inquiry.email}\nSubject: ${inquiry.subject}\nMessage: ${inquiry.message}`,
        });
      }
    } catch (mailErr) {
      console.error("Failed to send inquiry deletion alert email:", mailErr);
    }

    return NextResponse.json({
      success: true,
      message: "Inquiry soft-deleted, logged in audit trail, and notification dispatched",
    });
  } catch (error: any) {
    console.error("Delete inquiry error:", error);
    return NextResponse.json({ error: "Failed to delete inquiry" }, { status: 500 });
  }
}
