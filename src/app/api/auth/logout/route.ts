import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { logAuditAction } from "@/lib/audit";

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (user) {
      await logAuditAction({
        userId: user.id,
        userName: user.name,
        action: "LOGOUT",
        entity: "User",
        entityId: user.id,
        details: `User "${user.name}" (${user.email || user.role}) logged out of administration panel`,
        metadata: {
          email: user.email,
          role: user.role,
        },
        req,
      });
    }
  } catch (e) {
    // Ignore audit errors on logout
  }

  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });

  response.cookies.set("cis_admin_token", "", {
    httpOnly: true,
    expires: new Date(0),
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}

