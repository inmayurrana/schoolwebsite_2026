import { NextRequest, NextResponse } from "next/server";
import {
  verifyGoogleIdToken,
  findOrCreateGoogleUser,
  signToken,
  getAuthCookieOptions,
  AUTH_COOKIE_NAME,
} from "@/lib/auth";
import { logAuditAction } from "@/lib/audit";

/**
 * POST /api/auth/google
 * Handles Google One-Tap / Google Identity Services ID Token authentication.
 * Payload: { credential: string, rememberMe?: boolean }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { credential, rememberMe = true } = body;

    if (!credential) {
      return NextResponse.json(
        { error: "Google credential token is required" },
        { status: 400 }
      );
    }

    // 1. Verify Google ID Token with Google's servers
    const verifyResult = await verifyGoogleIdToken(credential);
    if (!verifyResult.valid || !verifyResult.payload) {
      return NextResponse.json(
        { error: verifyResult.error || "Invalid Google ID token" },
        { status: 401 }
      );
    }

    // 2. Find or Provision User
    const userResult = await findOrCreateGoogleUser(verifyResult.payload);
    if (!userResult.success || !userResult.user) {
      return NextResponse.json(
        { error: userResult.error || "User authorization failed" },
        { status: 403 }
      );
    }

    const user = userResult.user;
    const expiresIn = rememberMe ? "7d" : "24h";
    const token = signToken(user, expiresIn);

    // 3. Log Audit Action
    try {
      await logAuditAction({
        userId: user.id,
        userName: user.name,
        action: "GOOGLE_SSO_LOGIN",
        entity: "User",
        entityId: user.id,
        details: `Successful Google SSO login as ${user.email} (${user.role})`,
      });
    } catch (_) {}

    // 4. Build response with explicit JWT token and HTTP-only session cookie
    const response = NextResponse.json({
      success: true,
      token,
      tokenType: "Bearer",
      expiresIn,
      user,
      message: "Google Single Sign-On successful",
    });

    const cookieOptions = getAuthCookieOptions(rememberMe);
    response.cookies.set(AUTH_COOKIE_NAME, token, cookieOptions);

    return response;
  } catch (error: any) {
    console.error("Google SSO error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error during Google SSO" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/auth/google
 * Redirects the user's browser to the Google OAuth2 consent screen.
 */
export async function GET(req: NextRequest) {
  const clientId =
    process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId) {
    return NextResponse.json(
      {
        error:
          "Google SSO is not fully configured. Please set GOOGLE_CLIENT_ID in your environment variables.",
      },
      { status: 503 }
    );
  }

  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  const proto =
    req.headers.get("x-forwarded-proto") ||
    (host?.includes("localhost") || host?.includes("127.0.0.1") ? "http" : "https");

  const baseAppUrl =
    host && (host.includes("localhost") || host.includes("127.0.0.1"))
      ? `${proto}://${host}`
      : process.env.NEXTAUTH_URL ||
        process.env.NEXT_PUBLIC_APP_URL ||
        "http://localhost:3000";

  const appUrl = baseAppUrl.replace(/\/$/, "");
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI || `${appUrl}/api/auth/google/callback`;

  const state = Math.random().toString(36).substring(2, 15);

  const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  googleAuthUrl.searchParams.set("client_id", clientId);
  googleAuthUrl.searchParams.set("redirect_uri", redirectUri);
  googleAuthUrl.searchParams.set("response_type", "code");
  googleAuthUrl.searchParams.set("scope", "openid email profile");
  googleAuthUrl.searchParams.set("access_type", "online");
  googleAuthUrl.searchParams.set("state", state);
  googleAuthUrl.searchParams.set("prompt", "select_account");

  // If a primary school domain is configured, enforce hosted domain filter on Google account picker
  const primaryDomain = (process.env.GOOGLE_HOSTED_DOMAIN || "").split(",")[0].trim();
  if (primaryDomain && !primaryDomain.includes("*")) {
    googleAuthUrl.searchParams.set("hd", primaryDomain);
  }

  const response = NextResponse.redirect(googleAuthUrl.toString());
  response.cookies.set("google_oauth_state", state, {
    httpOnly: true,
    maxAge: 10 * 60,
    path: "/",
    sameSite: "lax",
  });

  return response;
}
