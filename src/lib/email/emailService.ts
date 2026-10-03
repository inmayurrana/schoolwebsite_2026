import { prisma } from "@/lib/prisma";
import {
  EmailAttachment,
  EmailConfigData,
  EmailConnectionResult,
  EmailSendOptions,
  EmailSendResult,
  EmailServiceStatus,
} from "./types";
import { createEmailProvider } from "./providers/factory";
import { encryptSecret, decryptSecret, maskSecret } from "./crypto";
import {
  interpolateVariables,
  generateSubmissionFieldsTable,
  wrapWithEmailLayout,
  getCleanFileName,
  escapeHtml,
  TemplateVariables,
} from "./templateRenderer";
import { ensureDefaultTemplatesExist } from "./defaultTemplates";
import path from "path";
import fs from "fs";

class EmailService {
  /**
   * Fetch current email configuration.
   * Priority: Environment Variables > Database > Defaults.
   */
  async getConfig(includeDecryptedPassword = false): Promise<EmailConfigData> {
    let dbConfig: any = null;
    try {
      dbConfig = await (prisma as any).emailConfiguration.findFirst();
    } catch (_) {}

    // 1. Check environment variables
    const envHost = process.env.SMTP_HOST;
    const envPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined;
    const envUser = process.env.SMTP_USER;
    const envPass = process.env.SMTP_PASSWORD || process.env.SMTP_PASS;
    const envFrom = process.env.EMAIL_FROM || process.env.SMTP_FROM;
    const envFromName = process.env.EMAIL_FROM_NAME || process.env.SMTP_FROM_NAME;
    const envProvider = process.env.EMAIL_PROVIDER;

    const provider = envProvider || dbConfig?.provider || "GMAIL";
    const smtpHost = envHost || dbConfig?.smtpHost || (provider === "GMAIL" ? "smtp.gmail.com" : "localhost");
    const smtpPort = envPort || dbConfig?.smtpPort || (provider === "GMAIL" ? 587 : 587);
    const encryption = dbConfig?.encryption || (smtpPort === 465 ? "SSL_TLS" : "STARTTLS");
    const isEnabled = dbConfig ? dbConfig.isEnabled : true;
    const fromName = envFromName || dbConfig?.fromName || "Cambridge International School";
    const fromEmail = envFrom || dbConfig?.fromEmail || envUser || "admin@cismandi.edu.in";
    const replyToEmail = dbConfig?.replyToEmail || "";
    const authRequired = dbConfig ? dbConfig.authRequired : true;
    const smtpUser = envUser || dbConfig?.smtpUser || "";
    
    // Decrypt password if requested
    let plainPass = "";
    if (envPass) {
      plainPass = envPass;
    } else if (dbConfig?.smtpPassEncrypted) {
      plainPass = decryptSecret(dbConfig.smtpPassEncrypted);
    }

    const defaultRecipients = dbConfig?.defaultRecipients || fromEmail;
    const defaultCc = dbConfig?.defaultCc || "";
    const defaultBcc = dbConfig?.defaultBcc || "";
    const status: EmailServiceStatus = !smtpUser
      ? "NOT_CONFIGURED"
      : !isEnabled
      ? "DISABLED"
      : dbConfig?.status || "NOT_CONFIGURED";

    return {
      id: dbConfig?.id,
      provider,
      isEnabled,
      fromName,
      fromEmail,
      replyToEmail,
      smtpHost,
      smtpPort,
      encryption,
      authRequired,
      smtpUser,
      smtpPass: includeDecryptedPassword ? plainPass : (plainPass ? maskSecret(plainPass) : ""),
      smtpPassEncrypted: dbConfig?.smtpPassEncrypted || "",
      defaultRecipients,
      defaultCc,
      defaultBcc,
      status,
      lastTestedAt: dbConfig?.lastTestedAt,
      lastError: dbConfig?.lastError,
    };
  }

