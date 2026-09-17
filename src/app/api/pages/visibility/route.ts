import { NextResponse } from "next/server";
import { getCachedVisibility } from "@/lib/pageContentCache";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { visibility, pages } = await getCachedVisibility();

    const response = NextResponse.json({
      success: true,
      visibility,
      pages,
      timestamp: Date.now(),
    });

    response.headers.set(
      "Cache-Control",
      "public, s-maxage=30, stale-while-revalidate=60"
    );
    return response;
  } catch (error: any) {
    console.error("Pages visibility GET error:", error);
    return NextResponse.json({ error: "Failed to fetch visibility" }, { status: 500 });
  }
}
