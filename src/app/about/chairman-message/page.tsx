import React from "react";
import PageHeader from "@/components/ui/PageHeader";
import { Quote, Award, Sparkles, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Chairman's Message | Cambridge International School, Mandi",
  description: "Read the visionary message from Sh. Arvind Thakur, Chairman of Cambridge International School Mandi.",
};

export default function ChairmanMessagePage() {
  return (
    <div>
      <PageHeader
        badge="Chairman's Desk"
        title="Visionary Leadership & Societal Commitment"
        description="A personal message from Sh. Arvind Thakur on shaping future leaders with courage, character, and global competence."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About Us", href: "/about" },
          { label: "Chairman's Message" },
        ]}
      />

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Portrait Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="glass-card p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80"
                alt="Chairman"
                className="w-full h-80 object-cover rounded-2xl shadow-md"
              />
              <div className="mt-4 text-center space-y-1">
                <h3 className="text-xl font-bold text-school-primary dark:text-white">
                  Sh. Arvind Thakur
                </h3>
                <p className="text-xs font-semibold text-school-secondary uppercase tracking-wider">
                  Chairman & Managing Trustee
                </p>
                <p className="text-[11px] text-slate-500">Cambridge Education Foundation</p>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/50 p-4 rounded-2xl border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-200 space-y-1.5">
              <p className="font-bold">"Education is the most powerful weapon which you can use to change the world."</p>
              <p className="text-[11px] opacity-80">— Nelson Mandela</p>
            </div>
          </div>

          {/* Letter Column */}
          <div className="lg:col-span-8 glass-card p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 relative">
            <Quote className="w-12 h-12 text-amber-400/20 absolute top-8 right-8 pointer-events-none" />

            <div className="space-y-4 text-slate-700 dark:text-slate-200 text-sm sm:text-base leading-relaxed">
              <h2 className="text-2xl font-bold text-school-primary dark:text-white">
                Dear Parents, Educators, and Esteemed Students,
              </h2>

              <p>
                It brings me immense joy and pride to welcome you to <strong>Cambridge International School, Mandi</strong>. When we laid the foundation stone of this institution, our guiding ambition was clear: to bring the highest international standards of learning to the children of Himachal Pradesh without compelling families to seek boarding thousands of miles away.
              </p>

              <p>
                Today, CIS Mandi stands tall as a beacon of academic distinction, technological innovation, and ethical uprightness. We understand that the 21st-century world demands far more than rote memorization. It requires problem-solvers, resilient innovators, ethical decision-makers, and compassionate citizens.
              </p>

              <p>
                Our 10-acre Himalayan campus provides the optimal synthesis of physical fitness, mental agility, and spiritual peace. From our state-of-the-art Robotics and AI laboratories to our Olympic-standard swimming pool and synthetic athletic tracks, every infrastructure element has been built to inspire greatness.
              </p>

              <p>
                I invite you to partner with us in this noble mission of sculpting young minds. Together, let us empower our children to soar on global wings while keeping their roots firmly anchored in the timeless values of our culture.
              </p>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-base text-school-primary dark:text-white font-heading">
                  Arvind Thakur
                </p>
                <p className="text-xs text-slate-500">Chairman, Cambridge International School Mandi</p>
              </div>
              <div className="font-serif italic text-xl text-slate-400">
                A. Thakur
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
