import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { logAuditAction } from "@/lib/audit";
import bcrypt from "bcryptjs";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const targetUser = await prisma.user.findUnique({
      where: { id },
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
      },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: targetUser });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Forbidden. Only Super Administrators can modify users." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const data = await req.json();

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updateData: any = {
      name: data.name || existing.name,
      email: data.email ? data.email.toLowerCase() : existing.email,
      role: data.role || existing.role,
      department: data.department !== undefined ? data.department : existing.department,
      permissionsJson: Array.isArray(data.permissions)
        ? JSON.stringify(data.permissions)
        : data.permissionsJson !== undefined
        ? data.permissionsJson
        : existing.permissionsJson,
      avatar: data.avatar !== undefined ? data.avatar : existing.avatar,
      phone: data.phone !== undefined ? data.phone : existing.phone,
      isActive: data.isActive !== undefined ? Boolean(data.isActive) : existing.isActive,
    };

    if (data.password && data.password.trim().length >= 6) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
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
        updatedAt: true,
      },
    });

    await logAuditAction({
      userId: user.id,
      userName: user.name || "Super Admin",
      action: "UPDATE_USER",
      entity: "User",
      entityId: id,
      details: `Updated user account: ${updated.name} (${updated.email}), Role: ${updated.role}`,
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error: any) {
    console.error("Update user error:", error);
    return NextResponse.json({ error: error.message || "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Forbidden. Only Super Administrators can delete users." },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Prevent deleting own account
    if (user.id === id) {
      return NextResponse.json(
        { error: "You cannot delete your own logged-in administrator account." },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await prisma.user.delete({ where: { id } });

    await logAuditAction({
      userId: user.id,
      userName: user.name || "Super Admin",
      action: "DELETE_USER",
      entity: "User",
      entityId: id,
      details: `Permanently deleted user: ${existing.name} (${existing.email})`,
    });

    return NextResponse.json({ success: true, message: "User deleted successfully" });
  } catch (error: any) {
    console.error("Delete user error:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
