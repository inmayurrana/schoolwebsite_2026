import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { logAuditAction } from "@/lib/audit";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const data = await req.json();

    const updated = await prisma.faculty.update({
      where: { id },
      data: {
        name: data.name,
        designation: data.designation,
        department: data.department,
        qualification: data.qualification,
        experience: data.experience,
        email: data.email || null,
        photoUrl: data.photoUrl,
        bio: data.bio || null,
        isLeadership: data.isLeadership !== undefined ? Boolean(data.isLeadership) : undefined,
      },
    });

    await logAuditAction({
      userId: user.id,
      userName: user.name || "Admin",
      action: "UPDATE_FACULTY",
      entity: "Faculty",
      entityId: id,
      details: `Updated faculty profile: "${updated.name}" (${updated.designation})`,
    });

    return NextResponse.json({ success: true, member: updated });
  } catch (error: any) {
    console.error("Update faculty error:", error);
    return NextResponse.json({ error: "Failed to update faculty profile" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.faculty.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Faculty member not found" }, { status: 404 });
    }

    await prisma.faculty.delete({ where: { id } });

    await logAuditAction({
      userId: user.id,
      userName: user.name || "Admin",
      action: "DELETE_FACULTY",
      entity: "Faculty",
      entityId: id,
      details: `Deleted faculty member: "${existing.name}"`,
    });

    return NextResponse.json({ success: true, message: "Faculty member deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to delete faculty member" }, { status: 500 });
  }
}
