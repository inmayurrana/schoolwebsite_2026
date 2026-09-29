import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { emailService } from "@/lib/email/emailService";

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let customConfig: any = undefined;
    try {
      customConfig = await req.json();
    } catch (_) {}

    const result = await emailService.testConnection(customConfig);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Test connection error:", error);
    return NextResponse.json(
      {
        success: false,
        provider: "Unknown",
        server: "",
        port: 0,
        message: `Connection test error: ${error.message || String(error)}`,
        error: error.message || String(error),
      },
      { status: 500 }
    );
  }
}