  /**
   * Save or update email configuration in the database.
   */
  async saveConfig(data: Partial<EmailConfigData>, adminUserName = "Admin"): Promise<EmailConfigData> {
    const existing = await (prisma as any).emailConfiguration.findFirst();

    let encryptedPass = existing?.smtpPassEncrypted || "";

    // If new password is provided and not masked
    if (data.smtpPass && !data.smtpPass.includes("•")) {
      let pass = data.smtpPass.trim();
      if (data.provider === "GMAIL" || (data.smtpHost && data.smtpHost.includes("gmail"))) {
        pass = pass.replace(/\s+/g, "");
      }
      encryptedPass = encryptSecret(pass);
    }

    const updatePayload: any = {
      provider: data.provider || "GMAIL",
      isEnabled: data.isEnabled !== undefined ? Boolean(data.isEnabled) : true,
      fromName: data.fromName || "Cambridge International School",
      fromEmail: data.fromEmail || "admin@cismandi.edu.in",
      replyToEmail: data.replyToEmail || null,
      smtpHost: data.smtpHost || (data.provider === "GMAIL" ? "smtp.gmail.com" : "localhost"),
      smtpPort: data.smtpPort ? Number(data.smtpPort) : 587,
      encryption: data.encryption || "STARTTLS",
      authRequired: data.authRequired !== undefined ? Boolean(data.authRequired) : true,
      smtpUser: data.smtpUser ? data.smtpUser.trim() : "",
      smtpPassEncrypted: encryptedPass,
      defaultRecipients: data.defaultRecipients || null,
      defaultCc: data.defaultCc || null,
      defaultBcc: data.defaultBcc || null,
    };

    let saved;
    if (existing) {
      saved = await (prisma as any).emailConfiguration.update({
        where: { id: existing.id },
        data: updatePayload,
      });
    } else {
      saved = await (prisma as any).emailConfiguration.create({
        data: {
          ...updatePayload,
          status: "NOT_CONFIGURED",
        },
      });
    }

    // Record audit log safely (NEVER log the actual password)
    try {
      await prisma.auditLog.create({
        data: {
          userName: adminUserName,
          action: "UPDATE_EMAIL_SETTINGS",
          entity: "EmailConfiguration",
          entityId: saved.id,
          details: `Updated Email Settings. Provider: ${saved.provider}, Host: ${saved.smtpHost}:${saved.smtpPort}. Password changed: ${Boolean(data.smtpPass && !data.smtpPass.includes("•"))}`,
        },
      });
    } catch (_) {}

    return this.getConfig(false);
  }

  /**
   * Test SMTP connection handshake and TLS configuration without sending an email.
   */
  async testConnection(customConfig?: Partial<EmailConfigData>): Promise<EmailConnectionResult> {
    const activeConfig = await this.getConfig(true);

    let resolvedPass = activeConfig.smtpPass || "";
    if (customConfig?.smtpPass && !customConfig.smtpPass.includes("•")) {
      resolvedPass = customConfig.smtpPass.trim();
    }

    const testConfig: EmailConfigData = {
      ...activeConfig,
      ...customConfig,
      smtpPass: resolvedPass,
    };

    if (testConfig.provider === "GMAIL" || (testConfig.smtpHost && testConfig.smtpHost.includes("gmail"))) {
      if (testConfig.smtpPass) {
        testConfig.smtpPass = testConfig.smtpPass.replace(/\s+/g, "");
      }
    }

    const provider = createEmailProvider(testConfig);
    const result = await provider.testConnection();

    // Persist test result status to DB
    try {
      const existing = await (prisma as any).emailConfiguration.findFirst();
      if (existing) {
        await (prisma as any).emailConfiguration.update({
          where: { id: existing.id },
          data: {
            status: result.success
              ? "CONNECTED"
              : result.error?.includes("authentication") || result.error?.includes("login")
              ? "AUTHENTICATION_ERROR"
              : "CONNECTION_ERROR",
            lastTestedAt: new Date(),
            lastError: result.success ? null : result.error || result.message,
          },
        });
      }
    } catch (_) {}

    return result;
  }

