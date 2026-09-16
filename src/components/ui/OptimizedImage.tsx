"use client";

import React, { useState } from "react";
import Image, { ImageProps } from "next/image";

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  priority?: boolean;
  aspectRatio?: string;
  useNextImage?: boolean;
  width?: number;
  height?: number;
  fill?: boolean;
}

/**
 * Normalizes image URLs for maximum speed:
 * 1. Unsplash: adds `&auto=format&q=75` for WebP/AVIF compression.
 * 2. Local uploads: prefers WebP version if available.
 */
export function getOptimizedImageUrl(url: string | undefined | null): string {
  if (!url) return "/images/placeholder.jpg";

  // Unsplash dynamic compression
  if (url.includes("images.unsplash.com")) {
    if (!url.includes("auto=format")) {
      const separator = url.includes("?") ? "&" : "?";
      return `${url}${separator}auto=format&q=75&fit=crop`;
    }
    return url;
  }

  // Local uploads: auto-convert .jpg/.png to .webp
  if (url.startsWith("/uploads/") && !url.endsWith(".webp") && !url.endsWith(".pdf") && !url.endsWith(".txt")) {
    const lastDot = url.lastIndexOf(".");
    if (lastDot > 0) {
      const webpUrl = url.substring(0, lastDot) + ".webp";
      return webpUrl;
    }
  }

  return url;
}

export default function OptimizedImage({
  src,
  alt,
  fallbackSrc = "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800&auto=format&fit=crop&q=75",
  className = "",
  priority = false,
  aspectRatio,
  useNextImage = false,
  width,
  height,
  fill,
  ...props
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(getOptimizedImageUrl(src));
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Update src when prop changes
  React.useEffect(() => {
    setImgSrc(getOptimizedImageUrl(src));
    setHasError(false);
  }, [src]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      // If webp failed, try original src, otherwise fallback
      if (imgSrc.endsWith(".webp") && src && !src.endsWith(".webp")) {
        setImgSrc(src);
      } else {
        setImgSrc(fallbackSrc);
      }
    }
  };

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* Sleek Skeleton Loading Background */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-800/40 animate-pulse z-0 pointer-events-none" />
      )}

      {/* Render optimized image */}
      <img
        src={imgSrc}
        alt={alt || "Cambridge International School Mandi"}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        onLoad={() => setIsLoaded(true)}
        onError={handleError}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        {...props}
      />
    </div>
  );
}
