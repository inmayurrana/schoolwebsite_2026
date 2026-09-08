import React from "react";
import PageHeader from "@/components/ui/PageHeader";
import Link from "next/link";
import { Sparkles, Heart, Smile, CheckCircle2, ArrowRight, ShieldCheck, Sun } from "lucide-react";

export const metadata = {
  title: "Pre-Primary / Early Years | Cambridge International School, Mandi",
  description: "Explore our experiential, joy-filled Pre-Primary and Kindergarten foundation stage at Cambridge Mandi.",
};

export default function PrePrimaryPage() {
  const highlights = [
    "Montessori & Experiential Play-Way Pedagogy",
    "Jolly Phonics Language & Early Literacy System",
    "Theme-based Sensory & Fine Motor Activity Corners",
    "Dedicated Child-Friendly Kindergarten Play Zone & Sandpit",
    "Air-Conditioned Colorful Smart Classrooms with Soft Flooring",
    "Nurturing Female Faculty with 1:12 Teacher-to-Child Ratio",
  ];

  return (
    <div>
      <PageHeader
        badge="Early Years Foundation"
        title="Pre-Primary Wing (Nursery, LKG, UKG)"
        description="A vibrant, joyful wonderland where early curiosity is celebrated and foundational love for discovery is born."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Academics", href: "/academics" },
          { label: "Pre-Primary" },
        ]}
      />

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-16 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">
              Ages 3 to 5 Years
            </span>
            <h2 className="text-3xl font-extrabold text-school-primary dark:text-white">
              The Joyful Foundation for Lifelong Learning
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              At Cambridge International School Mandi, our Pre-Primary wing provides a secure, loving, and intellectually rich sanctuary where young children transition happily from home to school.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              Our curriculum seamlessly integrates early cognitive milestones, phonics, spatial awareness, musical rhythm, and social emotional intelligence through activity-based learning.
            </p>

            <div className="space-y-2.5 pt-2">
              {highlights.map((h, i) => (
                <div key={i} className="flex items-center space-x-2.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>{h}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link
                href="/admissions/apply"
                className="inline-flex items-center space-x-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all"
              >
                <span>Apply for Nursery / KG Admission</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&auto=format&fit=crop&q=80"
                alt="Pre-primary Kindergarten"
                className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
