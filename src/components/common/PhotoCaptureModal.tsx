"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Upload,
  X,
  RotateCcw,
  Check,
  AlertCircle,
  Sparkles,
  Link as LinkIcon,
  RefreshCw,
  Image as ImageIcon,
  FolderOpen,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

interface PhotoSourceChooserModalProps {
  isOpen: boolean;
  fieldLabel?: string;
  maxSizeMB?: number;
  onClose: () => void;
  onSelectCamera: () => void;
  onSelectUpload: () => void;
  onSelectUrl?: () => void;
}

/**
 * High-Impact Interactive Photo Source Chooser Dialog
 */
export function PhotoSourceChooserModal({
  isOpen,
  fieldLabel = "Passport Size Photograph",
  maxSizeMB = 5,
  onClose,
  onSelectCamera,
  onSelectUpload,
  onSelectUrl,
}: PhotoSourceChooserModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 sm:p-7 space-y-6 text-slate-900 dark:text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-black uppercase tracking-wider border border-amber-500/20">
              <Camera className="w-3.5 h-3.5" />
              <span>Photo Upload Assistant</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black font-heading tracking-tight text-slate-900 dark:text-white">
              {fieldLabel}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Choose how you would like to provide your photograph:
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2 Primary Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Option 1: Open Camera (Live Photo) */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onSelectCamera();
            }}
            className="group relative flex flex-col items-center text-center p-5 rounded-2xl border-2 border-slate-200 dark:border-slate-700/80 bg-slate-50/80 dark:bg-slate-800/40 hover:border-amber-500 dark:hover:border-amber-400 hover:bg-amber-50/40 dark:hover:bg-amber-950/20 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 cursor-pointer text-left"
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 dark:bg-amber-400/10 text-amber-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-inner border border-amber-500/20">
              <Camera className="w-7 h-7" />
            </div>
            <span className="text-sm font-black text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              Open Camera
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
              Take a live photo with passport headshot alignment guide
            </span>
            <span className="mt-3 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
              Instant Snapshot
            </span>
          </button>

          {/* Option 2: Upload from Device / Gallery */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onSelectUpload();
            }}
            className="group relative flex flex-col items-center text-center p-5 rounded-2xl border-2 border-slate-200 dark:border-slate-700/80 bg-slate-50/80 dark:bg-slate-800/40 hover:border-sky-500 dark:hover:border-sky-400 hover:bg-sky-50/40 dark:hover:bg-sky-950/20 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 cursor-pointer text-left"
          >
            <div className="w-14 h-14 rounded-2xl bg-sky-500/10 dark:bg-sky-400/10 text-sky-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-inner border border-sky-500/20">
              <Upload className="w-7 h-7" />
            </div>
            <span className="text-sm font-black text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
              Upload Image
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
              Browse photo files or gallery from your device
            </span>
            <span className="mt-3 text-[10px] font-bold text-sky-600 dark:text-sky-400 bg-sky-500/10 px-2.5 py-0.5 rounded-full border border-sky-500/20">
              JPG, PNG up to {maxSizeMB}MB
            </span>
          </button>
        </div>

        {/* Footer Link Options */}
        {onSelectUrl && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[11px]">Have an existing photo link?</span>
            <button
              type="button"
              onClick={() => {
                onClose();
                onSelectUrl();
              }}
              className="text-amber-500 hover:underline font-bold flex items-center space-x-1 cursor-pointer"
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Paste Image Link</span>
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

interface LiveCameraStudioModalProps {
  isOpen: boolean;
  fieldLabel?: string;
  maxSizeMB?: number;
  onClose: () => void;
  onCapture: (file: File) => void;
  onFallbackToFile: () => void;
}

/**
 * State-of-the-Art Interactive Live Camera Studio Modal
 * Features:
 * - Real-time camera viewfinder
 * - Passport frame oval head guide & viewfinder corner reticles
 * - Flip/Switch camera support for mobile/multi-cam devices
 * - Shutter snap with flash effect
 * - Instant review with Retake & Confirm controls
 * - Automatic camera hardware turn-off on exit
 */
export function LiveCameraStudioModal({
  isOpen,
  fieldLabel = "Passport Photo Headshot",
  maxSizeMB = 5,
  onClose,
  onCapture,
  onFallbackToFile,
}: LiveCameraStudioModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [streamActive, setStreamActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
  const [flashActive, setFlashActive] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Stop camera tracks cleanly
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (_) {}
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setStreamActive(false);
  }, []);

  // Start camera stream
  const startCamera = useCallback(
    async (mode: "user" | "environment") => {
      stopCamera();
      setCameraError(null);
      setIsInitializing(true);

      // Check browser support
      if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
        setCameraError(
          "Camera access is not supported by your browser or connection. Please choose 'Upload Image' to select a photo file."
        );
        setIsInitializing(false);
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: mode,
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setStreamActive(true);
        }

        // Check if multiple camera devices exist
        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoInputs = devices.filter((d) => d.kind === "videoinput");
          setHasMultipleCameras(videoInputs.length > 1);
        } catch (_) {}
      } catch (err: any) {
        console.error("Camera access error:", err);
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          setCameraError(
            "Camera permission was blocked. Please click the camera/lock icon in your browser address bar to allow camera access, or upload a photo directly."
          );
        } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
          setCameraError("No camera device was detected on your system. Please upload a photo from your device.");
        } else {
          setCameraError(
            `Unable to connect to camera (${err.message || "Unknown error"}). Please upload a photo directly.`
          );
        }
      } finally {
        setIsInitializing(false);
      }
    },
    [stopCamera]
  );

  useEffect(() => {
    if (isOpen) {
      setCapturedImage(null);
      setCapturedBlob(null);
      startCamera(facingMode);
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode, startCamera, stopCamera]);

  // Keyboard shortcut: Esc closes modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        stopCamera();
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, stopCamera]);

  // Capture frame from live video
  const handleSnap = () => {
    if (!videoRef.current) return;

    // Trigger visual shutter flash
    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 220);

    const video = videoRef.current;
    const canvas = document.createElement("canvas");

    const vidW = video.videoWidth || 640;
    const vidH = video.videoHeight || 480;

    // Target a portrait passport aspect ratio (3:4)
    const targetAspect = 3 / 4;
    let cropW = vidW;
    let cropH = vidW / targetAspect;

    if (cropH > vidH) {
      cropH = vidH;
      cropW = vidH * targetAspect;
    }

    const startX = (vidW - cropW) / 2;
    const startY = (vidH - cropH) / 2;

    canvas.width = Math.min(Math.round(cropW), 960);
    canvas.height = Math.min(Math.round(cropH), 1280);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Mirror horizontal when using user/front selfie camera
    if (facingMode === "user") {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(
      video,
      startX,
      startY,
      cropW,
      cropH,
      0,
      0,
      canvas.width,
      canvas.height
    );

    canvas.toBlob(
      (blob) => {
        if (blob) {
          setCapturedBlob(blob);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
          setCapturedImage(dataUrl);
        }
      },
      "image/jpeg",
      0.92
    );
  };

  // Retake photo
  const handleRetake = () => {
    setCapturedImage(null);
    setCapturedBlob(null);
    startCamera(facingMode);
  };

  // Confirm photo and send to uploader
  const handleConfirm = () => {
    if (!capturedBlob) return;
    const file = new File([capturedBlob], `passport_photo_${Date.now()}.jpg`, {
      type: "image/jpeg",
    });
    stopCamera();
    onCapture(file);
    onClose();
  };

  // Switch between front/back camera
  const handleToggleFacingMode = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl text-white overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950/90 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 shadow-[0_0_8px_#10b981]"></span>
            </span>
            <div className="flex items-center space-x-1.5 text-xs font-black uppercase tracking-wider text-slate-300">
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              <span>{capturedImage ? "Photo Review" : "Live Camera Studio"}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Close Camera"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Viewfinder / Capture Canvas Container */}
        <div className="p-5 sm:p-6 space-y-4">
          {cameraError ? (
            /* Error & Fallback UI */
            <div className="p-6 rounded-2xl bg-rose-950/30 border border-rose-500/40 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto shadow-md">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-black text-sm text-white">Camera Access Notice</h4>
                <p className="text-xs text-rose-200/80 max-w-sm mx-auto leading-relaxed">
                  {cameraError}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => startCamera(facingMode)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    stopCamera();
                    onClose();
                    onFallbackToFile();
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black flex items-center space-x-1.5 transition-all shadow-md cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Image File Instead</span>
                </button>
              </div>
            </div>
          ) : capturedImage ? (
            /* Snapshot Review Screen */
            <div className="space-y-4">
              <div className="relative w-full aspect-[3/4] max-h-[460px] mx-auto rounded-2xl overflow-hidden bg-black border-2 border-amber-400/80 shadow-2xl flex items-center justify-center">
                <img
                  src={capturedImage}
                  alt="Captured headshot"
                  className="w-full h-full object-cover select-none"
                />
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-emerald-400/50 text-[10px] font-black text-emerald-400 flex items-center space-x-1 shadow">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Captured Headshot Ready</span>
                </div>
              </div>

              {/* Action Buttons: Retake vs Confirm */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleRetake}
                  className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer border border-slate-700 shadow-sm"
                >
                  <RotateCcw className="w-4 h-4 text-amber-400" />
                  <span>Retake Photo</span>
                </button>

                <button
                  type="button"
                  onClick={handleConfirm}
                  className="py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs flex items-center justify-center space-x-2 transition-all shadow-lg hover:shadow-amber-500/25 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Use This Photo</span>
                </button>
              </div>
            </div>
          ) : (
            /* Live Camera Viewfinder Screen */
            <div className="space-y-4">
              <div className="relative w-full aspect-[3/4] max-h-[460px] mx-auto rounded-2xl overflow-hidden bg-black border-2 border-slate-700 shadow-2xl flex items-center justify-center group">
                {/* Live Video Element */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${
                    facingMode === "user" ? "scale-x-[-1]" : ""
                  }`}
                />

                {/* Loading Spinner during initial camera boot */}
                {isInitializing && (
                  <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center space-y-2 text-amber-400 z-30">
                    <RefreshCw className="w-8 h-8 animate-spin" />
                    <span className="text-xs font-bold text-slate-300">Starting Camera...</span>
                  </div>
                )}

                {/* Shutter Visual Flash Overlay */}
                {flashActive && (
                  <div className="absolute inset-0 bg-white z-40 transition-opacity duration-200 pointer-events-none" />
                )}

                {/* Viewfinder Reticles & Golden Corners */}
                <div className="absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2 border-amber-400 shadow-[0_0_8px_#F59E0B] rounded-tl pointer-events-none z-20" />
                <div className="absolute top-4 right-4 w-5 h-5 border-t-2 border-r-2 border-amber-400 shadow-[0_0_8px_#F59E0B] rounded-tr pointer-events-none z-20" />
                <div className="absolute bottom-4 left-4 w-5 h-5 border-b-2 border-l-2 border-amber-400 shadow-[0_0_8px_#F59E0B] rounded-bl pointer-events-none z-20" />
                <div className="absolute bottom-4 right-4 w-5 h-5 border-b-2 border-r-2 border-amber-400 shadow-[0_0_8px_#F59E0B] rounded-br pointer-events-none z-20" />

                {/* Passport Headshot Oval Alignment Guide */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 p-6">
                  {/* Head & Shoulder Silhouette Outline */}
                  <div className="w-44 h-56 sm:w-52 sm:h-64 rounded-[50%/60%] border-2 border-dashed border-amber-400/60 shadow-[0_0_15px_rgba(245,158,11,0.25)] flex items-center justify-center relative">
                    {/* Center Crosshair */}
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400/40" />
                  </div>
                  <span className="text-[10px] font-bold text-amber-300/90 bg-slate-950/70 px-2.5 py-0.5 rounded-full mt-2 backdrop-blur-xs border border-amber-400/30">
                    Align face & eyes inside the oval guide
                  </span>
                </div>

                {/* Switch Camera Button (if device has front/rear cameras) */}
                {hasMultipleCameras && (
                  <button
                    type="button"
                    onClick={handleToggleFacingMode}
                    className="absolute top-3 right-3 z-30 p-2 rounded-full bg-slate-950/75 hover:bg-slate-900 border border-white/20 text-white shadow-md transition-colors cursor-pointer"
                    title="Switch Camera (Front/Rear)"
                  >
                    <RefreshCw className="w-4 h-4 text-amber-400" />
                  </button>
                )}
              </div>

              {/* Shutter Capture Bar */}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => {
                    stopCamera();
                    onClose();
                    onFallbackToFile();
                  }}
                  className="text-xs text-slate-400 hover:text-white font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  <span>Choose File Instead</span>
                </button>

                {/* Big Shutter Button */}
                <button
                  type="button"
                  onClick={handleSnap}
                  disabled={!streamActive}
                  className="relative group p-1 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 shadow-xl shadow-amber-500/25 hover:scale-105 active:scale-95 transition-transform cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Take Photo"
                >
                  <div className="w-14 h-14 rounded-full bg-white dark:bg-slate-950 flex items-center justify-center border-2 border-white/80">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 group-hover:scale-90 transition-transform flex items-center justify-center text-slate-950 shadow">
                      <Camera className="w-5 h-5 fill-slate-950" />
                    </div>
                  </div>
                </button>

                <div className="w-20 text-right">
                  <span className="text-[11px] font-bold text-slate-400">
                    {facingMode === "user" ? "Selfie" : "Rear"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
