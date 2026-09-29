export type EmailProviderType =
  | "GMAIL"
  | "SMTP"
  | "MICROSOFT"
  | "SES"
  | "SENDGRID"
  | "MAILGUN"
  | "RESEND"
  | "BREVO"
  | "OTHER";

export type EmailServiceStatus =
  | "CONNECTED"
  | "NOT_CONFIGURED"
  | "CONNECTION_ERROR"
  | "AUTHENTICATION_ERROR"
  | "DISABLED";

export type EmailLogStatus =
  | "QUEUED"
  | "SENDING"
  | "SENT"
  | "FAILED"
  | "RETRYING"
  | "CANCELLED";

export type EmailEncryptionType = "STARTTLS" | "SSL_TLS" | "NONE";

export interface EmailAttachment {
  filename: string;
  content?: string | Buffer;
  path?: string;
  contentType?: string;
}

export interface EmailSendOptions {
  to: string | string[];
  fromName?: string;
  fromEmail?: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: EmailAttachment[];
  type?: string;
  formSlug?: string;
  submissionId?: string;
  metadata?: Record<string, any>;
}

export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  provider: string;
  error?: string;
}

export interface EmailConnectionResult {
  success: boolean;
  provider: string;
  server: string;
  port: number;
  message: string;
  details?: Record<string, any>;
  error?: string;
}

export interface EmailConfigData {
  id?: string;
  provider: EmailProviderType | string;
  isEnabled: boolean;
  fromName: string;
  fromEmail: string;
  replyToEmail?: string | null;
  smtpHost: string;
  smtpPort: number;
  encryption: EmailEncryptionType | string;
  authRequired: boolean;
  smtpUser: string;
  smtpPass?: string; // Decrypted or new plaintext when saving
  smtpPassEncrypted?: string;
  defaultRecipients?: string | null;
  defaultCc?: string | null;
  defaultBcc?: string | null;
  status: EmailServiceStatus;
  lastTestedAt?: Date | string | null;
  lastError?: string | null;
}

export interface IEmailProvider {
  getProviderName(): string;
  send(options: EmailSendOptions): Promise<EmailSendResult>;
  testConnection(): Promise<EmailConnectionResult>;
  validateConfiguration(config: EmailConfigData): { valid: boolean; errors: string[] };
}
