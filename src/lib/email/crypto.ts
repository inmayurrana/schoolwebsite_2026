import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const TAG_LENGTH = 16;

function getMasterKey(): Buffer {
  const secret =
    process.env.APP_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "cambridge-international-school-secret-salt-2026-mandi";
  return crypto.createHash("sha256").update(secret).digest();
}

/**
 * Encrypt a secret string using AES-256-GCM.
 * Stored format: iv_hex:tag_hex:encrypted_hex
 */
export function encryptSecret(plainText: string): string {
  if (!plainText) return "";
  try {
    const key = getMasterKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    let encrypted = cipher.update(plainText, "utf8", "hex");
    encrypted += cipher.final("hex");
    const tag = cipher.getAuthTag();
    
    return `${iv.toString("hex")}:${tag.toString("hex")}:${encrypted}`;
  } catch (err) {
    console.error("Encryption error:", err);
    return "";
  }
}

/**
 * Decrypt a secret string using AES-256-GCM.
 */
export function decryptSecret(encryptedPayload: string): string {
  if (!encryptedPayload) return "";
  try {
    const parts = encryptedPayload.split(":");
    if (parts.length !== 3) {
      // Legacy or plain fallback if not encrypted
      return encryptedPayload;
    }
    const [ivHex, tagHex, encryptedHex] = parts;
    const key = getMasterKey();
    const iv = Buffer.from(ivHex, "hex");
    const tag = Buffer.from(tagHex, "hex");
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);
    
    let decrypted = decipher.update(encryptedHex, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (err) {
    console.error("Decryption error:", err);
    return "";
  }
}

/**
 * Mask secret for safe browser display.
 */
export function maskSecret(secret?: string | null): string {
  if (!secret) return "";
  return "••••••••••••";
}
