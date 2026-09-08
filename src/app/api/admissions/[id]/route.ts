import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { logAuditAction } from "@/lib/audit";

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

    const updated = await prisma.admissionApplication.update({
      where: { id },
      data: {
        status: body.status !== undefined ? body.status : undefined,
        remarks: body.remarks !== undefined ? body.remarks : undefined,
        feeReceiptNo: body.feeReceiptNo !== undefined ? body.feeReceiptNo : undefined,
        interviewDate: body.interviewDate ? new Date(body.interviewDate) : undefined,
      },
    });

    await logAuditAction({
      userId: user.id,
      userName: user.name || "Admin",
      action: "UPDATE_ADMISSION_STATUS",
      entity: "AdmissionApplication",
      entityId: id,
      details: `Status updated to ${body.status} for ${updated.studentName} (${updated.applicationNo})`,
    });

    return NextResponse.json({ success: true, application: updated });
  } catch (error: any) {
    console.error("Update admission error:", error);
    return NextResponse.json({ error: "Failed to update admission" }, { status: 500 });
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
    const existing = await prisma.admissionApplication.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    await prisma.admissionApplication.delete({ where: { id } });

    await logAuditAction({
      userId: user.id,
      userName: user.name || "Admin",
      action: "DELETE_ADMISSION_APPLICATION",
      entity: "AdmissionApplication",
      entityId: id,
      details: `Deleted admission application: ${existing.studentName} (${existing.applicationNo})`,
    });

    return NextResponse.json({ success: true, message: "Application deleted successfully" });
  } catch (error: any) {
    console.error("Delete admission error:", error);
    return NextResponse.json({ error: "Failed to delete application" }, { status: 500 });
  }
}
