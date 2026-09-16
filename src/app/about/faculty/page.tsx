import React from "react";
import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/ui/PageHeader";
import FacultyDirectoryClient, { FacultyMember } from "@/components/faculty/FacultyDirectoryClient";
import { GraduationCap, Award, Users, BookOpen, Sparkles, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Faculty & Academic Leadership | Cambridge International School, Mandi",
  description: "Explore the distinguished teaching faculty, department heads, and academic mentors at Cambridge International School Mandi.",
};

export const revalidate = 60;

export default async function FacultyPage() {
  let faculty: FacultyMember[] = [];

  try {
    const records = await prisma.faculty.findMany({
      orderBy: { sortOrder: "asc" },
    });
    faculty = records.map((r) => ({
      id: r.id,
      name: r.name,
      designation: r.designation,
      department: r.department,
      qualification: r.qualification,
      experience: r.experience,
      email: r.email,
      photoUrl: r.photoUrl,
      bio: r.bio,
      sortOrder: r.sortOrder,
      isLeadership: r.isLeadership,
    }));
  } catch (error) {
    console.error("Error loading faculty from database:", error);
  }

  return (
    <div>
      <PageHeader
        badge="Distinguished Educators"
        title="Faculty & Academic Mentors"
        description="Meet the passionate teachers, subject specialists, and academic leaders fostering curiosity, scientific rigor, and character development at Cambridge Mandi."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About Us", href: "/about" },
          { label: "Faculty Directory" },
        ]}
      />

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-12 sm:py-16 space-y-12">
        {/* Stats Highlights Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 shadow-lg text-center space-y-1">
            <Users className="w-6 h-6 text-amber-500 mx-auto" />
            <div className="text-2xl sm:text-3xl font-extrabold text-school-primary dark:text-white">58+</div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Faculty Members</div>
          </div>
          <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 shadow-lg text-center space-y-1">
            <GraduationCap className="w-6 h-6 text-blue-500 mx-auto" />
            <div className="text-2xl sm:text-3xl font-extrabold text-school-primary dark:text-white">100%</div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Post-Graduate Certified</div>
          </div>
          <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 shadow-lg text-center space-y-1">
            <Award className="w-6 h-6 text-emerald-500 mx-auto" />
            <div className="text-2xl sm:text-3xl font-extrabold text-school-primary dark:text-white">14+ Yrs</div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Avg Lead Experience</div>
          </div>
          <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 shadow-lg text-center space-y-1">
            <Sparkles className="w-6 h-6 text-amber-400 mx-auto" />
            <div className="text-2xl sm:text-3xl font-extrabold text-school-primary dark:text-white">1 : 15</div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Teacher-Student Ratio</div>
          </div>
        </div>

        {/* Interactive Faculty Directory */}
        <FacultyDirectoryClient initialFaculty={faculty} />
      </div>
    </div>
  );
}