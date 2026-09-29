import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { emailService } from "@/lib/email/emailService";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const result = await emailService.retryEmail(id);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Retry email error:", error);
    return NextResponse.json({ error: error.message || "Failed to retry email delivery" }, { status: 500 });
  }
}
