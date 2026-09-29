import { GenericSmtpProvider } from "./smtpProvider";
import { EmailConnectionResult, EmailConfigData } from "../types";

export class GmailEmailProvider extends GenericSmtpProvider {
  constructor(config: EmailConfigData) {
    const cleanPass = config.smtpPass ? config.smtpPass.replace(/\s+/g, "") : "";
    const gmailConfig: EmailConfigData = {
      ...config,
      provider: "GMAIL",
      smtpHost: config.smtpHost || "smtp.gmail.com",
      smtpPort: config.smtpPort || (config.encryption === "SSL_TLS" ? 465 : 587),
      authRequired: true,
      smtpPass: cleanPass,
    };
    super(gmailConfig);
  }

  override getProviderName(): string {
    return "Gmail";
  }

  override async testConnection(): Promise<EmailConnectionResult> {
    if (!this.config.smtpUser || !this.config.smtpPass) {
      return {
        success: false,
        provider: "Gmail",
        server: "smtp.gmail.com",
        port: this.config.smtpPort || 587,
        message: "✗ Gmail Credentials Missing",
        error: "Gmail requires both your Gmail address (Username) and a 16-character Google App Password. Please enter your App Password in Email Settings.",
        details: {
          recommendation: [
            "1. Enter your full Gmail address (e.g. school@gmail.com) as Username",
            "2. Generate a 16-character Google App Password from your Google Account > Security",
            "3. Enter the 16-character App Password in the Password field",
            "4. Save settings and re-test connection",
          ],
        },
      };
    }

    const result = await super.testConnection();

    if (!result.success && result.error) {
      // Provide actionable Gmail-specific diagnostics
      let enhancedAdvice = result.error;
      if (
        result.error.includes("authentication") ||
        result.error.includes("Invalid login") ||
        result.error.includes("535") ||
        result.error.includes("534")
      ) {
        enhancedAdvice =
          "Gmail SMTP Authentication Failed. Google requires a 16-character App Password when 2-Step Verification is active. Normal Gmail account passwords are not permitted. Please generate an App Password in Google Account Settings > Security.";
      }

      return {
        ...result,
        message: `✗ Gmail Authentication Failed`,
        details: {
          recommendation: [
            "1. Verify the Gmail address matches your account",
            "2. Ensure 2-Step Verification is enabled on your Google Account",
            "3. Generate a dedicated Google App Password (16 characters, e.g. 'abcd efgh ijkl mnop')",
            "4. Enter the App Password in the Password field (spaces are automatically ignored)",
            "5. Verify port is 587 (STARTTLS) or 465 (SSL/TLS)",
          ],
          rawError: result.error,
        },
        error: enhancedAdvice,
      };
    }

    return {
      ...result,
      provider: "Gmail",
      server: "smtp.gmail.com",
      message: "✓ Gmail SMTP connection and handshake successful! Ready for live delivery.",
    };
  }

  override validateConfiguration(config: EmailConfigData): { valid: boolean; errors: string[] } {
    const base = super.validateConfiguration(config);
    const errors = [...base.errors];

    if (!config.smtpUser || !config.smtpUser.includes("@")) {
      errors.push("Valid Google / Gmail email address is required as SMTP Username");
    }

    if (config.smtpPass && config.smtpPass.replace(/\s+/g, "").length < 8) {
      errors.push("Gmail password appears invalid. Note: Use a 16-character Google App Password.");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
