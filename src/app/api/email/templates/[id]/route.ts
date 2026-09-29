import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const template = await (prisma as any).emailTemplate.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });

    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, template });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load template" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const existing = await (prisma as any).emailTemplate.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    const updated = await (prisma as any).emailTemplate.update({
      where: { id: existing.id },
      data: {
        name: body.name ?? existing.name,
        type: body.type ?? existing.type,
        subject: body.subject ?? existing.subject,
        htmlBody: body.htmlBody ?? existing.htmlBody,
        plainTextBody: body.plainTextBody !== undefined ? body.plainTextBody : existing.plainTextBody,
        fromName: body.fromName !== undefined ? body.fromName : existing.fromName,
        replyTo: body.replyTo !== undefined ? body.replyTo : existing.replyTo,
        cc: body.cc !== undefined ? body.cc : existing.cc,
        bcc: body.bcc !== undefined ? body.bcc : existing.bcc,
      },
    });

    try {
      await prisma.auditLog.create({
        data: {
          userName: user.name || user.email,
          action: "UPDATE_EMAIL_TEMPLATE",
          entity: "EmailTemplate",
          entityId: existing.id,
          details: `Updated email template "${updated.name}" (${updated.slug})`,
        },
      });
    } catch (_) {}

    return NextResponse.json({ success: true, template: updated });
  } catch (error: any) {
    console.error("PUT email template error:", error);
    return NextResponse.json({ error: error.message || "Failed to update template" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await (prisma as any).emailTemplate.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    if (existing.isSystem) {
      return NextResponse.json(
        { error: "System default templates cannot be deleted, but you may edit them freely." },
        { status: 400 }
      );
    }

    await (prisma as any).emailTemplate.delete({
      where: { id: existing.id },
    });

    try {
      await prisma.auditLog.create({
        data: {
          userName: user.name || user.email,
          action: "DELETE_EMAIL_TEMPLATE",
          entity: "EmailTemplate",
          entityId: existing.id,
          details: `Deleted custom email template "${existing.name}"`,
        },
      });
    } catch (_) {}

    return NextResponse.json({ success: true, message: "Template deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete template" }, { status: 500 });
  }
}
