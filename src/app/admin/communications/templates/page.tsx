"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Mail,
  FileCode,
  Plus,
  Edit,
  Eye,
  Trash2,
  Copy,
  CheckCircle2,
  AlertTriangle,
  Send,
  Save,
  ChevronRight,
  Server,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Code,
  EyeOff,
  Bell,
} from "lucide-react";

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [saving, setSaving] = useState(false);

  // Form Fields
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [type, setType] = useState("FORM_NOTIFICATION");
  const [subject, setSubject] = useState("");
  const [htmlBody, setHtmlBody] = useState("");
  const [plainTextBody, setPlainTextBody] = useState("");

  // Preview state
  const [previewHtml, setPreviewHtml] = useState("");
  const [previewSubject, setPreviewSubject] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);

  // Send Test modal
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [testTo, setTestTo] = useState("");
  const [sendingTest, setSendingTest] = useState(false);

  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showToast = (type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  async function fetchTemplates() {
    setLoading(true);
    try {
      const res = await fetch("/api/email/templates");
      const data = await res.json();
      if (data.success && data.templates) {
        setTemplates(data.templates);
      }
    } catch (err) {
      showToast("error", "Failed to fetch email templates");
    } finally {
      setLoading(false);
    }
  }

  const handleSelectTemplate = (tpl: any) => {
    setSelectedTemplate(tpl);
    setName(tpl.name);
    setSlug(tpl.slug);
    setType(tpl.type);
    setSubject(tpl.subject);
    setHtmlBody(tpl.htmlBody);
    setPlainTextBody(tpl.plainTextBody || "");
    setIsEditing(true);
    setActiveTab("edit");
  };

  const handleNewTemplate = () => {
    setSelectedTemplate(null);
    setName("");
    setSlug("");
    setType("CUSTOM");
    setSubject("New Notification: {{form_name}}");
    setHtmlBody(`
      <h2>Notification for {{form_name}}</h2>
      <p>A new form was submitted on <strong>{{submission_date}}</strong> (Ref: <strong>{{submission_id}}</strong>).</p>
      {{fields_table}}
    `);
    setPlainTextBody("New notification received: {{submission_id}}");
    setIsEditing(true);
    setActiveTab("edit");
  };

  const handleInsertVariable = (varName: string) => {
    const token = `{{${varName}}}`;
    setHtmlBody((prev) => prev + token);
    showToast("success", `Inserted ${token}`);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const isNew = !selectedTemplate;
      const url = isNew ? "/api/email/templates" : `/api/email/templates/${selectedTemplate.id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug,
          type,
          subject,
          htmlBody,
          plainTextBody,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast("success", "Template saved successfully!");
        fetchTemplates();
        if (isNew) {
          setSelectedTemplate(data.template);
        }
      } else {
        showToast("error", data.error || "Failed to save template");
      }
    } catch (err: any) {
      showToast("error", err.message || "Network error");
    } finally {
      setSaving(false);
    }
  };

  const handleLoadPreview = async () => {
    setPreviewLoading(true);
    try {
      const res = await fetch("/api/email/templates/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          htmlBody,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPreviewHtml(data.html);
        setPreviewSubject(data.subject);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testTo) return;
    setSendingTest(true);
    try {
      const res = await fetch("/api/email/test-send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: testTo,
          subject: `[TEMPLATE TEST] ${previewSubject || subject}`,
          message: plainTextBody || "Email template preview verification",
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("success", `Test email dispatched to ${testTo}`);
        setTestModalOpen(false);
      } else {
        showToast("error", data.error || "Failed to send");
      }
    } catch (err: any) {
      showToast("error", err.message);
    } finally {
      setSendingTest(false);
    }
  };

  const availableVariables = [
    { key: "student_name", label: "Student Name", group: "Student" },
    { key: "parent_name", label: "Parent / Guardian", group: "Student" },
    { key: "grade_applying", label: "Grade Applying", group: "Student" },
    { key: "class", label: "Class", group: "Student" },
    { key: "email", label: "Email Address", group: "Contact" },
    { key: "phone", label: "Mobile / Phone", group: "Contact" },
    { key: "name", label: "Full Name", group: "Contact" },
    { key: "message", label: "Message / Query", group: "Message" },
    { key: "form_name", label: "Form Title", group: "System" },
    { key: "submission_id", label: "Submission Reference", group: "System" },
    { key: "submission_date", label: "Submission Date & Time", group: "System" },
    { key: "fields_table", label: "Complete Submitted Fields Table", group: "System" },
    { key: "site_name", label: "School Name", group: "System" },
  ];

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
              <span>Email Templates</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight flex items-center gap-3">
              <FileCode className="w-8 h-8 text-amber-400" />
              Email Template Studio
            </h1>
            <p className="text-sm text-slate-200 mt-1 font-medium">
              Design, customize, preview, and test branded notification templates for every website form.
            </p>
          </div>

          <button
            type="button"
            onClick={handleNewTemplate}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-400/20 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Custom Template</span>
          </button>
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
            className="px-4 py-2 rounded-xl text-xs font-black bg-amber-400 text-slate-950 shadow-md flex items-center gap-2"
          >
            <Mail className="w-3.5 h-3.5 text-slate-950" />
            <span>Email Templates</span>
          </Link>
          <Link
            href="/admin/communications/notifications"
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700 transition-all flex items-center gap-2"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Form Notifications</span>
          </Link>
          <Link
            href="/admin/communications/logs"
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700 transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
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

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Template List (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
                Available Templates ({templates.length})
              </span>
            </div>

            <div className="space-y-2.5 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
              {templates.map((tpl) => {
                const isSelected = selectedTemplate?.id === tpl.id;
                return (
                  <div
                    key={tpl.id}
                    onClick={() => handleSelectTemplate(tpl)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-gradient-to-r from-blue-900/80 to-slate-900 border-amber-400 text-white shadow-lg ring-1 ring-amber-400/50"
                        : "bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700 hover:bg-slate-900"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-extrabold text-sm text-white leading-snug">{tpl.name}</div>
                      <span
                        className={`text-[10px] font-black px-2.5 py-0.5 rounded-full flex-shrink-0 ${
                          tpl.type === "FORM_NOTIFICATION"
                            ? "bg-blue-500/20 text-blue-300 border border-blue-400/40"
                            : tpl.type === "FORM_CONFIRMATION"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40"
                            : "bg-amber-500/20 text-amber-300 border border-amber-400/40"
                        }`}
                      >
                        {tpl.type.replace(/_/g, " ")}
                      </span>
                    </div>
                    <p className="text-xs text-slate-200 truncate mt-1.5 font-medium">{tpl.subject}</p>
                    {tpl.isSystem && (
                      <span className="text-[10px] text-amber-300 font-bold mt-1.5 block">
                        ★ System Template
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Template Editor & Preview (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {isEditing ? (
            <div className="p-6 sm:p-7 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
              {/* Editor Tabs */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("edit")}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                      activeTab === "edit"
                        ? "bg-amber-400 text-slate-950 shadow"
                        : "text-slate-200 hover:text-white bg-slate-950 hover:bg-slate-800 border border-slate-800"
                    }`}
                  >
                    Template Editor
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("preview");
                      handleLoadPreview();
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                      activeTab === "preview"
                        ? "bg-amber-400 text-slate-950 shadow"
                        : "text-slate-200 hover:text-white bg-slate-950 hover:bg-slate-800 border border-slate-800"
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Live Preview</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {activeTab === "preview" && (
                    <button
                      type="button"
                      onClick={() => setTestModalOpen(true)}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs flex items-center gap-1.5 shadow"
                    >
                      <Send className="w-3 h-3" />
                      <span>Send Test</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-lg flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{saving ? "Saving..." : "Save Template"}</span>
                  </button>
                </div>
              </div>

              {activeTab === "edit" ? (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-black text-white uppercase tracking-wider mb-2">
                        Template Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. New Admission Enquiry"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-semibold text-xs sm:text-sm focus:outline-none focus:border-amber-400"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-white uppercase tracking-wider mb-2">
                        Template Type
                      </label>
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-semibold text-xs sm:text-sm focus:outline-none focus:border-amber-400"
                      >
                        <option value="FORM_NOTIFICATION" className="bg-slate-900 text-white">Form Notification (Admin)</option>
                        <option value="FORM_CONFIRMATION" className="bg-slate-900 text-white">Form Confirmation (Visitor)</option>
                        <option value="SYSTEM" className="bg-slate-900 text-white">System Alert</option>
                        <option value="PASSWORD_RESET" className="bg-slate-900 text-white">Password Reset</option>
                        <option value="CUSTOM" className="bg-slate-900 text-white">Custom Template</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-white uppercase tracking-wider mb-2">
                      Email Subject (Supports Variables)
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. New Admission Enquiry: {{student_name}} - {{submission_id}}"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm font-semibold focus:outline-none focus:border-amber-400"
                      required
                    />
                  </div>

                  {/* SECTION 28: AVAILABLE VARIABLES UI PANEL */}
                  <div className="p-4 sm:p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Dynamic Template Variables</span>
                      </span>
                      <span className="text-xs text-slate-300 font-bold">Click any variable to append to HTML</span>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {availableVariables.map((v) => (
                        <button
                          key={v.key}
                          type="button"
                          onClick={() => handleInsertVariable(v.key)}
                          className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-amber-400 hover:text-slate-950 text-amber-300 text-xs font-mono font-bold border border-slate-700 hover:border-amber-400 transition-colors flex items-center gap-1 shadow-sm"
                        >
                          <span>{`{{${v.key}}}`}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* HTML Body Editor */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Code className="w-3.5 h-3.5 text-blue-400" />
                        <span>HTML Template Body</span>
                      </label>
                      <span className="text-xs text-slate-300 font-medium">
                        Automatically wrapped in the Cambridge branded layout
                      </span>
                    </div>
                    <textarea
                      value={htmlBody}
                      onChange={(e) => setHtmlBody(e.target.value)}
                      rows={12}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs sm:text-sm font-mono focus:outline-none focus:border-amber-400 leading-relaxed shadow-inner"
                      required
                    />
                  </div>

                  {/* Plain Text Body */}
                  <div>
                    <label className="block text-xs font-black text-white uppercase tracking-wider mb-2">
                      Plain Text Fallback (Optional)
                    </label>
                    <textarea
                      value={plainTextBody}
                      onChange={(e) => setPlainTextBody(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              ) : (
                /* SECTION 27: LIVE PREVIEW TAB */
                <div className="space-y-4">
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400 font-bold uppercase tracking-wider">Subject: </span>
                      <span className="text-white font-extrabold text-sm ml-1">{previewSubject || subject}</span>
                    </div>
                    <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/40">
                      Sample Data Active
                    </span>
                  </div>

                  {previewLoading ? (
                    <div className="p-12 text-center text-slate-200 text-sm font-semibold">
                      Rendering live preview...
                    </div>
                  ) : (
                    <div className="border border-slate-700 rounded-2xl overflow-hidden bg-white shadow-2xl">
                      <iframe
                        srcDoc={previewHtml}
                        title="Email Preview"
                        className="w-full min-h-[550px] border-0"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4 shadow-xl">
              <Mail className="w-12 h-12 text-amber-400 mx-auto" />
              <div>
                <h3 className="text-lg font-black text-white">Select a Template to Edit</h3>
                <p className="text-sm text-slate-200 mt-1 max-w-sm mx-auto font-medium">
                  Choose any default template from the left column or create a brand new custom template for any school form.
                </p>
              </div>
              <button
                type="button"
                onClick={handleNewTemplate}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-400/20"
              >
                Create Custom Template
              </button>
            </div>
          )}
        </div>
      </div>

      {/* SEND TEST MODAL FROM PREVIEW */}
      {testModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 sm:p-7 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-white font-black text-base">Send Template Test</span>
              <button onClick={() => setTestModalOpen(false)} className="text-slate-300 hover:text-white font-bold text-lg">✕</button>
            </div>
            <form onSubmit={handleSendTest} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-white uppercase tracking-wider mb-2">
                  Recipient Email <span className="text-rose-400">*</span>
                </label>
                <input
                  type="email"
                  value={testTo}
                  onChange={(e) => setTestTo(e.target.value)}
                  placeholder="admin@school.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono font-semibold text-xs sm:text-sm focus:outline-none focus:border-amber-400"
                  required
                />
              </div>
              <p className="text-xs text-slate-200 font-medium">
                Dispatches a live test email rendered with sample student data so you can verify how it looks on mobile and desktop email clients.
              </p>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setTestModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingTest}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-lg disabled:opacity-50"
                >
                  {sendingTest ? "Sending..." : "Dispatch Test"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
