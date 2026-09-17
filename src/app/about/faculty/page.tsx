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

import { getCachedPageContent } from "@/lib/pageContentCache";

export default async function FacultyPage() {
  const pageData: any = await getCachedPageContent("faculty");
  const custom = pageData?.customStylesJson ? JSON.parse(pageData.customStylesJson) : {};

  const badge = pageData?.heroBadge || "Distinguished Educators";
  const title = pageData?.heroTitle || "Faculty & Academic Mentors";
  const description =
    pageData?.heroSubtitle ||
    "Meet the passionate teachers, subject specialists, and academic leaders fostering curiosity, scientific rigor, and character development at Cambridge Mandi.";

  const stat1Value = custom.stat1Value || "58+";
  const stat1Label = custom.stat1Label || "Faculty Members";
  const stat2Value = custom.stat2Value || "100%";
  const stat2Label = custom.stat2Label || "Post-Graduate Certified";
  const stat3Value = custom.stat3Value || "14+ Yrs";
  const stat3Label = custom.stat3Label || "Avg Lead Experience";
  const stat4Value = custom.stat4Value || "1 : 15";
  const stat4Label = custom.stat4Label || "Teacher-Student Ratio";

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
        badge={badge}
        title={title}
        description={description}
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
            <div className="text-2xl sm:text-3xl font-extrabold text-school-primary dark:text-white">
              {stat1Value}
            </div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {stat1Label}
            </div>
          </div>
          <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 shadow-lg text-center space-y-1">
            <GraduationCap className="w-6 h-6 text-blue-500 mx-auto" />
            <div className="text-2xl sm:text-3xl font-extrabold text-school-primary dark:text-white">
              {stat2Value}
            </div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {stat2Label}
            </div>
          </div>
          <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 shadow-lg text-center space-y-1">
            <Award className="w-6 h-6 text-emerald-500 mx-auto" />
            <div className="text-2xl sm:text-3xl font-extrabold text-school-primary dark:text-white">
              {stat3Value}
            </div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {stat3Label}
            </div>
          </div>
          <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 shadow-lg text-center space-y-1">
            <Sparkles className="w-6 h-6 text-amber-400 mx-auto" />
            <div className="text-2xl sm:text-3xl font-extrabold text-school-primary dark:text-white">
              {stat4Value}
            </div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {stat4Label}
            </div>
          </div>
        </div>

        {/* Interactive Faculty Directory */}
        <FacultyDirectoryClient initialFaculty={faculty} />
      </div>
    </div>
  );
}