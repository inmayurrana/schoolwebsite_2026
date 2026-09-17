import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    let submissions: any[] = [];
    try {
      if ((prisma as any).formSubmission) {
        submissions = await (prisma as any).formSubmission.findMany({
          where: { formSlug: slug },
          orderBy: { submittedAt: "desc" },
        });
      } else {
        submissions = (await prisma.$queryRawUnsafe(
          `SELECT * FROM FormSubmission WHERE formSlug = ? ORDER BY submittedAt DESC`,
          slug
        )) as any[];
      }
    } catch (e) {
      submissions = [];
    }

    const parsedSubmissions = submissions.map((s) => {
      let data: Record<string, any> = {};
      try {
        data = JSON.parse(s.dataJson);
      } catch (_) {}
      return {
        id: s.id,
        submissionNo: s.submissionNo,
        formSlug: s.formSlug,
        formTitle: s.formTitle,
        status: s.status,
        submittedAt: s.submittedAt,
        data,
      };
    });

    return NextResponse.json({ submissions: parsedSubmissions });
  } catch (error: any) {
    console.error("Submissions GET error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}
