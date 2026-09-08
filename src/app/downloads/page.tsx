"use client";

import React, { useState, useEffect } from "react";
import PageHeader from "@/components/ui/PageHeader";
import { Download, FileText, Search, Filter, ShieldCheck, CheckCircle2 } from "lucide-react";

interface DocItem {
  id: string;
  title: string;
  category: string;
  docNumber?: string;
  fileUrl: string;
  fileType: string;
  fileSize?: string;
  targetAudience: string;
  publishedDate: string;
}

export default function DownloadsPage() {
  const [docs, setDocs] = useState<DocItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCat, setSelectedCat] = useState("ALL");

  useEffect(() => {
    async function loadDocs() {
      try {
        const res = await fetch("/api/documents");
        const data = await res.json();
        if (data.documents) {
          setDocs(data.documents);
        }
      } catch (err) {
        console.error("Failed to load documents:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDocs();
  }, []);

  const categories = [
    { label: "All Documents", key: "ALL" },
    { label: "CBSE Disclosure", key: "MANDATORY_DISCLOSURE" },
    { label: "Prospectus", key: "PROSPECTUS" },
    { label: "Circulars & Notices", key: "CIRCULAR" },
    { label: "Forms & Fee", key: "FORM" },
    { label: "Book Lists", key: "BOOK_LIST" },
    { label: "Policies & TC", key: "CBSE_DOC" },
  ];

  const filteredDocs = docs.filter((d) => {
    const matchCat = selectedCat === "ALL" || d.category === selectedCat;
    const matchSearch =
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.docNumber && d.docNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div>
      <PageHeader
        badge="Official Repository"
        title="Downloads, Circulars & Documents"
        description="Search, view, and download official academic circulars, CBSE disclosure forms, syllabus, book lists, and policies."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Downloads" },
        ]}
      />

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-12 space-y-8">
        {/* Controls: Search + Categories */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search circulars, syllabus, forms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-slate-850 text-slate-900 dark:text-white pl-10 pr-4 py-2.5 text-xs rounded-2xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-school-secondary shadow-sm"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {categories.map((c) => (
              <button
                key={c.key}
                onClick={() => setSelectedCat(c.key)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCat === c.key
                    ? "bg-school-primary text-amber-400 dark:bg-school-secondary dark:text-white shadow-md"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Documents Table */}
        <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead className="bg-school-primary text-white">
              <tr>
                <th className="p-4 font-bold">Document Title & Details</th>
                <th className="p-4 font-bold hidden sm:table-cell">Document No.</th>
                <th className="p-4 font-bold hidden md:table-cell">Category</th>
                <th className="p-4 font-bold hidden lg:table-cell">File Size</th>
                <th className="p-4 font-bold text-right">Download</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    Loading documents...
                  </td>
                </tr>
              ) : filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    No documents matching your search criteria.
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-school-secondary flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-school-primary dark:text-white">{doc.title}</p>
                          <p className="text-[11px] text-slate-400">Target: {doc.targetAudience}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-xs text-slate-500 hidden sm:table-cell">
                      {doc.docNumber || "—"}
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg text-xs font-semibold">
                        {doc.category.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400 text-xs hidden lg:table-cell">
                      {doc.fileSize || "PDF"}
                    </td>
                    <td className="p-4 text-right">
                      <a
                        href={doc.fileUrl}
                        download
                        className="inline-flex items-center space-x-1.5 bg-school-secondary hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
