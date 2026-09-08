"use client";

import React, { useState, useEffect } from "react";
import PageHeader from "@/components/ui/PageHeader";
import { Image as ImageIcon, X, ChevronLeft, ChevronRight, Sparkles, Filter, Video } from "lucide-react";
import Link from "next/link";

interface GalleryItem {
  id: string;
  type: string;
  url: string;
  title?: string;
  caption?: string;
}

interface Album {
  id: string;
  title: string;
  slug: string;
  category: string;
  description?: string;
  coverImage: string;
  items: GalleryItem[];
}

export default function GalleryPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeItems, setActiveItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    async function fetchGallery() {
      try {
        const res = await fetch("/api/gallery");
        const data = await res.json();
        if (data.albums) {
          setAlbums(data.albums);
          // Flatten items
          const allItems = data.albums.flatMap((a: Album) => a.items || []);
          setActiveItems(allItems);
        }
      } catch (err) {
        console.error("Failed to load gallery:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchGallery();
  }, []);

  const categories = ["ALL", "Campus", "Sports", "Annual Day", "Science & Robotics", "Excursions"];

  const filteredAlbums = selectedCategory === "ALL" ? albums : albums.filter((a) => a.category === selectedCategory);
  const displayItems = selectedCategory === "ALL" 
    ? albums.flatMap((a) => a.items || [])
    : filteredAlbums.flatMap((a) => a.items || []);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const prevLightbox = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(lightboxIndex === 0 ? displayItems.length - 1 : lightboxIndex - 1);
    }
  };

  const nextLightbox = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(lightboxIndex === displayItems.length - 1 ? 0 : lightboxIndex + 1);
    }
  };

  return (
    <div>
      <PageHeader
        badge="Media & Campus Life"
        title="Photo Gallery & Campus Moments"
        description="Capturing vibrant milestones, sports championships, theatrical celebrations, and daily academic life in Mandi."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Gallery" },
        ]}
      />

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-12 space-y-10">
        {/* Category Controls & Video Shortcut */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? "bg-school-primary text-amber-400 dark:bg-school-secondary dark:text-white shadow-md"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/gallery/videos"
              className="inline-flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 hover:bg-school-secondary hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold px-4 py-2 rounded-xl transition-colors"
            >
              <Video className="w-4 h-4 text-amber-500" />
              <span>Watch Video Gallery</span>
            </Link>
            <Link
              href="/virtual-tour"
              className="inline-flex items-center space-x-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-sm"
            >
              <span>360° Virtual Tour</span>
            </Link>
          </div>
        </div>

        {/* Gallery Image Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-60 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : displayItems.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-sm">
            No photographs found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayItems.map((item, idx) => (
              <div
                key={item.id || idx}
                onClick={() => openLightbox(idx)}
                className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 border border-slate-200/80 dark:border-slate-800"
              >
                <img
                  src={item.url}
                  alt={item.title || "Campus Gallery"}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-school-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-white">
                  <p className="text-xs font-bold">{item.title || "Cambridge Mandi"}</p>
                  {item.caption && (
                    <p className="text-[11px] text-slate-300 line-clamp-1 mt-0.5">{item.caption}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && displayItems[lightboxIndex] && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={prevLightbox}
            className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <button
            onClick={nextLightbox}
            className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <div className="max-w-4xl max-h-[85vh] flex flex-col items-center space-y-3">
            <img
              src={displayItems[lightboxIndex].url}
              alt="Lightbox View"
              className="max-h-[75vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
            />
            <div className="text-center text-white">
              <p className="text-sm font-bold">{displayItems[lightboxIndex].title || "Cambridge International School Mandi"}</p>
              <p className="text-xs text-slate-300">{displayItems[lightboxIndex].caption}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
