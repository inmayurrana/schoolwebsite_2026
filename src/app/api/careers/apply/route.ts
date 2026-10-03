import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.jobId || !data.applicantName || !data.email || !data.phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const application = await prisma.jobApplication.create({
      data: {
        jobId: data.jobId,
        applicantName: data.applicantName,
        email: data.email,
        phone: data.phone,
        qualification: data.qualification || "",
        experience: data.experience || "",
        currentCtc: data.currentCtc || null,
        expectedCtc: data.expectedCtc || null,
        coverLetter: data.coverLetter || null,
        resumeUrl: data.resumeUrl || "https://example.com/resume.pdf",
      },
    });

    // Background email alert with attachments
    try {
      const { emailService } = await import("@/lib/email/emailService");
      const appRef = `CAR-${Date.now().toString().slice(-4)}`;
      emailService
        .handleFormSubmission({
          formSlug: "careers-apply",
          formTitle: "Career Application",
          submissionNo: appRef,
          formData: data,
        })
        .catch((e) => console.error("Careers direct apply email error:", e));
    } catch (_) {}

    return NextResponse.json({ success: true, application });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to submit job application" }, { status: 500 });
  }
}
