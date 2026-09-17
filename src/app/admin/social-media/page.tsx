"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Globe,
  Share2,
  Tv,
  Play,
  ExternalLink,
  Save,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  HelpCircle,
  Video,
  Eye,
  RefreshCw,
} from "lucide-react";

// Helper to extract or generate clean YouTube embed URL
function getCleanYouTubeEmbed(url?: string): string {
  if (!url || !url.trim()) {
    return "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ";
  }
  const clean = url.trim();
  if (clean.includes("embed/")) {
    return clean;
  }
  const match = clean.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
  if (match && match[1]) {
    return `https://www.youtube-nocookie.com/embed/${match[1]}?rel=0&modestbranding=1`;
  }
  return clean;
}

// Helper to extract or generate clean Facebook Page embed URL
function getCleanFacebookEmbed(fbUrl?: string, customEmbed?: string): string {
  if (customEmbed && customEmbed.trim()) {
    return customEmbed.trim();
  }
  const targetPage = (fbUrl && fbUrl.trim()) ? fbUrl.trim() : "https://www.facebook.com/cismandi";
  const encoded = encodeURIComponent(targetPage);
  return `https://www.facebook.com/plugins/page.php?href=${encoded}&tabs=timeline&width=500&height=550&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true`;
}

export default function AdminSocialMediaStudio() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Social Links & Embeds State
  const [facebookUrl, setFacebookUrl] = useState("https://facebook.com/cismandi");
  const [facebookEmbedUrl, setFacebookEmbedUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("https://youtube.com/@cismandi");
  const [youtubeEmbedUrl, setYoutubeEmbedUrl] = useState("https://www.youtube-nocookie.com/embed/48fO2u80pBs");
  const [instagramUrl, setInstagramUrl] = useState("https://instagram.com/cismandi_official");
  const [whatsappNumber, setWhatsappNumber] = useState("+919816099999");
  const [twitterUrl, setTwitterUrl] = useState("https://twitter.com/cismandi");
  const [linkedinUrl, setLinkedinUrl] = useState("https://linkedin.com/school/cismandi");

  // Home Page Display Settings
  const [showSocialEmbedsHome, setShowSocialEmbedsHome] = useState(true);
  const [socialSectionTitle, setSocialSectionTitle] = useState("Live Social Feeds & Video Broadcasts");
  const [socialSectionSubtitle, setSocialSectionSubtitle] = useState(
    "Follow Cambridge International School Mandi on Facebook and YouTube for daily campus highlights, student achievements, and live streams."
  );

  // Active preview tab for testing
  const [previewTab, setPreviewTab] = useState<"youtube" | "facebook">("youtube");

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.settings && Array.isArray(data.settings)) {
            const map: Record<string, string> = {};
            data.settings.forEach((s: any) => {
              map[s.key] = s.value;
            });

            if (map.facebook_url) setFacebookUrl(map.facebook_url);
            if (map.facebook_embed_url !== undefined) setFacebookEmbedUrl(map.facebook_embed_url);
            if (map.youtube_url) setYoutubeUrl(map.youtube_url);
            if (map.youtube_embed_url !== undefined) setYoutubeEmbedUrl(map.youtube_embed_url);
            if (map.instagram_url) setInstagramUrl(map.instagram_url);
            if (map.whatsapp_number) setWhatsappNumber(map.whatsapp_number);
            if (map.twitter_url) setTwitterUrl(map.twitter_url);
            if (map.linkedin_url) setLinkedinUrl(map.linkedin_url);

            if (map.show_social_embeds_home !== undefined) {
              setShowSocialEmbedsHome(map.show_social_embeds_home !== "false");
            }
            if (map.social_section_title) setSocialSectionTitle(map.social_section_title);
            if (map.social_section_subtitle) setSocialSectionSubtitle(map.social_section_subtitle);
          }
        }
      } catch (err) {
        console.error("Failed to load social settings:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    const payload = [
      { key: "facebook_url", value: facebookUrl.trim(), category: "SOCIAL" },
      { key: "facebook_embed_url", value: facebookEmbedUrl.trim(), category: "SOCIAL" },
      { key: "youtube_url", value: youtubeUrl.trim(), category: "SOCIAL" },
      { key: "youtube_embed_url", value: youtubeEmbedUrl.trim(), category: "SOCIAL" },
      { key: "instagram_url", value: instagramUrl.trim(), category: "SOCIAL" },
      { key: "whatsapp_number", value: whatsappNumber.trim(), category: "CONTACT" },
      { key: "twitter_url", value: twitterUrl.trim(), category: "SOCIAL" },
      { key: "linkedin_url", value: linkedinUrl.trim(), category: "SOCIAL" },
      { key: "show_social_embeds_home", value: showSocialEmbedsHome ? "true" : "false", category: "HOMEPAGE" },
      { key: "social_section_title", value: socialSectionTitle.trim(), category: "HOMEPAGE" },
      { key: "social_section_subtitle", value: socialSectionSubtitle.trim(), category: "HOMEPAGE" },
    ];

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: payload }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 4000);
      } else {
        const d = await res.json();
        setError(d.error || "Failed to update social settings.");
      }
    } catch (err: any) {
      setError(err.message || "Network error while saving.");
    } finally {
      setSaving(false);
    }
  };

  const previewYouTubeSrc = getCleanYouTubeEmbed(youtubeEmbedUrl || youtubeUrl);
  const previewFacebookSrc = getCleanFacebookEmbed(facebookUrl, facebookEmbedUrl);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center text-white">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-rose-500 border-t-amber-400 rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-400">Loading Social Media & Video Channel Config...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-24 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-rose-400 font-bold text-xs uppercase tracking-widest bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-full mb-1">
            <Share2 className="w-3.5 h-3.5" />
            <span>Official Social Channels & Live Broadcasts</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
            Facebook & YouTube Channel Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Configure official Facebook pages, YouTube channel videos, live streams, and social links displayed across the website and footer.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-xs font-bold border border-slate-700 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>View Public Website</span>
          </Link>
          <button
            type="button"
            onClick={() => handleSave()}
            disabled={saving}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-lg shadow-rose-600/30 transition-all disabled:opacity-50"
          >
            {saving ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save All Social Links</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Notifications */}
      {success && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center space-x-3 text-emerald-400 text-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-bold">Social Media Settings Saved Successfully!</p>
            <p className="text-[11px] text-emerald-300/80">
              Facebook page links, YouTube video streams, and footer icons have been updated immediately.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center space-x-3 text-rose-400 text-xs animate-in fade-in">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="font-semibold">{error}</p>
        </div>
      )}

      {/* Home Page Live Embed Switch Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Tv className="w-4 h-4 text-rose-400" />
              <h2 className="text-base font-bold text-white">Home Page Live Broadcast & Social Feeds Section</h2>
            </div>
            <p className="text-xs text-slate-400">
              Toggle and customize the dynamic YouTube video player & Facebook interactive feed section on the public homepage.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
            <input
              type="checkbox"
              checked={showSocialEmbedsHome}
              onChange={(e) => setShowSocialEmbedsHome(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-12 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
            <span className="ml-3 text-xs font-bold text-slate-200">
              {showSocialEmbedsHome ? "Enabled on Home Page" : "Hidden"}
            </span>
          </label>
        </div>

        {showSocialEmbedsHome && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Home Section Title</label>
              <input
                type="text"
                value={socialSectionTitle}
                onChange={(e) => setSocialSectionTitle(e.target.value)}
                placeholder="Live Social Feeds & Video Broadcasts"
                className="w-full bg-slate-950 text-white text-xs px-4 py-2.5 rounded-xl border border-slate-700 focus:border-rose-400 focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Home Section Subtitle</label>
              <input
                type="text"
                value={socialSectionSubtitle}
                onChange={(e) => setSocialSectionSubtitle(e.target.value)}
                placeholder="Follow Cambridge International School Mandi on Facebook and YouTube..."
                className="w-full bg-slate-950 text-white text-xs px-4 py-2.5 rounded-xl border border-slate-700 focus:border-rose-400 focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Main Form & Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Link Inputs (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Facebook Section */}
          <div className="bg-slate-900/80 border border-blue-500/30 rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-md">
                  f
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Facebook Page & Stream Settings</h2>
                  <p className="text-[11px] text-slate-400">Official page link for footer icons and live timeline stream</p>
                </div>
              </div>
              {facebookUrl && (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs px-3 py-1.5 rounded-xl border border-blue-500/30 transition-colors"
                >
                  <span>Test Link</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-200 flex items-center justify-between">
                  <span>Official Facebook Page URL</span>
                  <span className="text-[10px] text-blue-400 font-mono">e.g. https://facebook.com/cismandi</span>
                </label>
                <input
                  type="text"
                  value={facebookUrl}
                  onChange={(e) => setFacebookUrl(e.target.value)}
                  placeholder="https://facebook.com/cismandi"
                  className="w-full bg-slate-950 text-white text-xs px-4 py-3 rounded-xl border border-slate-700 focus:border-blue-400 focus:outline-none font-mono"
                />
                <p className="text-[10px] text-slate-400">
                  Used for the Facebook icon in the footer, header, and the interactive timeline feed.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-200 flex items-center justify-between">
                  <span>Facebook Embed / Plugin Iframe URL (Optional)</span>
                  <span className="text-[10px] text-slate-500">Auto-generated if left blank</span>
                </label>
                <input
                  type="text"
                  value={facebookEmbedUrl}
                  onChange={(e) => setFacebookEmbedUrl(e.target.value)}
                  placeholder="https://www.facebook.com/plugins/page.php?href=..."
                  className="w-full bg-slate-950 text-white text-xs px-4 py-3 rounded-xl border border-slate-700 focus:border-blue-400 focus:outline-none font-mono"
                />
                <p className="text-[10px] text-slate-400">
                  Leave empty to automatically generate a standard responsive Facebook Page plugin from your Page URL.
                </p>
              </div>
            </div>
          </div>

          {/* 2. YouTube Section */}
          <div className="bg-slate-900/80 border border-red-500/30 rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-md">
                  <Play className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">YouTube Channel & Video Embeds</h2>
                  <p className="text-[11px] text-slate-400">Channel link for subscribe buttons and showcase video player</p>
                </div>
              </div>
              {youtubeUrl && (
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 text-xs px-3 py-1.5 rounded-xl border border-red-500/30 transition-colors"
                >
                  <span>Test Channel</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-200 flex items-center justify-between">
                  <span>Official YouTube Channel URL</span>
                  <span className="text-[10px] text-red-400 font-mono">e.g. https://youtube.com/@cismandi</span>
                </label>
                <input
                  type="text"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://youtube.com/@cismandi"
                  className="w-full bg-slate-950 text-white text-xs px-4 py-3 rounded-xl border border-slate-700 focus:border-red-400 focus:outline-none font-mono"
                />
                <p className="text-[10px] text-slate-400">
                  Target destination when users click "Subscribe on YouTube" or the YouTube footer button.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-200 flex items-center justify-between">
                  <span>Featured Video, Live Stream or Playlist Embed URL</span>
                  <span className="text-[10px] text-amber-400 font-mono">Accepts watch / shorts / embed URLs</span>
                </label>
                <input
                  type="text"
                  value={youtubeEmbedUrl}
                  onChange={(e) => setYoutubeEmbedUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=48fO2u80pBs or embed link"
                  className="w-full bg-slate-950 text-white text-xs px-4 py-3 rounded-xl border border-slate-700 focus:border-red-400 focus:outline-none font-mono"
                />
                <p className="text-[10px] text-slate-400">
                  This video or livestream will play automatically in high-definition on the homepage video player.
                </p>
              </div>
            </div>
          </div>

          {/* 3. Additional Social Networks */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
              <div className="w-9 h-9 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Other Connected Social Channels</h2>
                <p className="text-[11px] text-slate-400">Instagram, WhatsApp, Twitter/X, and LinkedIn</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-200">Instagram Profile URL</label>
                <input
                  type="text"
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  placeholder="https://instagram.com/cismandi_official"
                  className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 focus:border-purple-400 focus:outline-none font-mono text-[11px]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-200">WhatsApp Support Number / Link</label>
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="+919816099999"
                  className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 focus:border-emerald-400 focus:outline-none font-mono text-[11px]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-200">Twitter / X Profile URL</label>
                <input
                  type="text"
                  value={twitterUrl}
                  onChange={(e) => setTwitterUrl(e.target.value)}
                  placeholder="https://twitter.com/cismandi"
                  className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 focus:border-cyan-400 focus:outline-none font-mono text-[11px]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-200">LinkedIn School Page URL</label>
                <input
                  type="text"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/school/cismandi"
                  className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 focus:border-blue-400 focus:outline-none font-mono text-[11px]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Interactive Preview (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 sticky top-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Live Public Preview</h3>
              </div>
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px]">
                <button
                  type="button"
                  onClick={() => setPreviewTab("youtube")}
                  className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                    previewTab === "youtube"
                      ? "bg-red-600 text-white shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  YouTube Player
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab("facebook")}
                  className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                    previewTab === "facebook"
                      ? "bg-blue-600 text-white shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Facebook Stream
                </button>
              </div>
            </div>

            {/* Preview Box */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 space-y-4">
              {previewTab === "youtube" ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200 flex items-center space-x-1.5">
                      <Play className="w-3.5 h-3.5 text-red-500 fill-current" />
                      <span>YouTube 16:9 Broadcast Video</span>
                    </span>
                    <a
                      href={youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-red-400 hover:underline flex items-center space-x-1"
                    >
                      <span>Channel</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>

                  <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-slate-800 shadow-inner">
                    <iframe
                      src={previewYouTubeSrc}
                      title="YouTube Preview"
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Source: <span className="text-slate-200 font-mono text-[10px] break-all">{previewYouTubeSrc}</span>
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200 flex items-center space-x-1.5">
                      <span className="w-3.5 h-3.5 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-[9px]">f</span>
                      <span>Facebook Community Stream</span>
                    </span>
                    <a
                      href={facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-blue-400 hover:underline flex items-center space-x-1"
                    >
                      <span>Page</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>

                  <div className="w-full h-[400px] rounded-xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
                    <iframe
                      src={previewFacebookSrc}
                      title="Facebook Preview"
                      className="w-full h-full border-none"
                      scrolling="no"
                      allow="encrypted-media"
                    />
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Target Page: <span className="text-slate-200 font-mono text-[10px] break-all">{facebookUrl}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Quick Status Pill Bar */}
            <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Active Social Endpoints
              </span>
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold rounded-lg flex items-center space-x-1">
                  <span>Facebook Connected</span>
                </span>
                <span className="px-2.5 py-1 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold rounded-lg flex items-center space-x-1">
                  <span>YouTube Connected</span>
                </span>
                <span className="px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-bold rounded-lg flex items-center space-x-1">
                  <span>Instagram Connected</span>
                </span>
                <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-lg flex items-center space-x-1">
                  <span>WhatsApp Active</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Save Toolbar */}
      <div className="sticky bottom-6 z-30 bg-slate-900/95 backdrop-blur-lg border border-slate-700/80 p-4 rounded-3xl shadow-2xl flex items-center justify-between">
        <div className="text-xs text-slate-400 hidden sm:block">
          Click <span className="text-white font-semibold">"Save All Social Links"</span> to apply updates to Header, Footer, and Home Page.
        </div>
        <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={() => handleSave()}
            disabled={saving}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white px-6 py-2.5 rounded-2xl text-xs font-bold shadow-lg shadow-rose-600/30 transition-all disabled:opacity-50"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Saving Social Settings...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Social Links</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
