import React from "react";
import PageHeader from "@/components/ui/PageHeader";
import { ShieldCheck, Lock, FileText, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Privacy Policy & Terms | Cambridge International School, Mandi",
  description: "Privacy Policy, terms of service, and student data protection standards for Cambridge Mandi.",
};

export default function PrivacyPolicyPage() {
  return (
    <div>
      <PageHeader
        badge="Data Protection & Privacy"
        title="Privacy Policy & Terms of Service"
        description="We are committed to safeguarding student and parent personal information with strict data confidentiality."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Privacy Policy" },
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
        <div className="glass-card p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-school-primary dark:text-white">
              1. Information We Collect
            </h2>
            <p>
              Cambridge International School Mandi collects personal identification details (student name, date of birth, parent names, residential address, contact numbers, email addresses, and academic records) solely for admission processing, attendance, academic records, and statutory CBSE compliance.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-school-primary dark:text-white">
              2. Data Security & Confidentiality
            </h2>
            <p>
              We implement industry-standard encryption, SSL transport security, and role-based administrative access controls. We do not sell, rent, or trade student or parent information to third-party commercial marketing entities under any circumstances.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-school-primary dark:text-white">
              3. Media & Photography Consent
            </h2>
            <p>
              Photographs and video footage of students participating in official school events, Olympiads, and athletic meets may be published on the official school website, annual school magazine, or accredited educational press with parental consent at the time of admission.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-school-primary dark:text-white">
              4. Contact the Data Protection Officer
            </h2>
            <p>
              For privacy inquiries, record correction, or consent modification, please write to <strong>admin@cismandi.edu.in</strong> or visit the administrative office during school working hours.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
