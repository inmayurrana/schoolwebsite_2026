"use client";

import React, { useState, useEffect } from "react";
import PageHeader from "@/components/ui/PageHeader";
import { Briefcase, Send, CheckCircle2, Sparkles, MapPin, Clock, ArrowRight, Loader2, User, Mail, Phone, FileText } from "lucide-react";

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
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    applicantName: "",
    email: "",
    phone: "",
    qualification: "",
    experience: "",
    currentCtc: "",
    expectedCtc: "",
    coverLetter: "",
    resumeUrl: "https://example.com/resume.pdf",
  });

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

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/careers/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: selectedJob.id,
          ...formData,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit application");
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

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
          <div className="lg:col-span-6 space-y-4">
            <h2 className="text-xl font-bold text-school-primary dark:text-white">
              Current Openings ({jobs.length})
            </h2>

            {loading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="h-32 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl" />
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="p-8 bg-slate-50 dark:bg-slate-900 rounded-2xl text-center text-slate-400 text-sm">
                No active vacancies currently. You may still email your resume to hr@cismandi.edu.in.
              </div>
            ) : (
              jobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => {
                    setSelectedJob(job);
                    setSubmitted(false);
                  }}
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

          {/* Right: Job Details & Application Form */}
          <div className="lg:col-span-6">
            {selectedJob ? (
              <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
                <div>
                  <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">
                    {selectedJob.department}
                  </span>
                  <h3 className="text-2xl font-bold text-school-primary dark:text-white mt-1">
                    {selectedJob.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                    {selectedJob.description}
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1 text-slate-700 dark:text-slate-300">
                  <p><strong>Minimum Qualification:</strong> {selectedJob.qualification}</p>
                  <p><strong>Work Experience:</strong> {selectedJob.experience}</p>
                </div>

                {submitted ? (
                  <div className="text-center py-8 space-y-3 bg-emerald-50 dark:bg-emerald-950/50 p-6 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                    <h4 className="font-bold text-slate-900 dark:text-white">Application Received!</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Our HR department will review your credentials and contact you for an interview.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleApply} className="space-y-4">
                    <h4 className="font-bold text-sm text-school-primary dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
                      Apply for this Position
                    </h4>

                    {error && (
                      <div className="p-3 bg-rose-50 text-rose-600 text-xs rounded-xl border border-rose-200">
                        {error}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Priya Sharma"
                          value={formData.applicantName}
                          onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                          className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="+91 98160..."
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="educator@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Educational Qualification & Experience Summary *
                      </label>
                      <textarea
                        rows={2}
                        required
                        placeholder="M.Sc. Physics, B.Ed. with 4 years CBSE teaching experience..."
                        value={formData.qualification}
                        onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full inline-flex items-center justify-center space-x-2 bg-school-secondary hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition-all"
                    >
                      {submitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Submit Job Application</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
