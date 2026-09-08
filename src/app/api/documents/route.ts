import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { logAuditAction } from "@/lib/audit";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const where: any = { isPublic: true };
    if (category && category !== "ALL") where.category = category;

    const documents = await prisma.document.findMany({
      where,
      orderBy: { publishedDate: "desc" },
    });

    return NextResponse.json({ success: true, documents });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    if (!data.title || !data.fileUrl || !data.category) {
      return NextResponse.json({ error: "Title, fileUrl, and category are required" }, { status: 400 });
    }

    const document = await prisma.document.create({
      data: {
        title: data.title,
        category: data.category,
        docNumber: data.docNumber || `CIS-DOC-${Date.now().toString().slice(-4)}`,
        fileUrl: data.fileUrl,
        fileType: data.fileType || "application/pdf",
        fileSize: data.fileSize || "1.5 MB",
        targetAudience: data.targetAudience || "ALL",
        isPublic: data.isPublic !== undefined ? data.isPublic : true,
      },
    });

    await logAuditAction({
      userId: user.id,
      userName: user.name,
      action: "UPLOAD_DOCUMENT",
      entity: "Document",
      entityId: document.id,
      details: `Uploaded document: ${document.title} (${document.category})`,
    });

    return NextResponse.json({ success: true, document });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to create document" }, { status: 500 });
  }
}
