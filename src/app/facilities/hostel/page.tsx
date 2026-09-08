import React from "react";
import PageHeader from "@/components/ui/PageHeader";
import Link from "next/link";
import { Home, CheckCircle2, ArrowRight, ShieldCheck, Utensils, HeartPulse, Sparkles } from "lucide-react";

export const metadata = {
  title: "Himalayan Residential Hostel | Cambridge International School, Mandi",
  description: "Explore safe, loving, and intellectually enriching boarding & hostel facilities at Cambridge Mandi.",
};

export default function HostelPage() {
  const highlights = [
    "Temperature-controlled air-conditioned and heated dormitories with individual study pods",
    "Separate, secure residential blocks for boys and girls with 24x7 resident wardens",
    "Hygienic multi-cuisine dining hall serving 4 wholesome nutritious meals crafted by dieticians",
    "Mandatory supervised evening study & remedial tutoring hours with resident faculty",
    "24x7 Medical Infirmary with resident nursing staff and on-call pediatrician visits",
    "Weekend hobby workshops, movie screenings, nature hikes, and excursion camps",
  ];

  return (
    <div>
      <PageHeader
        badge="Residential Life & Boarding"
        title="Himalayan Residential Boarding & Hostel"
        description="A warm, secure home away from home providing exemplary pastoral care, academic mentoring, and wholesome Himalayan living."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Facilities", href: "/facilities" },
          { label: "Hostel" },
        ]}
      />

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-16 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold text-school-secondary uppercase tracking-wider">
              Pastoral Care & Comfort
            </span>
            <h2 className="text-3xl font-extrabold text-school-primary dark:text-white">
              Safe, Structured & Loving Residential Community
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              For parents seeking premier boarding in Himachal Pradesh, the CIS Mandi Hostel offers an environment of camaraderie, discipline, and academic reinforcement. Resident students develop lifelong friendships, self-reliance, and outstanding time-management habits.
            </p>

            <div className="space-y-2.5 pt-2">
              {highlights.map((h, i) => (
                <div key={i} className="flex items-start space-x-2.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>{h}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link
                href="/admissions/apply"
                className="inline-flex items-center space-x-2 bg-school-secondary hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all"
              >
                <span>Apply for Boarding Admission</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop&q=80"
                alt="Hostel Dormitory"
                className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
