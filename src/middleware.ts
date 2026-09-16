import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWTEdge } from "@/lib/jwt-edge";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "cis_mandi_super_secret_jwt_key_2025_himachal_pradesh_cbse_987654";
const COOKIE_NAME = "cis_admin_token";

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Only apply to /admin routes
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const isLoginPage = pathname === "/admin/login";

  let user = null;
  if (token) {
    user = await verifyJWTEdge(token, JWT_SECRET);
  }

  // 1. Handling the Login page
  if (isLoginPage) {
    if (user) {
      // User is already authenticated, redirect to /admin dashboard or custom callback
      const callbackUrl = request.nextUrl.searchParams.get("callbackUrl");
      const targetUrl = callbackUrl && callbackUrl.startsWith("/admin") && callbackUrl !== "/admin/login"
        ? callbackUrl
        : "/admin";
      return NextResponse.redirect(new URL(targetUrl, request.url));
    }
    // Allow unauthenticated access to login page
    return NextResponse.next();
  }

  // 2. Protecting all other /admin routes
  if (!user) {
    const loginUrl = new URL("/admin/login", request.url);
    const fullCallback = pathname + (search || "");
    if (fullCallback !== "/admin") {
      loginUrl.searchParams.set("callbackUrl", fullCallback);
    }

    const response = NextResponse.redirect(loginUrl);
    
    // Clear invalid/stale token cookie if present
    if (token) {
      response.cookies.set(COOKIE_NAME, "", {
        httpOnly: true,
        expires: new Date(0),
        path: "/",
      });
    }
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
