import React from "react";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import { prisma } from "@/lib/prisma";
import { ShieldCheck, BookOpen, Users, Calendar, CheckCircle2, ArrowRight, GraduationCap } from "lucide-react";

export const metadata = {
  title: "CBSE School Information | Cambridge International School, Mandi",
  description: "Official CBSE Affiliation details, School Managing Committee (SMC), and Faculty / Teaching Staff list.",
};

export const revalidate = 60;

export default async function CBSEInformationPage() {
  const committee = [
    { name: "Sh. Arvind Thakur", role: "President / Chairman", designation: "Educationist & Philanthropist" },
    { name: "Mrs. Priyanka Jamwal", role: "Member Secretary", designation: "Principal, CIS Mandi" },
    { name: "Prof. Rajeshwar Sen", role: "Teacher Representative", designation: "Vice Principal, CIS Mandi" },
    { name: "Dr. Sandeep Kaundal", role: "Parent Representative (Male)", designation: "Neurosurgeon" },
    { name: "Mrs. Meenakshi Sen", role: "Parent Representative (Female)", designation: "HPAS Officer" },
    { name: "Principal, KV Mandi", role: "CBSE Nominee 1", designation: "Kendriya Vidyalaya Mandi" },
    { name: "Principal, JNV Mandi", role: "CBSE Nominee 2", designation: "Jawahar Navodaya Vidyalaya" },
  ];

  let faculty: any[] = [];
  try {
    faculty = await prisma.faculty.findMany({
      orderBy: { sortOrder: "asc" },
    });
  } catch (e) {
    console.error("Failed to load faculty for CBSE info page", e);
  }

  return (
    <div>
      <PageHeader
        badge="Accreditation & Governance"
        title="CBSE Affiliation, Committee & Faculty Directory"
        description="Comprehensive affiliation status, governing body details, and teaching faculty list as per CBSE Delhi guidelines."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "CBSE Information" },
        ]}
      />

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-16 space-y-16">
        {/* Affiliation Overview */}
        <div className="glass-card p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center space-x-3">
            <ShieldCheck className="w-8 h-8 text-amber-500" />
            <div>
              <h2 className="text-xl font-bold text-school-primary dark:text-white">
                CBSE Affiliation Certificate & Status
              </h2>
              <p className="text-xs text-slate-500">Affiliation No. 630198 | School Code: 43190</p>
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            Cambridge International School Mandi is permanently recognized by the Directorate of Higher Education, Himachal Pradesh, and provisionally affiliated to the Central Board of Secondary Education (CBSE), New Delhi for Senior Secondary (Science, Commerce, and Humanities) streams up to 31st March 2028.
          </p>
        </div>

        {/* SMC Committee Table */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-school-primary dark:text-white flex items-center space-x-2">
            <Users className="w-6 h-6 text-amber-500" />
            <span>School Managing Committee (SMC)</span>
          </h3>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md">
            <table className="w-full text-left border-collapse text-xs sm:text-sm bg-white dark:bg-slate-900">
              <thead className="bg-school-primary text-white">
                <tr>
                  <th className="p-4 font-bold">Member Name</th>
                  <th className="p-4 font-bold">Committee Role</th>
                  <th className="p-4 font-bold">Designation / Occupation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {committee.map((m, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-4 font-bold text-school-primary dark:text-amber-300">{m.name}</td>
                    <td className="p-4 text-school-secondary font-semibold">{m.role}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">{m.designation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Faculty & Teaching Staff Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold text-school-primary dark:text-white flex items-center space-x-2">
                <GraduationCap className="w-6 h-6 text-amber-500" />
                <span>Teaching Faculty & Department Leads</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Qualified educators imparting holistic CBSE & Cambridge curriculum
              </p>
            </div>
            <Link
              href="/about/faculty"
              className="inline-flex items-center space-x-2 text-xs font-bold text-school-primary dark:text-amber-400 hover:text-amber-500 transition-colors bg-amber-400/10 px-4 py-2 rounded-xl border border-amber-400/30 self-start sm:self-auto"
            >
              <span>View Full Visual Faculty Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md">
            <table className="w-full text-left border-collapse text-xs sm:text-sm bg-white dark:bg-slate-900">
              <thead className="bg-school-primary text-white">
                <tr>
                  <th className="p-4 font-bold">Faculty Member</th>
                  <th className="p-4 font-bold">Designation</th>
                  <th className="p-4 font-bold">Department</th>
                  <th className="p-4 font-bold">Academic Qualification</th>
                  <th className="p-4 font-bold">Experience</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {faculty.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">
                      No faculty records currently available.
                    </td>
                  </tr>
                ) : (
                  faculty.map((f, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          {f.photoUrl && (
                            <img
                              src={f.photoUrl}
                              alt={f.name}
                              className="w-9 h-9 rounded-full object-cover border border-amber-400/40"
                            />
                          )}
                          <div>
                            <span className="font-bold text-school-primary dark:text-amber-300 block">{f.name}</span>
                            {f.isLeadership && (
                              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Leadership</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-school-secondary font-semibold">{f.designation}</td>
                      <td className="p-4 text-slate-600 dark:text-slate-300 font-medium">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {f.department}
                        </span>
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-300">{f.qualification || "Post Graduate"}</td>
                      <td className="p-4 text-slate-600 dark:text-slate-300 font-medium">{f.experience || "10+ Years"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}