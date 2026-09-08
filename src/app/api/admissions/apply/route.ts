import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateApplicationNumber } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.studentName || !data.dob || !data.gradeApplying || !data.fatherName || !data.phone || !data.email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const applicationNo = generateApplicationNumber();

    const application = await prisma.admissionApplication.create({
      data: {
        applicationNo,
        studentName: data.studentName,
        dob: data.dob,
        gender: data.gender || "Male",
        bloodGroup: data.bloodGroup || null,
        gradeApplying: data.gradeApplying,
        academicYear: data.academicYear || "2025-2026",
        stream: data.stream || null,
        fatherName: data.fatherName,
        fatherPhone: data.fatherPhone || data.phone,
        fatherOccupation: data.fatherOccupation || null,
        motherName: data.motherName || "Not Specified",
        motherPhone: data.motherPhone || data.fatherPhone || data.phone,
        motherOccupation: data.motherOccupation || null,
        email: data.email,
        phone: data.phone,
        address: data.address || "Mandi, HP",
        city: data.city || "Mandi",
        state: data.state || "Himachal Pradesh",
        pincode: data.pincode || "175001",
        previousSchool: data.previousSchool || null,
        previousGrade: data.previousGrade || null,
        previousMarks: data.previousMarks || null,
        transportRequired: Boolean(data.transportRequired),
        hostelRequired: Boolean(data.hostelRequired),
        remarks: data.remarks || null,
      },
    });

    return NextResponse.json({
      success: true,
      applicationNo,
      application,
    });
  } catch (error: any) {
    console.error("Admission Apply API error:", error);
    return NextResponse.json({ error: error.message || "Failed to submit application" }, { status: 500 });
  }
}
