import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";
import sharp from "sharp";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();

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
    const rawBuffer = Buffer.from(bytes);

    // File extensions & safe naming
    const originalExt = (path.extname(file.name) || ".bin").toLowerCase();
    const cleanBase = path.basename(file.name, originalExt).replace(/[^a-zA-Z0-9_-]/g, "_").substring(0, 30);
    const uniqueHash = crypto.randomBytes(6).toString("hex");

    const isImage = file.type.startsWith("image/") || [".jpg", ".jpeg", ".png", ".webp", ".avif", ".bmp", ".tiff"].includes(originalExt);
    const isPdf = file.type === "application/pdf" || originalExt === ".pdf";

    let finalBuffer: Buffer = rawBuffer;
    let savedFilename = `${cleanBase}_${uniqueHash}${originalExt}`;
    let savedMimeType = file.type || (isPdf ? "application/pdf" : "application/octet-stream");

    // High-performance image compression using sharp to WebP format
    if (isImage && originalExt !== ".svg" && originalExt !== ".gif") {
      try {
        const pipeline = sharp(rawBuffer, { failOn: "none" }).rotate(); // Auto-rotates using EXIF orientation

        // Resize down if wider or taller than 1920px
        pipeline.resize({
          width: 1920,
          height: 1920,
          fit: "inside",
          withoutEnlargement: true,
        });

        // Convert to highly-compressed WebP format
        pipeline.webp({ quality: 80, effort: 6 });

        const compressed = await pipeline.toBuffer();
        if (compressed && compressed.length > 0) {
          finalBuffer = compressed;
          savedFilename = `${cleanBase}_${uniqueHash}.webp`;
          savedMimeType = "image/webp";
        }
      } catch (compressionErr) {
        console.warn("Image compression fallback to raw buffer:", compressionErr);
        finalBuffer = rawBuffer;
      }
    }

    // 1. Ensure upload directory exists in storage
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    // 2. Save physical file in uploads folder
    const targetFilePath = path.join(uploadDir, savedFilename);
    await writeFile(targetFilePath, finalBuffer);

    const publicUrl = `/uploads/${savedFilename}`;
    const sizeInBytes = finalBuffer.length;
    const formattedSize = sizeInBytes > 1024 * 1024 
      ? `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB` 
      : `${(sizeInBytes / 1024).toFixed(0)} KB`;

    // 3. Save uploaded document/media record permanently in the database
    const docRecord = await prisma.document.create({
      data: {
        title: file.name,
        category: isImage ? "IMAGE" : isPdf ? "CIRCULAR" : "OTHER",
        docNumber: `DOC-${uniqueHash.toUpperCase()}`,
        fileUrl: publicUrl,
        fileType: savedMimeType,
        fileSize: formattedSize,
        targetAudience: "ALL",
        isPublic: true,
      },
    });

    // 4. Save audit trail record in database
    try {
      await prisma.auditLog.create({
        data: {
          userId: user?.id || null,
          userName: user?.name || "Administrator",
          action: "FILE_UPLOAD",
          entity: "StorageDocument",
          entityId: docRecord.id,
          details: `Saved & compressed file "${file.name}" to WebP/storage (${formattedSize}). URL: ${publicUrl}`,
        },
      });
    } catch (_) {}

    return NextResponse.json({
      success: true,
      url: publicUrl,
      name: savedFilename,
      size: formattedSize,
      type: savedMimeType,
      documentId: docRecord.id,
    });
  } catch (error: any) {
    console.error("File upload and database save error:", error);
    return NextResponse.json({ error: "Failed to upload file to storage and database" }, { status: 500 });
  }
}
