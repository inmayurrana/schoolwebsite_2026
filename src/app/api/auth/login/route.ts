import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, signToken } from "@/lib/auth";
import { logAuditAction } from "@/lib/audit";

export async function POST(req: Request) {
  try {
    const { email, password, rememberMe } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: "Invalid credentials or inactive account" },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    const sessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as "SUPER_ADMIN" | "PRINCIPAL" | "STAFF_EDITOR",
      avatar: user.avatar,
    };

    const token = signToken(sessionUser);

    await logAuditAction({
      userId: user.id,
      userName: user.name,
      action: "LOGIN",
      entity: "User",
      entityId: user.id,
      details: `Successful login with role ${user.role} (${rememberMe ? "Remembered" : "Session"})`,
    });

    const response = NextResponse.json({
      success: true,
      user: sessionUser,
    });

    // If rememberMe is checked, cookie lasts 7 days; otherwise it's a browser session cookie
    const cookieOptions: any = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    };

    if (rememberMe) {
      cookieOptions.maxAge = 7 * 24 * 60 * 60; // 7 days
    }

    response.cookies.set("cis_admin_token", token, cookieOptions);

    return response;
  } catch (error: any) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
