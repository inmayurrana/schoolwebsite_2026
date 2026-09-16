/**
 * Edge-compatible JWT verification utility using the Web Crypto API.
 * Works seamlessly in Next.js Edge Middleware and Node.js runtimes.
 */

function base64UrlDecode(str: string): Uint8Array {
  // Convert base64url to standard base64
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  
  if (typeof atob === "function") {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }
  
  // Node.js Buffer fallback if atob is unavailable
  return new Uint8Array(Buffer.from(base64, "base64"));
}

export interface EdgeJWTPayload {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string | null;
  exp?: number;
  iat?: number;
  [key: string]: any;
}

export async function verifyJWTEdge(
  token: string,
  secret: string
): Promise<EdgeJWTPayload | null> {
  if (!token || typeof token !== "string") return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [headerB64, payloadB64, signatureB64] = parts;

  try {
    // 1. Decode & parse payload
    const payloadBytes = base64UrlDecode(payloadB64);
    const payloadText = new TextDecoder().decode(payloadBytes);
    const payload: EdgeJWTPayload = JSON.parse(payloadText);

    // 2. Check expiration
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return null;
    }

    // 3. Verify cryptographic signature using Web Crypto HMAC-SHA256
    const encoder = new TextEncoder();
    const dataToVerify = encoder.encode(`${headerB64}.${payloadB64}`);
    const signatureBytes = base64UrlDecode(signatureB64);

    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes,
      dataToVerify
    );

    if (!isValid) return null;

    return payload;
  } catch (err) {
    return null;
  }
}
