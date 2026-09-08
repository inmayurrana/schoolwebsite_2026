import React from "react";
import PageHeader from "@/components/ui/PageHeader";
import Link from "next/link";
import { Cpu, CheckCircle2, ArrowRight, Sparkles, Award, Bot, Radio } from "lucide-react";

export const metadata = {
  title: "STEM & Robotics Innovation Lab | Cambridge International School, Mandi",
  description: "Explore the national championship-winning STEM, Robotics, and 3D printing maker lab at Cambridge Mandi.",
};

export default function RoboticsLabPage() {
  const features = [
    "Dual-extruder Precision 3D Printers for rapid hardware prototyping",
    "Comprehensive Arduino Uno, Mega, ESP32, and Raspberry Pi 5 Maker Kits",
    "Indoor Drone Testing Cage and automated obstacle telemetry courses",
    "Humanoid robotic programming kits with visual block & Python SDKs",
    "IoT environmental weather monitoring station built and maintained by students",
    "Specialized coaching for National & International Robotics Olympiads (WRO / FLL)",
  ];

  return (
    <div>
      <PageHeader
        badge="Innovation & Maker Space"
        title="STEM, Robotics & Drone Innovation Lab"
        description="National Olympiad Gold Medal winning maker space where young minds design, program, and engineer real-world hardware solutions."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Facilities", href: "/facilities" },
          { label: "Robotics Lab" },
        ]}
      />

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-16 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">
              National Gold Medalist Lab 2025
            </span>
            <h2 className="text-3xl font-extrabold text-school-primary dark:text-white">
              From Concept to Creation: Real Engineering for School Students
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              The <strong>CIS Mandi STEM & Robotics Lab</strong> is celebrated as one of the most advanced innovation facilities in northern India. Here, students build AI rovers, alpine landslide sensor networks, autonomous line-followers, and IoT smart irrigation models.
            </p>

            <div className="space-y-2.5 pt-2">
              {features.map((f, i) => (
                <div key={i} className="flex items-start space-x-2.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>{f}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link
                href="/admissions/apply"
                className="inline-flex items-center space-x-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all"
              >
                <span>Join the Robotics Innovation Wing</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80"
                alt="Robotics Lab"
                className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
