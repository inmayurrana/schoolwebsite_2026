import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies, headers } from "next/headers";
import { prisma } from "./prisma";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "cis_mandi_super_secret_jwt_key_2025_himachal_pradesh_cbse_987654";
export const AUTH_COOKIE_NAME = "cis_admin_token";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "PRINCIPAL" | "STAFF_EDITOR";
  avatar?: string | null;
}

export interface GoogleTokenPayload {
  sub: string;
  email: string;
  name: string;
  picture?: string;
  email_verified: boolean;
  hd?: string; // Google Workspace Hosted Domain (e.g. "cismandi.edu.in")
  given_name?: string;
  family_name?: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Sign an industry-standard JWT token with claims: sub, id, name, email, role, avatar.
 */
export function signToken(user: SessionUser, expiresIn = "7d"): string {
  return jwt.sign(
    {
      sub: user.id,
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
    JWT_SECRET,
    { expiresIn: expiresIn as any }
  );
}

/**
 * Verify and decode an application JWT token.
 */
export function verifyToken(token: string): SessionUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (!decoded || (!decoded.id && !decoded.sub)) return null;
    return {
      id: decoded.id || decoded.sub,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
      avatar: decoded.avatar,
    };
  } catch {
    return null;
  }
}

/**
 * Extract authenticated user from:
 * 1. HTTP Bearer Authorization header: "Authorization: Bearer <jwt_token>"
 * 2. Secure HTTP-only cookie: "cis_admin_token"
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  // 1. Try reading from Authorization Bearer header
  try {
    const headerList = await headers();
    const authHeader = headerList.get("authorization") || headerList.get("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const bearerToken = authHeader.substring(7).trim();
      if (bearerToken) {
        const decoded = verifyToken(bearerToken);
        if (decoded) return decoded;
      }
    }
  } catch (_) {}

  // 2. Try reading from secure HTTP-only cookie
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (token) {
      const decoded = verifyToken(token);
      if (decoded) return decoded;
    }
  } catch (_) {}

  return null;
}

export async function requireAuth(allowedRoles?: string[]): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    throw new Error("FORBIDDEN");
  }
  return user;
}

/**
 * Build standard cookie options for admin sessions.
 */
export function getAuthCookieOptions(rememberMe = true) {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax" as const,
    path: "/",
    ...(rememberMe ? { maxAge: 7 * 24 * 60 * 60 } : {}),
  };
}

/**
 * Verify a Google ID token via Google's tokeninfo API.
 */
