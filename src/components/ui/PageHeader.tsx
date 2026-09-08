import React from "react";
import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";

interface PageHeaderProps {
  badge?: string;
  title: string;
  description: string;
  breadcrumbs?: { label: string; href?: string }[];
  image?: string;
}

export default function PageHeader({
  badge,
  title,
  description,
  breadcrumbs = [{ label: "Home", href: "/" }],
  image,
}: PageHeaderProps) {
  return (
    <div className="relative w-full bg-gradient-to-r from-[#030816] via-[#0A2540] to-[#001f3f] text-white py-16 sm:py-20 lg:py-24 overflow-hidden border-b border-white/10">
      {/* Background Image / Gradient Glow */}
      {image ? (
        <div
          className="absolute inset-0 opacity-25 bg-cover bg-center pointer-events-none mix-blend-overlay scale-105 transition-transform duration-1000"
          style={{ backgroundImage: `url(${image})` }}
        />
      ) : (
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500 via-transparent to-transparent pointer-events-none" />
      )}

      {/* Atmospheric Mountain Light Mesh */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 relative z-10 space-y-4">
        {/* Breadcrumb Trail */}
        <nav className="flex items-center space-x-2 text-xs text-slate-400">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-600" />}
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-amber-400 transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-slate-200 font-medium">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Badge */}
        {badge && (
          <div className="inline-flex items-center space-x-2 bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{badge}</span>
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold font-heading text-white tracking-tight leading-tight">
          {title}
        </h1>

        {/* Description */}
        <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-4xl leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
