import { prisma } from "@/lib/prisma";

export interface DefaultTemplateDef {
  name: string;
  slug: string;
  type: string;
  subject: string;
  htmlBody: string;
  plainTextBody?: string;
  isSystem: boolean;
}

export const DEFAULT_TEMPLATES: DefaultTemplateDef[] = [
  {
    name: "New Admission Enquiry",
    slug: "new-admission-enquiry",
    type: "FORM_NOTIFICATION",
    subject: "New Admission Enquiry: {{student_name}} - Grade {{grade_applying}} (Ref: {{submission_id}})",
    htmlBody: `
      <div style="margin-bottom: 20px;">
        <span style="background-color: #fef3c7; color: #92400e; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase;">
          New Admission Application
        </span>
        <h2 style="margin: 12px 0 6px 0; color: #0f172a; font-size: 18px; font-weight: 700;">
          Admission Enquiry Received
        </h2>
        <p style="margin: 0; color: #64748b; font-size: 14px;">
          A new prospective student admission form was submitted on <strong>{{submission_date}}</strong> via the website portal.
        </p>
      </div>

      <div style="background-color: #f8fafc; border-left: 4px solid #0066FF; padding: 12px 16px; margin: 16px 0; border-radius: 4px;">
        <p style="margin: 0; font-size: 13px; color: #334155;">
          <strong>Submission Reference:</strong> {{submission_id}}<br>
          <strong>Student Name:</strong> {{student_name}}<br>
          <strong>Parent/Guardian:</strong> {{parent_name}}<br>
          <strong>Grade Applying For:</strong> {{grade_applying}}<br>
          <strong>Contact Mobile:</strong> {{phone}}<br>
          <strong>Email:</strong> {{email}}
        </p>
      </div>

      <h3 style="margin: 20px 0 10px 0; font-size: 15px; color: #1e293b;">Complete Submission Details</h3>
      {{fields_table}}
    `,
    plainTextBody:
      "New Admission Enquiry Received\n\nStudent: {{student_name}}\nGrade: {{grade_applying}}\nParent: {{parent_name}}\nContact: {{phone}}, {{email}}\nRef: {{submission_id}}\nDate: {{submission_date}}",
    isSystem: true,
  },
  {
    name: "New Contact Form Submission",
    slug: "new-contact-submission",
    type: "FORM_NOTIFICATION",
    subject: "New Website Contact Message from {{name}} - {{submission_id}}",
    htmlBody: `
      <div style="margin-bottom: 20px;">
        <span style="background-color: #dbeafe; color: #1e40af; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase;">
          General Inquiry
        </span>
        <h2 style="margin: 12px 0 6px 0; color: #0f172a; font-size: 18px; font-weight: 700;">
          New Message from Contact Form
        </h2>
        <p style="margin: 0; color: #64748b; font-size: 14px;">
          A visitor has contacted the school on <strong>{{submission_date}}</strong>.
        </p>
      </div>

      <div style="background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 12px 16px; margin: 16px 0; border-radius: 4px;">
        <p style="margin: 0; font-size: 13px; color: #334155;">
          <strong>Sender:</strong> {{name}}<br>
          <strong>Email:</strong> {{email}}<br>
          <strong>Phone:</strong> {{phone}}<br>
          <strong>Subject:</strong> {{subject}}
        </p>
      </div>

      <h3 style="margin: 20px 0 10px 0; font-size: 15px; color: #1e293b;">Message Content</h3>
      <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; color: #1e293b; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">
{{message}}
      </div>

      {{fields_table}}
    `,
    plainTextBody:
      "New Contact Form Submission\n\nFrom: {{name}} ({{email}}, {{phone}})\nSubject: {{subject}}\nMessage: {{message}}\nRef: {{submission_id}}",
    isSystem: true,
  },
  {
    name: "New Career Application",
    slug: "new-career-application",
    type: "FORM_NOTIFICATION",
    subject: "New Career Application: {{applicant_name}} - {{position}} (Ref: {{submission_id}})",
    htmlBody: `
      <div style="margin-bottom: 20px;">
        <span style="background-color: #f3e8ff; color: #6b21a8; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase;">
          Human Resources
        </span>
        <h2 style="margin: 12px 0 6px 0; color: #0f172a; font-size: 18px; font-weight: 700;">
          New Employment Application
        </h2>
        <p style="margin: 0; color: #64748b; font-size: 14px;">
          An application for <strong>{{position}}</strong> has been submitted.
        </p>
      </div>

      <div style="background-color: #f8fafc; border-left: 4px solid #8b5cf6; padding: 12px 16px; margin: 16px 0; border-radius: 4px;">
        <p style="margin: 0; font-size: 13px; color: #334155;">
          <strong>Candidate:</strong> {{applicant_name}}<br>
          <strong>Email:</strong> {{email}}<br>
          <strong>Phone:</strong> {{phone}}<br>
          <strong>Total Experience:</strong> {{experience}}<br>
          <strong>Highest Qualification:</strong> {{qualification}}
        </p>
      </div>

      {{fields_table}}
    `,
    plainTextBody:
      "New Career Application\n\nCandidate: {{applicant_name}}\nPosition: {{position}}\nContact: {{email}}, {{phone}}\nRef: {{submission_id}}",
    isSystem: true,
  },
  {
    name: "New Feedback Submission",
    slug: "new-feedback-submission",
    type: "FORM_NOTIFICATION",
    subject: "New Parent / Visitor Feedback - {{submission_id}}",
    htmlBody: `
      <div style="margin-bottom: 20px;">
        <span style="background-color: #ecfdf5; color: #047857; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase;">
          Community Feedback
        </span>
        <h2 style="margin: 12px 0 6px 0; color: #0f172a; font-size: 18px; font-weight: 700;">
          Feedback Received
        </h2>
        <p style="margin: 0; color: #64748b; font-size: 14px;">
          New feedback has been recorded from <strong>{{name}}</strong> on {{submission_date}}.
        </p>
      </div>
      {{fields_table}}
    `,
    plainTextBody: "New Feedback Received from {{name}} ({{email}}). Ref: {{submission_id}}",
    isSystem: true,
  },
  {
    name: "New General Enquiry",
    slug: "new-general-enquiry",
    type: "FORM_NOTIFICATION",
    subject: "New Inquiry: {{subject}} (Ref: {{submission_id}})",
    htmlBody: `
      <div style="margin-bottom: 20px;">
        <h2 style="margin: 12px 0 6px 0; color: #0f172a; font-size: 18px; font-weight: 700;">
          General Inquiry Notification
        </h2>
        <p style="margin: 0; color: #64748b; font-size: 14px;">
          Form <strong>{{form_name}}</strong> was submitted on {{submission_date}}.
        </p>
      </div>
      {{fields_table}}
    `,
    plainTextBody: "New Inquiry from {{name}} on {{submission_date}}. Ref: {{submission_id}}",
    isSystem: true,
  },
  {
    name: "Form Submission Confirmation",
    slug: "form-submission-confirmation",
    type: "FORM_CONFIRMATION",
    subject: "Thank you for contacting Cambridge International School (Ref: {{submission_id}})",
    htmlBody: `
      <div style="margin-bottom: 24px;">
        <h2 style="margin: 0 0 10px 0; color: #0f172a; font-size: 20px; font-weight: 700;">
          We Have Received Your Submission
        </h2>
        <p style="margin: 0 0 14px 0; color: #334155; font-size: 15px; line-height: 1.6;">
          Dear <strong>{{name}}</strong>,
        </p>
        <p style="margin: 0 0 14px 0; color: #475569; font-size: 14px; line-height: 1.6;">
          Thank you for reaching out to <strong>Cambridge International School, Mandi</strong>. We have successfully received your <strong>{{form_name}}</strong>.
        </p>
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 18px; margin: 20px 0;">
          <p style="margin: 0; font-size: 13px; color: #334155;">
            <strong>Your Reference ID:</strong> <span style="color: #0066FF; font-weight: 700;">{{submission_id}}</span><br>
            <strong>Date Received:</strong> {{submission_date}}
          </p>
        </div>
        <p style="margin: 0; color: #475569; font-size: 14px; line-height: 1.6;">
          Our administrative office will review your enquiry and get back to you shortly. If your matter is urgent, please feel free to call our admissions desk at <strong>+91 98050 39389</strong>.
        </p>
      </div>
    `,
    plainTextBody:
      "Dear {{name}},\n\nThank you for reaching out to Cambridge International School, Mandi. We have received your submission (Ref: {{submission_id}}).\n\nOur team will contact you shortly.",
    isSystem: true,
  },
  {
    name: "Application Received",
    slug: "application-received",
    type: "FORM_CONFIRMATION",
    subject: "Application Acknowledgment: {{student_name}} - {{submission_id}}",
    htmlBody: `
      <div style="margin-bottom: 24px;">
        <h2 style="margin: 0 0 10px 0; color: #0f172a; font-size: 20px; font-weight: 700;">
          Admission Application Acknowledged
        </h2>
        <p style="margin: 0 0 14px 0; color: #475569; font-size: 14px; line-height: 1.6;">
          Dear Parents / Guardians of <strong>{{student_name}}</strong>,
        </p>
        <p style="margin: 0 0 14px 0; color: #475569; font-size: 14px; line-height: 1.6;">
          Thank you for your interest in Cambridge International School, Mandi. Your admission application for <strong>Grade {{grade_applying}}</strong> has been registered under Application No. <strong>{{submission_id}}</strong>.
        </p>
        <p style="margin: 0; color: #475569; font-size: 14px; line-height: 1.6;">
          Our admissions committee will verify the submitted information and schedule the student interaction / campus tour.
        </p>
      </div>
    `,
    plainTextBody:
      "Dear Parent,\n\nYour admission application for {{student_name}} (Grade {{grade_applying}}) is acknowledged with Ref {{submission_id}}.",
    isSystem: true,
  },
  {
    name: "Email Verification",
    slug: "email-verification",
    type: "SYSTEM",
    subject: "Verify Your Email Address - Cambridge International School",
    htmlBody: `
      <div style="margin-bottom: 24px;">
        <h2 style="margin: 0 0 10px 0; color: #0f172a; font-size: 20px; font-weight: 700;">
          Verify Your Email Address
        </h2>
        <p style="margin: 0 0 14px 0; color: #475569; font-size: 14px; line-height: 1.6;">
          Please click the button below to verify your email address and activate your account.
        </p>
      </div>
    `,
    plainTextBody: "Please verify your email address for Cambridge International School.",
    isSystem: true,
  },
  {
    name: "Password Reset",
    slug: "password-reset",
    type: "PASSWORD_RESET",
    subject: "Reset Your Password - Cambridge International School CMS",
    htmlBody: `
      <div style="margin-bottom: 24px;">
        <h2 style="margin: 0 0 10px 0; color: #0f172a; font-size: 20px; font-weight: 700;">
          Password Reset Request
        </h2>
        <p style="margin: 0 0 14px 0; color: #475569; font-size: 14px; line-height: 1.6;">
          We received a request to reset your password for the Cambridge International School CMS.
        </p>
      </div>
    `,
    plainTextBody: "Password reset request for Cambridge International School CMS.",
    isSystem: true,
  },
];

/**
 * Ensures all default templates exist in the database
 */
export async function ensureDefaultTemplatesExist(): Promise<void> {
  try {
    for (const tpl of DEFAULT_TEMPLATES) {
      const existing = await (prisma as any).emailTemplate.findUnique({
        where: { slug: tpl.slug },
      });
      if (!existing) {
        await (prisma as any).emailTemplate.create({
          data: tpl,
        });
      }
    }
  } catch (err) {
    console.error("Error ensuring default email templates:", err);
  }
}
