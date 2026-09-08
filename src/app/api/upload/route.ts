import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate size (max 50MB)
    const MAX_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File exceeds 50MB limit" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate safe unique filename
    const originalExt = path.extname(file.name) || ".bin";
    const cleanBase = path.basename(file.name, originalExt).replace(/[^a-zA-Z0-9_-]/g, "_").substring(0, 30);
    const uniqueHash = crypto.randomBytes(6).toString("hex");
    const filename = `${cleanBase}_${uniqueHash}${originalExt}`;

    // 1. Ensure upload directory exists in storage
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    // 2. Save physical file in storage
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;
    const fileSizeMb = (file.size / (1024 * 1024)).toFixed(2);
    const isImage = file.type.startsWith("image/");
    const isPdf = file.type === "application/pdf" || originalExt.toLowerCase() === ".pdf";

    // 3. Save uploaded document/media record permanently in the database
    const docRecord = await prisma.document.create({
      data: {
        title: file.name,
        category: isImage ? "IMAGE" : isPdf ? "CIRCULAR" : "OTHER",
        docNumber: `DOC-${uniqueHash.toUpperCase()}`,
        fileUrl: publicUrl,
        fileType: file.type || (isPdf ? "application/pdf" : "application/octet-stream"),
        fileSize: `${fileSizeMb} MB`,
        targetAudience: "ALL",
        isPublic: true,
      },
    });

    // 4. Save audit trail record in database
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userName: user.name || "Administrator",
        action: "FILE_UPLOAD",
        entity: "StorageDocument",
        entityId: docRecord.id,
        details: `Saved file "${file.name}" (${fileSizeMb} MB) to storage and recorded in database. URL: ${publicUrl}`,
      },
    });

    return NextResponse.json({
      success: true,
      url: publicUrl,
      name: file.name,
      size: `${fileSizeMb} MB`,
      type: file.type,
      documentId: docRecord.id,
    });
  } catch (error: any) {
    console.error("File upload and database save error:", error);
    return NextResponse.json({ error: "Failed to upload file to storage and database" }, { status: 500 });
  }
}
