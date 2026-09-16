const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

async function compressAllUploads() {
  const uploadsDir = path.join(__dirname, "..", "public", "uploads");

  if (!fs.existsSync(uploadsDir)) {
    console.log("Uploads directory does not exist.");
    return;
  }

  const files = fs.readdirSync(uploadsDir);
  const imageExtensions = [".jpg", ".jpeg", ".png", ".bmp", ".tiff"];

  let totalOriginalBytes = 0;
  let totalWebPBytes = 0;
  let compressedCount = 0;

  console.log(`🔍 Scanning ${files.length} files in ${uploadsDir} for compression...\n`);

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (!imageExtensions.includes(ext)) {
      continue;
    }

    const filePath = path.join(uploadsDir, file);
    const baseName = path.basename(file, ext);
    const webpPath = path.join(uploadsDir, `${baseName}.webp`);

    try {
      const originalStat = fs.statSync(filePath);
      const originalSize = originalStat.size;
      totalOriginalBytes += originalSize;

      const rawBuffer = fs.readFileSync(filePath);

      const webpBuffer = await sharp(rawBuffer, { failOnError: false })
        .rotate()
        .resize({
          width: 1920,
          height: 1920,
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality: 82, effort: 6 })
        .toBuffer();

      fs.writeFileSync(webpPath, webpBuffer);
      const webpSize = webpBuffer.length;
      totalWebPBytes += webpSize;
      compressedCount++;

      const savings = (((originalSize - webpSize) / originalSize) * 100).toFixed(1);
      console.log(
        `⚡ [WebP Generated] ${file} (${(originalSize / 1024).toFixed(0)} KB) -> ${baseName}.webp (${(webpSize / 1024).toFixed(0)} KB) [Saved ${savings}%]`
      );
    } catch (err) {
      console.error(`❌ Failed to compress ${file}:`, err.message);
    }
  }

  console.log("\n==========================================");
  console.log(`🎉 Batch Image Compression Completed!`);
  console.log(`🖼️  Images Processed: ${compressedCount}`);
  console.log(`📦 Original Total Size: ${(totalOriginalBytes / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`🚀 Optimized WebP Size: ${(totalWebPBytes / (1024 * 1024)).toFixed(2)} MB`);
  const totalSavings = totalOriginalBytes > 0 
    ? (((totalOriginalBytes - totalWebPBytes) / totalOriginalBytes) * 100).toFixed(1) 
    : 0;
  console.log(`✨ Total Bandwidth & Space Saved: ${totalSavings}%`);
  console.log("==========================================\n");
}

compressAllUploads();
