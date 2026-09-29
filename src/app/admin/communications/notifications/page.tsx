"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Mail,
  Server,
  RefreshCw,
  Sparkles,
  Save,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  Sliders,
  Send,
  HelpCircle,
  Bell,
} from "lucide-react";

export default function FormNotificationsPage() {
  const [forms, setForms] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFormSlug, setSelectedFormSlug] = useState<string>("");
  const [saving, setSaving] = useState(false);

  // Active Form Notification Config State
  const [isEnabled, setIsEnabled] = useState(true);
  const [recipientType, setRecipientType] = useState("FIXED");
  const [recipients, setRecipients] = useState("admissions@cismandi.edu.in");
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [replyToField, setReplyToField] = useState("email");
  const [subjectTemplate, setSubjectTemplate] = useState("New {{form_name}} Submission - {{submission_id}}");
  const [templateId, setTemplateId] = useState("");
  const [includeAllFields, setIncludeAllFields] = useState(true);
  const [includeSubmissionDate, setIncludeSubmissionDate] = useState(true);
  const [includeUploadedFiles, setIncludeUploadedFiles] = useState(true);

  // Visitor confirmation
  const [sendVisitorConfirmation, setSendVisitorConfirmation] = useState(false);
  const [visitorEmailField, setVisitorEmailField] = useState("email");
  const [confirmationTemplateId, setConfirmationTemplateId] = useState("");

  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showToast = (type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const res = await fetch("/api/email/notifications");
      const data = await res.json();
      if (data.success) {
        setForms(data.forms);
        setTemplates(data.templates);
        if (data.forms.length > 0) {
          selectForm(data.forms[0]);
        }
      }
    } catch (err) {
      showToast("error", "Failed to load form notification configurations");
    } finally {
      setLoading(false);
    }
  }

  const selectForm = (formItem: any) => {
    setSelectedFormSlug(formItem.formSlug);
    const cfg = formItem.config;
    setIsEnabled(cfg.isEnabled ?? true);
    setRecipientType(cfg.recipientType || "FIXED");
    setRecipients(cfg.recipients || "admissions@cismandi.edu.in");
    setCc(cfg.cc || "");
    setBcc(cfg.bcc || "");
    setReplyToField(cfg.replyToField || "email");
    setSubjectTemplate(cfg.subjectTemplate || `New ${formItem.formTitle} Submission - {{submission_id}}`);
    setTemplateId(cfg.templateId || "");
    setIncludeAllFields(cfg.includeAllFields ?? true);
    setIncludeSubmissionDate(cfg.includeSubmissionDate ?? true);
    setIncludeUploadedFiles(cfg.includeUploadedFiles ?? true);
    setSendVisitorConfirmation(cfg.sendVisitorConfirmation ?? false);
    setVisitorEmailField(cfg.visitorEmailField || "email");
    setConfirmationTemplateId(cfg.confirmationTemplateId || "");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFormSlug) return;
    setSaving(true);
    try {
      const res = await fetch("/api/email/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formSlug: selectedFormSlug,
          isEnabled,
          recipientType,
          recipients,
          cc,
          bcc,
          replyToField,
          subjectTemplate,
          templateId,
          includeAllFields,
          includeSubmissionDate,
          includeUploadedFiles,
          sendVisitorConfirmation,
          visitorEmailField,
          confirmationTemplateId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("success", `Notification settings saved for ${selectedFormSlug}!`);
        // Refresh local form list
        setForms((prev) =>
          prev.map((f) =>
            f.formSlug === selectedFormSlug ? { ...f, config: data.config } : f
          )
        );
      } else {
        showToast("error", data.error || "Failed to save settings");
      }
    } catch (err: any) {
      showToast("error", err.message || "Network error");
    } finally {
      setSaving(false);
    }
  };

  const currentForm = forms.find((f) => f.formSlug === selectedFormSlug);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16 text-slate-100">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-3 text-sm font-bold transition-all border ${
            toast.type === "success"
              ? "bg-emerald-900 text-emerald-100 border-emerald-400"
              : "bg-rose-900 text-rose-100 border-rose-400"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-rose-300" />
          )}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Header & Sub-navigation Tabs */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-black text-amber-400 uppercase tracking-widest mb-1.5">
              <span>Communications</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span>Form Notifications</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-amber-400" />
              Form Notification Routing
            </h1>
            <p className="text-sm text-slate-200 mt-1 font-medium">
              Configure independent email recipients, Reply-To routing, and automated visitor confirmations for each form.
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
          <Link
            href="/admin/communications/email"
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700 transition-all flex items-center gap-2"
          >
            <Server className="w-3.5 h-3.5 text-blue-400" />
            <span>Email Settings</span>
          </Link>
          <Link
            href="/admin/communications/alerts"
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700 transition-all flex items-center gap-2"
          >
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            <span>Email Alerts</span>
          </Link>
          <Link
            href="/admin/communications/templates"
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700 transition-all flex items-center gap-2"
          >
            <Mail className="w-3.5 h-3.5 text-purple-400" />
            <span>Email Templates</span>
          </Link>
          <Link
            href="/admin/communications/notifications"
            className="px-4 py-2 rounded-xl text-xs font-black bg-amber-400 text-slate-950 shadow-md flex items-center gap-2"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-slate-950" />
            <span>Form Notifications</span>
          </Link>
          <Link
            href="/admin/communications/logs"
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700 transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
            <span>Email Logs & Queue</span>
          </Link>
          <Link
            href="/admin/communications/design"
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Email Branding & Design</span>
          </Link>
        </div>
      </div>

      {/* Main Form Notifications Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Selector (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
            <span className="text-xs font-black text-amber-400 uppercase tracking-wider block mb-3 px-1">
              Select Form ({forms.length})
            </span>

            <div className="space-y-2.5 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
              {forms.map((item) => {
                const isSelected = selectedFormSlug === item.formSlug;
                const enabled = item.config?.isEnabled ?? true;
                return (
                  <div
                    key={item.formSlug}
                    onClick={() => selectForm(item)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-gradient-to-r from-blue-900/80 to-slate-900 border-amber-400 text-white shadow-lg ring-1 ring-amber-400/50"
                        : "bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700 hover:bg-slate-900"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-extrabold text-sm text-white">{item.formTitle}</span>
                      <span
                        className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                          enabled
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40"
                            : "bg-slate-800 text-slate-300 border border-slate-700"
                        }`}
                      >
                        {enabled ? "Active" : "Disabled"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-300 truncate">
                      <span className="text-amber-300 font-bold">To:</span>
                      <strong className="text-slate-100 font-medium truncate font-mono">
                        {item.config?.recipients || "admissions@cismandi.edu.in"}
                      </strong>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Notification Settings for Selected Form (8 cols) */}
        <div className="lg:col-span-8">
          {currentForm ? (
            <form onSubmit={handleSave} className="space-y-6">
              {/* Administrative Notifications Panel */}
              <div className="p-6 sm:p-7 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-3">
                  <div>
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      <span>{currentForm.formTitle}</span>
                      <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950/60 border border-amber-500/40 px-2 py-0.5 rounded">
                        {currentForm.formSlug}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-200 mt-1 font-medium">
                      Configure recipient inboxes and routing when this form is submitted online.
                    </p>
                  </div>

                  <label className="flex items-center gap-2.5 cursor-pointer bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
                    <input
                      type="checkbox"
                      checked={isEnabled}
                      onChange={(e) => setIsEnabled(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-400 focus:ring-amber-400 bg-slate-900 border-slate-600"
                    />
                    <span className="text-xs font-bold text-white">Enable Notification</span>
                  </label>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-black text-white uppercase tracking-wider mb-2">
                      Recipient Inboxes (TO) <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={recipients}
                      onChange={(e) => setRecipients(e.target.value)}
                      placeholder="admissions@school.com, principal@school.com"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs sm:text-sm font-semibold focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 placeholder:text-slate-500 shadow-inner"
                      required={isEnabled}
                    />
                    <span className="text-xs text-slate-300 mt-1.5 block">
                      Separate multiple email addresses with commas. Example: <code className="text-amber-300 font-bold bg-slate-950 px-1.5 py-0.5 rounded border border-amber-400/30">admissions@cismandi.edu.in, principal@cismandi.edu.in</code>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-white uppercase tracking-wider mb-2">
                        CC (Carbon Copy)
                      </label>
                      <input
                        type="text"
                        value={cc}
                        onChange={(e) => setCc(e.target.value)}
                        placeholder="office@cismandi.edu.in"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs sm:text-sm font-semibold focus:outline-none focus:border-amber-400 placeholder:text-slate-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-white uppercase tracking-wider mb-2">
                        BCC (Blind Carbon Copy)
                      </label>
                      <input
                        type="text"
                        value={bcc}
                        onChange={(e) => setBcc(e.target.value)}
                        placeholder="audit@cismandi.edu.in"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs sm:text-sm font-semibold focus:outline-none focus:border-amber-400 placeholder:text-slate-500"
                      />
                    </div>
                  </div>

                  {/* REPLY-TO ROUTING */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <label className="block text-xs font-black text-amber-400 uppercase tracking-wider">
                      Reply-To Header Field
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                      <input
                        type="text"
                        value={replyToField}
                        onChange={(e) => setReplyToField(e.target.value)}
                        placeholder="email"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs font-bold focus:outline-none focus:border-amber-400"
                      />
                      <p className="text-xs text-slate-200 leading-snug font-medium">
                        When the admin clicks <strong className="text-white font-bold">Reply</strong> in Gmail or Outlook, it automatically replies to the visitor's email address submitted in this field.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-white uppercase tracking-wider mb-2">
                      Subject Line Template
                    </label>
                    <input
                      type="text"
                      value={subjectTemplate}
                      onChange={(e) => setSubjectTemplate(e.target.value)}
                      placeholder="New {{form_name}} Submission - {{submission_id}}"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm font-semibold focus:outline-none focus:border-amber-400 placeholder:text-slate-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-white uppercase tracking-wider mb-2">
                      Notification Email Template
                    </label>
                    <select
                      value={templateId}
                      onChange={(e) => setTemplateId(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-semibold text-xs sm:text-sm focus:outline-none focus:border-amber-400"
                    >
                      <option value="" className="bg-slate-900 text-white">
                        (Default Automatic Notification Template)
                      </option>
                      {templates.map((t) => (
                        <option key={t.id} value={t.id} className="bg-slate-900 text-white">
                          {t.name} ({t.type})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-wrap gap-5 pt-2">
                    <label className="flex items-center gap-2.5 text-xs font-bold text-white cursor-pointer bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 hover:border-slate-700">
                      <input
                        type="checkbox"
                        checked={includeAllFields}
                        onChange={(e) => setIncludeAllFields(e.target.checked)}
                        className="w-4 h-4 rounded text-amber-400 focus:ring-amber-400 bg-slate-900 border-slate-600"
                      />
                      <span>Include all submitted fields table</span>
                    </label>
                    <label className="flex items-center gap-2.5 text-xs font-bold text-white cursor-pointer bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 hover:border-slate-700">
                      <input
                        type="checkbox"
                        checked={includeSubmissionDate}
                        onChange={(e) => setIncludeSubmissionDate(e.target.checked)}
                        className="w-4 h-4 rounded text-amber-400 focus:ring-amber-400 bg-slate-900 border-slate-600"
                      />
                      <span>Include submission date & timestamp</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* VISITOR CONFIRMATION EMAIL */}
              <div className="p-6 sm:p-7 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h4 className="text-base font-black text-white flex items-center gap-2">
                      <Mail className="w-5 h-5 text-emerald-400" />
                      <span>Automated Visitor Confirmation Email</span>
                    </h4>
                    <p className="text-xs text-slate-200 mt-0.5 font-medium">
                      Send an immediate acknowledgment receipt to the parent or applicant with their submission reference ID.
                    </p>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={sendVisitorConfirmation}
                      onChange={(e) => setSendVisitorConfirmation(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-400 focus:ring-emerald-400 bg-slate-900 border-slate-600"
                    />
                    <span className="text-xs font-bold text-emerald-300">Send to Visitor</span>
                  </label>
                </div>

                {sendVisitorConfirmation && (
                  <div className="space-y-4 pt-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black text-white uppercase tracking-wider mb-2">
                          Visitor Email Field in Form
                        </label>
                        <input
                          type="text"
                          value={visitorEmailField}
                          onChange={(e) => setVisitorEmailField(e.target.value)}
                          placeholder="email"
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono font-bold focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-white uppercase tracking-wider mb-2">
                          Confirmation Template
                        </label>
                        <select
                          value={confirmationTemplateId}
                          onChange={(e) => setConfirmationTemplateId(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-semibold text-xs focus:outline-none focus:border-amber-400"
                        >
                          <option value="" className="bg-slate-900 text-white">
                            (Default Form Submission Confirmation)
                          </option>
                          {templates
                            .filter((t) => t.type === "FORM_CONFIRMATION" || t.type === "CUSTOM")
                            .map((t) => (
                              <option key={t.id} value={t.id} className="bg-slate-900 text-white">
                                {t.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* SAVE BUTTON */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  <Save className={`w-4 h-4 ${saving ? "animate-spin" : ""}`} />
                  <span>{saving ? "Saving Changes..." : "Save Notification Settings"}</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="p-12 rounded-2xl bg-slate-900 border border-slate-800 text-center text-slate-200 text-sm font-medium">
              Select a form from the left to configure email notifications.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