  /**
   * Send a test email to verify end-to-end delivery.
   */
  async sendTestEmail(
    to: string,
    subject = "Website Email Delivery Test",
    message = "This is a test email sent from the Cambridge International School CMS."
  ): Promise<EmailSendResult> {
    const config = await this.getConfig(true);

    if (config.authRequired && (!config.smtpUser || !config.smtpPass)) {
      return {
        success: false,
        provider: config.provider,
        error: "Missing SMTP credentials: Username and Password / Google App Password are required. Please configure credentials in Communications > Email Settings first.",
      };
    }

    const provider = createEmailProvider(config);

    const testHtml = await wrapWithEmailLayout(`
      <div style="background-color: #ecfdf5; border: 1px solid #10b981; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 6px 0; color: #065f46; font-size: 16px;">
          ✓ Email Delivery Test Successful
        </h3>
        <p style="margin: 0; color: #047857; font-size: 13px;">
          Your website email configuration is working properly with provider <strong>${provider.getProviderName()}</strong>.
        </p>
      </div>

      <div style="font-size: 14px; color: #334155; line-height: 1.6;">
        <p><strong>Recipient:</strong> ${to}</p>
        <p><strong>SMTP Host:</strong> ${config.smtpHost}:${config.smtpPort} (${config.encryption})</p>
        <p><strong>Authenticated Sender:</strong> ${config.smtpUser || config.fromEmail}</p>
        <p><strong>Test Timestamp:</strong> ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</p>
      </div>

      <div style="background-color: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 6px; padding: 12px 14px; margin-top: 18px; font-size: 13px; color: #475569;">
        <strong>Custom Test Message:</strong><br>
        ${message}
      </div>
    `);

    // Log the test attempt
    let logRecord: any = null;
    try {
      logRecord = await (prisma as any).emailLog.create({
        data: {
          type: "TEST",
          recipient: to,
          subject,
          status: "SENDING",
          provider: provider.getProviderName(),
          attempts: 1,
          bodySnippet: message.substring(0, 150),
        },
      });
    } catch (_) {}

    const result = await provider.send({
      to,
      subject,
      html: testHtml,
      text: message,
    });

    if (logRecord) {
      try {
        await (prisma as any).emailLog.update({
          where: { id: logRecord.id },
          data: {
            status: result.success ? "SENT" : "FAILED",
            sentAt: result.success ? new Date() : null,
            errorMessage: result.success ? null : result.error,
          },
        });
      } catch (_) {}
    }

    return result;
  }

  /**
   * Resend / retry a failed email log.
   */
  async retryEmail(logId: string): Promise<EmailSendResult> {
    const log = await (prisma as any).emailLog.findUnique({
      where: { id: logId },
    });

    if (!log) {
      return { success: false, provider: "Unknown", error: "Log record not found" };
    }

    const config = await this.getConfig(true);
    const provider = createEmailProvider(config);

    await (prisma as any).emailLog.update({
      where: { id: logId },
      data: {
        status: "RETRYING",
        attempts: { increment: 1 },
      },
    });

    // Reconstruct email from log metadata or template
    let emailHtml = "";
    try {
      const meta = log.metadataJson ? JSON.parse(log.metadataJson) : null;
      if (meta?.html) {
        emailHtml = meta.html;
      }
    } catch (_) {}

    if (!emailHtml) {
      emailHtml = await wrapWithEmailLayout(`
        <div style="font-size: 14px; color: #334155;">
          <h2>Retried Notification: ${log.subject}</h2>
          <p>${log.bodySnippet || "Form submission notification."}</p>
        </div>
      `);
    }

    const result = await provider.send({
      to: log.recipient,
      cc: log.cc ? log.cc.split(",").map((s: string) => s.trim()) : undefined,
      bcc: log.bcc ? log.bcc.split(",").map((s: string) => s.trim()) : undefined,
      subject: log.subject,
      html: emailHtml,
    });

    await (prisma as any).emailLog.update({
      where: { id: logId },
      data: {
        status: result.success ? "SENT" : "FAILED",
        sentAt: result.success ? new Date() : null,
        errorMessage: result.success ? null : result.error,
      },
    });

    return result;
  }

  /**
   * Core form submission handler.
   * Runs asynchronously in background: saves email log, interpolates variables,
   * dispatches admin notification and optional visitor confirmation.
   * NEVER throws or disrupts the form submission response.
   */
  async handleFormSubmission({
    formSlug,
    formTitle,
    submissionNo,
    formData,
    submissionId,
  }: {
    formSlug: string;
    formTitle: string;
    submissionNo: string;
    formData: Record<string, any>;
    submissionId?: string;
  }): Promise<void> {
    try {
      const config = await this.getConfig(true);

      // If email delivery is globally disabled, log and exit safely
      if (!config.isEnabled) {
        try {
          await (prisma as any).emailLog.create({
            data: {
              type: "FORM_NOTIFICATION",
              recipient: config.defaultRecipients || config.fromEmail,
              subject: `Submission [${submissionNo}] - Email Disabled`,
              status: "CANCELLED",
              provider: config.provider,
              formSlug,
              submissionId: submissionNo,
              errorMessage: "Email notifications are currently disabled in CMS Settings.",
            },
          });
        } catch (_) {}
        return;
      }

      // Ensure default templates are present
      await ensureDefaultTemplatesExist();

      // Fetch FormNotificationConfig for this form
      let notifConfig: any = null;
      try {
        notifConfig = await (prisma as any).formNotificationConfig.findUnique({
          where: { formSlug },
        });
      } catch (_) {}

      // If form notifications are explicitly disabled for this form
      if (notifConfig && !notifConfig.isEnabled) {
        return;
      }

      // Build Template Variables
      const nowStr = new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "medium",
        timeStyle: "short",
      });

