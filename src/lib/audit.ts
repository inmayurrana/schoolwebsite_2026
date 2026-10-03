import { prisma } from "./prisma";

export interface LogAuditParams {
  userId?: string | null;
  userName: string;
  action: string;
  entity: string;
  entityId?: string | null;
  details?: string;
  message?: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  metadata?: Record<string, any>;
  req?: Request;
}

// Default fallback to user's verified public gateway IP
let cachedOutboundPublicIp: string | null = "152.58.109.26";
let lastOutboundIpFetchTime = 0;

/**
 * Checks whether an IP address is a private, loopback, or local development address.
 */
export function isPrivateOrLoopbackIp(ip: string | null | undefined): boolean {
  if (!ip) return true;
  const clean = ip.replace(/^::ffff:/, "").trim().toLowerCase();
  if (
    clean === "127.0.0.1" ||
    clean === "::1" ||
    clean === "localhost" ||
    clean === "0.0.0.0" ||
    clean === "unknown"
  ) {
    return true;
  }
  // 10.0.0.0 – 10.255.255.255
  if (/^10\./.test(clean)) return true;
  // 172.16.0.0 – 172.31.255.255
  if (/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(clean)) return true;
  // 192.168.0.0 – 192.168.255.255
  if (/^192\.168\./.test(clean)) return true;
  // 169.254.0.0 – 169.254.255.255
  if (/^169\.254\./.test(clean)) return true;
  // IPv6 unique local (fc00::/7) or link-local (fe80::/10)
  if (/^(fc|fd|fe8|fe9|fea|feb)/i.test(clean)) return true;

  return false;
}

/**
 * Resolves the server or network's real public IP address.
 * Caches for 10 minutes so it never slows down execution.
 */
export async function getOutboundPublicIp(): Promise<string | null> {
  const now = Date.now();
  if (cachedOutboundPublicIp && now - lastOutboundIpFetchTime < 10 * 60 * 1000 && lastOutboundIpFetchTime > 0) {
    return cachedOutboundPublicIp;
  }
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);
    const res = await fetch("https://api.ipify.org?format=json", {
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timeout);
    if (res.ok) {
      const data = await res.json();
      if (data?.ip && !isPrivateOrLoopbackIp(data.ip)) {
        cachedOutboundPublicIp = data.ip.trim();
        lastOutboundIpFetchTime = now;
        return cachedOutboundPublicIp;
      }
    }
  } catch (_) {
    // Silently continue if offline
  }
  return cachedOutboundPublicIp;
}

/**
 * Resolves the real public IP address of the client across all environments:
 * 1. Cloudflare (cf-connecting-ip)
 * 2. Reverse proxies / Nginx (x-real-ip, x-forwarded-for)
 * 3. Client reported header (x-client-public-ip)
 * 4. Localhost / On-prem NAT fallback to real public outbound gateway IP
 */
export async function resolveRealClientIp(
  explicitIpOrReq?: string | Request | null,
  headersObj?: Headers | { get(name: string): string | null } | null
): Promise<string> {
  let explicitIp: string | null = null;
  if (typeof explicitIpOrReq === "string") {
    explicitIp = explicitIpOrReq;
  } else if (explicitIpOrReq && typeof explicitIpOrReq === "object" && "headers" in explicitIpOrReq) {
    headersObj = (explicitIpOrReq as Request).headers;
  }

  // If an explicit public IP was provided directly
  if (explicitIp && !isPrivateOrLoopbackIp(explicitIp)) {
    return explicitIp.replace(/^::ffff:/, "").trim();
  }

  // 1. Try reading headers from provided headersObj or from next/headers
  let reqHeaders: Headers | { get(name: string): string | null } | null = headersObj || null;
  if (!reqHeaders) {
    try {
      const nextHeaders = await import("next/headers");
      reqHeaders = (await nextHeaders.headers()) as any;
    } catch (_) {
      // Outside Next.js request context
    }
  }

  if (reqHeaders) {
    // Cloudflare Connecting IP
    const cf = reqHeaders.get("cf-connecting-ip");
    if (cf && !isPrivateOrLoopbackIp(cf)) return cf.trim();

    // Client-reported public IP
    const clientPublic = reqHeaders.get("x-client-public-ip");
    if (clientPublic && !isPrivateOrLoopbackIp(clientPublic)) return clientPublic.trim();

    // True-Client-IP (Akamai, Cloudflare Enterprise)
    const trueClient = reqHeaders.get("true-client-ip");
    if (trueClient && !isPrivateOrLoopbackIp(trueClient)) return trueClient.trim();

    // X-Real-IP (Nginx $remote_addr)
    const realIp = reqHeaders.get("x-real-ip");
    if (realIp && !isPrivateOrLoopbackIp(realIp)) return realIp.trim();

    // X-Forwarded-For (can be a comma-separated chain: client, proxy1, proxy2)
    const forwarded = reqHeaders.get("x-forwarded-for");
    if (forwarded) {
      const ips = forwarded.split(",").map((s) => s.replace(/^::ffff:/, "").trim());
      // Find the first public IP in the chain
      const publicIp = ips.find((ip) => ip && !isPrivateOrLoopbackIp(ip));
      if (publicIp) return publicIp;
      if (ips[0] && !isPrivateOrLoopbackIp(ips[0])) return ips[0];
    }

    // Fastly CDN
    const fastly = reqHeaders.get("fastly-client-ip");
    if (fastly && !isPrivateOrLoopbackIp(fastly)) return fastly.trim();
  }

  // If explicit IP or headers were private/loopback, resolve real outbound public IP
  const outboundIp = await getOutboundPublicIp();
  if (outboundIp) {
    return outboundIp;
  }

  return explicitIp?.replace(/^::ffff:/, "").trim() || "127.0.0.1";
}

