import sharp from "sharp";
import fs from "fs";
import path from "path";

export interface FaviconOptions {
  iconUrl?: string;
  lightEffectEnabled?: boolean;
  borderColor?: string;
  borderWidth?: number;
  lightStyle?: "glow" | "neon" | "dual" | "subtle";
  glowIntensity?: "soft" | "medium" | "vibrant";
  bgColor?: string;
  shape?: "rounded" | "circle" | "square";
  size?: number;
  iconScale?: number; // 0.35 to 1.0 (e.g. 0.75 = 75% of tab plate)
}

export async function generateFaviconBuffer(options: FaviconOptions): Promise<Buffer> {
  const size = options.size || 64;
  const lightEffectEnabled = options.lightEffectEnabled !== false;
  const borderColor = options.borderColor || "#F59E0B";
  const borderWidth = options.borderWidth || 3;
  const lightStyle = options.lightStyle || "glow";
  const glowIntensity = options.glowIntensity || "vibrant";
  const bgColor = options.bgColor || "#0A2540";
  const shape = options.shape || "rounded";

  // Determine radius based on shape
  let rx = 16;
  if (shape === "circle") {
    rx = Math.floor(size / 2);
  } else if (shape === "square") {
    rx = 4;
  } else {
    rx = Math.floor(size * 0.25); // rounded squircle
  }

  // Resolve source icon path
  let iconPath = options.iconUrl || "/uploads/LOGO_c_72ead6e76f87.webp";
  if (iconPath.startsWith("/")) {
    iconPath = iconPath.slice(1);
  }

  const publicDir = path.join(process.cwd(), "public");
  let resolvedFilePath = path.join(publicDir, iconPath);

  if (!fs.existsSync(resolvedFilePath)) {
    // Try fallback to known icon
    const fallbackPath = path.join(publicDir, "uploads", "LOGO_c_72ead6e76f87.webp");
    if (fs.existsSync(fallbackPath)) {
      resolvedFilePath = fallbackPath;
    } else {
      resolvedFilePath = path.join(publicDir, "favicon.ico");
    }
  }

  if (!lightEffectEnabled) {
    // If light effect is disabled, just return the resized original icon
    if (fs.existsSync(resolvedFilePath)) {
      return await sharp(resolvedFilePath)
        .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer();
    }
  }

  // Calculate glow parameters
  let floodOpacity = 0.85;
  let stdDev1 = 2.5;
  let stdDev2 = 5;

  if (glowIntensity === "soft") {
    floodOpacity = 0.5;
    stdDev1 = 1.5;
    stdDev2 = 3;
  } else if (glowIntensity === "medium") {
    floodOpacity = 0.75;
    stdDev1 = 2;
    stdDev2 = 4;
  } else {
    // vibrant
    floodOpacity = 0.95;
    stdDev1 = 3;
    stdDev2 = 6;
  }

  // Filter definition based on lightStyle
  let filterDef = "";
  if (lightStyle === "neon") {
    filterDef = `
      <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="0" stdDeviation="1" flood-color="#ffffff" flood-opacity="0.9"/>
        <feDropShadow dx="0" dy="0" stdDeviation="${stdDev1}" flood-color="${borderColor}" flood-opacity="${floodOpacity}"/>
        <feDropShadow dx="0" dy="0" stdDeviation="${stdDev2}" flood-color="${borderColor}" flood-opacity="${floodOpacity * 0.7}"/>
      </filter>
    `;
  } else if (lightStyle === "dual") {
    filterDef = `
      <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="0" stdDeviation="${stdDev1}" flood-color="${borderColor}" flood-opacity="${floodOpacity}"/>
        <feDropShadow dx="0" dy="0" stdDeviation="${stdDev2}" flood-color="#ffffff" flood-opacity="0.6"/>
      </filter>
    `;
  } else if (lightStyle === "subtle") {
    filterDef = `
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="0" stdDeviation="1.5" flood-color="${borderColor}" flood-opacity="0.6"/>
      </filter>
    `;
  } else {
    // default "glow" - multi-layer radiant bloom
    filterDef = `
      <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="0" stdDeviation="${stdDev1}" flood-color="${borderColor}" flood-opacity="${floodOpacity}"/>
        <feDropShadow dx="0" dy="0" stdDeviation="${stdDev2}" flood-color="${borderColor}" flood-opacity="${floodOpacity * 0.5}"/>
      </filter>
    `;
  }

  const innerOffset = Math.max(borderWidth, 3);
  const plateWidth = size - innerOffset * 2;
  const plateHeight = size - innerOffset * 2;

  // Background SVG with radiant border
  const svgPlate = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        ${filterDef}
      </defs>
      <rect 
        x="${innerOffset}" 
        y="${innerOffset}" 
        width="${plateWidth}" 
        height="${plateHeight}" 
        rx="${rx}" 
        fill="${bgColor}" 
        stroke="${borderColor}" 
        stroke-width="${borderWidth}" 
        filter="url(#glow)"
      />
    </svg>
  `;

  const plateBuffer = await sharp(Buffer.from(svgPlate))
    .resize(size, size)
    .png()
    .toBuffer();

  // If source icon exists, composite it inside
  if (fs.existsSync(resolvedFilePath)) {
    let scale = options.iconScale !== undefined ? options.iconScale : 0.72;
    // Normalize if passed as percentage (e.g. 72 instead of 0.72)
    if (scale > 1.0) {
      scale = scale / 100;
    }
    scale = Math.max(0.3, Math.min(1.0, scale));

    const iconSize = Math.max(8, Math.floor(size * scale));
    const innerLogoBuffer = await sharp(resolvedFilePath)
      .resize(iconSize, iconSize, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toBuffer();

    return await sharp(plateBuffer)
      .composite([{ input: innerLogoBuffer, gravity: "center" }])
      .png()
      .toBuffer();
  }

  return plateBuffer;
}

export async function writeFaviconToPublic(options: FaviconOptions): Promise<void> {
  try {
    const publicDir = path.join(process.cwd(), "public");
    const buffer64 = await generateFaviconBuffer({ ...options, size: 64 });
    const buffer180 = await generateFaviconBuffer({ ...options, size: 180 });

    // Write to public/icon.png and public/favicon.ico
    fs.writeFileSync(path.join(publicDir, "icon.png"), buffer180);
    fs.writeFileSync(path.join(publicDir, "favicon.ico"), buffer64);
  } catch (err) {
    console.error("Error writing favicon to public folder:", err);
  }
}
