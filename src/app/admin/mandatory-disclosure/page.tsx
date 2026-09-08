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
            Upload PDF certificates and update statutory school information. All changes sync to the public disclosure page.
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
          { id: "C", label: "C: Results & Academics", icon: GraduationCap },
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

      {/* TAB B: STATUTORY DOCUMENTS UPLOADER */}
      {activeTab === "B" && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <span>B : DOCUMENTS AND INFORMATION (UPLOAD STATUTORY CERTIFICATES)</span>
              </h2>
              <p className="text-xs text-slate-400">
                Upload verified scanned PDF certificates for all 8 mandatory compliance categories.
              </p>
            </div>
            <span className="text-xs bg-amber-400/10 text-amber-400 border border-amber-400/30 px-3 py-1 rounded-full font-bold">
              PDF & Documents
            </span>
          </div>

          <div className="space-y-4">
            {data.documents.map((doc, idx) => {
              const isUploading = uploadingIdx === `documents-${idx}`;
              const hasFile = Boolean(doc.docUrl);
              return (
                <div
                  key={idx}
                  className="bg-slate-950/80 border border-slate-800 hover:border-slate-700 p-4 sm:p-5 rounded-2xl transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start space-x-3">
                      <span className="w-7 h-7 rounded-xl bg-school-secondary/20 text-school-secondary font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div>
                        <h3 className="font-bold text-xs sm:text-sm text-white leading-snug">
                          {doc.title}
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-0.5 truncate max-w-md sm:max-w-xl font-mono">
                          Current File: {doc.docUrl || "No file uploaded yet"}
                        </p>
                      </div>
                    </div>

                    {/* Actions Row */}
                    <div className="flex items-center space-x-2.5 sm:self-center">
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

                      <label className="cursor-pointer inline-flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-4 py-2 rounded-xl shadow transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isUploading ? "Uploading..." : "Upload New PDF"}</span>
                        <input
                          type="file"
                          accept=".pdf,application/pdf"
                          onChange={(e) => handleDocumentUpload("documents", idx, e)}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Manual URL Input Fallback */}
                  <div className="pt-2 border-t border-slate-800/60 flex items-center space-x-2 text-xs">
                    <span className="text-[10px] text-slate-500 font-semibold uppercase">Or Direct URL:</span>
                    <input
                      type="text"
                      value={doc.docUrl}
                      onChange={(e) => {
                        const updatedDocs = [...data.documents];
                        updatedDocs[idx].docUrl = e.target.value;
                        setData({ ...data, documents: updatedDocs });
                      }}
                      placeholder="e.g. /sample-documents/document.pdf or https://..."
                      className="flex-1 bg-slate-900 text-slate-300 p-2 rounded-lg border border-slate-800 text-xs font-mono focus:border-school-secondary focus:outline-none"
                    />
                  </div>
                </div>
              );
            })}
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
            <p className="text-xs text-slate-400">
              Fee structure, annual academic calendar, SMC, PTA committee lists, and 3-year board performance records.
            </p>
          </div>

          {/* Academic Documents */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              1. Statutory Academic Documents & Committee Lists
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.academicResults.documents.map((acadDoc, aIdx) => {
                const isUploading = uploadingIdx === `academicDocs-${aIdx}`;
                return (
                  <div
                    key={aIdx}
                    className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white">
                        {acadDoc.slNo}. {acadDoc.title}
                      </span>
                      {acadDoc.docUrl && (
                        <a
                          href={acadDoc.docUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-xs font-bold"
                        >
                          View
                        </a>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={acadDoc.docUrl}
                        onChange={(e) => {
                          const updated = [...data.academicResults.documents];
                          updated[aIdx].docUrl = e.target.value;
                          setData({
                            ...data,
                            academicResults: {
                              ...data.academicResults,
                              documents: updated,
                            },
                          });
                        }}
                        className="flex-1 bg-slate-900 text-slate-200 p-2 rounded-xl border border-slate-800 text-xs font-mono"
                        placeholder="Document URL..."
                      />
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
