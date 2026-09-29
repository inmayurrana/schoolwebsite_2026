import { IEmailProvider, EmailConfigData } from "../types";
import { GmailEmailProvider } from "./gmailProvider";
import { GenericSmtpProvider } from "./smtpProvider";

export function createEmailProvider(config: EmailConfigData): IEmailProvider {
  const providerType = (config.provider || "GMAIL").toUpperCase();

  switch (providerType) {
    case "GMAIL":
      return new GmailEmailProvider(config);

    case "SMTP":
    case "OTHER":
      return new GenericSmtpProvider(config);

    case "MICROSOFT":
      // Microsoft 365 / Outlook SMTP uses smtp.office365.com on port 587 STARTTLS
      return new GenericSmtpProvider({
        ...config,
        smtpHost: config.smtpHost || "smtp.office365.com",
        smtpPort: config.smtpPort || 587,
        encryption: config.encryption || "STARTTLS",
      });

    case "SES":
      // Amazon SES SMTP wrapper
      return new GenericSmtpProvider(config);

    case "RESEND":
    case "SENDGRID":
    case "MAILGUN":
    case "BREVO":
      // Generic SMTP fallback for modern API providers providing SMTP relay credentials
      return new GenericSmtpProvider(config);

    default:
      return new GenericSmtpProvider(config);
  }
}
