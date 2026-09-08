import React from "react";
import PageHeader from "@/components/ui/PageHeader";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Calendar, User, Eye, ArrowRight, Bell, Sparkles, Video, Play } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "School News & Circulars | Cambridge International School, Mandi",
  description: "Read the latest news bulletins, academic announcements, and circulars from Cambridge Mandi.",
};

function extractYouTubeId(url?: string | null): string | null {
  if (!url) return null;
  const m = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
  );
  return m ? m[1] : null;
}

export default async function NewsPage() {
  let newsList: any[] = [];
  try {
    newsList = await prisma.news.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
    });
  } catch (err) {
    console.error("Error loading news:", err);
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
      <PageHeader
        badge="Official School Bulletins"
        title="Latest News & Press Releases"
        description="Stay updated with school events, academic circulars, competition victories, and campus announcements."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "News" },
        ]}
      />

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-12 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsList.map((item) => {
            const isVideo = item.mediaType === "VIDEO" || Boolean(item.videoUrl);
            const ytId = isVideo ? extractYouTubeId(item.videoUrl) : null;

            return (
              <article
                key={item.id}
                className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all group flex flex-col justify-between"
              >
                {/* Media Container */}
                <div className="relative h-56 overflow-hidden bg-slate-950">
                  {isVideo ? (
                    ytId ? (
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=0&controls=1&rel=0`}
                        title={item.title}
                        className="w-full h-full"
                        allowFullScreen
                      />
                    ) : item.videoUrl ? (
                      <video
                        src={item.videoUrl}
                        controls
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={item.coverImage}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )
                  ) : (
                    <img
                      src={item.coverImage}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}

                  <span className="absolute top-3 left-3 bg-school-secondary text-white text-xs font-bold px-3 py-1 rounded-full shadow pointer-events-none">
                    {item.category}
                  </span>
                  {item.isFeatured && (
                    <span className="absolute top-3 right-3 bg-amber-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full shadow pointer-events-none">
                      Featured
                    </span>
                  )}
                </div>

                {/* Content Container */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <div className="flex items-center space-x-2 text-xs text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDate(item.publishedAt)}</span>
                      <span>•</span>
                      <User className="w-3.5 h-3.5" />
                      <span>{item.author || "Admin Office"}</span>
                    </div>

                    <h2 className="text-base sm:text-lg font-bold text-school-primary dark:text-white line-clamp-2">
                      {item.title}
                    </h2>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-4 leading-relaxed whitespace-pre-line">
                      {item.content}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
