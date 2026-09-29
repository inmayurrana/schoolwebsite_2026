import nodemailer from "nodemailer";
import {
  IEmailProvider,
  EmailSendOptions,
  EmailSendResult,
  EmailConnectionResult,
  EmailConfigData,
} from "../types";

export class GenericSmtpProvider implements IEmailProvider {
  protected config: EmailConfigData;

  constructor(config: EmailConfigData) {
    this.config = config;
  }

  getProviderName(): string {
    return "Generic SMTP";
  }

  protected createTransporter() {
    const isSecure =
      this.config.encryption === "SSL_TLS" || this.config.smtpPort === 465;

    const transportOptions: any = {
      host: this.config.smtpHost || "localhost",
      port: this.config.smtpPort || 587,
      secure: isSecure,
      connectionTimeout: 10000,
      greetingTimeout: 8000,
      socketTimeout: 15000,
    };

    if (this.config.encryption === "STARTTLS") {
      transportOptions.requireTLS = true;
      transportOptions.tls = {
        rejectUnauthorized: true,
      };
    } else if (this.config.encryption === "NONE") {
      transportOptions.ignoreTLS = true;
    }

    if (this.config.authRequired) {
      const user = (this.config.smtpUser || "").trim();
      let pass = (this.config.smtpPass || "").trim();

      if (this.config.provider === "GMAIL" || (this.config.smtpHost && this.config.smtpHost.includes("gmail"))) {
        pass = pass.replace(/\s+/g, "");
      }

      if (!user) {
        throw new Error("SMTP Username / Email is required for authentication.");
      }
      if (!pass) {
        throw new Error("SMTP Password or Google App Password is required when authentication is enabled. Please enter your password in Email Settings.");
      }

      transportOptions.auth = {
        user,
        pass,
      };
    }

    return nodemailer.createTransport(transportOptions);
  }

  async testConnection(): Promise<EmailConnectionResult> {
    try {
      const transporter = this.createTransporter();
      await transporter.verify();

      return {
        success: true,
        provider: this.getProviderName(),
        server: this.config.smtpHost,
        port: this.config.smtpPort,
        message: "✓ SMTP connection and authentication successful",
        details: {
          host: this.config.smtpHost,
          port: this.config.smtpPort,
          encryption: this.config.encryption,
          authenticatedUser: this.config.smtpUser,
        },
      };
    } catch (err: any) {
      const errorMsg = err?.message || String(err);
      let friendlyError = errorMsg;

      if (
        errorMsg.includes("Missing credentials") ||
        errorMsg.includes("PLAIN") ||
        errorMsg.includes("No authentication mechanism")
      ) {
        friendlyError = "Missing credentials: Password or Google App Password is required. Please enter your password in Email Settings and save.";
      } else if (errorMsg.includes("EAUTH") || errorMsg.includes("Invalid login") || errorMsg.includes("535")) {
        friendlyError = "SMTP authentication failed. Please verify your email and password (for Gmail, ensure you use a 16-character App Password).";
      } else if (errorMsg.includes("ETIMEDOUT") || errorMsg.includes("ECONNREFUSED")) {
        friendlyError = `Connection to ${this.config.smtpHost}:${this.config.smtpPort} timed out or was refused. Check host and port.`;
      } else if (errorMsg.includes("self signed certificate") || errorMsg.includes("CERT")) {
        friendlyError = "TLS/SSL Certificate validation failed for the mail server.";
      }

      return {
        success: false,
        provider: this.getProviderName(),
        server: this.config.smtpHost,
        port: this.config.smtpPort,
        message: `✗ SMTP connection failed: ${friendlyError}`,
        error: friendlyError,
      };
    }
  }

  async send(options: EmailSendOptions): Promise<EmailSendResult> {
    try {
      const transporter = this.createTransporter();

      const fromAddress = options.fromEmail || this.config.fromEmail;
      const fromDisplayName = options.fromName || this.config.fromName;
      const fromHeader = `"${fromDisplayName}" <${fromAddress}>`;

      const mailOptions: any = {
        from: fromHeader,
        to: Array.isArray(options.to) ? options.to.join(", ") : options.to,
        subject: options.subject,
        html: options.html,
      };

      if (options.text) {
        mailOptions.text = options.text;
      }

      if (options.cc) {
        mailOptions.cc = Array.isArray(options.cc) ? options.cc.join(", ") : options.cc;
      }

      if (options.bcc) {
        mailOptions.bcc = Array.isArray(options.bcc) ? options.bcc.join(", ") : options.bcc;
      }

      if (options.replyTo || this.config.replyToEmail) {
        mailOptions.replyTo = options.replyTo || this.config.replyToEmail;
      }

      if (options.attachments && options.attachments.length > 0) {
        mailOptions.attachments = options.attachments;
      }

      const info = await transporter.sendMail(mailOptions);

      return {
        success: true,
        messageId: info.messageId,
        provider: this.getProviderName(),
      };
    } catch (err: any) {
      console.error(`Email send error (${this.getProviderName()}):`, err);
      const rawError = err?.message || String(err);
      let friendlyError = rawError;

      if (
        rawError.includes("Missing credentials") ||
        rawError.includes("PLAIN") ||
        rawError.includes("No authentication mechanism")
      ) {
        friendlyError = "Missing credentials: Password or Google App Password is required. Please configure your password in Communications > Email Settings.";
      } else if (rawError.includes("EAUTH") || rawError.includes("Invalid login") || rawError.includes("535")) {
        friendlyError = "SMTP Authentication failed: Invalid username or password. For Gmail, please ensure you use a 16-character Google App Password.";
      }

      return {
        success: false,
        provider: this.getProviderName(),
        error: friendlyError,
      };
    }
  }

  validateConfiguration(config: EmailConfigData): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!config.smtpHost) errors.push("SMTP Host is required");
    if (!config.smtpPort || config.smtpPort <= 0) errors.push("Valid SMTP Port is required");
    if (!config.fromEmail) errors.push("From Email address is required");
    if (config.authRequired && !config.smtpUser) errors.push("SMTP Username is required when authentication is enabled");

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
