import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getFormDefault } from "@/lib/formRegistry";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const formSlug = body.formSlug || "admissions-apply";
    const rawData = body.submissionData || body;
    const { formSlug: _ignored, ...formData } = rawData;

    const formDef = getFormDefault(formSlug);
    const prefix = formDef.settings?.receiptPrefix || "CIS-REF";
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const submissionNo = `${prefix}-${Date.now().toString().slice(-4)}${randomDigits}`;

    // 1. Admission Form Handling
    if (formSlug === "admissions-apply") {
      try {
        const studentName = formData.studentName || "Candidate";
        const email = formData.email || "admissions@cismandi.edu.in";
        const phone = formData.phone || formData.fatherPhone || "0000000000";

        await prisma.admissionApplication.create({
          data: {
            applicationNo: submissionNo,
            studentName,
            dob: formData.dob || "2018-01-01",
            gender: formData.gender || "Male",
            bloodGroup: formData.bloodGroup || "B+",
            gradeApplying: formData.gradeApplying || "Grade I",
            academicYear: formData.academicYear || "2027-2028",
            stream: formData.stream || null,
            fatherName: formData.fatherName || "Father",
            fatherPhone: formData.fatherPhone || phone,
            fatherOccupation: formData.fatherOccupation || null,
            motherName: formData.motherName || "Mother",
            motherPhone: formData.motherPhone || phone,
            motherOccupation: formData.motherOccupation || null,
            email,
            phone,
            address: formData.address || "Mandi, HP",
            city: formData.city || "Mandi",
            state: formData.state || "Himachal Pradesh",
            pincode: formData.pincode || "175001",
            previousSchool: formData.previousSchool || null,
            previousGrade: formData.previousGrade || null,
            previousMarks: formData.previousMarks || null,
            transportRequired: Boolean(formData.transportRequired),
            hostelRequired: Boolean(formData.hostelRequired),
            remarks: formData.remarks || null,
            status: "SUBMITTED",
          },
        });
      } catch (err) {
        console.error("AdmissionApplication table insert error:", err);
      }
    }

    // 2. Careers Form Handling
    else if (formSlug === "careers-apply") {
      try {
        // If there's an open job matching position or fallback
        const openJob = await prisma.jobOpening.findFirst({ where: { status: "OPEN" } });
        if (openJob) {
          await prisma.jobApplication.create({
            data: {
              jobId: openJob.id,
              applicantName: formData.applicantName || "Applicant",
              email: formData.email || "applicant@example.com",
              phone: formData.phone || "0000000000",
              qualification: formData.qualification || "Qualified",
              experience: formData.experience || "0-1 Year",
              currentCtc: formData.currentCtc || null,
              expectedCtc: formData.expectedCtc || null,
              coverLetter: formData.coverLetter || null,
              resumeUrl: formData.resumeUrl || "https://example.com/resume.pdf",
              status: "PENDING",
            },
          });
        }
      } catch (err) {
        console.error("JobApplication insert error:", err);
      }
    }

    // 3. Contact & Inquiry Form Handling
    else if (formSlug === "contact-inquiry") {
      try {
        await prisma.inquiry.create({
          data: {
            name: formData.name || "Visitor",
            email: formData.email || "visitor@example.com",
            phone: formData.phone || "0000000000",
            inquiryType: formData.inquiryType || "GENERAL",
            subject: formData.subject || "Website Inquiry",
            message: formData.message || "Inquiry details",
            status: "NEW",
          },
        });
      } catch (err) {
        console.error("Inquiry table insert error:", err);
      }
    }

    // 4. Universal FormSubmission record
    try {
      if ((prisma as any).formSubmission) {
        await (prisma as any).formSubmission.create({
          data: {
            formSlug,
            formTitle: formDef.title || formSlug,
            submissionNo,
            dataJson: JSON.stringify(formData),
            status: "SUBMITTED",
          },
        });
      } else {
        const id = `sub_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        const now = new Date().toISOString();
        await prisma.$queryRawUnsafe(
          `INSERT INTO FormSubmission (id, formSlug, formTitle, submissionNo, dataJson, status, submittedAt) 
           VALUES (?, ?, ?, ?, ?, 'SUBMITTED', ?)`,
          id,
          formSlug,
          formDef.title || formSlug,
          submissionNo,
          JSON.stringify(formData),
          now
        );
      }
    } catch (err) {
      console.error("FormSubmission insert error:", err);
    }

    // 5. Increment FormDefinition submissionsCount
    try {
      if ((prisma as any).formDefinition) {
        await (prisma as any).formDefinition.updateMany({
          where: { slug: formSlug },
          data: { submissionsCount: { increment: 1 } },
        });
      } else {
        await prisma.$queryRawUnsafe(
          `UPDATE FormDefinition SET submissionsCount = submissionsCount + 1 WHERE slug = ?`,
          formSlug
        );
      }
    } catch (_) {}

    // 6. Record Audit Log
    try {
      await prisma.auditLog.create({
        data: {
          userName: "Public Visitor",
          action: "SUBMIT_FORM",
          entity: "FormSubmission",
          entityId: submissionNo,
          details: `Submitted form "${formDef.title}" (Ref: ${submissionNo})`,
        },
      });
    } catch (_) {}

    return NextResponse.json({
      success: true,
      submissionNo,
      applicationNo: submissionNo,
      date: new Date().toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      data: formData,
      formTitle: formDef.title,
    });
  } catch (error: any) {
    console.error("Form submit error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit form" },
      { status: 500 }
    );
  }
}
