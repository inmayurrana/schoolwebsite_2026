import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const faculty = await prisma.faculty.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json({ success: true, faculty });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch faculty" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    const member = await prisma.faculty.create({
      data: {
        name: data.name,
        designation: data.designation,
        department: data.department || "Sciences",
        qualification: data.qualification || "",
        experience: data.experience || "",
        email: data.email || null,
        photoUrl: data.photoUrl || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
        bio: data.bio || null,
        sortOrder: Number(data.sortOrder) || 10,
        isLeadership: Boolean(data.isLeadership),
      },
    });

    return NextResponse.json({ success: true, member });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to add faculty" }, { status: 500 });
  }
}