      const variables: TemplateVariables = {
        site_name: "Cambridge International School",
        site_url: process.env.NEXTAUTH_URL || "https://cismandi.edu.in",
        form_name: formTitle,
        submission_id: submissionNo,
        submission_date: nowStr,
        view_submission_url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/admin/forms`,
        ...formData,
      };

      // 1. Send Admin Notification
      await this.dispatchAdminNotification({
        config,
        notifConfig,
        formSlug,
        formTitle,
        submissionNo,
        formData,
        variables,
      });

      // 2. Send Visitor Confirmation (if configured)
      if (notifConfig?.sendVisitorConfirmation) {
        await this.dispatchVisitorConfirmation({
          config,
          notifConfig,
          formSlug,
          formTitle,
          submissionNo,
          formData,
          variables,
        });
      }
    } catch (err) {
      console.error("Critical error in handleFormSubmission email processing:", err);
    }
  }

  /**
   * Scans submitted form data for uploaded files and documents located in /public/uploads/,
   * verifies their existence on disk, and prepares them as physical Nodemailer attachments.
   */
  private extractAttachmentsFromFormData(formData: Record<string, any>): {
    attachments: EmailAttachment[];
    attachmentSummaries: Array<{ name: string; size: string; isImage: boolean }>;
  } {
    const attachments: EmailAttachment[] = [];
    const attachmentSummaries: Array<{ name: string; size: string; isImage: boolean }> = [];
    const MAX_TOTAL_SIZE = 24 * 1024 * 1024; // 24MB safety limit for email delivery
    let totalSizeBytes = 0;

    const findUploadPaths = (val: any): string[] => {
      const paths: string[] = [];
      if (!val) return paths;
      if (typeof val === "string") {
        if (val.startsWith("/uploads/") || val.startsWith("uploads/") || val.includes("/uploads/")) {
          const match = val.match(/\/uploads\/[^"'\s]+/);
          if (match) {
            paths.push(match[0]);
          } else {
            paths.push(val);
          }
        }
      } else if (Array.isArray(val)) {
        for (const item of val) {
          paths.push(...findUploadPaths(item));
        }
      } else if (typeof val === "object") {
        for (const k of Object.keys(val)) {
          paths.push(...findUploadPaths(val[k]));
        }
      }
      return paths;
    };

    const seenPaths = new Set<string>();

    for (const [key, value] of Object.entries(formData)) {
      const paths = findUploadPaths(value);
      for (const p of paths) {
        if (seenPaths.has(p)) continue;
        seenPaths.add(p);

        try {
          const relativePath = p.startsWith("/") ? p.slice(1) : p;
          const fullPath = path.join(process.cwd(), "public", relativePath);

          if (fs.existsSync(fullPath)) {
            const stats = fs.statSync(fullPath);
            if (stats.size > 0 && totalSizeBytes + stats.size <= MAX_TOTAL_SIZE) {
              totalSizeBytes += stats.size;
              const cleanName = getCleanFileName(p);
              const ext = path.extname(fullPath).toLowerCase();
              const isImage = [".webp", ".png", ".jpg", ".jpeg", ".gif", ".avif"].includes(ext);

              let contentType = "application/octet-stream";
              if (ext === ".pdf") contentType = "application/pdf";
              else if (ext === ".webp") contentType = "image/webp";
              else if (ext === ".png") contentType = "image/png";
              else if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
              else if (ext === ".doc") contentType = "application/msword";
              else if (ext === ".docx") contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

              const formattedSize =
                stats.size > 1024 * 1024
                  ? `${(stats.size / (1024 * 1024)).toFixed(2)} MB`
                  : `${(stats.size / 1024).toFixed(0)} KB`;

              attachments.push({
                filename: cleanName,
                path: fullPath,
                contentType,
              });

              attachmentSummaries.push({
                name: cleanName,
                size: formattedSize,
                isImage,
              });
            }
          }
        } catch (fileErr) {
          console.warn("Could not process attachment for email:", p, fileErr);
        }
      }
    }

    return { attachments, attachmentSummaries };
  }

  private async dispatchAdminNotification({
    config,
    notifConfig,
    formSlug,
    formTitle,
    submissionNo,
    formData,
    variables,
  }: any) {
    try {
      // 1. Query administrative email alerts configuration from database
      let alertRecipients: string[] = [];
      let shouldSendAlert = true;
      try {
        const alertSetting = await (prisma as any).siteSetting.findUnique({
          where: { key: "admin_email_alerts" },
        });
        if (alertSetting?.value) {
          const parsed = JSON.parse(alertSetting.value);
          if (parsed.alert_recipients) {
            parsed.alert_recipients.split(",").forEach((email: string) => {
              const trimmed = email.trim();
              if (trimmed.includes("@")) alertRecipients.push(trimmed);
            });
          }
          const lowerSlug = (formSlug || "").toLowerCase();
          if (lowerSlug.includes("admission") && parsed.alert_new_admission === false) {
            shouldSendAlert = false;
          } else if (lowerSlug.includes("career") && parsed.alert_new_career === false) {
            shouldSendAlert = false;
          } else if ((lowerSlug.includes("contact") || lowerSlug.includes("inquir")) && parsed.alert_new_contact === false) {
            shouldSendAlert = false;
          }
        }
      } catch (err) {
        console.warn("Could not read admin_email_alerts setting:", err);
      }

      if (!shouldSendAlert) {
        console.log(`Email alert suppressed by admin settings for form: ${formSlug}`);
        return;
      }

      // Determine recipients: Combine alert_recipients + notifConfig + config
      const recipientSet = new Set<string>();
      alertRecipients.forEach((e) => recipientSet.add(e));
      if (notifConfig?.recipients) {
        notifConfig.recipients.split(",").forEach((e: string) => {
          const trimmed = e.trim();
          if (trimmed.includes("@")) recipientSet.add(trimmed);
        });
      }
      if (recipientSet.size === 0 && config.defaultRecipients) {
        config.defaultRecipients.split(",").forEach((e: string) => {
          const trimmed = e.trim();
          if (trimmed.includes("@")) recipientSet.add(trimmed);
        });
      }
      if (recipientSet.size === 0 && config.fromEmail) {
        recipientSet.add(config.fromEmail);
      }
      const recipientList = Array.from(recipientSet);

      if (recipientList.length === 0) return;

      // Extract uploaded documents & images to attach physically to the email alert
      const { attachments, attachmentSummaries } = this.extractAttachmentsFromFormData(formData);

      // Determine Reply-To from form field if valid
      let replyToEmail: string | undefined = undefined;
      const replyField = notifConfig?.replyToField || "email";
      if (formData[replyField] && typeof formData[replyField] === "string" && formData[replyField].includes("@")) {
        replyToEmail = formData[replyField].trim();
      }

      // Build Attachment Highlight Banner if files are attached
      let attachmentBannerHtml = "";
      if (attachmentSummaries.length > 0) {
        const items = attachmentSummaries
          .map(
            (att) => `
            <li style="margin: 6px 0; font-size: 13px;">
              <span style="font-size: 15px; margin-right: 4px;">${att.isImage ? "🖼️" : "📄"}</span>
              <strong style="color: #0f172a;">${escapeHtml(att.name)}</strong>
              <span style="color: #64748b; font-size: 11px; margin-left: 4px;">(${att.size})</span>
              <span style="background-color: #22c55e; color: #ffffff; font-size: 10px; font-weight: bold; padding: 2px 7px; border-radius: 9999px; margin-left: 8px;">
                ATTACHED TO EMAIL
              </span>
            </li>
          `
          )
          .join("");

        attachmentBannerHtml = `
          <div style="margin: 20px 0; padding: 16px 20px; background-color: #f8fafc; border: 1px solid #cbd5e1; border-left: 4px solid #f59e0b; border-radius: 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 4px;">
              📎 ${attachmentSummaries.length} Uploaded File${attachmentSummaries.length > 1 ? "s" : ""} Attached:
            </div>
            <div style="font-size: 12px; color: #64748b; margin-bottom: 8px;">
              The submitted documents and images have been physically attached to this email alert for immediate review:
            </div>
            <ul style="margin: 0; padding-left: 20px; color: #334155; line-height: 1.6;">
              ${items}
            </ul>
          </div>
        `;
      }

      // Fetch or assemble template
      let subject = `New ${formTitle} Submission - ${submissionNo}`;
      let bodyHtml = "";

      let template = null;
      if (notifConfig?.templateId) {
        template = await (prisma as any).emailTemplate.findUnique({
          where: { id: notifConfig.templateId },
        });
      } else {
        // Fallback: match by form slug or general enquiry
        const slugMatch =
          formSlug.includes("admission")
            ? "new-admission-enquiry"
            : formSlug.includes("career")
            ? "new-career-application"
            : formSlug.includes("contact")
            ? "new-contact-submission"
            : "new-general-enquiry";

        template = await (prisma as any).emailTemplate.findUnique({
          where: { slug: slugMatch },
        });
      }

      const fieldsTable = generateSubmissionFieldsTable(formData);
      const enhancedVars = {
        ...variables,
        fields_table: fieldsTable + attachmentBannerHtml,
        attached_files_banner: attachmentBannerHtml,
      };

      if (template) {
        subject = interpolateVariables(template.subject, enhancedVars, false);
        bodyHtml = interpolateVariables(template.htmlBody, enhancedVars, false);
        if (!template.htmlBody.includes("{{fields_table}}") && !template.htmlBody.includes("{{attached_files_banner}}")) {
          bodyHtml += attachmentBannerHtml;
        }
      } else {
        bodyHtml = `
          <h2>New Submission Received for ${formTitle}</h2>
          <p>A new entry was submitted on <strong>${variables.submission_date}</strong> (Ref: <strong>${submissionNo}</strong>).</p>
          ${attachmentBannerHtml}
          ${fieldsTable}
        `;
      }

      const finalHtml = await wrapWithEmailLayout(bodyHtml, {
        previewText: `New ${formTitle} submission: ${submissionNo}${attachments.length > 0 ? ` (${attachments.length} files attached)` : ""}`,
        actionUrl: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/admin/forms`,
        actionText: "View Submission in CMS",
      });

      const provider = createEmailProvider(config);

      // Save Log as QUEUED/SENDING
      const log = await (prisma as any).emailLog.create({
        data: {
          type: "FORM_NOTIFICATION",
          recipient: recipientList.join(", "),
          cc: notifConfig?.cc || null,
          bcc: notifConfig?.bcc || null,
          subject,
          status: "SENDING",
          provider: provider.getProviderName(),
          formSlug,
          submissionId: submissionNo,
          attempts: 1,
          bodySnippet: `Form ${formTitle} submission (${submissionNo})${attachments.length > 0 ? ` [${attachments.length} file(s) attached]` : ""}`,
          metadataJson: JSON.stringify({
            html: finalHtml,
            attachments: attachmentSummaries.map((a) => `${a.name} (${a.size})`),
          }),
        },
      });

      const sendResult = await provider.send({
        to: recipientList,
        cc: notifConfig?.cc ? notifConfig.cc.split(",").map((s: string) => s.trim()) : undefined,
        bcc: notifConfig?.bcc ? notifConfig.bcc.split(",").map((s: string) => s.trim()) : undefined,
        replyTo: replyToEmail,
        subject,
        html: finalHtml,
        attachments,
      });

      await (prisma as any).emailLog.update({
        where: { id: log.id },
        data: {
          status: sendResult.success ? "SENT" : "FAILED",
          sentAt: sendResult.success ? new Date() : null,
          errorMessage: sendResult.success ? null : sendResult.error,
        },
      });
    } catch (err) {
      console.error("Error dispatching admin notification:", err);
    }
  }

  private async dispatchVisitorConfirmation({
    config,
    notifConfig,
    formSlug,
    formTitle,
    submissionNo,
    formData,
    variables,
  }: any) {
    try {
      const visitorEmailKey = notifConfig.visitorEmailField || "email";
      const visitorEmail = formData[visitorEmailKey];

      if (!visitorEmail || typeof visitorEmail !== "string" || !visitorEmail.includes("@")) {
        return;
      }

      let template = null;
      if (notifConfig.confirmationTemplateId) {
        template = await (prisma as any).emailTemplate.findUnique({
          where: { id: notifConfig.confirmationTemplateId },
        });
      } else {
        const slugMatch = formSlug.includes("admission")
          ? "application-received"
          : "form-submission-confirmation";

        template = await (prisma as any).emailTemplate.findUnique({
          where: { slug: slugMatch },
        });
      }

      let subject = `Thank you for contacting Cambridge International School (${submissionNo})`;
      let bodyHtml = "";

      if (template) {
        subject = interpolateVariables(template.subject, variables, false);
        bodyHtml = interpolateVariables(template.htmlBody, variables, false);
      } else {
        bodyHtml = `
          <h2>Thank You for Contacting Cambridge International School</h2>
          <p>We have received your submission for <strong>${formTitle}</strong> (Ref: <strong>${submissionNo}</strong>).</p>
          <p>Our team will review your enquiry and get back to you shortly.</p>
        `;
      }

      const finalHtml = await wrapWithEmailLayout(bodyHtml, {
        previewText: `Acknowledgment: ${submissionNo}`,
      });

      const provider = createEmailProvider(config);

      const log = await (prisma as any).emailLog.create({
        data: {
          type: "FORM_CONFIRMATION",
          recipient: visitorEmail.trim(),
          subject,
          status: "SENDING",
          provider: provider.getProviderName(),
          formSlug,
          submissionId: submissionNo,
          attempts: 1,
          bodySnippet: `Visitor Confirmation for ${formTitle}`,
          metadataJson: JSON.stringify({ html: finalHtml }),
        },
      });

      const sendResult = await provider.send({
        to: visitorEmail.trim(),
        subject,
        html: finalHtml,
      });

      await (prisma as any).emailLog.update({
        where: { id: log.id },
        data: {
          status: sendResult.success ? "SENT" : "FAILED",
          sentAt: sendResult.success ? new Date() : null,
          errorMessage: sendResult.success ? null : sendResult.error,
        },
      });
    } catch (err) {
      console.error("Error dispatching visitor confirmation email:", err);
    }
  }

  /**
   * General purpose email sender with logging.
   */
  async sendEmail(options: EmailSendOptions): Promise<EmailSendResult> {
    try {
      const config = await this.getConfig(true);
      const provider = createEmailProvider(config);

      const recipientStr = Array.isArray(options.to) ? options.to.join(", ") : options.to;
      const ccStr = options.cc ? (Array.isArray(options.cc) ? options.cc.join(", ") : options.cc) : undefined;
      const bccStr = options.bcc ? (Array.isArray(options.bcc) ? options.bcc.join(", ") : options.bcc) : undefined;

      let logRecord: any = null;
      try {
        logRecord = await (prisma as any).emailLog.create({
          data: {
            type: options.type || "SYSTEM",
            recipient: recipientStr,
            cc: ccStr,
            bcc: bccStr,
            subject: options.subject,
            status: "SENDING",
            provider: provider.getProviderName(),
            formSlug: options.formSlug,
            submissionId: options.submissionId,
            attempts: 1,
            bodySnippet: (options.text || options.html || "").substring(0, 150),
            metadataJson: options.metadata ? JSON.stringify(options.metadata) : null,
          },
        });
      } catch (_) {}

      const result = await provider.send({
        to: options.to,
        fromName: options.fromName,
        fromEmail: options.fromEmail,
        cc: options.cc,
        bcc: options.bcc,
        replyTo: options.replyTo,
        subject: options.subject,
        html: options.html,
        text: options.text,
        attachments: options.attachments,
      });

      if (logRecord) {
        try {
          await (prisma as any).emailLog.update({
            where: { id: logRecord.id },
            data: {
              status: result.success ? "SENT" : "FAILED",
              sentAt: result.success ? new Date() : null,
              errorMessage: result.success ? null : result.error,
            },
          });
        } catch (_) {}
      }

      return result;
    } catch (error: any) {
      console.error("Error sending email via sendEmail:", error);
      return {
        success: false,
        provider: "Unknown",
        error: error.message || "Failed to send email",
      };
    }
  }

  /**
   * Dispatches an urgent security alert email when an account is temporarily
   * locked after 5 consecutive failed login attempts.
   */
  async sendAccountLockoutAlert({
    userId,
    userEmail,
    userName,
    lockMinutes = 5,
    ipAddress = "Unknown",
    userAgent = "Unknown",
  }: {
    userId: string;
    userEmail: string;
    userName: string;
    lockMinutes?: number;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<EmailSendResult> {
    try {
      const now = new Date();
      const unlockDate = new Date(now.getTime() + lockMinutes * 60 * 1000);

      const timestampStr = now.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "medium",
        timeStyle: "medium",
      });

      const unlockTimeStr = unlockDate.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "medium",
        timeStyle: "medium",
      });

      const variables: TemplateVariables = {
        user_name: userName || "Administrator",
        user_email: userEmail,
        lock_minutes: String(lockMinutes),
        timestamp: timestampStr,
        unlock_time: unlockTimeStr,
        ip_address: ipAddress,
        user_agent: userAgent,
        site_name: "Cambridge International School",
      };

      // Check if custom template exists in database
      let template: any = null;
      try {
        template = await (prisma as any).emailTemplate.findUnique({
          where: { slug: "account-lockout-alert" },
        });
      } catch (_) {}

      let subject = `Security Alert: Account Temporarily Locked (${userEmail})`;
      let bodyHtml = "";

      if (template?.htmlBody) {
        subject = interpolateVariables(template.subject || subject, variables, false);
        bodyHtml = interpolateVariables(template.htmlBody, variables, false);
      } else {
        bodyHtml = `
          <div style="margin-bottom: 24px;">
            <span style="background-color: #fee2e2; color: #991b1b; padding: 5px 12px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; display: inline-block;">
              ⚠️ Security Alert • Account Locked
            </span>
            <h2 style="margin: 16px 0 8px 0; color: #0f172a; font-size: 20px; font-weight: 700;">
              Account Temporarily Blocked for 5 Minutes
            </h2>
            <p style="margin: 0 0 14px 0; color: #475569; font-size: 14px; line-height: 1.6;">
              Hello <strong>${userName || "User"}</strong>,
            </p>
            <p style="margin: 0 0 14px 0; color: #475569; font-size: 14px; line-height: 1.6;">
              This is an urgent automated security alert from <strong>Cambridge International School</strong>. Your account has been temporarily blocked for <strong>${lockMinutes} minutes</strong> due to <strong>5 consecutive failed login attempts</strong>.
            </p>
          </div>

          <div style="background-color: #fff1f2; border-left: 4px solid #e11d48; border-radius: 6px; padding: 14px 18px; margin: 18px 0;">
            <p style="margin: 0; font-size: 13px; color: #881337; line-height: 1.8;">
              <strong>Target Account / User ID:</strong> ${userEmail}<br>
              <strong>Status:</strong> Temporarily Locked (5 Minutes)<br>
              <strong>Lockout Initiated:</strong> ${timestampStr} (IST)<br>
              <strong>Automatic Unlock Time:</strong> ${unlockTimeStr} (IST)<br>
              <strong>Origin IP Address:</strong> ${ipAddress}<br>
              <strong>Device / Browser:</strong> ${userAgent}
            </p>
          </div>

          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <h4 style="margin: 0 0 8px 0; color: #1e293b; font-size: 14px; font-weight: 600;">
              Did you try to sign in?
            </h4>
            <p style="margin: 0 0 10px 0; color: #64748b; font-size: 13px; line-height: 1.6;">
              If this was you, please wait <strong>${lockMinutes} minutes</strong>. Your account will automatically unlock at <strong>${unlockTimeStr}</strong>, and you can re-enter your correct password.
            </p>
            <p style="margin: 0; color: #dc2626; font-size: 13px; line-height: 1.6; font-weight: 500;">
              If you did NOT attempt to sign in, an unauthorized party may be attempting to guess your password. We strongly recommend resetting your password immediately once your account unlocks, or contacting the school IT administrator.
            </p>
          </div>
        `;
      }

      const finalHtml = await wrapWithEmailLayout(bodyHtml, {
        previewText: `Security Alert: Account ${userEmail} locked for 5 minutes after 5 failed login attempts.`,
      });

      return await this.sendEmail({
        to: userEmail,
        subject,
        html: finalHtml,
        text: `Security Alert: Your account ${userEmail} has been temporarily locked for ${lockMinutes} minutes due to 5 consecutive failed login attempts.\n\nTime: ${timestampStr}\nIP: ${ipAddress}\nBrowser: ${userAgent}\n\nIf you did not make this attempt, contact your IT administrator.`,
        type: "SECURITY_ALERT",
        metadata: {
          userId,
          ipAddress,
          userAgent,
          lockMinutes,
          lockedAt: now.toISOString(),
        },
      });
    } catch (err: any) {
      console.error("Error in sendAccountLockoutAlert:", err);
      return {
        success: false,
        provider: "Unknown",
        error: err.message || "Failed to dispatch lockout alert email",
      };
    }
  }
}

export const emailService = new EmailService();
