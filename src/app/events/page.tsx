import React from "react";
import PageHeader from "@/components/ui/PageHeader";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Calendar, MapPin, Clock, ArrowRight, Sparkles, Users } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "School Events Calendar | Cambridge International School, Mandi",
  description: "Explore the upcoming events calendar, annual functions, competitions, and sports fests at Cambridge Mandi.",
};

export default async function EventsPage() {
  let events: any[] = [];
  try {
    events = await prisma.event.findMany({
      where: { isPublished: true },
      orderBy: { startDate: "asc" },
    });
  } catch (err) {
    console.error("Error loading events:", err);
  }

  return (
    <div>
      <PageHeader
        badge="School Calendar"
        title="Upcoming Events & Festivities"
        description="Mark your calendar for upcoming inter-school competitions, cultural celebrations, sports meets, and parent conclaves."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Events" },
        ]}
      />

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-12 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="glass-card rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col sm:flex-row group"
            >
              <div className="sm:w-48 h-48 sm:h-auto relative flex-shrink-0 bg-slate-900">
                <img
                  src={ev.coverImage}
                  alt={ev.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-school-primary text-white text-center px-3 py-1 rounded-xl shadow">
                  <span className="text-xs uppercase font-bold text-amber-400 block">
                    {new Date(ev.startDate).toLocaleString("default", { month: "short" })}
                  </span>
                  <span className="text-xl font-black block">
                    {new Date(ev.startDate).getDate()}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-school-secondary bg-blue-50 dark:bg-blue-950/80 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {ev.category}
                  </span>
                  <h2 className="text-lg font-bold text-school-primary dark:text-white">
                    {ev.title}
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {ev.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs text-slate-500">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                    <span className="truncate">{ev.venue}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3.5 h-3.5 text-school-secondary flex-shrink-0" />
                    <span>{formatDate(ev.startDate)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
