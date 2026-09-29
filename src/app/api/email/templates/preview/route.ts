import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import {
  interpolateVariables,
  generateSubmissionFieldsTable,
  wrapWithEmailLayout,
  TemplateVariables,
} from "@/lib/email/templateRenderer";

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subject, htmlBody, sampleData } = await req.json();

    const mockVariables: TemplateVariables = {
      site_name: "Cambridge International School",
      site_url: "https://cismandi.edu.in",
      form_name: "Admission Enquiry",
      submission_id: "SUB-2026-00123",
      submission_date: "29 September 2026, 8:40 PM",
      view_submission_url: "http://localhost:3000/admin/forms",
      student_name: "Rahul Sharma",
      parent_name: "Amit Sharma",
      grade_applying: "Grade 8",
      class: "8",
      phone: "+91 98050 39389",
      email: "amit.sharma@example.com",
      message: "We would like to schedule a campus tour and obtain admission guidelines for Grade 8.",
      position: "Senior Mathematics Educator (TGT/PGT)",
      qualification: "M.Sc. Mathematics, B.Ed (Gold Medalist)",
      experience: "7 Years CBSE Experience",
      applicant_name: "Dr. Sunita Verma",
      name: "Rahul Sharma",
      ...sampleData,
    };

    const mockTable = generateSubmissionFieldsTable({
      "Student Name": mockVariables.student_name,
      "Parent / Guardian": mockVariables.parent_name,
      "Grade Applying": mockVariables.grade_applying,
      "Contact Mobile": mockVariables.phone,
      "Email Address": mockVariables.email,
      "Residence City": "Mandi, Himachal Pradesh",
      "Message / Query": mockVariables.message,
    });

    const enrichedVariables = {
      ...mockVariables,
      fields_table: mockTable,
    };

    const renderedSubject = interpolateVariables(subject || "", enrichedVariables, false);
    const renderedBody = interpolateVariables(htmlBody || "", enrichedVariables, false);

    const renderedHtml = await wrapWithEmailLayout(renderedBody, {
      previewText: renderedSubject,
      actionUrl: "http://localhost:3000/admin/forms",
      actionText: "View Submission in CMS",
    });

    return NextResponse.json({
      success: true,
      subject: renderedSubject,
      html: renderedHtml,
      sampleVariables: enrichedVariables,
    });
  } catch (error: any) {
    console.error("Preview render error:", error);
    return NextResponse.json({ error: error.message || "Failed to render preview" }, { status: 500 });
  }
}
