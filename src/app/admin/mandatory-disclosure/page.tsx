"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Save,
  Upload,
  Eye,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Building2,
  Users,
  GraduationCap,
  Download,
  AlertCircle,
  Sparkles,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  RotateCcw,
  Edit3,
} from "lucide-react";
import Link from "next/link";

interface DocItem {
  slNo: number;
  title: string;
  docUrl: string;
}

interface DisclosureData {
  schoolName: string;
  affiliationNo: string;
  schoolCode: string;
  address: string;
  principalName: string;
  principalQualification: string;
  schoolEmail: string;
  contactDetails: string;
  documents: DocItem[];
  academicResults: {
    documents: DocItem[];
    classXResults: any[];
    classXIIResults: any[];
  };
  staffInfo: {
    principal: string;
    totalTeachers: string;
    pgt: string;
    tgt: string;
    prt: string;
    pet: string;
    teacherSectionRatio: string;
    specialEducator: string;
    counsellor: string;
  };
  infrastructure: {
    campusAreaSqMtr: string;
    builtUpAreaSqMtr: string;
    classroomsCount: string;
    laboratoriesCount: string;
    internetFacility: string;
    girlsToilets: string;
    boysToilets: string;
    inspectionVideoUrl: string;
  };
}

export default function AdminMandatoryDisclosure() {
  const [data, setData] = useState<DisclosureData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [uploadingIdx, setUploadingIdx] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"A" | "B" | "C" | "D" | "E">("B");

  useEffect(() => {
    async function loadDisclosure() {
      try {
        const res = await fetch("/api/mandatory-disclosure");
        const json = await res.json();
        if (json.disclosure) {
          setData(json.disclosure);
        }
      } catch (err) {
        console.error("Failed to load mandatory disclosure:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDisclosure();
  }, []);

  const handleDocumentUpload = async (
    targetType: "documents" | "academicDocs",
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || !data) return;

    setUploadingIdx(`${targetType}-${index}`);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const uploadJson = await res.json();

      if (uploadJson.url) {
        if (targetType === "documents") {
          const updatedDocs = [...data.documents];
          updatedDocs[index].docUrl = uploadJson.url;
          setData({ ...data, documents: updatedDocs });
        } else {
          const updatedAcadDocs = [...data.academicResults.documents];
          updatedAcadDocs[index].docUrl = uploadJson.url;
          setData({
            ...data,
            academicResults: {
              ...data.academicResults,
              documents: updatedAcadDocs,
            },
          });
        }
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploadingIdx(null);
    }
  };

  // Section B Documents Handlers (Add, Modify, Delete, Move, Reset)
  const handleAddDocument = () => {
    if (!data) return;
    const newDoc: DocItem = {
      slNo: data.documents.length + 1,
      title: "NEW STATUTORY CERTIFICATE / COMPLIANCE DOCUMENT",
      docUrl: "",
    };
    setData({
      ...data,
      documents: [...data.documents, newDoc],
    });
  };

  const handleUpdateDocument = (index: number, updates: Partial<DocItem>) => {
    if (!data) return;
    const updated = [...data.documents];
    updated[index] = { ...updated[index], ...updates };
    setData({ ...data, documents: updated });
  };

  const handleDeleteDocument = (index: number) => {
    if (!data) return;
    if (confirm("Are you sure you want to delete this document entry?")) {
      const updated = data.documents.filter((_, idx) => idx !== index);
      setData({ ...data, documents: updated });
    }
  };

  const handleMoveDocument = (index: number, direction: "up" | "down") => {
    if (!data) return;
    const updated = [...data.documents];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= updated.length) return;
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setData({ ...data, documents: updated });
  };

  const handleResetDefaultDocuments = () => {
    if (!data) return;
    if (
      confirm(
        "Reset to standard 8 CBSE Appendix-IX statutory categories? Existing custom items will be restored to defaults."
      )
    ) {
      setData({
        ...data,
        documents: [
          {
            slNo: 1,
            title:
              "COPIES OF AFFILIATION/UPGRADATION LETTER AND RECENT EXTENSIONOF AFFILIATION, IF ANY",
            docUrl: "/sample-documents/CBSE_Mandatory_Disclosure_CIS_Mandi.pdf",
          },
          {
            slNo: 2,
            title:
              "COPIES OF SOCIETIES/TRUST/COMPANY REGISTRATION/RENEWAL CERTIFICATE, AS APPLICABLE",
            docUrl: "/sample-documents/CBSE_Mandatory_Disclosure_CIS_Mandi.pdf",
          },
          {
            slNo: 3,
            title:
              "COPY OF NO OBJECTION CERTIFICATE (NOC) ISSUED, IF APPLICABLE, BYTHE STATE GOVT./UT",
            docUrl: "/sample-documents/CBSE_Mandatory_Disclosure_CIS_Mandi.pdf",
          },
          {
            slNo: 4,
            title:
              "COPIES OF RECOGNITION CERTIFICATE UNDER RTE ACT, 2009, AND IT'SRENEWAL IF APPLICABLE",
            docUrl: "/sample-documents/CBSE_Mandatory_Disclosure_CIS_Mandi.pdf",
          },
          {
            slNo: 5,
            title:
              "COPY OF VALID BUILDING SAFETY CERTIFICATE AS PER THE NATIONAL BUILDING CODE",
            docUrl: "/sample-documents/CBSE_Mandatory_Disclosure_CIS_Mandi.pdf",
          },
          {
            slNo: 6,
            title:
              "COPY OF VALID FIRE SAFETY CERTIFICATE ISSUED BY THE COMPETENT AUTHORITY",
            docUrl: "/sample-documents/CBSE_Mandatory_Disclosure_CIS_Mandi.pdf",
          },
          {
            slNo: 7,
            title:
              "COPY OF THE DEO CERTIFICATE SUBMITTED BY THE SCHOOL FOR AFFILIATION/UPGRADATION/EXTENSION OF AFFILIATION OR SELF CERTIFICATION BY SCHOOL",
            docUrl: "/sample-documents/CBSE_Mandatory_Disclosure_CIS_Mandi.pdf",
          },
          {
            slNo: 8,
            title: "COPIES OF VALID WATER, HEALTH AND SANITATION CERTIFICATES",
            docUrl: "/sample-documents/CBSE_Mandatory_Disclosure_CIS_Mandi.pdf",
          },
        ],
      });
    }
  };

  // Section C Academic Documents Handlers
  const handleAddAcademicDoc = () => {
    if (!data) return;
    const newDoc: DocItem = {
      slNo: (data.academicResults.documents || []).length + 1,
      title: "NEW ACADEMIC DOCUMENT / COMMITTEE LIST",
      docUrl: "",
    };
    setData({
      ...data,
      academicResults: {
        ...data.academicResults,
        documents: [...(data.academicResults.documents || []), newDoc],
      },
    });
  };

  const handleUpdateAcademicDoc = (index: number, updates: Partial<DocItem>) => {
    if (!data) return;
    const updated = [...data.academicResults.documents];
    updated[index] = { ...updated[index], ...updates };
    setData({
      ...data,
      academicResults: {
        ...data.academicResults,
        documents: updated,
      },
    });
  };

  const handleDeleteAcademicDoc = (index: number) => {
    if (!data) return;
    if (confirm("Are you sure you want to delete this academic document entry?")) {
      const updated = data.academicResults.documents.filter((_, idx) => idx !== index);
      setData({
        ...data,
        academicResults: {
          ...data.academicResults,
          documents: updated,
        },
      });
    }
  };

  const handleMoveAcademicDoc = (index: number, direction: "up" | "down") => {
    if (!data) return;
    const updated = [...data.academicResults.documents];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= updated.length) return;
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setData({
      ...data,
      academicResults: {
        ...data.academicResults,
        documents: updated,
      },
    });
  };

  // Section C Board Exam Results (Class X & XII) Handlers
  const handleAddResultRow = (grade: "X" | "XII") => {
    if (!data) return;
    const newRow = {
      year: "2024-2025",
      registered: 100,
      passed: 100,
      passPct: "100%",
      remarks: "100% Pass Rate",
    };
    if (grade === "X") {
      setData({
        ...data,
        academicResults: {
          ...data.academicResults,
          classXResults: [newRow, ...(data.academicResults.classXResults || [])],
        },
      });
    } else {
      setData({
        ...data,
        academicResults: {
          ...data.academicResults,
          classXIIResults: [newRow, ...(data.academicResults.classXIIResults || [])],
        },
      });
    }
  };

  const handleUpdateResultRow = (grade: "X" | "XII", index: number, updates: any) => {
    if (!data) return;
    if (grade === "X") {
      const updated = [...(data.academicResults.classXResults || [])];
      updated[index] = { ...updated[index], ...updates };
      setData({
        ...data,
        academicResults: {
          ...data.academicResults,
          classXResults: updated,
        },
      });
    } else {
      const updated = [...(data.academicResults.classXIIResults || [])];
      updated[index] = { ...updated[index], ...updates };
      setData({
        ...data,
        academicResults: {
          ...data.academicResults,
          classXIIResults: updated,
        },
      });
    }
  };

  const handleDeleteResultRow = (grade: "X" | "XII", index: number) => {
    if (!data) return;
    if (grade === "X") {
      const updated = (data.academicResults.classXResults || []).filter((_, idx) => idx !== index);
      setData({
        ...data,
        academicResults: {
          ...data.academicResults,
          classXResults: updated,
        },
      });
    } else {
      const updated = (data.academicResults.classXIIResults || []).filter((_, idx) => idx !== index);
      setData({
        ...data,
        academicResults: {
          ...data.academicResults,
          classXIIResults: updated,
        },
      });
    }
  };

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/mandatory-disclosure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 4000);
      }
    } catch (err) {
      console.error("Failed to save disclosure:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-school-secondary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white font-heading">
              CBSE Appendix-IX Mandatory Disclosure Manager
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Add, modify, and delete statutory certificates, PDF documents, and compliance records. All changes sync in real-time to the public disclosure page.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/mandatory-disclosure"
            target="_blank"
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors border border-slate-700"
          >
            <Eye className="w-3.5 h-3.5 text-school-secondary" />
            <span>View Live Page</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </Link>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-school-secondary to-blue-600 hover:from-blue-600 hover:to-school-primary text-white text-xs font-black px-6 py-2.5 rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50"
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Saved Successfully!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{saving ? "Saving Changes..." : "Save Public Disclosure"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        {[
          { id: "A", label: "A: General Info", icon: Building2 },
          { id: "B", label: "B: Statutory Documents (Upload PDFs)", icon: FileText, count: data.documents.length },
          { id: "C", label: "C: Results & Academics", icon: GraduationCap, count: (data.academicResults?.documents || []).length },
          { id: "D", label: "D: Teaching Staff", icon: Users },
          { id: "E", label: "E: Infrastructure", icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? "bg-school-secondary text-white shadow-lg"
                  : "bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800/80"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-amber-300" : "text-slate-400"}`} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className="bg-black/30 px-2 py-0.5 rounded-full text-[10px] text-amber-300 font-mono">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB A: GENERAL INFORMATION */}
      {activeTab === "A" && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-amber-400" />
              <span>A : GENERAL INFORMATION</span>
            </h2>
            <p className="text-xs text-slate-400">
              Basic statutory identity details as per CBSE SARAS registration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">1. NAME OF THE SCHOOL *</label>
              <input
                type="text"
                value={data.schoolName}
                onChange={(e) => setData({ ...data, schoolName: e.target.value })}
                className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 font-semibold focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">2. AFFILIATION NO. (CBSE) *</label>
              <input
                type="text"
                value={data.affiliationNo}
                onChange={(e) => setData({ ...data, affiliationNo: e.target.value })}
                className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 font-mono font-bold text-amber-400 focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">3. SCHOOL CODE *</label>
              <input
                type="text"
                value={data.schoolCode}
                onChange={(e) => setData({ ...data, schoolCode: e.target.value })}
                className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 font-mono font-bold focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">4. PRINCIPAL NAME *</label>
              <input
                type="text"
                value={data.principalName}
                onChange={(e) => setData({ ...data, principalName: e.target.value })}
                className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 font-semibold focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">5. PRINCIPAL QUALIFICATION *</label>
              <input
                type="text"
                value={data.principalQualification}
                onChange={(e) => setData({ ...data, principalQualification: e.target.value })}
                className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">6. SCHOOL EMAIL ID *</label>
              <input
                type="email"
                value={data.schoolEmail}
                onChange={(e) => setData({ ...data, schoolEmail: e.target.value })}
                className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 font-mono focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">7. CONTACT DETAILS (LANDLINE/MOBILE) *</label>
              <input
                type="text"
                value={data.contactDetails}
                onChange={(e) => setData({ ...data, contactDetails: e.target.value })}
                className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 font-semibold focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="font-semibold text-slate-300">8. COMPLETE ADDRESS WITH PIN CODE *</label>
              <textarea
                rows={2}
                value={data.address}
                onChange={(e) => setData({ ...data, address: e.target.value })}
                className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 focus:border-amber-400 focus:outline-none leading-relaxed"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB B: STATUTORY DOCUMENTS UPLOADER & MANAGER */}
      {activeTab === "B" && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <span>B : DOCUMENTS AND INFORMATION (UPLOAD STATUTORY CERTIFICATES)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Add, modify certificate titles, upload scanned PDFs, reorder, or delete compliance categories.
              </p>
            </div>

            {/* Quick Actions Header */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleResetDefaultDocuments}
                className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
                title="Restore default 8 CBSE statutory categories"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span>Reset to CBSE Defaults</span>
              </button>

              <button
                type="button"
                onClick={handleAddDocument}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow-lg transition-transform hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                <span>Add Statutory Document</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {data.documents.map((doc, idx) => {
              const isUploading = uploadingIdx === `documents-${idx}`;
              const hasFile = Boolean(doc.docUrl);
              return (
                <div
                  key={idx}
                  className="bg-slate-950/90 border border-slate-800 hover:border-slate-700 p-4 sm:p-5 rounded-2xl transition-all space-y-4 shadow-sm"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Index Badge & Editable Document Title */}
                    <div className="flex items-start space-x-3 flex-1">
                      <span className="w-8 h-8 rounded-xl bg-school-secondary/20 text-school-secondary font-black text-xs flex items-center justify-center flex-shrink-0 mt-1 border border-school-secondary/30">
                        {idx + 1}
                      </span>
                      <div className="flex-1 space-y-1.5">
                        <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
                          <Edit3 className="w-3 h-3 text-amber-400" />
                          <span>Document / Compliance Category Title (Click to Edit)</span>
                        </label>
                        <input
                          type="text"
                          value={doc.title}
                          onChange={(e) => handleUpdateDocument(idx, { title: e.target.value })}
                          placeholder="e.g. COPIES OF AFFILIATION/UPGRADATION LETTER..."
                          className="w-full bg-[#051329] text-white font-bold text-xs sm:text-sm p-2.5 rounded-xl border border-slate-700 focus:border-amber-400 focus:outline-none"
                        />
                        <p className="text-[11px] text-slate-400 font-mono truncate max-w-xl">
                          File: {doc.docUrl || "No file uploaded yet"}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons: View, Upload, Move Up/Down, Delete */}
                    <div className="flex flex-wrap items-center gap-2 self-end lg:self-center">
                      {/* Reorder Up/Down */}
                      <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                        <button
                          type="button"
                          onClick={() => handleMoveDocument(idx, "up")}
                          disabled={idx === 0}
                          className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 rounded-lg hover:bg-slate-800"
                          title="Move Up"
                        >
                          <MoveUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveDocument(idx, "down")}
                          disabled={idx === data.documents.length - 1}
                          className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 rounded-lg hover:bg-slate-800"
                          title="Move Down"
                        >
                          <MoveDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {hasFile && (
                        <a
                          href={doc.docUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 text-blue-400 text-xs font-bold border border-blue-500/30 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>View PDF</span>
                        </a>
                      )}

                      <label className="cursor-pointer inline-flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-3.5 py-2 rounded-xl shadow transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isUploading ? "Uploading..." : "Upload PDF"}</span>
                        <input
                          type="file"
                          accept=".pdf,application/pdf"
                          onChange={(e) => handleDocumentUpload("documents", idx, e)}
                          className="hidden"
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => handleDeleteDocument(idx)}
                        className="inline-flex items-center space-x-1 px-3 py-2 bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 hover:text-rose-300 rounded-xl text-xs font-bold border border-rose-500/30 transition-colors"
                        title="Delete this document category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>

                  {/* Manual URL Input Fallback */}
                  <div className="pt-2 border-t border-slate-800/60 flex items-center space-x-2 text-xs">
                    <span className="text-[10px] text-slate-500 font-semibold uppercase whitespace-nowrap">
                      Or Direct PDF URL:
                    </span>
                    <input
                      type="text"
                      value={doc.docUrl}
                      onChange={(e) => handleUpdateDocument(idx, { docUrl: e.target.value })}
                      placeholder="e.g. /sample-documents/document.pdf or https://..."
                      className="flex-1 bg-slate-900 text-slate-300 p-2 rounded-lg border border-slate-800 text-xs font-mono focus:border-school-secondary focus:outline-none"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Add Document Button */}
          <div className="pt-4 border-t border-slate-800 flex justify-center">
            <button
              type="button"
              onClick={handleAddDocument}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-lg transition-transform hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Add Another Statutory Document Row</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB C: RESULT AND ACADEMICS */}
      {activeTab === "C" && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <GraduationCap className="w-5 h-5 text-amber-400" />
              <span>C : RESULT AND ACADEMICS (DOCUMENTS & BOARD PASS RATES)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Fee structure, annual academic calendar, SMC, PTA committee lists, and 3-year board performance records.
            </p>
          </div>

          {/* Academic Documents Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                1. Statutory Academic Documents & Committee Lists
              </h3>
              <button
                type="button"
                onClick={handleAddAcademicDoc}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold shadow transition-transform hover:scale-105"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Academic Document</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.academicResults.documents.map((acadDoc, aIdx) => {
                const isUploading = uploadingIdx === `academicDocs-${aIdx}`;
                return (
                  <div
                    key={aIdx}
                    className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-3 shadow-sm hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-2 flex-1">
                        <span className="w-6 h-6 rounded-lg bg-school-secondary/20 text-school-secondary font-bold text-xs flex items-center justify-center flex-shrink-0">
                          {aIdx + 1}
                        </span>
                        <input
                          type="text"
                          value={acadDoc.title}
                          onChange={(e) => handleUpdateAcademicDoc(aIdx, { title: e.target.value })}
                          placeholder="Document Title (e.g. FEE STRUCTURE)"
                          className="w-full bg-[#051329] text-white font-bold text-xs p-2 rounded-lg border border-slate-700 focus:border-amber-400 focus:outline-none"
                        />
                      </div>

                      <div className="flex items-center space-x-1">
                        <button
                          type="button"
                          onClick={() => handleMoveAcademicDoc(aIdx, "up")}
                          disabled={aIdx === 0}
                          className="p-1 text-slate-400 hover:text-white disabled:opacity-30 rounded hover:bg-slate-800"
                          title="Move Up"
                        >
                          <MoveUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveAcademicDoc(aIdx, "down")}
                          disabled={aIdx === data.academicResults.documents.length - 1}
                          className="p-1 text-slate-400 hover:text-white disabled:opacity-30 rounded hover:bg-slate-800"
                          title="Move Down"
                        >
                          <MoveDown className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAcademicDoc(aIdx)}
                          className="p-1 text-rose-400 hover:text-rose-300 rounded hover:bg-rose-500/20"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={acadDoc.docUrl}
                        onChange={(e) => handleUpdateAcademicDoc(aIdx, { docUrl: e.target.value })}
                        className="flex-1 bg-slate-900 text-slate-200 p-2 rounded-xl border border-slate-800 text-xs font-mono focus:outline-none focus:border-school-secondary"
                        placeholder="Document URL..."
                      />
                      {acadDoc.docUrl && (
                        <a
                          href={acadDoc.docUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-xs font-bold px-2 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20"
                        >
                          View
                        </a>
                      )}
                      <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-3 py-2 rounded-xl transition-colors flex items-center space-x-1 flex-shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isUploading ? "..." : "Upload"}</span>
                        <input
                          type="file"
                          accept=".pdf,application/pdf"
                          onChange={(e) => handleDocumentUpload("academicDocs", aIdx, e)}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Class X Results Table */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                2. Result Class X (Last 3-Year CBSE Board Record)
              </h3>
              <button
                type="button"
                onClick={() => handleAddResultRow("X")}
                className="inline-flex items-center space-x-1 px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold border border-slate-700"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Year Row</span>
              </button>
            </div>

            <div className="overflow-x-auto bg-slate-950 rounded-2xl border border-slate-800">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                  <tr>
                    <th className="p-3">Year</th>
                    <th className="p-3">Registered</th>
                    <th className="p-3">Passed</th>
                    <th className="p-3">Pass %</th>
                    <th className="p-3">Remarks</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {(data.academicResults.classXResults || []).map((row, rIdx) => (
                    <tr key={rIdx}>
                      <td className="p-2">
                        <input
                          type="text"
                          value={row.year}
                          onChange={(e) => handleUpdateResultRow("X", rIdx, { year: e.target.value })}
                          className="bg-slate-900 text-white p-1.5 rounded-lg border border-slate-800 text-xs w-28 font-mono"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          value={row.registered}
                          onChange={(e) =>
                            handleUpdateResultRow("X", rIdx, { registered: parseInt(e.target.value) || 0 })
                          }
                          className="bg-slate-900 text-white p-1.5 rounded-lg border border-slate-800 text-xs w-20 font-mono"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          value={row.passed}
                          onChange={(e) =>
                            handleUpdateResultRow("X", rIdx, { passed: parseInt(e.target.value) || 0 })
                          }
                          className="bg-slate-900 text-white p-1.5 rounded-lg border border-slate-800 text-xs w-20 font-mono"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={row.passPct}
                          onChange={(e) => handleUpdateResultRow("X", rIdx, { passPct: e.target.value })}
                          className="bg-slate-900 text-amber-400 font-bold p-1.5 rounded-lg border border-slate-800 text-xs w-20 font-mono"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={row.remarks}
                          onChange={(e) => handleUpdateResultRow("X", rIdx, { remarks: e.target.value })}
                          className="bg-slate-900 text-slate-300 p-1.5 rounded-lg border border-slate-800 text-xs w-full"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteResultRow("X", rIdx)}
                          className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Class XII Results Table */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                3. Result Class XII (Last 3-Year CBSE Board Record)
              </h3>
              <button
                type="button"
                onClick={() => handleAddResultRow("XII")}
                className="inline-flex items-center space-x-1 px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold border border-slate-700"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Year Row</span>
              </button>
            </div>

            <div className="overflow-x-auto bg-slate-950 rounded-2xl border border-slate-800">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                  <tr>
                    <th className="p-3">Year</th>
                    <th className="p-3">Registered</th>
                    <th className="p-3">Passed</th>
                    <th className="p-3">Pass %</th>
                    <th className="p-3">Remarks</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {(data.academicResults.classXIIResults || []).map((row, rIdx) => (
                    <tr key={rIdx}>
                      <td className="p-2">
                        <input
                          type="text"
                          value={row.year}
                          onChange={(e) => handleUpdateResultRow("XII", rIdx, { year: e.target.value })}
                          className="bg-slate-900 text-white p-1.5 rounded-lg border border-slate-800 text-xs w-28 font-mono"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          value={row.registered}
                          onChange={(e) =>
                            handleUpdateResultRow("XII", rIdx, { registered: parseInt(e.target.value) || 0 })
                          }
                          className="bg-slate-900 text-white p-1.5 rounded-lg border border-slate-800 text-xs w-20 font-mono"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          value={row.passed}
                          onChange={(e) =>
                            handleUpdateResultRow("XII", rIdx, { passed: parseInt(e.target.value) || 0 })
                          }
                          className="bg-slate-900 text-white p-1.5 rounded-lg border border-slate-800 text-xs w-20 font-mono"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={row.passPct}
                          onChange={(e) => handleUpdateResultRow("XII", rIdx, { passPct: e.target.value })}
                          className="bg-slate-900 text-amber-400 font-bold p-1.5 rounded-lg border border-slate-800 text-xs w-20 font-mono"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={row.remarks}
                          onChange={(e) => handleUpdateResultRow("XII", rIdx, { remarks: e.target.value })}
                          className="bg-slate-900 text-slate-300 p-1.5 rounded-lg border border-slate-800 text-xs w-full"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteResultRow("XII", rIdx)}
                          className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB D: TEACHING STAFF */}
      {activeTab === "D" && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Users className="w-5 h-5 text-amber-400" />
              <span>D : STAFF (TEACHING) DETAILS</span>
            </h2>
            <p className="text-xs text-slate-400">
              Staff headcount, qualification breakdown, teacher-section ratio, and student wellness counselors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">1. PRINCIPAL DETAILS</label>
              <input
                type="text"
                value={data.staffInfo.principal}
                onChange={(e) =>
                  setData({
                    ...data,
                    staffInfo: { ...data.staffInfo, principal: e.target.value },
                  })
                }
                className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">2. TOTAL NO. OF TEACHERS</label>
              <input
                type="text"
                value={data.staffInfo.totalTeachers}
                onChange={(e) =>
                  setData({
                    ...data,
                    staffInfo: { ...data.staffInfo, totalTeachers: e.target.value },
                  })
                }
                className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 font-mono font-bold text-amber-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">3. PGT TEACHERS COUNT</label>
              <input
                type="text"
                value={data.staffInfo.pgt}
                onChange={(e) =>
                  setData({
                    ...data,
                    staffInfo: { ...data.staffInfo, pgt: e.target.value },
                  })
                }
                className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">4. TGT TEACHERS COUNT</label>
              <input
                type="text"
                value={data.staffInfo.tgt}
                onChange={(e) =>
                  setData({
                    ...data,
                    staffInfo: { ...data.staffInfo, tgt: e.target.value },
                  })
                }
                className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">5. PRT TEACHERS COUNT</label>
              <input
                type="text"
                value={data.staffInfo.prt}
                onChange={(e) =>
                  setData({
                    ...data,
                    staffInfo: { ...data.staffInfo, prt: e.target.value },
                  })
                }
                className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">6. TEACHERS SECTION RATIO</label>
              <input
                type="text"
                value={data.staffInfo.teacherSectionRatio}
                onChange={(e) =>
                  setData({
                    ...data,
                    staffInfo: { ...data.staffInfo, teacherSectionRatio: e.target.value },
                  })
                }
                className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 font-bold"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="font-semibold text-slate-300">7. SPECIAL EDUCATOR DETAILS</label>
              <input
                type="text"
                value={data.staffInfo.specialEducator}
                onChange={(e) =>
                  setData({
                    ...data,
                    staffInfo: { ...data.staffInfo, specialEducator: e.target.value },
                  })
                }
                className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="font-semibold text-slate-300">8. COUNSELLOR & WELLNESS TEACHER</label>
              <input
                type="text"
                value={data.staffInfo.counsellor}
                onChange={(e) =>
                  setData({
                    ...data,
                    staffInfo: { ...data.staffInfo, counsellor: e.target.value },
                  })
                }
                className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB E: SCHOOL INFRASTRUCTURE */}
      {activeTab === "E" && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-amber-400" />
              <span>E : SCHOOL INFRASTRUCTURE SPECIFICATIONS</span>
            </h2>
            <p className="text-xs text-slate-400">
              Campus area in square meters, room counts, lab counts, sanitary facilities, and YouTube inspection video link.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">1. TOTAL CAMPUS AREA (IN SQ MTR) *</label>
              <input
                type="text"
                value={data.infrastructure.campusAreaSqMtr}
                onChange={(e) =>
                  setData({
                    ...data,
                    infrastructure: { ...data.infrastructure, campusAreaSqMtr: e.target.value },
                  })
                }
                className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 font-bold text-amber-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">2. NO. AND SIZE OF CLASS ROOMS (IN SQ FT/MTR) *</label>
              <input
                type="text"
                value={data.infrastructure.classroomsCount}
                onChange={(e) =>
                  setData({
                    ...data,
                    infrastructure: { ...data.infrastructure, classroomsCount: e.target.value },
                  })
                }
                className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">3. NO. AND SIZE OF LABORATORIES *</label>
              <input
                type="text"
                value={data.infrastructure.laboratoriesCount}
                onChange={(e) =>
                  setData({
                    ...data,
                    infrastructure: { ...data.infrastructure, laboratoriesCount: e.target.value },
                  })
                }
                className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">4. INTERNET FACILITY (Y/N & SPEED) *</label>
              <input
                type="text"
                value={data.infrastructure.internetFacility}
                onChange={(e) =>
                  setData({
                    ...data,
                    infrastructure: { ...data.infrastructure, internetFacility: e.target.value },
                  })
                }
                className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">5. NO. OF GIRLS TOILETS *</label>
              <input
                type="text"
                value={data.infrastructure.girlsToilets}
                onChange={(e) =>
                  setData({
                    ...data,
                    infrastructure: { ...data.infrastructure, girlsToilets: e.target.value },
                  })
                }
                className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">6. NO. OF BOYS TOILETS *</label>
              <input
                type="text"
                value={data.infrastructure.boysToilets}
                onChange={(e) =>
                  setData({
                    ...data,
                    infrastructure: { ...data.infrastructure, boysToilets: e.target.value },
                  })
                }
                className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="font-semibold text-slate-300">
                7. LINK OF YOUTUBE VIDEO OF THE INSPECTION OF SCHOOL COVERING INFRASTRUCTURE
              </label>
              <input
                type="url"
                value={data.infrastructure.inspectionVideoUrl}
                onChange={(e) =>
                  setData({
                    ...data,
                    infrastructure: { ...data.infrastructure, inspectionVideoUrl: e.target.value },
                  })
                }
                placeholder="https://youtu.be/..."
                className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 font-mono text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