export async function verifyGoogleIdToken(idToken: string): Promise<{
  valid: boolean;
  payload?: GoogleTokenPayload;
  error?: string;
}> {
  if (!idToken || typeof idToken !== "string") {
    return { valid: false, error: "Missing or invalid Google ID token" };
  }

  try {
    const googleVerifyUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(
      idToken.trim()
    )}`;
    const response = await fetch(googleVerifyUrl, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      return {
        valid: false,
        error: errData.error_description || "Google token verification failed",
      };
    }

    const data = await response.json();

    const isVerified =
      data.email_verified === "true" || data.email_verified === true;
    if (!isVerified) {
      return {
        valid: false,
        error: "Google account email is not verified by Google",
      };
    }

    // If client ID is defined in environment, verify aud match
    const configuredClientId =
      process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (configuredClientId && data.aud !== configuredClientId) {
      return {
        valid: false,
        error: "Google token audience (aud) does not match configured Google Client ID",
      };
    }

    const payload: GoogleTokenPayload = {
      sub: data.sub,
      email: (data.email || "").toLowerCase().trim(),
      name: data.name || data.given_name || "Google User",
      picture: data.picture,
      email_verified: true,
      hd: data.hd, // Google Workspace Hosted Domain claim (e.g. "cismandi.edu.in")
      given_name: data.given_name,
      family_name: data.family_name,
    };

    return { valid: true, payload };
  } catch (err: any) {
    return {
      valid: false,
      error: err.message || "Failed to reach Google token verification service",
    };
  }
}

/**
 * Find or provision user from verified Google profile.
 *
 * SECURITY ENFORCEMENT:
 * - Existing users in the User table are permitted to login.
 * - New accounts are ONLY auto-provisioned as STAFF_EDITOR if:
 *   1. AUTO_PROVISION_GOOGLE_STAFF is "true", AND
 *   2. The Google token's Hosted Domain (`hd`) or the email domain suffix
 *      strictly matches the authorized school domain (e.g. @cismandi.edu.in).
 * - Public Google accounts (@gmail.com, etc.) are NEVER auto-provisioned.
 */
export async function findOrCreateGoogleUser(payload: GoogleTokenPayload): Promise<{
  success: boolean;
  user?: SessionUser;
  error?: string;
}> {
  const normalizedEmail = payload.email.toLowerCase().trim();

  // 1. Look for existing registered user by Google ID or Email
  let user = await prisma.user.findFirst({
    where: {
      OR: [
        { googleId: payload.sub },
        { email: normalizedEmail },
      ],
    },
  });

  if (user) {
    if (!user.isActive) {
      return {
        success: false,
        error: "Your administrator account has been deactivated. Please contact the Super Admin.",
      };
    }

    // Link googleId if missing or update profile
    const updateData: any = {
      lastLogin: new Date(),
    };
    if (!user.googleId) {
      updateData.googleId = payload.sub;
    }
    if (!user.avatar && payload.picture) {
      updateData.avatar = payload.picture;
    }

    user = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role as "SUPER_ADMIN" | "PRINCIPAL" | "STAFF_EDITOR",
        avatar: user.avatar,
      },
    };
  }

  // 2. User does not exist: Strictly evaluate hosted domain (hd) & email suffix
  const rawAllowedDomains =
    process.env.GOOGLE_HOSTED_DOMAIN ||
    process.env.ALLOWED_GOOGLE_HOSTED_DOMAINS ||
    "cismandi.edu.in, cambridgemandi.com";

  const allowedDomains = rawAllowedDomains
    .split(",")
    .map((d) => d.trim().toLowerCase())
    .filter(Boolean);

  // Check A: Google token `hd` (Hosted Domain) claim verified by Google
  const tokenHd = payload.hd ? payload.hd.toLowerCase().trim() : "";
  const isAuthorizedHd = Boolean(tokenHd && allowedDomains.includes(tokenHd));

  // Check B: Email domain suffix (e.g. teacher@cismandi.edu.in)
  const emailDomain = normalizedEmail.includes("@")
    ? normalizedEmail.split("@")[1].toLowerCase().trim()
    : "";
  const isAuthorizedEmailSuffix = Boolean(
    emailDomain && allowedDomains.includes(emailDomain)
  );

  const isSchoolStaffDomain = isAuthorizedHd || isAuthorizedEmailSuffix;
  const isAutoProvisionEnabled =
    process.env.AUTO_PROVISION_GOOGLE_STAFF === "true";

  const totalUsers = await prisma.user.count();

  // Case A: Initial clean install bootstrap (0 total users in DB)
  if (totalUsers === 0) {
    const randomPass = await hashPassword(
      `google_root_${payload.sub}_${Date.now()}`
    );

    const newUser = await prisma.user.create({
      data: {
        name: payload.name,
        email: normalizedEmail,
        password: randomPass,
        role: "SUPER_ADMIN",
        googleId: payload.sub,
        avatar: payload.picture,
        isActive: true,
        lastLogin: new Date(),
      },
    });

    return {
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: "SUPER_ADMIN",
        avatar: newUser.avatar,
      },
    };
  }

  // Case B: Auto-provisioning is enabled AND the account strictly belongs to an authorized school domain
  if (isAutoProvisionEnabled && isSchoolStaffDomain) {
    const randomPass = await hashPassword(
      `google_staff_${payload.sub}_${Date.now()}`
    );

    const newUser = await prisma.user.create({
      data: {
        name: payload.name,
        email: normalizedEmail,
        password: randomPass,
        role: "STAFF_EDITOR",
        googleId: payload.sub,
        avatar: payload.picture,
        isActive: true,
        lastLogin: new Date(),
      },
    });

    return {
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: "STAFF_EDITOR",
        avatar: newUser.avatar,
      },
    };
  }

  // Case C: Public Google account (e.g. personal @gmail.com) or unauthorized domain
  if (!isSchoolStaffDomain) {
    return {
      success: false,
      error: `Access Denied: Google account (${payload.email}) is not from an authorized school domain (${allowedDomains.join(
        ", "
      )}). Public Google accounts cannot be automatically granted staff access. Please use your official school Google account or contact the Super Admin.`,
    };
  }

  // Case D: School domain but AUTO_PROVISION_GOOGLE_STAFF is disabled
  return {
    success: false,
    error: `Access Denied: Google account (${payload.email}) is not registered in the CMS database and staff auto-provisioning is disabled. Please contact the Super Admin.`,
  };
}
