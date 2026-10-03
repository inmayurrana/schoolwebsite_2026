"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Phone,
  Mail,
  Home,
  GraduationCap,
  Calendar,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Printer,
  Loader2,
  FileCheck,
  Briefcase,
  FileText,
  HelpCircle,
  Upload,
  AlertCircle,
  Check,
  Image as ImageIcon,
  Camera,
  Link as LinkIcon,
  ExternalLink,
  X,
  RefreshCw,
} from "lucide-react";
import confetti from "canvas-confetti";
import { FormDefinitionRecord, FormField, FormStep } from "@/lib/formRegistry";
import { PhotoSourceChooserModal, LiveCameraStudioModal } from "./PhotoCaptureModal";

interface DynamicFormRendererProps {
  initialForm?: FormDefinitionRecord;
  formSlug?: string;
  className?: string;
  onSuccess?: (data: any) => void;
}

const ICON_MAP: Record<string, any> = {
  User,
  Phone,
  Mail,
  Home,
  GraduationCap,
  Calendar,
  Briefcase,
  FileText,
  FileCheck,
  CheckCircle2,
  HelpCircle,
  ImageIcon,
  Camera,
};

function getInitialFormData(f: FormDefinitionRecord): Record<string, any> {
  const initial: Record<string, any> = {};
  f.fields.forEach((field) => {
    if (field.defaultValue !== undefined) {
      initial[field.name] = field.defaultValue;
    } else if (field.type === "checkbox") {
      initial[field.name] = false;
    } else {
      initial[field.name] = "";
    }
  });
  return initial;
}

