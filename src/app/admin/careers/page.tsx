"use client";

import React, { useState, useEffect } from "react";
import { Briefcase, Plus, Users, CheckCircle2, X, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function AdminCareersPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/careers");
      const data = await res.json();
      if (data.jobs) setJobs(data.jobs);
    } catch (err) {
      console.error("Failed to load jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
            Recruitment & HR
          </span>
          <h1 className="text-2xl font-bold font-heading text-white">
            Job Openings & Applicant Submissions ({jobs.length})
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.map((j) => (
          <div key={j.id} className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="bg-blue-950 text-blue-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-800">
                {j.department}
              </span>
              <span className="text-xs text-emerald-400 font-bold">
                {j.applications?.length || 0} Applicants
              </span>
            </div>
            <h3 className="font-bold text-base text-white">{j.title}</h3>
            <p className="text-xs text-slate-400">{j.description}</p>
            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800">
              <p><strong>Qualification:</strong> {j.qualification}</p>
              <p><strong>Experience:</strong> {j.experience}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
