import React from "react";
import PageHeader from "@/components/ui/PageHeader";
import { Quote, Award, Sparkles, BookOpen, GraduationCap } from "lucide-react";

export const metadata = {
  title: "Principal's Message | Cambridge International School, Mandi",
  description: "Welcome address and academic roadmap from Dr. Sunita Sharma, Principal of Cambridge International School Mandi.",
};

export default function PrincipalMessagePage() {
  return (
    <div>
      <PageHeader
        badge="Principal's Desk"
        title="Fostering Curiosity, Character & Excellence"
        description="Welcome to an educational sanctuary where every child's innate potential is recognized, nurtured, and elevated."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About Us", href: "/about" },
          { label: "Principal's Message" },
        ]}
      />

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Portrait Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="glass-card p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80"
                alt="Principal"
                className="w-full h-80 object-cover rounded-2xl shadow-md"
              />
              <div className="mt-4 text-center space-y-1">
                <h3 className="text-xl font-bold text-school-primary dark:text-white">
                  Dr. Sunita Sharma
                </h3>
                <p className="text-xs font-semibold text-school-secondary uppercase tracking-wider">
                  Principal & Academic Director
                </p>
                <p className="text-[11px] text-slate-500">Ph.D. Education (Gold Medalist), M.Sc. Physics</p>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/50 p-4 rounded-2xl border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-200 space-y-1.5">
              <p className="font-bold">"Tell me and I forget. Teach me and I remember. Involve me and I learn."</p>
              <p className="text-[11px] opacity-80">— Benjamin Franklin</p>
            </div>
          </div>

          {/* Letter Column */}
          <div className="lg:col-span-8 glass-card p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 relative">
            <Quote className="w-12 h-12 text-school-secondary/20 absolute top-8 right-8 pointer-events-none" />

            <div className="space-y-4 text-slate-700 dark:text-slate-200 text-sm sm:text-base leading-relaxed">
              <h2 className="text-2xl font-bold text-school-primary dark:text-white">
                Warm Greetings from Cambridge International School, Mandi!
              </h2>

              <p>
                As Principal, it is my distinct honor to lead a faculty of over 150 passionate educators who dedicate their intellect, empathy, and expertise to illuminating the minds of our 2,500+ students.
              </p>

              <p>
                At Cambridge Mandi, our learning methodology transcends conventional rote teaching. Through experiential laboratory inquiry, robotics engineering, creative writing workshops, bilingual debating, and structured physical athletics, we spark an enduring love for lifelong learning.
              </p>

              <p>
                Our students consistently achieve stellar accolades — from 100% distinction rates in the <strong>CBSE Board Examinations (Affiliation No. 630198)</strong> to Gold medals at the All-India STEM Robotics Championships and state athletic records. Yet, what makes us most proud is their moral integrity, empathy for societal causes, and unshakeable self-confidence.
              </p>

              <p>
                I look forward to welcoming you and your ward to our campus. Let us embark upon this transformational voyage of discovery together.
              </p>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-base text-school-primary dark:text-white font-heading">
                  Dr. Sunita Sharma
                </p>
                <p className="text-xs text-slate-500">Principal, Cambridge International School Mandi</p>
              </div>
              <div className="font-serif italic text-xl text-slate-400">
                S. Sharma
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
