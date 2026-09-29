import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all defined forms
    const forms = await (prisma as any).formDefinition.findMany({
      orderBy: { title: "asc" },
    });

    // Get all existing notification configs
    const configs = await (prisma as any).formNotificationConfig.findMany();
    const configMap = new Map(configs.map((c: any) => [c.formSlug, c]));

    // Get available email templates for dropdown
    const templates = await (prisma as any).emailTemplate.findMany({
      select: { id: true, name: true, slug: true, type: true },
      orderBy: { name: "asc" },
    });

    // Merge forms with their notification configs
    const formNotifications = forms.map((form: any) => {
      const existingConfig = configMap.get(form.slug);
      return {
        formId: form.id,
        formSlug: form.slug,
        formTitle: form.title,
        category: form.category,
        config: existingConfig || {
          formSlug: form.slug,
          isEnabled: true,
          recipientType: "FIXED",
          recipients: "admissions@cismandi.edu.in",
          cc: "",
          bcc: "",
          replyToField: "email",
          subjectTemplate: `New ${form.title} Submission - {{submission_id}}`,
          templateId: "",
          includeAllFields: true,
          includeSubmissionDate: true,
          includeUploadedFiles: true,
          sendVisitorConfirmation: false,
          visitorEmailField: "email",
          confirmationTemplateId: "",
        },
      };
    });

    return NextResponse.json({
      success: true,
      forms: formNotifications,
      templates,
    });
  } catch (error: any) {
    console.error("GET form notifications error:", error);
    return NextResponse.json({ error: error.message || "Failed to load notifications" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { formSlug, isEnabled, recipientType, recipients, cc, bcc, replyToField, subjectTemplate, templateId, includeAllFields, includeSubmissionDate, includeUploadedFiles, sendVisitorConfirmation, visitorEmailField, confirmationTemplateId } = body;

    if (!formSlug) {
      return NextResponse.json({ error: "Form slug is required" }, { status: 400 });
    }

    const payload = {
      isEnabled: isEnabled !== undefined ? Boolean(isEnabled) : true,
      recipientType: recipientType || "FIXED",
      recipients: recipients || "admissions@cismandi.edu.in",
      cc: cc || null,
      bcc: bcc || null,
      replyToField: replyToField || "email",
      subjectTemplate: subjectTemplate || "New {{form_name}} Submission - {{submission_id}}",
      templateId: templateId || null,
      includeAllFields: includeAllFields !== undefined ? Boolean(includeAllFields) : true,
      includeSubmissionDate: includeSubmissionDate !== undefined ? Boolean(includeSubmissionDate) : true,
      includeUploadedFiles: includeUploadedFiles !== undefined ? Boolean(includeUploadedFiles) : true,
      sendVisitorConfirmation: sendVisitorConfirmation !== undefined ? Boolean(sendVisitorConfirmation) : false,
      visitorEmailField: visitorEmailField || "email",
      confirmationTemplateId: confirmationTemplateId || null,
    };

    const saved = await (prisma as any).formNotificationConfig.upsert({
      where: { formSlug },
      update: payload,
      create: {
        formSlug,
        ...payload,
      },
    });

    try {
      await prisma.auditLog.create({
        data: {
          userName: user.name || user.email,
          action: "UPDATE_FORM_NOTIFICATIONS",
          entity: "FormNotificationConfig",
          entityId: formSlug,
          details: `Updated email notifications for form "${formSlug}". Recipients: ${payload.recipients}`,
        },
      });
    } catch (_) {}

    return NextResponse.json({ success: true, config: saved });
  } catch (error: any) {
    console.error("POST form notification error:", error);
    return NextResponse.json({ error: error.message || "Failed to save form notification settings" }, { status: 500 });
  }
}