export default function DynamicFormRenderer({
  initialForm,
  formSlug = "admissions-apply",
  className = "",
  onSuccess,
}: DynamicFormRendererProps) {
  const [form, setForm] = useState<FormDefinitionRecord | null>(initialForm || null);
  const [loading, setLoading] = useState(!initialForm);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>(() =>
    initialForm ? getInitialFormData(initialForm) : {}
  );
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [dragOverField, setDragOverField] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<{ field: string; message: string } | null>(null);
  const [manualUrlFields, setManualUrlFields] = useState<Record<string, boolean>>({});
  const [uploadedFileMeta, setUploadedFileMeta] = useState<Record<string, { originalName: string; size?: string }>>({});
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [uploadCurrentFileName, setUploadCurrentFileName] = useState<Record<string, string>>({});
  const [activePhotoSourceModal, setActivePhotoSourceModal] = useState<{
    fieldName: string;
    fieldLabel: string;
    maxSizeMB: number;
  } | null>(null);
  const [activeCameraModal, setActiveCameraModal] = useState<{
    fieldName: string;
    fieldLabel: string;
    maxSizeMB: number;
  } | null>(null);

  const triggerFileInput = (fieldName: string) => {
    const input = document.getElementById(`file-${fieldName}`) as HTMLInputElement;
    if (input) {
      input.click();
    }
  };

  const getCleanDisplayName = (urlOrPath: string, fieldName?: string, defaultFallback: string = "Document"): string => {
    if (fieldName && uploadedFileMeta[fieldName]?.originalName) {
      return uploadedFileMeta[fieldName].originalName;
    }
    if (!urlOrPath || typeof urlOrPath !== "string") return defaultFallback;
    // Strip query strings and URL fragments
    const cleanUrl = urlOrPath.split("?")[0].split("#")[0];
    const raw = cleanUrl.split("/").pop()?.split("\\").pop() || "";
    if (!raw) return defaultFallback;

    // Strip generated hex hashes like _5580fb8867d0 or __7f8574f64f69 or _[a-f0-9]{8,36}
    let withoutHash = raw
      .replace(/_+[a-f0-9]{8,36}(\.[a-zA-Z0-9]+)$/i, "$1")
      .replace(/^[a-f0-9]{8,36}_+/i, "")
      .replace(/^\d{10,14}[-_]/, "");

    const ext = withoutHash.includes(".") ? withoutHash.slice(withoutHash.lastIndexOf(".")) : "";
    let base = withoutHash.slice(0, withoutHash.length - ext.length);

    // Format numbered indices like ExportedReport__1__ to ExportedReport (1)
    base = base.replace(/__(\d+)__/g, " ($1) ").replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();

    if (!base || base.toLowerCase() === "uploads" || base.toLowerCase() === "file" || base.toLowerCase() === "document" || base.toLowerCase() === "image") {
      return defaultFallback + (ext.toLowerCase() || "");
    }

    // Capitalize nicely if all lowercase
    const formatted = base === base.toLowerCase()
      ? base.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
      : base;

    return formatted + (ext.toLowerCase() || "");
  };

  const renderUploadProgressBar = (fieldName: string, isImage: boolean = false) => {
    const fileName = uploadCurrentFileName[fieldName] || (isImage ? "Passport Photo" : "Document");
    const progress = uploadProgress[fieldName] || 0;

    let stageText = "Preparing & optimizing file...";
    if (progress >= 100) {
      stageText = "Upload complete! Finalizing attachment...";
    } else if (progress >= 80) {
      stageText = "Verifying security & cloud storage...";
    } else if (progress >= 40) {
      stageText = isImage ? "Compressing & generating preview..." : "Uploading document to server...";
    } else if (progress >= 15) {
      stageText = "Starting encrypted transmission...";
    }

    return (
      <div className="w-full max-w-md mx-auto py-5 px-3 space-y-3.5 animate-in fade-in duration-300">
        {/* Header with icon, filename and live percentage */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-500 flex items-center justify-center shrink-0 shadow-sm">
              <Upload className="w-5 h-5 animate-bounce" />
            </div>
            <div className="text-left min-w-0">
              <p className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-100 truncate">
                {fileName}
              </p>
              <p className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 flex items-center space-x-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping inline-block" />
                <span>{stageText}</span>
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center space-x-1 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-full">
            <span className="text-xs font-black font-mono text-amber-600 dark:text-amber-400">
              {progress}%
            </span>
          </div>
        </div>

        {/* Animated Progress Bar Track */}
        <div className="w-full h-3 sm:h-3.5 bg-slate-200/90 dark:bg-slate-800/90 rounded-full overflow-hidden p-0.5 border border-slate-300 dark:border-slate-700 shadow-inner relative">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 transition-all duration-300 ease-out relative overflow-hidden shadow-sm"
            style={{ width: `${Math.max(6, progress)}%` }}
          >
            {/* Shimmer light sweep animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
          </div>
        </div>

        {/* Bottom Subtitle / Indicators */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 font-medium pt-0.5">
          <span className="flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Encrypted SSL Upload</span>
          </span>
          <span className="font-semibold text-slate-500 dark:text-slate-400">
            {progress >= 100 ? "Ready!" : "Do not close window"}
          </span>
        </div>
      </div>
    );
  };

  // Fetch form definition if not provided as initialForm
  useEffect(() => {
    if (initialForm) {
      setForm(initialForm);
      setFormData(getInitialFormData(initialForm));
      setLoading(false);
      return;
    }
    async function loadForm() {
      setLoading(true);
      try {
        const res = await fetch(`/api/forms/${formSlug}`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.form) {
            setForm(data.form);
            setFormData(getInitialFormData(data.form));
          }
        }
      } catch (err) {
        console.error("Failed to load dynamic form:", err);
      } finally {
        setLoading(false);
      }
    }
    loadForm();
  }, [formSlug, initialForm]);

  const initFormState = (f: FormDefinitionRecord) => {
    setFormData(getInitialFormData(f));
  };

  if (loading || !form) {
    return (
      <div className="py-20 text-center space-y-4 bg-slate-900/40 rounded-3xl border border-slate-800">
        <Loader2 className="w-10 h-10 animate-spin text-amber-400 mx-auto" />
        <p className="text-xs text-slate-400 font-semibold">Loading interactive form...</p>
      </div>
    );
  }

  // Steps and multi-step detection
  const steps: FormStep[] = form.steps || [];
  const isMultiStep = Boolean((form.settings?.isMultiStep ?? true) && steps.length > 1);

  // Filter only enabled/selected fields
  const enabledFields = form.fields.filter((f) => f.enabled !== false && !f.disabled);

  // Steps that contain at least one enabled field
  const activeSteps: FormStep[] = isMultiStep
    ? steps.filter((st: FormStep) => enabledFields.some((f) => f.stepId === st.id))
    : steps;

  const displaySteps = activeSteps.length > 0 ? activeSteps : steps;
  const currentStep = displaySteps[currentStepIdx] || displaySteps[0] || { id: "step_default", stepNumber: 1, title: "Form Details" };

  // Fields to display on current step
  const activeFields: FormField[] = isMultiStep && displaySteps.length > 1
    ? enabledFields.filter((f) => !f.stepId || f.stepId === currentStep.id)
    : enabledFields;

  const handleInputChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setValidationError(null);
  };

  const handleFileUpload = async (fieldName: string, file: File, maxSizeMB: number = 10) => {
    if (!file) return;
    if (file.size > maxSizeMB * 1024 * 1024) {
      setUploadError({
        field: fieldName,
        message: `File size exceeds ${maxSizeMB}MB limit (selected file is ${(file.size / (1024 * 1024)).toFixed(1)}MB).`,
      });
      return;
    }

    setUploadingField(fieldName);
    setUploadError(null);
    setUploadCurrentFileName((prev) => ({ ...prev, [fieldName]: file.name }));
    setUploadProgress((prev) => ({ ...prev, [fieldName]: 12 }));

    // Animated smooth progressive steps
    let currentPct = 15;
    const progressTimer = setInterval(() => {
      currentPct = Math.min(currentPct + Math.floor(Math.random() * 12) + 6, 88);
      setUploadProgress((prev) => ({ ...prev, [fieldName]: currentPct }));
    }, 120);

    try {
      const uploadData = new FormData();
      uploadData.append("file", file);

      // Perform upload with real progress tracking via XMLHttpRequest
      const uploadPromise = new Promise<{ url: string; originalName?: string; size?: string }>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/upload");

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const calculated = Math.round((event.loaded / event.total) * 90);
            setUploadProgress((prev) => ({ ...prev, [fieldName]: Math.max(calculated, currentPct) }));
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const resData = JSON.parse(xhr.responseText);
              if (resData.url) {
                resolve(resData);
              } else {
                reject(new Error(resData.error || "Failed to process upload"));
              }
            } catch (_) {
              reject(new Error("Invalid server response format"));
            }
          } else {
            try {
              const resData = JSON.parse(xhr.responseText);
              reject(new Error(resData.error || `Upload failed (Status ${xhr.status})`));
            } catch (_) {
              reject(new Error(`Upload failed with status code ${xhr.status}`));
            }
          }
        };

        xhr.onerror = () => reject(new Error("Network connection lost during upload"));
        xhr.send(uploadData);
      });

      const data = await uploadPromise;
      clearInterval(progressTimer);

      // Jump to 100% complete
      setUploadProgress((prev) => ({ ...prev, [fieldName]: 100 }));

      // 450ms pause to let user see "100% Complete" animated check
      await new Promise((r) => setTimeout(r, 450));

      setUploadedFileMeta((prev) => ({
        ...prev,
        [fieldName]: {
          originalName: file.name,
          size: data.size || `${(file.size / 1024).toFixed(0)} KB`,
        },
      }));

      handleInputChange(fieldName, data.url);
    } catch (err: any) {
      clearInterval(progressTimer);
      console.error("Upload error:", err);
      setUploadError({
        field: fieldName,
        message: err.message || "Failed to upload file. Please try again.",
      });
    } finally {
      clearInterval(progressTimer);
      setUploadingField(null);
    }
  };

  const validateCurrentStep = (): boolean => {
    setValidationError(null);
    for (const field of activeFields) {
      if (field.required) {
        const val = formData[field.name];
        if (val === undefined || val === null || val === "" || (field.type === "checkbox" && val !== true)) {
          setValidationError(`Please fill out the required field: "${field.label}"`);
          return false;
        }
      }
      if (field.type === "email" && formData[field.name]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData[field.name])) {
          setValidationError(`Please enter a valid email address for "${field.label}"`);
          return false;
        }
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    if (currentStepIdx < displaySteps.length - 1) {
      setCurrentStepIdx((prev) => prev + 1);
      window.scrollTo({ top: 300, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    setValidationError(null);
    if (currentStepIdx > 0) {
      setCurrentStepIdx((prev) => prev - 1);
      window.scrollTo({ top: 300, behavior: "smooth" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCurrentStep()) return;

    setSubmitting(true);
    setValidationError(null);

    try {
      const res = await fetch("/api/forms/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formSlug: form.slug,
          ...formData,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Form submission failed");
      }

      setSuccessData(data);
      if (onSuccess) onSuccess(data);

      if (form.settings?.enableConfetti !== false) {
        try {
          confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch (_) {}
      }
    } catch (err: any) {
      setValidationError(err.message || "An error occurred during submission. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const getWidthClass = (width?: "full" | "half" | "third") => {
    switch (width) {
      case "third":
        return "col-span-12 sm:col-span-6 lg:col-span-4";
      case "half":
        return "col-span-12 sm:col-span-6";
      case "full":
      default:
        return "col-span-12";
    }
  };

  // SUCCESS CONFIRMATION RECEIPT VIEW
  if (successData) {
    return (
      <div className="glass-card rounded-3xl p-8 sm:p-12 lg:p-14 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-8 print:shadow-none print:border-none bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 w-full max-w-5xl 2xl:max-w-6xl mx-auto">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
            {form.settings?.successBadge || "Submission Successful"}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-school-primary dark:text-white font-heading">
            {form.settings?.successTitle || "Thank You!"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {form.settings?.successMessage ||
              "Your form submission has been safely recorded in our system. A confirmation email has been dispatched."}
          </p>
          <div className="inline-block bg-amber-50 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-800 px-6 py-2.5 rounded-2xl shadow-inner mt-2">
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
              Official Reference / Application Number:
            </p>
            <p className="text-xl sm:text-2xl font-black font-mono text-school-primary dark:text-amber-400">
              {successData.applicationNo || successData.submissionNo}
            </p>
          </div>
        </div>

        {/* Candidate Summary Table */}
        <div className="bg-slate-50 dark:bg-slate-950/80 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 text-xs sm:text-sm">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-school-primary dark:text-white flex items-center space-x-2">
              <FileCheck className="w-4 h-4 text-amber-500" />
              <span>Official Submission Summary</span>
            </h3>
            <span className="text-xs text-slate-500">
              Date: {successData.date || new Date().toLocaleDateString()}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {form.fields
              .filter((f) => f.type !== "heading" && formData[f.name] !== undefined && formData[f.name] !== "")
              .slice(0, 16)
              .map((f) => {
                const val = formData[f.name];
                const isImageVal =
                  f.type === "image" ||
                  (typeof val === "string" && (val.endsWith(".webp") || val.endsWith(".jpg") || val.endsWith(".png")));
                const isDocVal =
                  f.type === "document" ||
                  f.type === "file" ||
                  (typeof val === "string" && (val.endsWith(".pdf") || val.endsWith(".docx") || val.endsWith(".doc")));

                return (
                  <div key={f.id} className="space-y-1 border-b border-slate-100 dark:border-slate-900 pb-2">
                    <span className="text-[11px] text-slate-400 font-semibold block">{f.label}</span>
                    {isImageVal ? (
                      <div className="flex items-center space-x-2 pt-0.5">
                        <img
                          src={String(val)}
                          alt={f.label}
                          className="w-10 h-10 object-cover rounded-lg border border-amber-400 shadow-sm"
                        />
                        <div className="space-y-0.5">
                          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block truncate max-w-[150px]">
                            {getCleanDisplayName(String(val), f.name)}
                          </span>
                          <a
                            href={String(val)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-amber-500 hover:underline text-[11px] font-bold flex items-center space-x-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>View Photo</span>
                          </a>
                        </div>
                      </div>
                    ) : isDocVal ? (
                      <a
                        href={String(val)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1.5 text-amber-500 hover:underline text-xs font-bold pt-0.5"
                      >
                        <FileText className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate max-w-[200px]">{getCleanDisplayName(String(val), f.name)}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    ) : (
                      <span className="font-bold text-slate-800 dark:text-slate-200 block truncate">
                        {typeof val === "boolean" ? (val ? "Yes" : "No") : String(val)}
                      </span>
                    )}
                  </div>
                );
              })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4 print:hidden">
          {form.settings?.enablePrinting !== false && (
            <button
              onClick={handlePrintReceipt}
              type="button"
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl border border-slate-700 flex items-center space-x-2 shadow-lg cursor-pointer transition-all hover:scale-105"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Print Acknowledgment Slip</span>
            </button>
          )}

          <button
            onClick={() => {
              setSuccessData(null);
              setCurrentStepIdx(0);
              initFormState(form);
            }}
            type="button"
            className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-lg cursor-pointer transition-all hover:scale-105"
          >
            <span>Submit Another Application</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`glass-card rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 w-full max-w-5xl 2xl:max-w-6xl mx-auto space-y-8 ${className}`}>
      {/* Multi-Step Wizard Indicator */}
      {isMultiStep && displaySteps.length > 1 && (
        <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0" />
            <div
              className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-500 -translate-y-1/2 z-0 transition-all duration-300"
              style={{ width: `${(currentStepIdx / (displaySteps.length - 1)) * 100}%` }}
            />

            {displaySteps.map((st: FormStep, idx: number) => {
              const isPast = idx < currentStepIdx;
              const isCurrent = idx === currentStepIdx;
              const StepIcon = (st.icon && ICON_MAP[st.icon]) || Sparkles;

              return (
                <div
                  key={st.id || idx}
                  onClick={() => {
                    if (idx < currentStepIdx) setCurrentStepIdx(idx);
                  }}
                  className={`relative z-10 flex flex-col items-center space-y-1.5 cursor-pointer group ${
                    idx <= currentStepIdx ? "opacity-100" : "opacity-40"
                  }`}
                >
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center font-bold text-xs sm:text-sm shadow-md transition-all ${
                      isPast
                        ? "bg-emerald-500 text-slate-950 ring-2 ring-emerald-400/40"
                        : isCurrent
                        ? "bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 ring-4 ring-amber-400/30 scale-110"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                    }`}
                  >
                    {isPast ? <Check className="w-4 h-4 stroke-[3]" /> : <StepIcon className="w-4 h-4" />}
                  </div>
                  <span
                    className={`text-[10px] sm:text-xs font-bold text-center tracking-tight hidden sm:block ${
                      isCurrent
                        ? "text-amber-500 dark:text-amber-400"
                        : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {st.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Step Header */}
      <div className="space-y-1">
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-500 dark:text-amber-400 flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>
            {isMultiStep ? `Step ${currentStepIdx + 1} of ${displaySteps.length}: ` : ""}
            {currentStep.title}
          </span>
        </span>
        {currentStep.subtitle && (
          <p className="text-xs text-slate-500 dark:text-slate-400">{currentStep.subtitle}</p>
        )}
      </div>

      {/* Validation Error Alert */}
      {validationError && (
        <div className="bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 p-4 rounded-2xl flex items-center space-x-3 text-rose-700 dark:text-rose-300 text-xs font-semibold animate-shake">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Dynamic Fields Grid */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-12 gap-5">
          {activeFields.map((field) => {
            const FieldIcon = (field.icon && ICON_MAP[field.icon]) || null;
            const widthClass = getWidthClass(field.width);

            if (field.type === "heading") {
              return (
                <div key={field.id} className="col-span-12 pt-4 pb-1 border-b border-slate-200 dark:border-slate-800">
                  <h4 className="font-bold text-sm text-school-primary dark:text-white flex items-center space-x-2">
                    {FieldIcon && <FieldIcon className="w-4 h-4 text-amber-500" />}
                    <span>{field.label}</span>
                  </h4>
                  {field.helperText && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{field.helperText}</p>
                  )}
                </div>
              );
            }

            return (
              <div key={field.id} className={`${widthClass} space-y-1.5`}>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>{field.label}</span>
                  {field.required && <span className="text-rose-500 ml-1 font-bold">*</span>}
                </label>

                {/* TEXT / EMAIL / TEL / NUMBER */}
                {(field.type === "text" || field.type === "email" || field.type === "tel" || field.type === "number") && (
                  <div className="relative">
                    {FieldIcon && (
                      <FieldIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    )}
                    <input
                      type={field.type}
                      value={formData[field.name] || ""}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      placeholder={field.placeholder || ""}
                      required={field.required}
                      disabled={field.disabled}
                      className={`w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all ${
                        FieldIcon ? "pl-10" : ""
                      }`}
                    />
                  </div>
                )}

                {/* DATE */}
                {field.type === "date" && (
                  <div className="relative">
                    <input
                      type="date"
                      value={formData[field.name] || ""}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      required={field.required}
                      disabled={field.disabled}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                    />
                  </div>
                )}

                {/* SELECT DROPDOWN */}
                {field.type === "select" && (
                  <div className="relative">
                    <select
                      value={formData[field.name] || ""}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      required={field.required}
                      disabled={field.disabled}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all cursor-pointer"
                    >
                      {field.placeholder && <option value="">{field.placeholder}</option>}
                      {(field.options || []).map((opt, oIdx) => (
                        <option key={oIdx} value={opt.value} className="bg-slate-900 text-white">
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* RADIO GROUP */}
                {field.type === "radio" && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {(field.options || []).map((opt, oIdx) => {
                      const isChecked = formData[field.name] === opt.value;
                      return (
                        <label
                          key={oIdx}
                          className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center space-x-2 ${
                            isChecked
                              ? "bg-amber-400 text-slate-950 border-amber-400 shadow-md"
                              : "bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-400/60"
                          }`}
                        >
                          <input
                            type="radio"
                            name={field.name}
                            value={opt.value}
                            checked={isChecked}
                            onChange={() => handleInputChange(field.name, opt.value)}
                            className="hidden"
                          />
                          <span>{opt.label}</span>
                        </label>
                      );
                    })}
                  </div>
                )}

                {/* CHECKBOX */}
                {field.type === "checkbox" && (
                  <label className="cursor-pointer flex items-start space-x-3 p-3.5 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-amber-400/60 transition-all select-none">
                    <input
                      type="checkbox"
                      checked={Boolean(formData[field.name])}
                      onChange={(e) => handleInputChange(field.name, e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded accent-amber-500 cursor-pointer"
                    />
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                        {field.label}
                      </span>
                      {field.helperText && (
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                          {field.helperText}
                        </span>
                      )}
                    </div>
                  </label>
                )}

                {/* TEXTAREA */}
                {field.type === "textarea" && (
                  <textarea
                    rows={3}
                    value={formData[field.name] || ""}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    placeholder={field.placeholder || ""}
                    required={field.required}
                    disabled={field.disabled}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all resize-y font-sans"
                  />
                )}

                {/* IMAGE UPLOAD */}
                {field.type === "image" && (
                  <div className="space-y-2">
                    {uploadingField === field.name ? (
                      <div className="border-2 border-dashed border-amber-400 bg-amber-50/60 dark:bg-amber-950/20 rounded-2xl p-4 sm:p-6 shadow-inner">
                        {renderUploadProgressBar(field.name, true)}
                      </div>
                    ) : formData[field.name] ? (
                      <div className="p-4 bg-amber-500/5 dark:bg-amber-400/5 border border-amber-400/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center space-x-3.5">
                          <img
                            src={formData[field.name]}
                            alt={field.label}
                            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border-2 border-amber-400 shadow-md bg-slate-900"
                          />
                          <div className="space-y-1">
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Photo Attached</span>
                            </span>
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate max-w-[200px] sm:max-w-xs">
                              {getCleanDisplayName(formData[field.name], field.name, "Passport Photo")}
                            </p>
                            <div className="flex items-center space-x-2 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                              <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold border border-amber-500/20">
                                {uploadedFileMeta[field.name]?.size || "Ready"}
                              </span>
                              <span>• Ready for submission</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                          <a
                            href={formData[field.name]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center space-x-1 transition-all"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>View</span>
                          </a>
                          <button
                            type="button"
                            onClick={() =>
                              setActivePhotoSourceModal({
                                fieldName: field.name,
                                fieldLabel: field.label,
                                maxSizeMB: field.maxSizeMB || 5,
                              })
                            }
                            className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold flex items-center space-x-1 cursor-pointer transition-all shadow"
                            title="Replace photo with camera or file"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>Replace</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleInputChange(field.name, "")}
                            className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all cursor-pointer"
                            title="Remove Photo"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : manualUrlFields[field.name] ? (
                      <div className="space-y-2">
                        <div className="relative">
                          <input
                            type="url"
                            value={formData[field.name] || ""}
                            onChange={(e) => handleInputChange(field.name, e.target.value)}
                            placeholder={field.placeholder || "Paste image URL (https://...)"}
                            required={field.required}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-400"
                          />
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          {field.helperText && (
                            <span className="text-slate-500 dark:text-slate-400">{field.helperText}</span>
                          )}
                          <button
                            type="button"
                            onClick={() => setManualUrlFields((prev) => ({ ...prev, [field.name]: false }))}
                            className="text-amber-500 hover:underline font-bold flex items-center space-x-1 ml-auto cursor-pointer"
                          >
                            <Upload className="w-3 h-3" />
                            <span>Switch to File Upload</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {/* Hidden Native File Input for Direct Gallery Selection */}
                        <input
                          id={`file-${field.name}`}
                          type="file"
                          accept={field.accept || "image/*,.jpg,.jpeg,.png,.webp"}
                          disabled={uploadingField === field.name}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(field.name, file, field.maxSizeMB || 5);
                            e.target.value = "";
                          }}
                          className="hidden"
                        />

                        {/* Interactive Dropzone: Clicking opens Photo Choice Dialog */}
                        <div
                          onClick={() => {
                            setActivePhotoSourceModal({
                              fieldName: field.name,
                              fieldLabel: field.label,
                              maxSizeMB: field.maxSizeMB || 5,
                            });
                          }}
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setDragOverField(field.name);
                          }}
                          onDragEnter={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setDragOverField(field.name);
                          }}
                          onDragLeave={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setDragOverField((prev) => (prev === field.name ? null : prev));
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setDragOverField(null);
                            const file = e.dataTransfer.files?.[0];
                            if (file) handleFileUpload(field.name, file, field.maxSizeMB || 5);
                          }}
                          className={`group relative border-2 border-dashed rounded-2xl p-6 sm:p-7 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 select-none ${
                            uploadingField === field.name
                              ? "border-amber-400 bg-amber-400/5 opacity-75"
                              : dragOverField === field.name
                              ? "border-amber-500 bg-amber-500/10 ring-4 ring-amber-500/20 scale-[1.01] shadow-lg"
                              : "border-slate-300 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-400 bg-slate-50/70 dark:bg-slate-950/40 hover:bg-amber-400/5 hover:scale-[1.005] hover:shadow-md"
                          }`}
                        >
                          {uploadingField === field.name ? (
                            renderUploadProgressBar(field.name, true)
                          ) : dragOverField === field.name ? (
                            <div className="space-y-2 py-1 animate-pulse">
                              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center mx-auto shadow-md">
                                <Upload className="w-6 h-6 animate-bounce" />
                              </div>
                              <p className="text-sm font-extrabold text-amber-600 dark:text-amber-400">
                                Drop photo now to upload!
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                Release mouse to process photo
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-3 w-full max-w-sm">
                              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-amber-400/10 text-amber-500 flex items-center justify-center mx-auto transition-transform group-hover:scale-110 shadow-sm border border-amber-500/20">
                                <Camera className="w-6 h-6" />
                              </div>
                              <div>
                                <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">
                                  {field.uploadButtonText || "Click to browse or drag & drop photo"}
                                </p>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                  {field.helperText || `Upload recent formal passport color photo (JPG, PNG up to ${field.maxSizeMB || 5}MB)`}
                                </p>
                              </div>

                              {/* Interactive Dual Action Chips */}
                              <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveCameraModal({
                                      fieldName: field.name,
                                      fieldLabel: field.label,
                                      maxSizeMB: field.maxSizeMB || 5,
                                    });
                                  }}
                                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 hover:scale-105 transition-all shadow-xs cursor-pointer"
                                  title="Open live camera"
                                >
                                  <Camera className="w-3.5 h-3.5 text-blue-500" />
                                  <span>Take Photo</span>
                                </button>

                                <span className="text-slate-300 dark:text-slate-600">•</span>

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    triggerFileInput(field.name);
                                  }}
                                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 hover:scale-105 transition-all shadow-xs cursor-pointer"
                                  title="Upload from device gallery"
                                >
                                  <ImageIcon className="w-3.5 h-3.5 text-emerald-500" />
                                  <span>Choose from Gallery</span>
                                </button>

                                <span className="text-slate-300 dark:text-slate-600">•</span>

                                <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                                  Drag & Drop
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-end text-[11px] text-slate-400 px-1">
                          <button
                            type="button"
                            onClick={() => setManualUrlFields((prev) => ({ ...prev, [field.name]: true }))}
                            className="text-amber-500 hover:underline font-bold flex items-center space-x-1 cursor-pointer"
                          >
                            <LinkIcon className="w-3 h-3" />
                            <span>Or paste direct Image Link</span>
                          </button>
                        </div>
                      </div>
                    )}
                    {uploadError && uploadError.field === field.name && (
                      <p className="text-xs text-rose-500 font-semibold mt-1.5 flex items-center space-x-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{uploadError.message}</span>
                      </p>
                    )}
                  </div>
                )}

                {/* DOCUMENT & FILE UPLOAD */}
                {(field.type === "document" || field.type === "file") && (
                  <div className="space-y-2">
                    {uploadingField === field.name ? (
                      <div className="border-2 border-dashed border-amber-400 bg-amber-50/60 dark:bg-amber-950/20 rounded-2xl p-4 sm:p-6 shadow-inner">
                        {renderUploadProgressBar(field.name, false)}
                      </div>
                    ) : formData[field.name] ? (
                      <div className="p-4 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center space-x-3.5">
                          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 border border-amber-500/20">
                            <FileText className="w-6 h-6" />
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Document Attached</span>
                            </span>
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate max-w-[200px] sm:max-w-xs">
                              {getCleanDisplayName(formData[field.name], field.name, "Attached Document")}
                            </p>
                            <div className="flex items-center space-x-2 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                              <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
                                {uploadedFileMeta[field.name]?.size || "Verified"}
                              </span>
                              <span>• Ready for submission</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                          <a
                            href={formData[field.name]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center space-x-1 transition-all"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>View File</span>
                          </a>
                          <label className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold flex items-center space-x-1 cursor-pointer transition-all shadow">
                            <RefreshCw className="w-3 h-3" />
                            <span>Replace</span>
                            <input
                              type="file"
                              accept={field.accept || (field.type === "document" ? ".pdf,.doc,.docx,.jpg,.png" : "*/*")}
                              disabled={uploadingField === field.name}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(field.name, file, field.maxSizeMB || 10);
                              }}
                              className="hidden"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => handleInputChange(field.name, "")}
                            className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all cursor-pointer"
                            title="Remove Document"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : manualUrlFields[field.name] ? (
                      <div className="space-y-2">
                        <div className="relative">
                          <input
                            type="url"
                            value={formData[field.name] || ""}
                            onChange={(e) => handleInputChange(field.name, e.target.value)}
                            placeholder={field.placeholder || "Paste document link / Google Drive link (https://...)"}
                            required={field.required}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-400"
                          />
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          {field.helperText && (
                            <span className="text-slate-500 dark:text-slate-400">{field.helperText}</span>
                          )}
                          <button
                            type="button"
                            onClick={() => setManualUrlFields((prev) => ({ ...prev, [field.name]: false }))}
                            className="text-amber-500 hover:underline font-bold flex items-center space-x-1 ml-auto cursor-pointer"
                          >
                            <Upload className="w-3 h-3" />
                            <span>Switch to File Upload</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <label
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setDragOverField(field.name);
                          }}
                          onDragEnter={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setDragOverField(field.name);
                          }}
                          onDragLeave={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setDragOverField((prev) => (prev === field.name ? null : prev));
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setDragOverField(null);
                            const file = e.dataTransfer.files?.[0];
                            if (file) handleFileUpload(field.name, file, field.maxSizeMB || 10);
                          }}
                          className={`group relative border-2 border-dashed rounded-2xl p-6 sm:p-7 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 select-none ${
                            uploadingField === field.name
                              ? "border-amber-400 bg-amber-400/5 opacity-75"
                              : dragOverField === field.name
                              ? "border-amber-500 bg-amber-500/10 ring-4 ring-amber-500/20 scale-[1.01] shadow-lg"
                              : "border-slate-300 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-400 bg-slate-50/70 dark:bg-slate-950/40 hover:bg-amber-400/5 hover:scale-[1.005] hover:shadow-md"
                          }`}
                        >
                          <input
                            id={`file-${field.name}`}
                            type="file"
                            accept={field.accept || (field.type === "document" ? ".pdf,.doc,.docx,.jpg,.png" : "*/*")}
                            disabled={uploadingField === field.name}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(field.name, file, field.maxSizeMB || 10);
                            }}
                            className="hidden"
                          />
                          {uploadingField === field.name ? (
                            renderUploadProgressBar(field.name, false)
                          ) : dragOverField === field.name ? (
                            <div className="space-y-2 py-1 animate-pulse">
                              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center mx-auto shadow-md">
                                <Upload className="w-6 h-6 animate-bounce" />
                              </div>
                              <p className="text-sm font-extrabold text-amber-600 dark:text-amber-400">
                                Drop document now to upload!
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                Release mouse to process document
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-amber-400/10 text-amber-500 flex items-center justify-center mx-auto transition-transform group-hover:scale-110 shadow-sm border border-amber-500/20">
                                <FileText className="w-6 h-6" />
                              </div>
                              <div>
                                <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">
                                  {field.uploadButtonText || "Click to browse or drag & drop document"}
                                </p>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                  {field.helperText || `Supported formats: PDF, Word DOC/DOCX (Max ${field.maxSizeMB || 10}MB)`}
                                </p>
                              </div>
                              <div className="inline-flex items-center space-x-2 pt-1 text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                                <span>Browse Files</span>
                                <span>•</span>
                                <span>Drag & Drop</span>
                              </div>
                            </div>
                          )}
                        </label>
                        <div className="flex items-center justify-end text-[11px] text-slate-400 px-1">
                          <button
                            type="button"
                            onClick={() => setManualUrlFields((prev) => ({ ...prev, [field.name]: true }))}
                            className="text-amber-500 hover:underline font-bold flex items-center space-x-1 cursor-pointer"
                          >
                            <LinkIcon className="w-3 h-3" />
                            <span>Or paste Google Drive / Dropbox link</span>
                          </button>
                        </div>
                      </div>
                    )}
                    {uploadError && uploadError.field === field.name && (
                      <p className="text-xs text-rose-500 font-semibold mt-1.5 flex items-center space-x-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{uploadError.message}</span>
                      </p>
                    )}
                  </div>
                )}

                {field.type !== "checkbox" && field.type !== "file" && field.type !== "image" && field.type !== "document" && field.helperText && (
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">{field.helperText}</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Wizard Footer Navigation Controls */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800">
          {isMultiStep && currentStepIdx > 0 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs sm:text-sm rounded-xl flex items-center space-x-2 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{form.settings?.prevButtonText || "Previous"}</span>
            </button>
          ) : (
            <div />
          )}

          {isMultiStep && displaySteps.length > 1 && currentStepIdx < displaySteps.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-500/20 flex items-center space-x-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>{form.settings?.nextButtonText || "Next Step →"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-xl shadow-amber-500/20 flex items-center space-x-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                  <span>{form.settings?.submitButtonText || "Submit Application"}</span>
                </>
              )}
            </button>
          )}
        </div>
      </form>

      {/* Photo Source Chooser Dialog (Camera vs Gallery vs Link) */}
      {activePhotoSourceModal && (
        <PhotoSourceChooserModal
          isOpen={Boolean(activePhotoSourceModal)}
          fieldLabel={activePhotoSourceModal.fieldLabel}
          maxSizeMB={activePhotoSourceModal.maxSizeMB}
          onClose={() => setActivePhotoSourceModal(null)}
          onSelectCamera={() => {
            const modal = activePhotoSourceModal;
            setActivePhotoSourceModal(null);
            setActiveCameraModal(modal);
          }}
          onSelectUpload={() => {
            const fieldName = activePhotoSourceModal.fieldName;
            setActivePhotoSourceModal(null);
            triggerFileInput(fieldName);
          }}
          onSelectUrl={() => {
            const fieldName = activePhotoSourceModal.fieldName;
            setActivePhotoSourceModal(null);
            setManualUrlFields((prev) => ({ ...prev, [fieldName]: true }));
          }}
        />
      )}

      {/* Live Camera Viewfinder Studio Modal */}
      {activeCameraModal && (
        <LiveCameraStudioModal
          isOpen={Boolean(activeCameraModal)}
          fieldLabel={activeCameraModal.fieldLabel}
          maxSizeMB={activeCameraModal.maxSizeMB}
          onClose={() => setActiveCameraModal(null)}
          onCapture={(file) => {
            const fieldName = activeCameraModal.fieldName;
            const maxSizeMB = activeCameraModal.maxSizeMB;
            setActiveCameraModal(null);
            handleFileUpload(fieldName, file, maxSizeMB);
          }}
          onFallbackToFile={() => {
            const fieldName = activeCameraModal.fieldName;
            setActiveCameraModal(null);
            triggerFileInput(fieldName);
          }}
        />
      )}
    </div>
  );
}
