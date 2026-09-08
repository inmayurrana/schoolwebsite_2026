import React from "react";
import PageHeader from "@/components/ui/PageHeader";
import Link from "next/link";
import { Monitor, CheckCircle2, ArrowRight, Sparkles, Volume2, Shield } from "lucide-react";

export const metadata = {
  title: "Smart Classrooms | Cambridge International School, Mandi",
  description: "Discover the 4K interactive smart classrooms and digital pedagogy at Cambridge Mandi.",
};

export default function SmartClassroomsPage() {
  const specs = [
    "86-inch 4K UHD Anti-Glare Interactive Touch Flat Panels in every classroom",
    "High-definition digital podiums with wireless stylus annotations",
    "Acoustically insulated walls and ceiling sound dampening for crystal clear audio",
    "Ergonomic dual-desk seating engineered to maintain spinal health & posture",
    "High-speed gigabit Wi-Fi 6 connectivity with strict content safety firewalls",
    "Real-time recording system for lecture archiving and revision review",
  ];

  return (
    <div>
      <PageHeader
        badge="Digital Learning Infrastructure"
        title="4K Interactive Smart Classrooms"
        description="Transforming abstract concepts into immersive visual experiences through 21st-century digital classrooms."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Facilities", href: "/facilities" },
          { label: "Smart Classrooms" },
        ]}
      />

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-16 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold text-school-secondary uppercase tracking-wider">
              Interactive Pedagogy
            </span>
            <h2 className="text-3xl font-extrabold text-school-primary dark:text-white">
              Visual, Engaging & Experiential Learning
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              Every single classroom at Cambridge International School Mandi is equipped as a full-fledged multimedia smart room. Our teachers utilize 3D simulations, interactive geometry manipulatives, and virtual field trips to explain complex topics.
            </p>

            <div className="space-y-2.5 pt-2">
              {specs.map((spec, i) => (
                <div key={i} className="flex items-start space-x-2.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>{spec}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link
                href="/admissions/apply"
                className="inline-flex items-center space-x-2 bg-school-secondary hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all"
              >
                <span>Apply for Admission</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80"
                alt="Smart Classroom"
                className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
