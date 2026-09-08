import React from "react";
import PageHeader from "@/components/ui/PageHeader";
import Link from "next/link";
import { Bus, CheckCircle2, ArrowRight, ShieldCheck, MapPin, Radio, Phone } from "lucide-react";

export const metadata = {
  title: "GPS Transport Fleet | Cambridge International School, Mandi",
  description: "Safe, GPS-monitored, air-conditioned bus transportation covering Mandi and surrounding valleys.",
};

export default function TransportPage() {
  const routes = [
    { route: "Route 1 (Mandi Central)", stops: "Victoria Bridge, Samkhetar, Palace Colony, Paddal, Bhiuli, School Campus" },
    { route: "Route 2 (Gutkar & Nerchowk)", stops: "Nerchowk Bus Stand, Medical College Chowk, Gutkar Bypass, Dudar, School Campus" },
    { route: "Route 3 (Sundernagar Express)", stops: "Sundernagar BBMB Colony, Naulakha, Kanaid, Bagla, School Campus" },
    { route: "Route 4 (Pandoh & Valley)", stops: "Pandoh Dam, Aut Link, Sauli Khad, Jail Road, School Campus" },
    { route: "Route 5 (Rewalsar Sector)", stops: "Rewalsar Lake Town, Ratti, Balh Valley, Nerchowk Link, School Campus" },
  ];

  return (
    <div>
      <PageHeader
        badge="Safety First"
        title="GPS & CCTV Monitored Bus Fleet"
        description="Ensuring secure, punctual, and comfortable daily transit for students across Mandi, Nerchowk, Sundernagar, and adjoining valleys."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Facilities", href: "/facilities" },
          { label: "Transport" },
        ]}
      />

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-16 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold text-school-secondary uppercase tracking-wider">
              Safety & Real-Time Tracking
            </span>
            <h2 className="text-3xl font-extrabold text-school-primary dark:text-white">
              Punctual, Supervised & Secure Daily Commute
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              Every bus in the CIS Mandi transport fleet is equipped with real-time GPS telemetry, dual HD CCTV security cameras, speed limit governors (restricted to 40 km/h on mountain roads), and mandatory first-aid kits.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              Trained female attendants accompany every route to assist younger children, and parents receive live SMS/App arrival notifications.
            </p>

            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center space-x-2 bg-school-secondary hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all"
              >
                <span>Inquire About Bus Stop Near You</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&auto=format&fit=crop&q=80"
                alt="School Bus Fleet"
                className="w-full h-[380px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>

        {/* Routes Table */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-school-primary dark:text-white">
            Major Transport Routes & Coverage
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {routes.map((r, idx) => (
              <div key={idx} className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div className="flex items-center space-x-2 text-school-secondary font-bold text-sm">
                  <MapPin className="w-4 h-4 text-amber-500" />
                  <span>{r.route}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 pl-6">
                  <strong>Key Stops: </strong>{r.stops}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
