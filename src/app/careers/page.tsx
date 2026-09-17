"use client";

import React, { useState, useEffect } from "react";
import PageHeader from "@/components/ui/PageHeader";
import { Briefcase, Send, CheckCircle2, Sparkles, MapPin, Clock, ArrowRight, Loader2, User, Mail, Phone, FileText } from "lucide-react";
import DynamicFormRenderer from "@/components/common/DynamicFormRenderer";

interface Job {
  id: string;
  title: string;
  department: string;
  qualification: string;
  experience: string;
  type: string;
  vacancies: number;
  description: string;
  requirements: string;
}

export default function CareersPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  useEffect(() => {
    async function loadJobs() {
      try {
        const res = await fetch("/api/careers");
        const data = await res.json();
        if (data.jobs) {
          setJobs(data.jobs);
          if (data.jobs.length > 0) setSelectedJob(data.jobs[0]);
        }
      } catch (err) {
        console.error("Failed to load jobs:", err);
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
  }, []);

  return (
    <div>
      <PageHeader
        badge="Join Our Team"
        title="Careers & Educator Opportunities"
        description="Inspire the next generation. Join a dynamic, supportive faculty team at Himachal's leading international school."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Careers" },
        ]}
      />

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-12 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Job Openings List */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-xl font-bold text-school-primary dark:text-white flex items-center space-x-2">
              <Briefcase className="w-5 h-5 text-amber-500" />
              <span>Current Openings ({jobs.length})</span>
            </h2>

            {loading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="h-32 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl" />
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="p-8 bg-slate-50 dark:bg-slate-900 rounded-2xl text-center text-slate-400 text-sm border border-slate-200 dark:border-slate-800">
                No active vacancies currently. You may still submit your application below for general consideration.
              </div>
            ) : (
              jobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className={`p-6 rounded-2xl border transition-all cursor-pointer ${
                    selectedJob?.id === job.id
                      ? "bg-white dark:bg-slate-850 border-school-secondary ring-2 ring-school-secondary/30 shadow-lg"
                      : "glass-card border-slate-200 dark:border-slate-800 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-school-secondary uppercase tracking-wider bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                        {job.department}
                      </span>
                      <h3 className="text-base font-bold text-school-primary dark:text-white mt-1">
                        {job.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        <strong>Experience:</strong> {job.experience} | <strong>Vacancies:</strong> {job.vacancies}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full">
                      Active
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right: Dynamic Career Application Form */}
          <div className="lg:col-span-7 space-y-6">
            {selectedJob && (
              <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">
                    Selected Position: {selectedJob.department}
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    {selectedJob.type || "Full Time"}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-school-primary dark:text-white">
                  {selectedJob.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedJob.description}
                </p>
                <div className="flex flex-wrap gap-4 text-xs pt-1 border-t border-slate-100 dark:border-slate-800 text-slate-500">
                  <span><strong>Qualification:</strong> {selectedJob.qualification}</span>
                  <span><strong>Experience:</strong> {selectedJob.experience}</span>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-school-primary dark:text-white">
                Submit Online Faculty Application
              </h3>
              <DynamicFormRenderer formSlug="careers-apply" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
