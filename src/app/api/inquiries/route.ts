import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

// Public: Submit inquiry
export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.name || !data.email || !data.phone) {
      return NextResponse.json({ error: "Name, email, and phone are required" }, { status: 400 });
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        studentGrade: data.studentGrade || null,
        inquiryType: data.inquiryType || "GENERAL",
        subject: data.subject || "General Inquiry",
        message: data.message || "Request for information",
        status: "NEW",
      },
    });

    return NextResponse.json({ success: true, inquiry });
  } catch (error: any) {
    console.error("Submit inquiry error:", error);
    return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 500 });
  }
}

// Admin: Get all inquiries
export async function GET(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, inquiries });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch inquiries" }, { status: 500 });
  }
}
