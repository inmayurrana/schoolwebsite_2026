"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  FileText,
  Plus,
  Trash2,
  Edit3,
  Check,
  Save,
  Loader2,
  Eye,
  ArrowRight,
  MoveUp,
  MoveDown,
  Copy,
  Sparkles,
  Zap,
  Globe,
  HelpCircle,
  AlertCircle,
  CheckCircle2,
  X,
  Layers,
  Settings,
  Download,
  Search,
  Filter,
  ExternalLink,
  ChevronRight,
  User,
  Phone,
  Mail,
  Home,
  GraduationCap,
  Calendar,
  Briefcase,
  Sliders,
  Share2,
  CheckSquare,
  Square,
  EyeOff,
  Upload,
  Camera,
  Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";
import {
  FormField,
  FormStep,
  FormSettings,
  FormDefinitionRecord,
  DEFAULT_FORM_REGISTRY,
  getFormDefault,
  FieldType,
} from "@/lib/formRegistry";
import DynamicFormRenderer from "@/components/common/DynamicFormRenderer";

export default function AdminFormsManager() {
  const [activeTab, setActiveTab] = useState<"directory" | "builder" | "submissions">("directory");
  const [forms, setForms] = useState<FormDefinitionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlug, setSelectedSlug] = useState<string>("admissions-apply");
  const [currentForm, setCurrentForm] = useState<FormDefinitionRecord | null>(null);

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Field Edit Modal State
  const [editingField, setEditingField] = useState<FormField | null>(null);
  const [isFieldModalOpen, setIsFieldModalOpen] = useState(false);
  const [isNewField, setIsNewField] = useState(false);

  // Field Filtering in Builder
  const [fieldFilterTab, setFieldFilterTab] = useState<"ALL" | "ENABLED" | "DISABLED" | "REQUIRED" | "OPTIONAL">("ALL");
  const [fieldSearchTerm, setFieldSearchTerm] = useState("");

  // Live Preview Modal State
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Create Form Modal State
  const [showCreateFormModal, setShowCreateFormModal] = useState(false);
  const [newFormSlug, setNewFormSlug] = useState("");
  const [newFormTitle, setNewFormTitle] = useState("");
  const [newFormCategory, setNewFormCategory] = useState<any>("CUSTOM");

  // Submissions State
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [selectedSubmissionData, setSelectedSubmissionData] = useState<any | null>(null);

  // Directory Search
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Load All Forms
  const loadForms = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/forms", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.forms && data.forms.length > 0) {
          setForms(data.forms);
          const current = data.forms.find((f: any) => f.slug === selectedSlug) || data.forms[0];
          setCurrentForm(JSON.parse(JSON.stringify(current)));
          return;
        }
      }
      // Fallback to registry
      const fallbackList = Object.values(DEFAULT_FORM_REGISTRY);
      setForms(fallbackList);
      setCurrentForm(JSON.parse(JSON.stringify(fallbackList[0])));
    } catch (err) {
      console.error("Failed to load forms:", err);
      const fallbackList = Object.values(DEFAULT_FORM_REGISTRY);
      setForms(fallbackList);
      setCurrentForm(JSON.parse(JSON.stringify(fallbackList[0])));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadForms();
  }, []);

  // 2. Select a form to edit
  const handleSelectForm = (slug: string) => {
    setSelectedSlug(slug);
    const target = forms.find((f) => f.slug === slug) || getFormDefault(slug);
    setCurrentForm(JSON.parse(JSON.stringify(target)));
    setActiveTab("builder");
  };

  // 3. Save Form Definition
  const handleSaveForm = async () => {
    if (!currentForm) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/forms/${currentForm.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentForm),
      });

      if (res.ok) {
        setSavedSuccess(true);
        const enabledCount = currentForm.fields.filter((f) => f.enabled !== false && !f.disabled).length;
        setToastMessage(`✨ Saved! ${enabledCount} selected fields are live on the website.`);
        setTimeout(() => setSavedSuccess(false), 3000);
        setTimeout(() => setToastMessage(null), 4000);
        // Refresh local list
        setForms((prev) =>
          prev.map((f) => (f.slug === currentForm.slug ? JSON.parse(JSON.stringify(currentForm)) : f))
        );
      } else {
        setToastMessage("❌ Failed to save form. Please try again.");
      }
    } catch (err) {
      console.error("Save form failed:", err);
      setToastMessage("❌ Network error saving form.");
    } finally {
      setSaving(false);
    }
  };

  // 4. Quick Active/Inactive Toggle in Directory
  const handleToggleFormStatus = async (slug: string, newStatus: boolean) => {
    try {
      const target = forms.find((f) => f.slug === slug);
      if (!target) return;
      const updated = { ...target, isActive: newStatus };

      setForms((prev) => prev.map((f) => (f.slug === slug ? updated : f)));
      if (currentForm && currentForm.slug === slug) {
        setCurrentForm({ ...currentForm, isActive: newStatus });
      }

      await fetch(`/api/forms/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      setToastMessage(`Form status updated: ${newStatus ? "ACTIVE (Live)" : "DISABLED (Hidden)"}`);
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err) {
      console.error("Toggle form status error:", err);
    }
  };

  // 5. Toggle Individual Field Selected/Enabled
  const handleToggleFieldEnabled = (fieldId: string, enabled: boolean) => {
    if (!currentForm) return;
    const updated = currentForm.fields.map((f) =>
      f.id === fieldId ? { ...f, enabled: enabled, disabled: !enabled } : f
    );
    setCurrentForm({ ...currentForm, fields: updated });
  };

  // 6. Bulk Select All / Deselect All Fields
  const handleBulkToggleFields = (status: boolean) => {
    if (!currentForm) return;
    const updated = currentForm.fields.map((f) => ({
      ...f,
      enabled: status,
      disabled: !status,
    }));
    setCurrentForm({ ...currentForm, fields: updated });
    setToastMessage(status ? "Selected all fields for live form" : "Deselected all fields");
    setTimeout(() => setToastMessage(null), 2500);
  };

  // 6b. Toggle Field Mandatory vs Optional (1-click)
  const handleToggleFieldRequired = (fieldId: string, required: boolean) => {
    if (!currentForm) return;
    const updated = currentForm.fields.map((f) => (f.id === fieldId ? { ...f, required } : f));
    setCurrentForm({ ...currentForm, fields: updated });
    setToastMessage(required ? "🔴 Set field as Mandatory (*)" : "⚪ Set field as Optional");
    setTimeout(() => setToastMessage(null), 2000);
  };

  // 6c. Bulk Make All Fields Mandatory or Optional
  const handleBulkToggleRequired = (required: boolean) => {
    if (!currentForm) return;
    const updated = currentForm.fields.map((f) => ({ ...f, required }));
    setCurrentForm({ ...currentForm, fields: updated });
    setToastMessage(required ? "🔴 Made all fields Mandatory (*)" : "⚪ Made all fields Optional");
    setTimeout(() => setToastMessage(null), 2500);
  };

  // 7. Create New Form
  const handleCreateNewForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFormSlug || !newFormTitle) return;

    const cleanSlug = newFormSlug.toLowerCase().trim().replace(/[^a-z0-9_-]/g, "-");
    const newFormTemplate = getFormDefault(cleanSlug);
    newFormTemplate.title = newFormTitle;
    newFormTemplate.category = newFormCategory;

    try {
      const res = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newFormTemplate),
      });

      if (res.ok) {
        setForms((prev) => [newFormTemplate, ...prev]);
        setSelectedSlug(cleanSlug);
        setCurrentForm(newFormTemplate);
        setShowCreateFormModal(false);
        setActiveTab("builder");
        setToastMessage(`🎉 Form "${newFormTitle}" created successfully!`);
        setTimeout(() => setToastMessage(null), 4000);
      }
    } catch (err) {
      console.error("Create form failed:", err);
    }
  };

  // 8. Delete Form
  const handleDeleteForm = async (slug: string) => {
    if (!confirm(`Are you sure you want to delete or reset form "${slug}"?`)) return;

    try {
      await fetch(`/api/forms/${slug}`, { method: "DELETE" });
      setForms((prev) => prev.filter((f) => f.slug !== slug));
      if (selectedSlug === slug) {
        const next = forms.find((f) => f.slug !== slug) || forms[0];
        if (next) handleSelectForm(next.slug);
      }
      setToastMessage(`Form "${slug}" removed.`);
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err) {
      console.error("Delete form failed:", err);
    }
  };

  // 9. Load Submissions
  const loadSubmissions = async (slug: string) => {
    setLoadingSubmissions(true);
    try {
      const res = await fetch(`/api/forms/${slug}/submissions`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data.submissions || []);
      }
    } catch (err) {
      console.error("Failed to load submissions:", err);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  // Field Management Helpers
  const handleOpenAddField = () => {
    const activeStepId = currentForm?.steps?.[0]?.id || "step_1";
    const newField: FormField = {
      id: `field_${Date.now()}`,
      name: `custom_field_${Date.now().toString().slice(-4)}`,
      label: "New Custom Field",
      type: "text",
      placeholder: "Enter value...",
      required: false,
      enabled: true,
      width: "full",
      stepId: activeStepId,
    };
    setEditingField(newField);
    setIsNewField(true);
    setIsFieldModalOpen(true);
  };

  const handleOpenEditField = (field: FormField) => {
    setEditingField(JSON.parse(JSON.stringify(field)));
    setIsNewField(false);
    setIsFieldModalOpen(true);
  };

  const handleSaveFieldModal = () => {
    if (!currentForm || !editingField) return;

    let updatedFields: FormField[];
    if (isNewField) {
      updatedFields = [...currentForm.fields, editingField];
    } else {
      updatedFields = currentForm.fields.map((f) => (f.id === editingField.id ? editingField : f));
    }

    setCurrentForm({ ...currentForm, fields: updatedFields });
    setIsFieldModalOpen(false);
    setEditingField(null);
  };

  const handleDeleteField = (fieldId: string) => {
    if (!currentForm) return;
    const updated = currentForm.fields.filter((f) => f.id !== fieldId);
    setCurrentForm({ ...currentForm, fields: updated });
  };

  const handleDuplicateField = (field: FormField) => {
    if (!currentForm) return;
    const copy: FormField = {
      ...JSON.parse(JSON.stringify(field)),
      id: `field_${Date.now()}`,
      name: `${field.name}_copy`,
      label: `${field.label} (Copy)`,
      enabled: true,
    };
    const idx = currentForm.fields.findIndex((f) => f.id === field.id);
    const updated = [...currentForm.fields];
    updated.splice(idx + 1, 0, copy);
    setCurrentForm({ ...currentForm, fields: updated });
  };

  const handleMoveField = (index: number, direction: "up" | "down") => {
    if (!currentForm) return;
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= currentForm.fields.length) return;

    const updated = [...currentForm.fields];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIdx, 0, moved);
    setCurrentForm({ ...currentForm, fields: updated });
  };

  // Step Management Helpers
  const handleAddStep = () => {
    if (!currentForm) return;
    const newStepNumber = (currentForm.steps?.length || 0) + 1;
    const newStep: FormStep = {
      id: `step_${Date.now()}`,
      stepNumber: newStepNumber,
      title: `Step ${newStepNumber}: New Section`,
      subtitle: "Provide details for this section",
      icon: "FileText",
    };
    const updatedSteps = [...(currentForm.steps || []), newStep];
    setCurrentForm({ ...currentForm, steps: updatedSteps });
  };

  const handleRemoveStep = (stepId: string) => {
    if (!currentForm) return;
    if ((currentForm.steps?.length || 0) <= 1) {
      alert("A form must have at least one step.");
      return;
    }
    const updatedSteps = currentForm.steps.filter((s) => s.id !== stepId);
    const firstStepId = updatedSteps[0].id;
    const updatedFields = currentForm.fields.map((f) =>
      f.stepId === stepId ? { ...f, stepId: firstStepId } : f
    );
    setCurrentForm({ ...currentForm, steps: updatedSteps, fields: updatedFields });
  };

  const handleUpdateStep = (stepId: string, updates: Partial<FormStep>) => {
    if (!currentForm) return;
    const updatedSteps = currentForm.steps.map((s) => (s.id === stepId ? { ...s, ...updates } : s));
    setCurrentForm({ ...currentForm, steps: updatedSteps });
  };

  const filteredForms = forms.filter(
    (f) =>
      f.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Field stats
  const totalFieldsCount = currentForm?.fields?.length || 0;
  const enabledFieldsCount =
    currentForm?.fields?.filter((f) => f.enabled !== false && !f.disabled).length || 0;
  const disabledFieldsCount = totalFieldsCount - enabledFieldsCount;
  const mandatoryFieldsCount =
    currentForm?.fields?.filter((f) => Boolean(f.required)).length || 0;
  const optionalFieldsCount = totalFieldsCount - mandatoryFieldsCount;

  const displayFields = useMemo(() => {
    if (!currentForm) return [];
    return currentForm.fields.filter((field) => {
      const isEnabled = field.enabled !== false && !field.disabled;
      if (fieldFilterTab === "ENABLED" && !isEnabled) return false;
      if (fieldFilterTab === "DISABLED" && isEnabled) return false;
      if (fieldFilterTab === "REQUIRED" && !field.required) return false;
      if (fieldFilterTab === "OPTIONAL" && field.required) return false;
      if (fieldSearchTerm) {
        const query = fieldSearchTerm.toLowerCase();
        return (
          field.label.toLowerCase().includes(query) ||
          field.name.toLowerCase().includes(query) ||
          (field.placeholder && field.placeholder.toLowerCase().includes(query))
        );
      }
      return true;
    });
  }, [currentForm, fieldFilterTab, fieldSearchTerm]);

  return (
    <div className="space-y-6 pb-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl border border-amber-400 shadow-2xl flex items-center space-x-3 text-xs font-bold animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner & Header */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-gradient-to-r from-slate-950 via-slate-900 to-[#0A2540] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xl">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Form Builder & Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
            Dynamic Forms Studio & Field Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Select/unselect fields with checkboxes to customize what appears on the live website. Modify labels, add new fields, or reorder anytime.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowCreateFormModal(true)}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold border border-slate-700 flex items-center space-x-2 transition-all hover:scale-105 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>+ Create New Form</span>
          </button>

          {activeTab === "builder" && (
            <>
              <button
                onClick={() => setShowPreviewModal(true)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-600 flex items-center space-x-2 transition-all cursor-pointer"
              >
                <Eye className="w-4 h-4 text-blue-400" />
                <span>Live Test Preview</span>
              </button>

              <button
                onClick={handleSaveForm}
                disabled={saving}
                className={`px-5 py-2.5 rounded-xl text-xs font-extrabold shadow-lg flex items-center space-x-2 transition-all cursor-pointer ${
                  savedSuccess
                    ? "bg-emerald-500 text-slate-950 scale-105"
                    : "bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950"
                }`}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : savedSuccess ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Saved & Live!</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-current" />
                    <span>Save & Publish Form Live</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab("directory")}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
            activeTab === "directory"
              ? "bg-amber-400 text-slate-950 shadow-md"
              : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>🗂️ All Forms Directory ({forms.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("builder")}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
            activeTab === "builder"
              ? "bg-amber-400 text-slate-950 shadow-md"
              : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>🛠️ Visual Form Builder & Field Studio</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("submissions");
            if (currentForm) loadSubmissions(currentForm.slug);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
            activeTab === "submissions"
              ? "bg-amber-400 text-slate-950 shadow-md"
              : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>📊 View Form Submissions</span>
        </button>
      </div>

      {/* ========================================================
          TAB 1: FORMS DIRECTORY
         ======================================================== */}
      {activeTab === "directory" && (
        <div className="space-y-6">
          {/* Search bar */}
          <div className="flex items-center justify-between bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div className="relative w-full max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search forms by name, slug or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Grid of Form Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredForms.map((formItem) => {
              const isAdmission = formItem.slug === "admissions-apply";
              const isCareers = formItem.slug === "careers-apply";
              const isContact = formItem.slug === "contact-inquiry";
              const livePath = isAdmission
                ? "/admissions/apply"
                : isCareers
                ? "/careers"
                : isContact
                ? "/contact"
                : `/forms/${formItem.slug}`;

              const enabledCount =
                formItem.fields?.filter((f) => f.enabled !== false && !f.disabled).length || 0;

              return (
                <div
                  key={formItem.slug}
                  className={`rounded-3xl p-6 border transition-all flex flex-col justify-between space-y-5 ${
                    formItem.isActive
                      ? "bg-slate-950/90 border-slate-800 hover:border-slate-700 shadow-xl"
                      : "bg-rose-950/20 border-rose-900/40 opacity-75"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                        {formItem.category}
                      </span>

                      <label className="cursor-pointer inline-flex items-center space-x-1.5 bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-800 text-[11px] font-bold">
                        <input
                          type="checkbox"
                          checked={formItem.isActive}
                          onChange={(e) => handleToggleFormStatus(formItem.slug, e.target.checked)}
                          className="w-3.5 h-3.5 accent-emerald-500 rounded cursor-pointer"
                        />
                        <span className={formItem.isActive ? "text-emerald-400" : "text-rose-400"}>
                          {formItem.isActive ? "Live" : "Disabled"}
                        </span>
                      </label>
                    </div>

                    <div>
                      <h3 className="font-bold text-base text-white">{formItem.title}</h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{formItem.description}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 pt-1">
                      <span className="bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                        📑 <strong>{formItem.steps?.length || 1}</strong> Steps
                      </span>
                      <span className="bg-emerald-950/60 text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-800/80 font-bold">
                        ✅ <strong>{enabledCount}</strong> of {formItem.fields?.length || 0} Fields Active
                      </span>
                      {formItem.submissionsCount !== undefined && (
                        <span className="bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-amber-300">
                          📊 <strong>{formItem.submissionsCount}</strong> Responses
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Action Buttons */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-1">
                      <Link
                        href={livePath}
                        target="_blank"
                        className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800"
                        title="Open Live Public Form"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        onClick={() => {
                          setSelectedSlug(formItem.slug);
                          loadSubmissions(formItem.slug);
                          setActiveTab("submissions");
                        }}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold border border-slate-800 cursor-pointer"
                      >
                        Submissions
                      </button>
                    </div>

                    <button
                      onClick={() => handleSelectForm(formItem.slug)}
                      className="px-3.5 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 rounded-xl text-xs font-extrabold shadow flex items-center space-x-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Fields</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: INTERACTIVE VISUAL FORM BUILDER STUDIO
         ======================================================== */}
      {activeTab === "builder" && currentForm && (
        <div className="space-y-6">
          {/* Form Switcher & Status Bar */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Globe className="w-3.5 h-3.5" />
                <span>Selected Form:</span>
              </span>

              <select
                value={selectedSlug}
                onChange={(e) => handleSelectForm(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                {forms.map((f) => (
                  <option key={f.slug} value={f.slug}>
                    {f.title} ({f.slug})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="cursor-pointer inline-flex items-center space-x-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-bold text-white">
                <input
                  type="checkbox"
                  checked={currentForm.isActive}
                  onChange={(e) => setCurrentForm({ ...currentForm, isActive: e.target.checked })}
                  className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                />
                <span className={currentForm.isActive ? "text-emerald-400" : "text-rose-400"}>
                  {currentForm.isActive ? "Form is Live & Active" : "Form is Disabled (Closed)"}
                </span>
              </label>

              <button
                onClick={() => handleDeleteForm(currentForm.slug)}
                className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 rounded-xl text-xs font-bold border border-rose-800 flex items-center space-x-1 cursor-pointer"
                title="Delete or Reset Form"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete / Reset</span>
              </button>
            </div>
          </div>

          {/* Form Header Configuration Accordion */}
          <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
            <h3 className="font-bold text-sm text-amber-400 flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Form General Settings & Labels</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Form Title</label>
                <input
                  type="text"
                  value={currentForm.title}
                  onChange={(e) => setCurrentForm({ ...currentForm, title: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Badge Tag</label>
                <input
                  type="text"
                  value={currentForm.badge || ""}
                  onChange={(e) => setCurrentForm({ ...currentForm, badge: e.target.value })}
                  placeholder="e.g. Session 2027-2028"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Submit Button Label</label>
                <input
                  type="text"
                  value={currentForm.settings?.submitButtonText || "Submit Application"}
                  onChange={(e) =>
                    setCurrentForm({
                      ...currentForm,
                      settings: { ...currentForm.settings, submitButtonText: e.target.value },
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Admin Notification Email</label>
                <input
                  type="email"
                  value={currentForm.settings?.notificationEmail || ""}
                  onChange={(e) =>
                    setCurrentForm({
                      ...currentForm,
                      settings: { ...currentForm.settings, notificationEmail: e.target.value },
                    })
                  }
                  placeholder="admissions@cismandi.edu.in"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-slate-300">Form Subtitle / Instructions Description</label>
              <textarea
                rows={2}
                value={currentForm.description || ""}
                onChange={(e) => setCurrentForm({ ...currentForm, description: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400 resize-none font-sans"
              />
            </div>
          </div>

          {/* Multi-Step Manager Bar */}
          <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-amber-400 flex items-center space-x-2">
                <Layers className="w-4 h-4" />
                <span>Multi-Step Wizard Configuration ({currentForm.steps?.length || 1} Steps)</span>
              </h3>

              <div className="flex items-center space-x-2">
                <label className="cursor-pointer inline-flex items-center space-x-1.5 bg-slate-900 px-3 py-1 rounded-xl border border-slate-800 text-xs font-bold text-slate-300">
                  <input
                    type="checkbox"
                    checked={currentForm.settings?.isMultiStep !== false}
                    onChange={(e) =>
                      setCurrentForm({
                        ...currentForm,
                        settings: { ...currentForm.settings, isMultiStep: e.target.checked },
                      })
                    }
                    className="w-3.5 h-3.5 accent-amber-500 rounded cursor-pointer"
                  />
                  <span>Enable Multi-Step Wizard</span>
                </label>

                <button
                  type="button"
                  onClick={handleAddStep}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Step</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {(currentForm.steps || []).map((stepItem, sIdx) => (
                <div
                  key={stepItem.id}
                  className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 space-y-2 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-400">
                      Step #{sIdx + 1}
                    </span>
                    {(currentForm.steps?.length || 0) > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveStep(stepItem.id)}
                        className="p-1 text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete Step"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    value={stepItem.title}
                    onChange={(e) => handleUpdateStep(stepItem.id, { title: e.target.value })}
                    placeholder="Step Title..."
                    className="w-full bg-slate-950 font-bold text-xs text-white px-2.5 py-1.5 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-400"
                  />

                  <input
                    type="text"
                    value={stepItem.subtitle || ""}
                    onChange={(e) => handleUpdateStep(stepItem.id, { subtitle: e.target.value })}
                    placeholder="Subtitle..."
                    className="w-full bg-slate-950 text-[11px] text-slate-400 px-2.5 py-1 rounded-lg border border-slate-800 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ========================================================
              FORM FIELDS CANVAS WITH CHECKBOX SELECTION
             ======================================================== */}
          <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-6 shadow-xl">
            {/* Field Canvas Header & Action Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold text-base text-white flex items-center space-x-2">
                    <span>Form Fields Selection & Manager</span>
                  </h3>
                  <span className="text-xs font-extrabold px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    ✅ {enabledFieldsCount} of {totalFieldsCount} Selected (Live on Form)
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Check or uncheck boxes to select which fields are active on the website. Unchecked fields are safely preserved in the database.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Bulk Select All / Deselect All */}
                <button
                  type="button"
                  onClick={() => handleBulkToggleFields(true)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-emerald-300 rounded-xl text-xs font-bold border border-slate-700 flex items-center space-x-1.5 transition-all cursor-pointer"
                  title="Select all fields to display on live form"
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>Select All</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleBulkToggleFields(false)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold border border-slate-700 flex items-center space-x-1.5 transition-all cursor-pointer"
                  title="Deselect all fields"
                >
                  <Square className="w-3.5 h-3.5" />
                  <span>Deselect All</span>
                </button>

                {/* Bulk Mandatory / Optional */}
                <button
                  type="button"
                  onClick={() => handleBulkToggleRequired(true)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-rose-300 rounded-xl text-xs font-bold border border-slate-700 flex items-center space-x-1 transition-all cursor-pointer"
                  title="Set all fields as Mandatory (*)"
                >
                  <span>🔴 All Mandatory</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleBulkToggleRequired(false)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold border border-slate-700 flex items-center space-x-1 transition-all cursor-pointer"
                  title="Set all fields as Optional"
                >
                  <span>⚪ All Optional</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenAddField}
                  className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg flex items-center space-x-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add New Field</span>
                </button>
              </div>
            </div>

            {/* Filter Pills & Search */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800/80">
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
                <span className="text-slate-400 text-[11px] uppercase mr-1">View:</span>
                <button
                  type="button"
                  onClick={() => setFieldFilterTab("ALL")}
                  className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                    fieldFilterTab === "ALL"
                      ? "bg-amber-400 text-slate-950 font-extrabold shadow"
                      : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                  }`}
                >
                  All Fields ({totalFieldsCount})
                </button>
                <button
                  type="button"
                  onClick={() => setFieldFilterTab("ENABLED")}
                  className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                    fieldFilterTab === "ENABLED"
                      ? "bg-emerald-500 text-slate-950 font-extrabold shadow"
                      : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                  }`}
                >
                  Selected / Live ({enabledFieldsCount})
                </button>
                <button
                  type="button"
                  onClick={() => setFieldFilterTab("DISABLED")}
                  className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                    fieldFilterTab === "DISABLED"
                      ? "bg-rose-500 text-white font-extrabold shadow"
                      : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                  }`}
                >
                  Hidden ({disabledFieldsCount})
                </button>
                <button
                  type="button"
                  onClick={() => setFieldFilterTab("REQUIRED")}
                  className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                    fieldFilterTab === "REQUIRED"
                      ? "bg-rose-600 text-white font-extrabold shadow"
                      : "bg-slate-900 text-rose-400 hover:text-white border border-slate-800"
                  }`}
                >
                  🔴 Mandatory ({mandatoryFieldsCount})
                </button>
                <button
                  type="button"
                  onClick={() => setFieldFilterTab("OPTIONAL")}
                  className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                    fieldFilterTab === "OPTIONAL"
                      ? "bg-slate-200 text-slate-950 font-extrabold shadow"
                      : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                  }`}
                >
                  ⚪ Optional ({optionalFieldsCount})
                </button>
              </div>

              <div className="relative w-full sm:w-60">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter fields by name..."
                  value={fieldSearchTerm}
                  onChange={(e) => setFieldSearchTerm(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* List of Form Fields with Checkbox Option */}
            <div className="space-y-3">
              {displayFields.map((field) => {
                const originalIndex = (currentForm.fields || []).findIndex((f) => f.id === field.id);
                const stepLabel = currentForm.steps?.find((s) => s.id === field.stepId)?.title || "General";
                const isEnabled = field.enabled !== false && !field.disabled;

                return (
                  <div
                    key={field.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group shadow ${
                      isEnabled
                        ? "bg-slate-900 hover:bg-slate-850 border-slate-800 hover:border-amber-400/60"
                        : "bg-slate-950/40 border-dashed border-slate-800/80 opacity-60 hover:opacity-85"
                    }`}
                  >
                    {/* Left: Checkbox Selector + Reorder + Field Info */}
                    <div className="flex items-center space-x-3.5 flex-1">
                      {/* Checkbox Selector */}
                      <label
                        className={`cursor-pointer inline-flex items-center space-x-2 px-3 py-2 rounded-xl border text-xs font-bold transition-all select-none ${
                          isEnabled
                            ? "bg-emerald-950/80 hover:bg-emerald-900/80 border-emerald-700/80 text-emerald-200"
                            : "bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-400"
                        }`}
                        title="Check to include this field in the live website form, uncheck to hide"
                      >
                        <input
                          type="checkbox"
                          checked={isEnabled}
                          onChange={(e) => handleToggleFieldEnabled(field.id, e.target.checked)}
                          className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 bg-slate-950 border-slate-700 cursor-pointer accent-emerald-500"
                        />
                        <span className="hidden sm:inline font-bold">
                          {isEnabled ? "Selected" : "Excluded"}
                        </span>
                      </label>

                      {/* Reorder Arrows */}
                      <div className="flex flex-col space-y-0.5">
                        <button
                          type="button"
                          onClick={() => handleMoveField(originalIndex, "up")}
                          disabled={originalIndex === 0}
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 disabled:opacity-20 cursor-pointer"
                          title="Move Up"
                        >
                          <MoveUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveField(originalIndex, "down")}
                          disabled={originalIndex === currentForm.fields.length - 1}
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 disabled:opacity-20 cursor-pointer"
                          title="Move Down"
                        >
                          <MoveDown className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Field Metadata & Labels */}
                      <div className="space-y-1 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`font-bold text-sm ${
                              isEnabled ? "text-white" : "text-slate-400 line-through"
                            }`}
                          >
                            {field.label}
                          </span>

                          {/* Live / Hidden Status Badge */}
                          <span
                            className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border flex items-center space-x-1 ${
                              isEnabled
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                : "bg-slate-800 text-slate-400 border-slate-700"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isEnabled ? "bg-emerald-400" : "bg-slate-500"
                              }`}
                            />
                            <span>{isEnabled ? "Live on Form" : "Hidden from Form"}</span>
                          </span>

                          {/* 1-Click Mandatory vs Optional Toggle Button */}
                          <button
                            type="button"
                            onClick={() => handleToggleFieldRequired(field.id, !field.required)}
                            className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border flex items-center space-x-1 cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-sm ${
                              field.required
                                ? "bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30"
                                : "bg-slate-800/90 text-slate-400 border-slate-700 hover:text-white hover:border-slate-500"
                            }`}
                            title="Click to toggle Mandatory (Required *) vs Optional"
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                field.required ? "bg-rose-400 animate-pulse" : "bg-slate-500"
                              }`}
                            />
                            <span>{field.required ? "Mandatory *" : "Optional"}</span>
                          </button>
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            {field.type}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
                            {field.name}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                          <span>
                            Step: <strong className="text-amber-300">{stepLabel}</strong>
                          </span>
                          <span>•</span>
                          <span>
                            Width: <strong>{field.width || "full"}</strong>
                          </span>
                          {field.placeholder && (
                            <>
                              <span>•</span>
                              <span className="italic">Placeholder: "{field.placeholder}"</span>
                            </>
                          )}
                          {field.options && field.options.length > 0 && (
                            <>
                              <span>•</span>
                              <span className="text-emerald-400 font-semibold">
                                {field.options.length} Options
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center space-x-1.5 opacity-90 group-hover:opacity-100 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleOpenEditField(field)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-xl text-xs font-bold border border-slate-700 flex items-center space-x-1 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDuplicateField(field)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl cursor-pointer"
                        title="Duplicate Field"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteField(field.id)}
                        className="p-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 rounded-xl border border-rose-900 cursor-pointer"
                        title="Delete Field"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {displayFields.length === 0 && (
              <div className="py-12 text-center space-y-3 border-2 border-dashed border-slate-800 rounded-3xl p-8">
                <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
                <h4 className="font-bold text-sm text-white">No Fields Found in this Filter</h4>
                <p className="text-xs text-slate-400">
                  Switch the filter to "All Fields" or click below to add a new field.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFieldFilterTab("ALL");
                    setFieldSearchTerm("");
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 cursor-pointer"
                >
                  Show All Fields
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 3: VIEW SUBMISSIONS
         ======================================================== */}
      {activeTab === "submissions" && (
        <div className="space-y-6">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Viewing Submissions For:
              </span>
              <select
                value={selectedSlug}
                onChange={(e) => {
                  setSelectedSlug(e.target.value);
                  loadSubmissions(e.target.value);
                }}
                className="bg-slate-900 border border-slate-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                {forms.map((f) => (
                  <option key={f.slug} value={f.slug}>
                    {f.title} ({f.slug})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => loadSubmissions(selectedSlug)}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold border border-slate-800 flex items-center space-x-1 cursor-pointer"
            >
              <span>🔄 Refresh List</span>
            </button>
          </div>

          {/* Submissions Table */}
          {loadingSubmissions ? (
            <div className="py-20 text-center space-y-3 bg-slate-950 rounded-3xl border border-slate-800">
              <Loader2 className="w-8 h-8 animate-spin text-amber-400 mx-auto" />
              <p className="text-xs text-slate-400">Loading form submissions...</p>
            </div>
          ) : submissions.length === 0 ? (
            <div className="py-16 text-center space-y-3 bg-slate-950 rounded-3xl border border-slate-800 p-8">
              <FileText className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="font-bold text-base text-white">No Submissions Recorded Yet</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Responses submitted through the public website for this form will appear here in real time.
              </p>
            </div>
          ) : (
            <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-4">Submission Ref #</th>
                      <th className="p-4">Candidate / Name</th>
                      <th className="p-4">Email / Phone</th>
                      <th className="p-4">Date & Time</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {submissions.map((sub) => {
                      const name =
                        sub.data?.studentName ||
                        sub.data?.applicantName ||
                        sub.data?.name ||
                        sub.data?.fullName ||
                        "—";
                      const contact = sub.data?.email || sub.data?.phone || "—";
                      const dateStr = new Date(sub.submittedAt).toLocaleString();

                      return (
                        <tr key={sub.id} className="hover:bg-slate-900/60 transition-colors">
                          <td className="p-4 font-mono font-bold text-amber-400">{sub.submissionNo}</td>
                          <td className="p-4 font-bold text-white">{name}</td>
                          <td className="p-4 text-slate-400">{contact}</td>
                          <td className="p-4 text-slate-400">{dateStr}</td>
                          <td className="p-4">
                            <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              {sub.status || "SUBMITTED"}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => setSelectedSubmissionData(sub)}
                              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg text-xs font-bold cursor-pointer"
                            >
                              View Full Details
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          MODAL: FIELD INSPECTOR & EDITOR
         ======================================================== */}
      {isFieldModalOpen && editingField && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="font-bold text-lg text-white flex items-center space-x-2">
                <Edit3 className="w-5 h-5 text-amber-400" />
                <span>{isNewField ? "Add New Form Field" : "Edit Field Configuration"}</span>
              </h3>
              <button
                onClick={() => setIsFieldModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Field Label (Visible to user)</label>
                <input
                  type="text"
                  value={editingField.label}
                  onChange={(e) => {
                    const newLabel = e.target.value;
                    const autoName = isNewField
                      ? newLabel
                          .toLowerCase()
                          .replace(/[^a-z0-9]/g, "_")
                          .replace(/_+/g, "_")
                          .slice(0, 30)
                      : editingField.name;
                    setEditingField({ ...editingField, label: newLabel, name: autoName || editingField.name });
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Field Key / DB Column Name</label>
                <input
                  type="text"
                  value={editingField.name}
                  onChange={(e) => setEditingField({ ...editingField, name: e.target.value })}
                  className="w-full bg-slate-950 font-mono text-xs border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Field Type</label>
                <select
                  value={editingField.type}
                  onChange={(e) =>
                    setEditingField({
                      ...editingField,
                      type: e.target.value as FieldType,
                      accept:
                        e.target.value === "image"
                          ? "image/*,.jpg,.jpeg,.png,.webp"
                          : e.target.value === "document"
                          ? ".pdf,.doc,.docx,.jpg,.png"
                          : editingField.accept,
                      maxSizeMB:
                        e.target.value === "image"
                          ? 5
                          : e.target.value === "document"
                          ? 10
                          : editingField.maxSizeMB,
                      options:
                        e.target.value === "select" || e.target.value === "radio"
                          ? editingField.options && editingField.options.length > 0
                            ? editingField.options
                            : [
                                { label: "Option 1", value: "Option 1" },
                                { label: "Option 2", value: "Option 2" },
                              ]
                          : editingField.options,
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="image">🖼️ Image Upload (Student Photo, ID Card, JPG, PNG, WebP)</option>
                  <option value="document">📄 Document / PDF Upload (PDF, DOCX, Marksheet, TC, Resume)</option>
                  <option value="file">📁 General File Upload (Any Attachment)</option>
                  <option value="text">Single Line Text</option>
                  <option value="email">Email Address</option>
                  <option value="tel">Phone Number</option>
                  <option value="number">Numeric</option>
                  <option value="date">Date Picker</option>
                  <option value="select">Dropdown Select</option>
                  <option value="radio">Radio Options</option>
                  <option value="checkbox">Checkbox Toggle</option>
                  <option value="textarea">Multi-line Textarea</option>
                  <option value="heading">Section Divider Heading</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Assign to Step</label>
                <select
                  value={editingField.stepId || currentForm?.steps?.[0]?.id || ""}
                  onChange={(e) => setEditingField({ ...editingField, stepId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  {(currentForm?.steps || []).map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Field Width on Screen</label>
                <select
                  value={editingField.width || "full"}
                  onChange={(e) => setEditingField({ ...editingField, width: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="full">Full Width (100%)</option>
                  <option value="half">Half Width (50% - 2 Columns)</option>
                  <option value="third">One-Third Width (33% - 3 Columns)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Placeholder Text</label>
                <input
                  type="text"
                  value={editingField.placeholder || ""}
                  onChange={(e) => setEditingField({ ...editingField, placeholder: e.target.value })}
                  placeholder="e.g. Enter full name..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Helper Text, Required & Enabled Checkbox Switches */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Helper / Instruction Note</label>
                <input
                  type="text"
                  value={editingField.helperText || ""}
                  onChange={(e) => setEditingField({ ...editingField, helperText: e.target.value })}
                  placeholder="e.g. As written on government birth certificate"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Field Requirement & Live Status Settings */}
            <div className="space-y-3 pt-2">
              <label className="font-bold text-slate-200 text-xs block">
                Field Requirement & Live Form Status
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Mandatory vs Optional Card 1: Mandatory */}
                <label
                  className={`cursor-pointer flex items-start space-x-3 p-3.5 rounded-2xl border transition-all ${
                    editingField.required
                      ? "bg-rose-950/60 border-rose-500 ring-2 ring-rose-500/30 text-white shadow-lg"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="fieldRequirementOption"
                    checked={Boolean(editingField.required)}
                    onChange={() => setEditingField({ ...editingField, required: true })}
                    className="w-4 h-4 mt-0.5 accent-rose-500 cursor-pointer"
                  />
                  <div className="space-y-0.5">
                    <span className="font-extrabold text-xs block text-rose-300">
                      🔴 Mandatory Field (*)
                    </span>
                    <span className="text-[11px] text-slate-400 block leading-tight">
                      Applicants must fill or upload this field before submitting.
                    </span>
                  </div>
                </label>

                {/* Mandatory vs Optional Card 2: Optional */}
                <label
                  className={`cursor-pointer flex items-start space-x-3 p-3.5 rounded-2xl border transition-all ${
                    !editingField.required
                      ? "bg-slate-900 border-amber-400/80 ring-2 ring-amber-400/30 text-white shadow-lg"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="fieldRequirementOption"
                    checked={!editingField.required}
                    onChange={() => setEditingField({ ...editingField, required: false })}
                    className="w-4 h-4 mt-0.5 accent-amber-400 cursor-pointer"
                  />
                  <div className="space-y-0.5">
                    <span className="font-extrabold text-xs block text-amber-300">
                      ⚪ Optional Field
                    </span>
                    <span className="text-[11px] text-slate-400 block leading-tight">
                      Applicants can optionally skip or leave this field empty.
                    </span>
                  </div>
                </label>
              </div>

              {/* Field Enabled / Selected Checkbox */}
              <div className="pt-1">
                <label className="cursor-pointer inline-flex items-center space-x-2.5 bg-slate-950 px-4 py-2.5 rounded-2xl border border-slate-800 text-xs font-bold text-white hover:border-slate-700 transition-all">
                  <input
                    type="checkbox"
                    checked={editingField.enabled !== false && !editingField.disabled}
                    onChange={(e) =>
                      setEditingField({
                        ...editingField,
                        enabled: e.target.checked,
                        disabled: !e.target.checked,
                      })
                    }
                    className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                  />
                  <span
                    className={
                      editingField.enabled !== false && !editingField.disabled
                        ? "text-emerald-400"
                        : "text-slate-400"
                    }
                  >
                    {editingField.enabled !== false && !editingField.disabled
                      ? "✅ Included / Selected (Live on Website)"
                      : "○ Excluded (Hidden from Website Form)"}
                  </span>
                </label>
              </div>
            </div>

            {/* Media & Document Upload Settings */}
            {(editingField.type === "image" || editingField.type === "document" || editingField.type === "file") && (
              <div className="bg-slate-950 p-4 rounded-2xl border border-amber-500/30 space-y-3.5">
                <div className="flex items-center space-x-2 text-xs font-bold text-amber-400">
                  <Upload className="w-4 h-4" />
                  <span>
                    {editingField.type === "image"
                      ? "🖼️ Image Upload Specifications"
                      : "📄 Document & File Specifications"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Accepted File Formats</label>
                    <input
                      type="text"
                      value={editingField.accept || ""}
                      onChange={(e) => setEditingField({ ...editingField, accept: e.target.value })}
                      placeholder={
                        editingField.type === "image"
                          ? "image/*,.jpg,.jpeg,.png,.webp"
                          : ".pdf,.doc,.docx,.jpg,.png"
                      }
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-white font-mono text-[11px] focus:outline-none focus:border-amber-400"
                    />
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {editingField.type === "image" ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setEditingField({ ...editingField, accept: "image/*,.jpg,.jpeg,.png,.webp" })}
                            className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded text-[10px] font-bold cursor-pointer"
                          >
                            JPG/PNG/WebP
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingField({ ...editingField, accept: "image/jpeg,image/png" })}
                            className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] cursor-pointer"
                          >
                            JPG/PNG Only
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => setEditingField({ ...editingField, accept: ".pdf" })}
                            className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded text-[10px] font-bold cursor-pointer"
                          >
                            PDF Only
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingField({ ...editingField, accept: ".pdf,.doc,.docx" })}
                            className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] cursor-pointer"
                          >
                            PDF + Word
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingField({ ...editingField, accept: ".pdf,.jpg,.jpeg,.png" })}
                            className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] cursor-pointer"
                          >
                            PDF + Scans
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Max File Size Limit (MB)</label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={editingField.maxSizeMB || (editingField.type === "image" ? 5 : 10)}
                      onChange={(e) =>
                        setEditingField({ ...editingField, maxSizeMB: parseInt(e.target.value) || 5 })
                      }
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                    />
                    <span className="text-[10px] text-slate-500">Default: 5MB for photos, 10MB for documents</span>
                  </div>
                </div>
              </div>
            )}

            {/* Options List Editor (for select / radio) */}
            {(editingField.type === "select" || editingField.type === "radio") && (
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-xs text-amber-400">
                    Dropdown / Radio Options List ({editingField.options?.length || 0})
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const newOpt = {
                        label: `Option ${(editingField.options?.length || 0) + 1}`,
                        value: `Option ${(editingField.options?.length || 0) + 1}`,
                      };
                      setEditingField({
                        ...editingField,
                        options: [...(editingField.options || []), newOpt],
                      });
                    }}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg text-xs font-bold cursor-pointer"
                  >
                    + Add Option
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {(editingField.options || []).map((opt, oIdx) => (
                    <div key={oIdx} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={opt.label}
                        onChange={(e) => {
                          const updated = [...(editingField.options || [])];
                          updated[oIdx] = { label: e.target.value, value: e.target.value };
                          setEditingField({ ...editingField, options: updated });
                        }}
                        placeholder="Option Label..."
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (editingField.options || []).filter((_, idx) => idx !== oIdx);
                          setEditingField({ ...editingField, options: updated });
                        }}
                        className="p-1.5 text-slate-500 hover:text-rose-400 cursor-pointer"
                        title="Delete Option"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsFieldModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveFieldModal}
                className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-extrabold shadow cursor-pointer"
              >
                {isNewField ? "Add Field to Form" : "Save Field Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: LIVE FORM INTERACTIVE PREVIEW
         ======================================================== */}
      {showPreviewModal && currentForm && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-4xl max-h-[95vh] overflow-y-auto p-6 sm:p-10 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">
                  Live Interactive Simulation (Only {enabledFieldsCount} Selected Fields Shown)
                </span>
                <h3 className="font-bold text-lg text-white">{currentForm.title}</h3>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <DynamicFormRenderer initialForm={currentForm} />
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: CREATE NEW FORM
         ======================================================== */}
      {showCreateFormModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateNewForm}
            className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md p-6 sm:p-8 space-y-5 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white flex items-center space-x-2">
                <Plus className="w-5 h-5 text-amber-400" />
                <span>Create New Custom Form</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateFormModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Form Title</label>
                <input
                  type="text"
                  required
                  value={newFormTitle}
                  onChange={(e) => {
                    setNewFormTitle(e.target.value);
                    if (!newFormSlug) {
                      setNewFormSlug(
                        e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9]/g, "-")
                          .replace(/-+/g, "-")
                      );
                    }
                  }}
                  placeholder="e.g. Sports Academy Registration"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Form URL Slug</label>
                <input
                  type="text"
                  required
                  value={newFormSlug}
                  onChange={(e) => setNewFormSlug(e.target.value)}
                  placeholder="e.g. sports-registration"
                  className="w-full bg-slate-950 font-mono text-xs border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Category</label>
                <select
                  value={newFormCategory}
                  onChange={(e) => setNewFormCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="CUSTOM">Custom Form</option>
                  <option value="ADMISSION">Admission Related</option>
                  <option value="CAREERS">Careers Related</option>
                  <option value="CONTACT">Inquiries & Feedback</option>
                  <option value="GENERAL">General Services / TC</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowCreateFormModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-extrabold shadow cursor-pointer"
              >
                Create Form
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================
          MODAL: SUBMISSION DETAILS VIEW
         ======================================================== */}
      {selectedSubmissionData && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-amber-400">
                  Submission Ref #{selectedSubmissionData.submissionNo}
                </span>
                <h3 className="font-bold text-base text-white">{selectedSubmissionData.formTitle}</h3>
              </div>
              <button
                onClick={() => setSelectedSubmissionData(null)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {Object.entries(selectedSubmissionData.data || {}).map(([key, val]) => {
                const strVal = String(val || "");
                const isImageVal =
                  typeof val === "string" &&
                  (strVal.endsWith(".webp") ||
                    strVal.endsWith(".jpg") ||
                    strVal.endsWith(".png") ||
                    strVal.endsWith(".jpeg") ||
                    key.toLowerCase().includes("photo") ||
                    key.toLowerCase().includes("image"));
                const isDocVal =
                  typeof val === "string" &&
                  (strVal.endsWith(".pdf") ||
                    strVal.endsWith(".docx") ||
                    strVal.endsWith(".doc") ||
                    strVal.startsWith("/uploads/") ||
                    key.toLowerCase().includes("resume") ||
                    key.toLowerCase().includes("doc") ||
                    key.toLowerCase().includes("cert"));

                return (
                  <div key={key} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">{key}</span>
                    {isImageVal && strVal.length > 5 ? (
                      <div className="space-y-1.5 pt-1">
                        <img
                          src={strVal}
                          alt={key}
                          className="w-16 h-16 object-cover rounded-lg border border-slate-700 shadow"
                        />
                        <a
                          href={strVal}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-amber-400 hover:underline text-[11px] font-bold flex items-center space-x-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>View Full Image</span>
                        </a>
                      </div>
                    ) : isDocVal && strVal.length > 5 ? (
                      <div className="pt-1">
                        <a
                          href={strVal}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-xl border border-slate-700 text-xs font-bold transition-all"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span className="truncate max-w-[150px]">{strVal.split("/").pop() || "View Document"}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    ) : (
                      <p className="font-bold text-white break-words">
                        {typeof val === "boolean" ? (val ? "Yes" : "No") : String(val || "—")}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedSubmissionData(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
