import { prisma } from "@/lib/prisma";

export interface TemplateVariables {
  site_name?: string;
  site_url?: string;
  form_name?: string;
  submission_id?: string;
  submission_date?: string;
  view_submission_url?: string;
  [key: string]: any;
}

/**
 * Escapes HTML characters in user-provided content
 */
export function escapeHtml(str: any): string {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Interpolates variables in a template string, e.g. {{student_name}}
 */
export function interpolateVariables(
  template: string,
  variables: TemplateVariables,
  sanitizeUserValues: boolean = true
): string {
  if (!template) return "";

  return template.replace(/\{\{\s*([a-zA-Z0-9_-]+)\s*\}\}/g, (_, key) => {
    const val = variables[key];
    if (val === undefined || val === null) {
      return "";
    }
    if (sanitizeUserValues && typeof val === "string") {
      return escapeHtml(val);
    }
    return String(val);
  });
}

/**
 * Strips storage paths, technical directories, and unique random hashes,
 * converting an uploaded file path or URL into a clean, friendly document name.
 * e.g., "/uploads/birth_certificate_866bc89cf18d.pdf" -> "Birth Certificate.pdf"
 */
export function getCleanFileName(urlOrPath: string): string {
  if (!urlOrPath) return "Document";
  const raw = String(urlOrPath).split("/").pop() || urlOrPath;
  const withoutHash = raw.replace(/_[a-f0-9]{8,16}(\.[a-zA-Z0-9]+)$/i, "$1");
  const ext = withoutHash.includes(".") ? withoutHash.slice(withoutHash.lastIndexOf(".")) : "";
  const base = withoutHash.slice(0, withoutHash.length - ext.length);
  const cleanBase = base.replace(/[_-]+/g, " ").trim();
  const formatted = cleanBase
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
  return (formatted || "Document") + ext.toLowerCase();
}

/**
 * Generate a responsive HTML table of submitted form key-values
 */
export function generateSubmissionFieldsTable(formData: Record<string, any>): string {
  const skipKeys = new Set(["_honey", "csrfToken", "recaptcha", "turnstile", "honeypot"]);
  const entries = Object.entries(formData).filter(([k]) => !skipKeys.has(k));

  if (entries.length === 0) return "";

  const rows = entries
    .map(([key, value]) => {
      // Format label nicely: "student_name" -> "Student Name"
      const label = key
        .replace(/_/g, " ")
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase())
        .trim();

      let displayVal = "";
      if (typeof value === "object" && value !== null) {
        displayVal = `<pre style="margin:0;font-size:12px;">${escapeHtml(JSON.stringify(value, null, 2))}</pre>`;
      } else {
        const strVal = String(value ?? "");
        const isUpload = strVal.startsWith("/uploads/") || strVal.includes("/uploads/");
        const isImage = [".webp", ".png", ".jpg", ".jpeg", ".gif", ".avif"].some((ext) => strVal.toLowerCase().endsWith(ext));
        const isDoc = [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".txt"].some((ext) => strVal.toLowerCase().endsWith(ext));

        if (isUpload || ((isImage || isDoc) && strVal.length > 4)) {
          const cleanName = getCleanFileName(strVal);
          const icon = isImage ? "🖼️" : "📄";
          displayVal = `
            <div style="display: inline-block; padding: 6px 12px; background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
              <span style="font-size: 15px; margin-right: 6px;">${icon}</span>
              <strong style="color: #166534; font-size: 13px;">${escapeHtml(cleanName)}</strong>
              <span style="display: inline-block; margin-left: 8px; font-size: 10px; font-weight: 700; background-color: #22c55e; color: #ffffff; padding: 2px 7px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.5px;">
                📎 Attached
              </span>
            </div>
          `;
        } else {
          displayVal = escapeHtml(strVal);
        }
      }

      return `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 10px 14px; font-weight: 600; color: #334155; width: 35%; vertical-align: top; background-color: #f8fafc; font-size: 13px;">
            ${escapeHtml(label)}
          </td>
          <td style="padding: 10px 14px; color: #0f172a; font-size: 14px; word-break: break-word;">
            ${displayVal}
          </td>
        </tr>
      `;
    })
    .join("");

  return `
    <table style="width: 100%; border-collapse: collapse; margin: 16px 0; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}

/**
 * Wrap an email body in the official Cambridge International School branded layout
 */
export async function wrapWithEmailLayout(
  contentHtml: string,
  options?: {
    previewText?: string;
    actionUrl?: string;
    actionText?: string;
  }
): Promise<string> {
  // Fetch branding settings or fallback to defaults
  let branding = {
    schoolName: "Cambridge International School, Mandi",
    schoolLogo: "/images/crest.png",
    primaryColor: "#0A2540",
    secondaryColor: "#0066FF",
    headerText: "Cambridge International School, Mandi",
    footerText: "This is an automated notification from the Cambridge International School CMS.",
    address: "Lunapani, Tehsil Balh, Distt Mandi, H.P. - 175021",
    phone: "+91 98050 39389",
    website: "https://cismandi.edu.in",
  };

  try {
    const dbBranding = await (prisma as any).emailDesignSetting.findFirst();
    if (dbBranding) {
      branding = { ...branding, ...dbBranding };
    }
  } catch (_) {}

  const actionButton = options?.actionUrl
    ? `
      <div style="text-align: center; margin: 28px 0 16px 0;">
        <a href="${escapeHtml(options.actionUrl)}" 
           style="background-color: ${branding.secondaryColor}; color: #ffffff; padding: 12px 26px; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 8px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
          ${escapeHtml(options.actionText || "View Submission in CMS")} &rarr;
        </a>
      </div>
    `
    : "";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(branding.schoolName)}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #1e293b;">
  <div style="display: none; font-size: 1px; color: #f1f5f9; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    ${escapeHtml(options?.previewText || "")}
  </div>

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f1f5f9; padding: 24px 12px;">
    <tr>
      <td align="center">
        <!-- Container -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 620px; background-color: #ffffff; border-radius: 14px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025); border: 1px solid #e2e8f0;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: ${branding.primaryColor}; padding: 24px 28px; text-align: left; border-bottom: 4px solid #f59e0b;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <span style="display: inline-block; color: #f59e0b; font-size: 11px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase;">
                      Official Communications
                    </span>
                    <h1 style="margin: 4px 0 0 0; color: #ffffff; font-size: 20px; font-weight: 700; line-height: 1.3;">
                      ${escapeHtml(branding.schoolName)}
                    </h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content Body -->
          <tr>
            <td style="padding: 28px 28px 20px 28px;">
              ${contentHtml}
              ${actionButton}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 20px 28px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; line-height: 1.5;">
              <p style="margin: 0 0 6px 0; font-weight: 600; color: #475569;">
                ${escapeHtml(branding.schoolName)}
              </p>
              <p style="margin: 0 0 6px 0;">
                ${escapeHtml(branding.address)} | Ph: ${escapeHtml(branding.phone)}
              </p>
              <p style="margin: 0 0 10px 0;">
                <a href="${escapeHtml(branding.website)}" style="color: ${branding.secondaryColor}; text-decoration: none; font-weight: 600;">Visit Website</a>
              </p>
              <p style="margin: 0; font-size: 11px; color: #94a3b8; border-top: 1px dashed #cbd5e1; padding-top: 10px;">
                ${escapeHtml(branding.footerText)}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
