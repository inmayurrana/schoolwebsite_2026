import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { ensureDefaultTemplatesExist } from "@/lib/email/defaultTemplates";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await ensureDefaultTemplatesExist();

    const templates = await (prisma as any).emailTemplate.findMany({
      orderBy: [{ isSystem: "desc" }, { name: "asc" }],
    });

    return NextResponse.json({ success: true, templates });
  } catch (error: any) {
    console.error("GET email templates error:", error);
    return NextResponse.json({ error: error.message || "Failed to load templates" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, slug, type, subject, htmlBody, plainTextBody, fromName, replyTo } = body;

    if (!name || !subject || !htmlBody) {
      return NextResponse.json(
        { error: "Name, subject, and HTML body are required" },
        { status: 400 }
      );
    }

    const templateSlug =
      slug ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    const newTemplate = await (prisma as any).emailTemplate.create({
      data: {
        name,
        slug: templateSlug,
        type: type || "CUSTOM",
        subject,
        htmlBody,
        plainTextBody: plainTextBody || null,
        fromName: fromName || null,
        replyTo: replyTo || null,
        isSystem: false,
      },
    });

    try {
      await prisma.auditLog.create({
        data: {
          userName: user.name || user.email,
          action: "CREATE_EMAIL_TEMPLATE",
          entity: "EmailTemplate",
          entityId: newTemplate.id,
          details: `Created email template "${name}" (${templateSlug})`,
        },
      });
    } catch (_) {}

    return NextResponse.json({ success: true, template: newTemplate });
  } catch (error: any) {
    console.error("POST email template error:", error);
    return NextResponse.json({ error: error.message || "Failed to create template" }, { status: 500 });
  }
}
