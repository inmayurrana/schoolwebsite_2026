import React from "react";
import PageHeader from "@/components/ui/PageHeader";
import Link from "next/link";
import {
  Monitor,
  FlaskConical,
  Cpu,
  BookOpen,
  Trophy,
  Home,
  Bus,
  ArrowRight,
  ShieldCheck,
  MapPin,
} from "lucide-react";
import Campus3DViewer from "@/components/3d/Campus3DViewer";

export const metadata = {
  title: "Campus Facilities | Cambridge International School, Mandi",
  description: "Explore the 10-acre world-class campus facilities at Cambridge Mandi including 4K smart classrooms, robotics lab, sports complex, and boarding.",
};

export default function FacilitiesHubPage() {
  const facilities = [
    {
      title: "Smart Classrooms",
      desc: "4K interactive touch panels, digital podiums, and air-conditioned acoustically treated learning spaces.",
      link: "/facilities/smart-classrooms",
      icon: Monitor,
      image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600",
    },
    {
      title: "Science & AI Laboratories",
      desc: "Ultra-modern Physics, Chemistry, Biology, and Biotechnology experimentation suites.",
      link: "/facilities/science-labs",
      icon: FlaskConical,
      image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600",
    },
    {
      title: "STEM & Robotics Innovation Lab",
      desc: "Equipped with 3D printers, IoT hardware, Arduino & Raspberry Pi rigs, and drone bays.",
      link: "/facilities/robotics-lab",
      icon: Cpu,
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600",
    },
    {
      title: "Computer & Coding Labs",
      desc: "High-speed optical fiber AI computing workstations, Python coding terminals, and cyber safety.",
      link: "/facilities/computer-labs",
      icon: Monitor,
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600",
    },
    {
      title: "Central Digital Library",
      desc: "Over 25,000 physical titles, kindle e-reading stations, and international research periodicals.",
      link: "/facilities/library",
      icon: BookOpen,
      image: "https://images.unsplash.com/photo-1568667256549-094345857637?w=600",
    },
    {
      title: "Olympic Sports Complex",
      desc: "Semi-Olympic heated pool, FIFA standard turf, synthetic tennis & basketball courts, and badminton hall.",
      link: "/facilities/sports-complex",
      icon: Trophy,
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600",
    },
    {
      title: "Himalayan Residential Hostel",
      desc: "Comfortable temperature-controlled dorms, 24x7 resident wardens, and hygienic dining.",
      link: "/facilities/hostel",
      icon: Home,
      image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600",
    },
    {
      title: "GPS-Monitored Bus Transport",
      desc: "Modern bus fleet with CCTV surveillance, speed governors, and live parent mobile tracking app.",
      link: "/facilities/transport",
      icon: Bus,
      image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=600",
    },
  ];

  return (
    <div className="w-full">
      <PageHeader
        badge="World-Class Infrastructure"
        title="10-Acre Himalayan Campus & Facilities"
        description="Crafted with architectural finesse, international safety benchmarks, and high-tech educational tools to foster learning without limits."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Campus Facilities" }]}
      />

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-16 space-y-16">
        {/* Interactive 3D Map Component */}
        <Campus3DViewer />

        {/* Facilities 8-Card Grid */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-school-primary dark:text-white">
              Explore Our Campus Wings
            </h3>
            <p className="text-xs text-slate-500">
              Click any facility below to inspect detailed specifications, photos, and safety protocols.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {facilities.map((fac, idx) => {
              const Icon = fac.icon;
              return (
                <Link
                  key={idx}
                  href={fac.link}
                  className="glass-card rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col justify-between"
                >
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={fac.image}
                      alt={fac.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-school-primary/80 via-transparent to-transparent flex items-end p-3.5">
                      <div className="flex items-center space-x-2 text-white">
                        <Icon className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold">{fac.title}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {fac.desc}
                    </p>
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-bold text-school-secondary flex items-center justify-between">
                      <span>View Specifications</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
