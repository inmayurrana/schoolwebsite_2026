import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { logAuditAction, resolveRealClientIp } from "@/lib/audit";
import { emailService } from "@/lib/email/emailService";

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { ids } = await req.json();
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "No inquiry IDs provided" }, { status: 400 });
    }

    // Find all target inquiries before deletion to capture forensic details
    const inquiries = await prisma.inquiry.findMany({
      where: { id: { in: ids } },
    });

    if (inquiries.length === 0) {
      return NextResponse.json({ error: "No matching inquiries found" }, { status: 404 });
    }

    // Soft delete all matched inquiries
    await prisma.inquiry.updateMany({
      where: { id: { in: ids } },
      data: {
        status: "DELETED",
        responseNotes: `Bulk deleted on ${new Date().toISOString()} by ${user.name || user.email}`,
      },
    });

    const clientIp = await resolveRealClientIp(req);

    // 1. Audit Log batch deletion
    await logAuditAction({
      req,
      userId: user.id,
      userName: user.name || user.email,
      action: "BULK_DELETE_INQUIRIES",
      entity: "Inquiry",
      entityId: `batch_${inquiries.length}`,
      message: `Bulk deleted ${inquiries.length} visitor inquiries: ${inquiries.map((i) => `"${i.name}"`).join(", ")}`,
      metadata: {
        totalDeleted: inquiries.length,
        deletedInquiryIds: ids,
        inquiriesSummary: inquiries.map((i) => ({
          id: i.id,
          name: i.name,
          email: i.email,
          phone: i.phone,
          subject: i.subject,
        })),
        deletedBy: user.name || user.email,
        deletedAt: new Date().toISOString(),
        clientIp,
      },
    });

    // 2. Dispatch Bulk Deletion Alert Email
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

        const rowsHtml = inquiries
          .map(
            (inq, idx) => `
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 10px; font-weight: bold; color: #64748b;">${idx + 1}</td>
              <td style="padding: 8px 10px; color: #0f172a; font-weight: 600;">${inq.name}</td>
              <td style="padding: 8px 10px; color: #475569;">${inq.phone}<br/><span style="font-size: 11px; color: #64748b;">${inq.email}</span></td>
              <td style="padding: 8px 10px; color: #0f172a;">${inq.subject}</td>
              <td style="padding: 8px 10px; color: #64748b; font-size: 11px;">${inq.inquiryType}</td>
            </tr>`
          )
          .join("");

        const alertHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 14px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            <div style="background: linear-gradient(135deg, #b91c1c, #991b1b); padding: 24px; color: #ffffff;">
              <span style="background: rgba(255,255,255,0.25); font-size: 11px; font-weight: bold; padding: 4px 10px; border-radius: 20px; text-transform: uppercase; letter-spacing: 1px;">Security & Compliance Alert</span>
              <h1 style="margin: 12px 0 0 0; font-size: 21px; font-weight: 800; color: #ffffff;">⚠️ Bulk Visitor Inquiries Deleted (${inquiries.length})</h1>
              <p style="margin: 6px 0 0 0; font-size: 13px; color: #fecaca;">A batch of ${inquiries.length} visitor inquiries was deleted from the administration portal.</p>
            </div>
            
            <div style="padding: 24px; color: #1e293b;">
              <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 14px 16px; border-radius: 6px; margin-bottom: 22px;">
                <p style="margin: 0; font-size: 13px; color: #475569; line-height: 1.6;">
                  <strong>Action:</strong> <span style="color: #b91c1c; font-weight: bold;">BULK_DELETE_INQUIRIES</span><br/>
                  <strong>Performed By:</strong> ${user.name || user.email} (${user.role || "Admin"})<br/>
                  <strong>Client Real Public IP:</strong> <span style="font-family: monospace; background: #e2e8f0; padding: 2px 6px; border-radius: 4px; font-weight: bold; color: #0f172a;">${clientIp}</span><br/>
                  <strong>Timestamp:</strong> ${istTime}
                </p>
              </div>

              <h3 style="margin: 0 0 12px 0; font-size: 15px; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">List of Deleted Inquiries (${inquiries.length})</h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 16px;">
                <thead>
                  <tr style="background: #f8fafc; text-align: left; color: #475569; font-size: 11px; text-transform: uppercase;">
                    <th style="padding: 8px 10px;">#</th>
                    <th style="padding: 8px 10px;">Inquirer</th>
                    <th style="padding: 8px 10px;">Contact</th>
                    <th style="padding: 8px 10px;">Subject</th>
                    <th style="padding: 8px 10px;">Type</th>
                  </tr>
                </thead>
                <tbody>
                  ${rowsHtml}
                </tbody>
              </table>

              <div style="margin-top: 20px; padding: 14px; background: #f8fafc; border-radius: 8px; font-size: 12px; color: #64748b; text-align: center;">
                All deleted records are preserved in the Security Audit Log and the Inquiries Archive.
              </div>
            </div>
          </div>
        `;

        await emailService.sendEmail({
          to: recipientList,
          subject: `⚠️ Security Alert: ${inquiries.length} Visitor Inquiries Bulk Deleted`,
          html: alertHtml,
          text: `SECURITY ALERT: ${inquiries.length} visitor inquiries bulk deleted by ${user.name || user.email} from real IP ${clientIp}.`,
        });
      }
    } catch (mailErr) {
      console.error("Failed to send bulk inquiry deletion alert email:", mailErr);
    }

    return NextResponse.json({
      success: true,
      count: inquiries.length,
      message: `${inquiries.length} inquiries soft-deleted and alerts sent`,
    });
  } catch (error: any) {
    console.error("Bulk delete inquiries error:", error);
    return NextResponse.json({ error: "Failed to bulk delete inquiries" }, { status: 500 });
  }
}