/**
 * Parses a raw User-Agent string to extract human-readable browser, OS, and device categories.
 */
export function parseUserAgent(ua?: string | null): {
  browser: string;
  os: string;
  device: string;
  raw: string;
} {
  const raw = ua || "Unknown Browser / Device";
  if (!ua) {
    return { browser: "Unknown Browser", os: "Unknown OS", device: "Unknown Device", raw };
  }

  let browser = "Web Browser";
  if (/Edg\//i.test(ua)) browser = "Microsoft Edge";
  else if (/Chrome\//i.test(ua) && !/Chromium\//i.test(ua)) browser = "Google Chrome";
  else if (/Firefox\//i.test(ua)) browser = "Mozilla Firefox";
  else if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) browser = "Apple Safari";
  else if (/OPR\//i.test(ua) || /Opera/i.test(ua)) browser = "Opera";
  else if (/curl/i.test(ua)) browser = "cURL Terminal";
  else if (/Postman/i.test(ua)) browser = "Postman API Client";

  let os = "Unknown OS";
  if (/Windows NT 10/i.test(ua)) os = "Windows 10 / 11";
  else if (/Windows NT/i.test(ua)) os = "Windows";
  else if (/Macintosh|Mac OS X/i.test(ua)) os = "macOS";
  else if (/iPhone|iPad|iPod/i.test(ua)) os = "Apple iOS";
  else if (/Android/i.test(ua)) os = "Android OS";
  else if (/Linux/i.test(ua)) os = "Linux";

  let device = "Desktop PC";
  if (/Mobile|iPhone|Android.*Mobile/i.test(ua)) device = "Mobile Phone";
  else if (/iPad|Tablet/i.test(ua)) device = "Tablet Device";

  return { browser, os, device, raw };
}

/**
 * Unpacks an audit log details string, handling both plain text and JSON structures.
 */
export function parseLogDetails(details?: string | null): {
  message: string;
  browser?: string;
  os?: string;
  device?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
  isStructured: boolean;
} {
  if (!details) {
    return { message: "No details recorded", isStructured: false };
  }

  const trimmed = details.trim();
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    try {
      const parsed = JSON.parse(trimmed);
      return {
        message: parsed.message || parsed.description || "Activity logged",
        browser: parsed.browser,
        os: parsed.os,
        device: parsed.device,
        userAgent: parsed.userAgent,
        metadata: parsed.metadata,
        isStructured: true,
      };
    } catch (_) {}
  }

  return { message: details, isStructured: false };
}

/**
 * Centralized audit logger that automatically captures real public IP and activity intelligence.
 */
export async function logAuditAction(params: LogAuditParams) {
  try {
    let headersObj: Headers | { get(name: string): string | null } | null = params.req?.headers || null;
    let userAgentRaw = params.userAgent || null;

    if (!headersObj) {
      try {
        const nextHeaders = await import("next/headers");
        headersObj = (await nextHeaders.headers()) as any;
      } catch (_) {}
    }

    if (!userAgentRaw && headersObj) {
      userAgentRaw = headersObj.get("user-agent") || null;
    }

    // Resolve real public IP
    const realIp = await resolveRealClientIp(params.ipAddress, headersObj);

    // Parse device intelligence
    const clientInfo = parseUserAgent(userAgentRaw);

    // Format rich details payload
    const activityPayload = {
      message: params.message || params.details || `${params.action} performed on ${params.entity}`,
      browser: clientInfo.browser,
      os: clientInfo.os,
      device: clientInfo.device,
      userAgent: clientInfo.raw !== "Unknown Browser / Device" ? clientInfo.raw : undefined,
      metadata: params.metadata && Object.keys(params.metadata).length > 0 ? params.metadata : undefined,
    };

    const detailsJson = JSON.stringify(activityPayload);

    return await prisma.auditLog.create({
      data: {
        userId: params.userId || null,
        userName: params.userName || "System",
        action: params.action,
        entity: params.entity,
        entityId: params.entityId || null,
        details: detailsJson,
        ipAddress: realIp,
      },
    });
  } catch (error) {
    console.error("Failed to write audit log:", error);
    return null;
  }
}
