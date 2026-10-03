import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { logAuditAction } from "@/lib/audit";

export async function POST(
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

    const restored = await prisma.inquiry.update({
      where: { id },
      data: {
        status: "NEW",
        responseNotes: `Restored on ${new Date().toISOString()} by ${user.name || user.email}`,
      },
    });

    await logAuditAction({
      req,
      userId: user.id,
      userName: user.name || user.email,
      action: "RESTORE_INQUIRY",
      entity: "Inquiry",
      entityId: id,
      message: `Restored deleted visitor inquiry from "${restored.name}" (${restored.subject}) back to active status`,
      metadata: {
        inquiryId: restored.id,
        name: restored.name,
        email: restored.email,
        phone: restored.phone,
        subject: restored.subject,
        restoredBy: user.name || user.email,
        restoredAt: new Date().toISOString(),
      },
    });

    return NextResponse.json({
      success: true,
      inquiry: restored,
      message: "Inquiry restored to active list successfully",
    });
  } catch (error: any) {
    console.error("Restore inquiry error:", error);
    return NextResponse.json({ error: "Failed to restore inquiry" }, { status: 500 });
  }
}
