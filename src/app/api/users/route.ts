import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { logAuditAction } from "@/lib/audit";
import bcrypt from "bcryptjs";

export async function GET(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
        permissionsJson: true,
        avatar: true,
        phone: true,
        isActive: true,
        twoFactor: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    console.error("Fetch users error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Forbidden. Only Super Administrators can create users." },
        { status: 403 }
      );
    }

    const data = await req.json();

    if (!data.name || !data.email || !data.password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });
    if (existing) {
      return NextResponse.json(
        { error: "A user with this email address already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        password: hashedPassword,
        role: data.role || "STAFF_EDITOR",
        department: data.department || "General",
        permissionsJson: Array.isArray(data.permissions)
          ? JSON.stringify(data.permissions)
          : data.permissionsJson || "[]",
        avatar: data.avatar || null,
        phone: data.phone || null,
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
        permissionsJson: true,
        avatar: true,
        phone: true,
        isActive: true,
        createdAt: true,
      },
    });

    await logAuditAction({
      userId: user.id,
      userName: user.name || "Super Admin",
      action: "CREATE_USER",
      entity: "User",
      entityId: newUser.id,
      details: `Created new admin user: ${newUser.name} (${newUser.email}) with role: ${newUser.role}`,
    });

    return NextResponse.json({ success: true, user: newUser });
  } catch (error: any) {
    console.error("Create user error:", error);
    return NextResponse.json({ error: error.message || "Failed to create user" }, { status: 500 });
  }
}
