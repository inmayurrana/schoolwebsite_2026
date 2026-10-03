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
 * GET /api/auth/google/callback
 * Exchanges authorization code for Google tokens, validates ID token,
 * signs JWT, sets session cookie, and redirects user to /admin.
 */
export async function GET(req: NextRequest) {
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
  const loginUrl = new URL("/admin/login", appUrl);

  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const error = url.searchParams.get("error");

    if (error) {
      loginUrl.searchParams.set("error", `Google authentication cancelled: ${error}`);
      return NextResponse.redirect(loginUrl);
    }

    if (!code) {
      loginUrl.searchParams.set("error", "Missing Google authorization code");
      return NextResponse.redirect(loginUrl);
    }

    const clientId =
      process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      loginUrl.searchParams.set(
        "error",
        "Google OAuth credentials missing on server (GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET)"
      );
      return NextResponse.redirect(loginUrl);
    }

    const callbackPath = req.nextUrl?.pathname || "/api/auth/google/callback";
    const redirectUri =
      process.env.GOOGLE_REDIRECT_URI || `${appUrl}${callbackPath}`;

    // Exchange authorization code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.id_token) {
      const errMsg = tokenData.error_description || tokenData.error || "Failed to exchange code";
      loginUrl.searchParams.set("error", `Google token error: ${errMsg}`);
      return NextResponse.redirect(loginUrl);
    }

    // Verify ID token
    const verifyResult = await verifyGoogleIdToken(tokenData.id_token);
    if (!verifyResult.valid || !verifyResult.payload) {
      loginUrl.searchParams.set("error", verifyResult.error || "Invalid Google ID token");
      return NextResponse.redirect(loginUrl);
    }

    // Find or provision user
    const userResult = await findOrCreateGoogleUser(verifyResult.payload);
    if (!userResult.success || !userResult.user) {
      loginUrl.searchParams.set(
        "error",
        userResult.error || "Account not authorized for school administration"
      );
      return NextResponse.redirect(loginUrl);
    }

    const user = userResult.user;
    const token = signToken(user, "7d");

    // Audit log with real public IP and activity intelligence
    try {
      await logAuditAction({
        userId: user.id,
        userName: user.name,
        action: "GOOGLE_SSO_LOGIN",
        entity: "User",
        entityId: user.id,
        details: `Successful Google OAuth callback login as ${user.email}`,
        metadata: {
          email: user.email,
          role: user.role,
          provider: "Google Workspace SSO",
        },
        req,
      });
    } catch (_) {}

    // Redirect to admin dashboard with cookie
    const adminUrl = new URL("/admin", appUrl);
    const response = NextResponse.redirect(adminUrl);
    response.cookies.set(AUTH_COOKIE_NAME, token, getAuthCookieOptions(true));

    return response;
  } catch (err: any) {
    console.error("Google callback error:", err);
    loginUrl.searchParams.set("error", err.message || "An unexpected error occurred during Google sign in");
    return NextResponse.redirect(loginUrl);
  }
}
