import React from "react";
import PageHeader from "@/components/ui/PageHeader";
import { ShieldCheck, BookOpen, Users, Calendar, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "CBSE School Information | Cambridge International School, Mandi",
  description: "Official CBSE Affiliation details, School Managing Committee (SMC), and Academic calendar.",
};

export default function CBSEInformationPage() {
  const committee = [
    { name: "Sh. Arvind Thakur", role: "President / Chairman", designation: "Educationist & Philanthropist" },
    { name: "Dr. Sunita Sharma", role: "Member Secretary", designation: "Principal, CIS Mandi" },
    { name: "Prof. Rajeshwar Sen", role: "Teacher Representative", designation: "Vice Principal, CIS Mandi" },
    { name: "Dr. Sandeep Kaundal", role: "Parent Representative (Male)", designation: "Neurosurgeon" },
    { name: "Mrs. Meenakshi Sen", role: "Parent Representative (Female)", designation: "HPAS Officer" },
    { name: "Principal, KV Mandi", role: "CBSE Nominee 1", designation: "Kendriya Vidyalaya Mandi" },
    { name: "Principal, JNV Mandi", role: "CBSE Nominee 2", designation: "Jawahar Navodaya Vidyalaya" },
  ];

  return (
    <div>
      <PageHeader
        badge="Accreditation & Governance"
        title="CBSE Affiliation & School Management Committee"
        description="Comprehensive affiliation status, governing body details, and academic norms as per CBSE Delhi guidelines."
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
          <h3 className="text-2xl font-bold text-school-primary dark:text-white">
            School Managing Committee (SMC)
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
      </div>
    </div>
  );
}
