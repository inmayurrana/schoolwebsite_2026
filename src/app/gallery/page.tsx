"use client";

import React, { useState, useEffect } from "react";
import PageHeader from "@/components/ui/PageHeader";
import {
  Image as ImageIcon,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Filter,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Download,
  Play,
  Pause,
  FolderOpen,
  ArrowLeft,
  Grid,
} from "lucide-react";
import Link from "next/link";

interface GalleryPhoto {
  id?: string;
  url: string;
  title?: string;
  caption?: string;
  type?: string;
}

interface AlbumGroup {
  id: string;
  title: string;
  slug: string;
  category: string;
  description?: string;
  coverImage: string;
  items: GalleryPhoto[];
  createdAt?: string;
}

export default function GalleryPage() {
  const [albums, setAlbums] = useState<AlbumGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumGroup | null>(null);
  const [viewMode, setViewMode] = useState<"GROUPS" | "ALL_PHOTOS">("GROUPS");

  // Lightbox State
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lightboxList, setLightboxList] = useState<GalleryPhoto[]>([]);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isPlayingSlideshow, setIsPlayingSlideshow] = useState<boolean>(false);

  useEffect(() => {
    async function fetchGallery() {
      try {
        setLoading(true);
        const res = await fetch("/api/gallery");
        const data = await res.json();
        if (data.albums) {
          setAlbums(data.albums);
        }
      } catch (err) {
        console.error("Failed to load gallery:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchGallery();
  }, []);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "ArrowRight") nextPhoto();
      else if (e.key === "ArrowLeft") prevPhoto();
      else if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, lightboxList]);

  // Slideshow timer
  useEffect(() => {
    if (!isPlayingSlideshow || lightboxIndex === null) return;
    const interval = setInterval(() => {
      setLightboxIndex((prev) =>
        prev !== null && prev < lightboxList.length - 1 ? prev + 1 : 0
      );
    }, 3500);
    return () => clearInterval(interval);
  }, [isPlayingSlideshow, lightboxIndex, lightboxList]);

  const categories = ["ALL", "Campus", "Sports", "Annual Day", "Science & Robotics", "Excursions", "Celebrations"];

  const filteredAlbums =
    selectedCategory === "ALL"
      ? albums
      : albums.filter((a) => a.category === selectedCategory);

  // All flattened photos for stream mode
  const allPhotos: { photo: GalleryPhoto; albumTitle: string }[] = [];
  filteredAlbums.forEach((alb) => {
    (alb.items || []).forEach((photo) => {
      allPhotos.push({ photo, albumTitle: alb.title });
    });
  });

  // Open Lightbox for specific photo in an array
  const openLightbox = (photos: GalleryPhoto[], index: number) => {
    setLightboxList(photos);
    setLightboxIndex(index);
    setZoomLevel(1);
    setIsPlayingSlideshow(false);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    setZoomLevel(1);
    setIsPlayingSlideshow(false);
  };

  const prevPhoto = () => {
    if (lightboxIndex !== null && lightboxList.length > 0) {
      setLightboxIndex(lightboxIndex === 0 ? lightboxList.length - 1 : lightboxIndex - 1);
      setZoomLevel(1);
    }
  };

  const nextPhoto = () => {
    if (lightboxIndex !== null && lightboxList.length > 0) {
      setLightboxIndex(lightboxIndex === lightboxList.length - 1 ? 0 : lightboxIndex + 1);
      setZoomLevel(1);
    }
  };

  const activePhoto = lightboxIndex !== null ? lightboxList[lightboxIndex] : null;

  return (
    <div className="space-y-0">
      <PageHeader
        badge="Interactive Visual Archives"
        title="Campus Life, Laurels & Photo Albums"
        description="Explore high-definition memories of our 10-acre Himalayan sanctuary, national championships, robotics championships, and daily academic life."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Photo Gallery" }]}
      />

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-12 space-y-12">
        {/* TOP FILTER & VIEW CONTROLS */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
          {/* Category Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 lg:pb-0 custom-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat);
                  setSelectedAlbum(null);
                }}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-school-primary dark:bg-amber-400 text-white dark:text-slate-950 shadow-md scale-[1.02]"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {cat === "ALL" ? "✨ All Groups" : cat}
              </button>
            ))}
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center space-x-2 self-start lg:self-auto bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                setViewMode("GROUPS");
                setSelectedAlbum(null);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                viewMode === "GROUPS" && !selectedAlbum
                  ? "bg-white dark:bg-slate-800 text-school-primary dark:text-amber-400 shadow"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Album Groups</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setViewMode("ALL_PHOTOS");
                setSelectedAlbum(null);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                viewMode === "ALL_PHOTOS"
                  ? "bg-white dark:bg-slate-800 text-school-primary dark:text-amber-400 shadow"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>All Photos Stream</span>
            </button>
          </div>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="py-24 text-center space-y-4">
            <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-semibold text-slate-500">Loading campus photo albums...</p>
          </div>
        )}

        {/* VIEW A: FOCUSED SINGLE ALBUM GROUP VIEW */}
        {!loading && selectedAlbum && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900/80 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setSelectedAlbum(null)}
                  className="inline-flex items-center space-x-1 text-xs font-bold text-school-secondary dark:text-amber-400 hover:underline mb-2 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to All Album Groups</span>
                </button>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-500 border border-amber-500/30">
                    {selectedAlbum.category}
                  </span>
                  <span className="text-xs text-slate-500">
                    {selectedAlbum.items?.length || 0} Photographs
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-school-primary dark:text-white">
                  {selectedAlbum.title}
                </h2>
                {selectedAlbum.description && (
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
                    {selectedAlbum.description}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => openLightbox(selectedAlbum.items || [], 0)}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs rounded-2xl shadow-lg flex items-center space-x-2 hover:from-amber-300 cursor-pointer self-start sm:self-auto"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Slideshow</span>
              </button>
            </div>

            {/* Photos in this Album */}
            {(!selectedAlbum.items || selectedAlbum.items.length === 0) ? (
              <div className="p-16 text-center text-slate-500 bg-slate-50 dark:bg-slate-900/40 rounded-3xl border border-slate-200 dark:border-slate-800">
                <p className="text-sm">No photos added to this group yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {selectedAlbum.items.map((photo, idx) => (
                  <div
                    key={photo.id || idx}
                    onClick={() => openLightbox(selectedAlbum.items, idx)}
                    className="group relative rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer aspect-square"
                  >
                    <img
                      src={photo.url}
                      alt={photo.title || `Photo ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5">
                      <p className="text-white font-bold text-sm line-clamp-1">{photo.title || `Photo #${idx + 1}`}</p>
                      <span className="text-[11px] text-amber-400 font-semibold mt-0.5">Click to expand</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW B: ALL ALBUM GROUPS GRID */}
        {!loading && !selectedAlbum && viewMode === "GROUPS" && (
          <div className="space-y-6">
            {filteredAlbums.length === 0 ? (
              <div className="py-20 text-center text-slate-500 bg-slate-50 dark:bg-slate-900/40 rounded-3xl border border-slate-200 dark:border-slate-800">
                <ImageIcon className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-60" />
                <p className="text-base font-bold text-slate-700 dark:text-slate-300">No album groups found</p>
                <p className="text-xs text-slate-500 mt-1">Check back soon as new campus event galleries are published.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredAlbums.map((alb) => (
                  <div
                    key={alb.id}
                    onClick={() => setSelectedAlbum(alb)}
                    className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-xl hover:shadow-2xl hover:border-amber-400/80 transition-all duration-300 flex flex-col justify-between cursor-pointer"
                  >
                    {/* Album Cover & Badges */}
                    <div className="relative h-64 overflow-hidden bg-slate-950">
                      <img
                        src={alb.coverImage}
                        alt={alb.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-75" />

                      {/* Top Badges */}
                      <div className="absolute top-4 left-4 flex items-center space-x-2">
                        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-900/90 text-amber-400 border border-slate-700 backdrop-blur-md">
                          {alb.category}
                        </span>
                      </div>

                      {/* Photo Count Chip */}
                      <div className="absolute bottom-4 right-4 bg-slate-900/90 text-white px-3 py-1.5 rounded-2xl text-xs font-bold border border-slate-700 flex items-center space-x-1.5 backdrop-blur-md">
                        <Layers className="w-4 h-4 text-amber-400" />
                        <span>{alb.items?.length || 0} Photographs</span>
                      </div>
                    </div>

                    {/* Album Content */}
                    <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <h3 className="font-extrabold text-xl text-school-primary dark:text-white group-hover:text-amber-500 transition-colors">
                          {alb.title}
                        </h3>
                        {alb.description && (
                          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                            {alb.description}
                          </p>
                        )}
                      </div>

                      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-school-secondary dark:text-amber-400">
                        <span>Explore Group Photos</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW C: ALL PHOTOS STREAM (DYNAMIC MASONRY/GRID) */}
        {!loading && !selectedAlbum && viewMode === "ALL_PHOTOS" && (
          <div className="space-y-6">
            {allPhotos.length === 0 ? (
              <div className="py-20 text-center text-slate-500 bg-slate-50 dark:bg-slate-900/40 rounded-3xl border border-slate-200 dark:border-slate-800">
                <p className="text-base font-bold">No photographs found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {allPhotos.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => openLightbox(allPhotos.map((p) => p.photo), idx)}
                    className="group relative rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer aspect-square"
                  >
                    <img
                      src={item.photo.url}
                      alt={item.photo.title || `Photo ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                        {item.albumTitle}
                      </span>
                      <p className="text-white font-bold text-sm line-clamp-1">{item.photo.title || `Photo #${idx + 1}`}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* FULLSCREEN INTERACTIVE LIGHTBOX MODAL */}
      {lightboxIndex !== null && activePhoto && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between text-white select-none animate-fadeIn">
          {/* Top Bar */}
          <div className="flex items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-black/80 to-transparent">
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950">
                Photo {lightboxIndex + 1} of {lightboxList.length}
              </span>
              <span className="text-sm font-bold text-slate-200 hidden sm:inline-block">
                {activePhoto.title || "Campus Photograph"}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {/* Zoom Controls */}
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(0.5, z - 0.25))}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(3, z + 0.25))}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-5 h-5" />
              </button>

              {/* Slideshow Play/Pause */}
              <button
                type="button"
                onClick={() => setIsPlayingSlideshow(!isPlayingSlideshow)}
                className={`p-2 rounded-xl transition-colors ${
                  isPlayingSlideshow ? "bg-amber-400 text-slate-950 font-bold" : "hover:bg-white/10 text-white"
                }`}
                title={isPlayingSlideshow ? "Pause Slideshow" : "Play Slideshow"}
              >
                {isPlayingSlideshow ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>

              {/* Download Photo */}
              <a
                href={activePhoto.url}
                target="_blank"
                download
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                title="Download High-Res Photo"
              >
                <Download className="w-5 h-5" />
              </a>

              {/* Close Lightbox */}
              <button
                type="button"
                onClick={closeLightbox}
                className="p-2 bg-white/10 hover:bg-rose-500 hover:text-white rounded-xl transition-colors ml-2"
                title="Close (Esc)"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Center Main Photo Stage */}
          <div className="flex-1 relative flex items-center justify-center p-4 overflow-hidden">
            {/* Prev Arrow */}
            <button
              type="button"
              onClick={prevPhoto}
              className="absolute left-4 z-20 p-3 bg-black/60 hover:bg-amber-400 hover:text-slate-950 rounded-2xl backdrop-blur-md transition-all cursor-pointer transform hover:scale-110"
              title="Previous Photo (Left Arrow)"
            >
              <ChevronLeft className="w-7 h-7 stroke-[3]" />
            </button>

            {/* Photo with dynamic Zoom */}
            <div
              className="max-w-6xl max-h-[75vh] transition-transform duration-300 ease-out flex items-center justify-center"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <img
                src={activePhoto.url}
                alt={activePhoto.title || "Full resolution photo"}
                className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl"
              />
            </div>

            {/* Next Arrow */}
            <button
              type="button"
              onClick={nextPhoto}
              className="absolute right-4 z-20 p-3 bg-black/60 hover:bg-amber-400 hover:text-slate-950 rounded-2xl backdrop-blur-md transition-all cursor-pointer transform hover:scale-110"
              title="Next Photo (Right Arrow)"
            >
              <ChevronRight className="w-7 h-7 stroke-[3]" />
            </button>
          </div>

          {/* Bottom Filmstrip Thumbnail Carousel */}
          <div className="p-4 bg-gradient-to-t from-black/90 via-black/70 to-transparent flex flex-col items-center space-y-3">
            {activePhoto.title && (
              <p className="text-xs sm:text-sm text-slate-300 text-center max-w-xl font-medium">
                {activePhoto.title}
              </p>
            )}

            <div className="flex items-center space-x-2 overflow-x-auto max-w-3xl py-1 px-4 custom-scrollbar">
              {lightboxList.map((thumb, tIdx) => (
                <button
                  key={thumb.id || tIdx}
                  type="button"
                  onClick={() => {
                    setLightboxIndex(tIdx);
                    setZoomLevel(1);
                  }}
                  className={`w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${
                    lightboxIndex === tIdx
                      ? "border-amber-400 scale-110 shadow-lg ring-2 ring-amber-400/50"
                      : "border-transparent opacity-50 hover:opacity-100"
                  }`}
                >
                  <img
                    src={thumb.url}
                    alt={`Thumb ${tIdx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
