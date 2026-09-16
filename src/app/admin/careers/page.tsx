"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Briefcase,
  Plus,
  Users,
  CheckCircle2,
  X,
  Loader2,
  Edit2,
  Trash2,
  Search,
  Filter,
  Calendar,
  GraduationCap,
  Award,
  Mail,
  Phone,
  FileText,
  Download,
  ExternalLink,
  Eye,
  Check,
  Clock,
  Building2,
  UserCheck,
  UserX,
  ChevronRight,
  AlertTriangle,
  ArrowUpDown,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface JobOpening {
  id: string;
  title: string;
  department: string;
  qualification: string;
  experience: string;
  type: string;
  vacancies: number;
  deadline?: string | null;
  status: string;
  description: string;
  requirements: string;
  createdAt: string;
  applications?: any[];
}

interface JobApplication {
  id: string;
  jobId: string;
  applicantName: string;
  email: string;
  phone: string;
  qualification: string;
  experience: string;
  currentCtc?: string | null;
  expectedCtc?: string | null;
  coverLetter?: string | null;
  resumeUrl: string;
  status: string;
  appliedAt: string;
  job?: {
    id: string;
    title: string;
    department: string;
  };
}

const DEPARTMENTS = [
  "Sciences / Computer Tech",
  "Mathematics",
  "English & Foreign Languages",
  "Social Sciences & Humanities",
  "Robotics & Artificial Intelligence",
  "Sports & Physical Education",
  "Visual & Performing Arts",
  "Primary & Kindergarten Wing",
  "School Administration & Admissions",
  "Counseling & Student Care",
];

export default function AdminCareersPage() {
  const [activeTab, setActiveTab] = useState<"jobs" | "applications">("jobs");
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Search & Filter
  const [jobSearch, setJobSearch] = useState("");
  const [jobDeptFilter, setJobDeptFilter] = useState("ALL");
  const [appSearch, setAppSearch] = useState("");
  const [appStatusFilter, setAppStatusFilter] = useState("ALL");
  const [appJobFilter, setAppJobFilter] = useState("ALL");

  // Modal States
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobOpening | null>(null);
  const [jobToDelete, setJobToDelete] = useState<JobOpening | null>(null);
  const [appToDelete, setAppToDelete] = useState<JobApplication | null>(null);
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);

  // Job Form State
  const [jobForm, setJobForm] = useState({
    title: "",
    department: "Sciences / Computer Tech",
    qualification: "",
    experience: "",
    type: "FULL_TIME",
    vacancies: 1,
    deadline: "",
    status: "OPEN",
    description: "",
    requirements: "",
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [jobsRes, appsRes] = await Promise.all([
        fetch("/api/careers"),
        fetch("/api/careers/applications"),
      ]);

      if (jobsRes.ok) {
        const data = await jobsRes.json();
        if (data.jobs) setJobs(data.jobs);
      }
      if (appsRes.ok) {
        const data = await appsRes.json();
        if (data.applications) setApplications(data.applications);
      }
    } catch (err) {
      console.error("Failed to load recruitment data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Open Add Job Modal
  const handleOpenAddJob = () => {
    setEditingJob(null);
    setJobForm({
      title: "",
      department: "Sciences / Computer Tech",
      qualification: "",
      experience: "",
      type: "FULL_TIME",
      vacancies: 1,
      deadline: "",
      status: "OPEN",
      description: "",
      requirements: "",
    });
    setIsJobModalOpen(true);
  };

  // Open Edit Job Modal
  const handleOpenEditJob = (job: JobOpening) => {
    setEditingJob(job);
    setJobForm({
      title: job.title,
      department: job.department,
      qualification: job.qualification || "",
      experience: job.experience || "",
      type: job.type || "FULL_TIME",
      vacancies: job.vacancies || 1,
      deadline: job.deadline ? job.deadline.split("T")[0] : "",
      status: job.status || "OPEN",
      description: job.description || "",
      requirements: job.requirements || "",
    });
    setIsJobModalOpen(true);
  };

  // Submit Job (Create or Update)
  const handleSubmitJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingJob) {
        // PUT update
        const res = await fetch(`/api/careers/${editingJob.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(jobForm),
        });
        const data = await res.json();
        if (res.ok && data.job) {
          setJobs((prev) => prev.map((j) => (j.id === editingJob.id ? { ...j, ...data.job } : j)));
          setIsJobModalOpen(false);
          showToast(`Job opening "${data.job.title}" updated successfully.`);
        } else {
          alert(data.error || "Failed to update job");
        }
      } else {
        // POST create
        const res = await fetch("/api/careers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(jobForm),
        });
        const data = await res.json();
        if (res.ok && data.job) {
          setJobs((prev) => [data.job, ...prev]);
          setIsJobModalOpen(false);
          showToast(`Job opening "${data.job.title}" created successfully.`);
        } else {
          alert(data.error || "Failed to create job");
        }
      }
    } catch (err: any) {
      console.error("Save job error:", err);
      alert("Error saving job opening.");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Job
  const handleDeleteJob = async () => {
    if (!jobToDelete) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/careers/${jobToDelete.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setJobs((prev) => prev.filter((j) => j.id !== jobToDelete.id));
        setApplications((prev) => prev.filter((a) => a.jobId !== jobToDelete.id));
        showToast(`Job opening "${jobToDelete.title}" deleted successfully.`);
        setJobToDelete(null);
      } else {
        alert("Failed to delete job opening.");
      }
    } catch (err) {
      console.error("Delete job error:", err);
      alert("Error deleting job opening.");
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle Status (OPEN/CLOSED)
  const handleToggleJobStatus = async (job: JobOpening) => {
    const newStatus = job.status === "OPEN" ? "CLOSED" : "OPEN";
    try {
      const res = await fetch(`/api/careers/${job.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...job, status: newStatus }),
      });
      if (res.ok) {
        setJobs((prev) => prev.map((j) => (j.id === job.id ? { ...j, status: newStatus } : j)));
        showToast(`Job status changed to ${newStatus}.`);
      }
    } catch (err) {
      console.error("Status toggle error:", err);
    }
  };

  // Update Application Status
  const handleUpdateAppStatus = async (appId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/careers/applications/${appId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setApplications((prev) =>
          prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
        );
        if (selectedApp && selectedApp.id === appId) {
          setSelectedApp({ ...selectedApp, status: newStatus });
        }
        showToast(`Application status updated to ${newStatus}.`);
      }
    } catch (err) {
      console.error("App status update error:", err);
    }
  };

  // Delete Application
  const handleDeleteApplication = async () => {
    if (!appToDelete) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/careers/applications/${appToDelete.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setApplications((prev) => prev.filter((a) => a.id !== appToDelete.id));
        showToast(`Application from ${appToDelete.applicantName} deleted.`);
        setAppToDelete(null);
      }
    } catch (err) {
      console.error("Delete app error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Filtered Jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter((j) => {
      const matchDept = jobDeptFilter === "ALL" || j.department === jobDeptFilter;
      const matchSearch =
        jobSearch === "" ||
        j.title.toLowerCase().includes(jobSearch.toLowerCase()) ||
        j.description.toLowerCase().includes(jobSearch.toLowerCase());
      return matchDept && matchSearch;
    });
  }, [jobs, jobDeptFilter, jobSearch]);

  // Filtered Applications
  const filteredApps = useMemo(() => {
    return applications.filter((a) => {
      const matchJob = appJobFilter === "ALL" || a.jobId === appJobFilter;
      const matchStatus = appStatusFilter === "ALL" || a.status === appStatusFilter;
      const matchSearch =
        appSearch === "" ||
        a.applicantName.toLowerCase().includes(appSearch.toLowerCase()) ||
        a.email.toLowerCase().includes(appSearch.toLowerCase()) ||
        a.phone.includes(appSearch) ||
        (a.job?.title && a.job.title.toLowerCase().includes(appSearch.toLowerCase()));
      return matchJob && matchStatus && matchSearch;
    });
  }, [applications, appJobFilter, appStatusFilter, appSearch]);

  const totalOpenings = jobs.length;
  const activeOpenings = jobs.filter((j) => j.status === "OPEN").length;
  const totalApps = applications.length;
  const shortlistedApps = applications.filter((a) => a.status === "SHORTLISTED").length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-amber-400/40 text-white px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center space-x-3 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Banner & Stats */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center space-x-1.5">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Recruitment & HR Studio</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white mt-1">
            Careers & Candidate Application Records
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Create, edit, and delete job openings, and review applied candidate resumes and qualifications.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleOpenAddJob}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-school-secondary to-blue-600 hover:from-blue-600 hover:to-school-primary text-white text-xs font-black px-5 py-2.5 rounded-xl shadow-lg transition-all"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            <span>Post New Job Opening</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Positions</span>
          <p className="text-2xl font-black text-white">{totalOpenings}</p>
        </div>
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Active Openings</span>
          <p className="text-2xl font-black text-emerald-400">{activeOpenings}</p>
        </div>
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Total Applicants</span>
          <p className="text-2xl font-black text-amber-400">{totalApps}</p>
        </div>
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">Shortlisted</span>
          <p className="text-2xl font-black text-blue-400">{shortlistedApps}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 space-x-2">
        <button
          onClick={() => setActiveTab("jobs")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center space-x-2 ${
            activeTab === "jobs"
              ? "border-amber-400 text-amber-400"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Job Openings ({jobs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("applications")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center space-x-2 ${
            activeTab === "applications"
              ? "border-amber-400 text-amber-400"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Candidate Applications ({applications.length})</span>
        </button>
      </div>

      {/* ========================================================
          TAB 1: JOB OPENINGS (ADD, EDIT, DELETE)
         ======================================================== */}
      {activeTab === "jobs" && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search job title or keyword..."
                value={jobSearch}
                onChange={(e) => setJobSearch(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-slate-400 whitespace-nowrap">Department:</span>
              <select
                value={jobDeptFilter}
                onChange={(e) => setJobDeptFilter(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-white text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-amber-400"
              >
                <option value="ALL">All Departments</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Jobs Cards Grid */}
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-school-secondary mx-auto" />
              <p className="text-xs text-slate-400">Loading job openings...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-16 bg-slate-950 border border-slate-800 rounded-3xl p-8 space-y-3">
              <Briefcase className="w-8 h-8 text-slate-600 mx-auto" />
              <h3 className="font-bold text-sm text-white">No Job Openings Found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Click "Post New Job Opening" to list your first faculty or administrative role.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredJobs.map((j) => {
                const appCount = j.applications?.length || 0;
                const isOpen = j.status === "OPEN";

                return (
                  <div
                    key={j.id}
                    className="bg-slate-950 rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all group"
                  >
                    <div className="space-y-3">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="bg-blue-950 text-blue-300 text-[11px] font-bold px-3 py-1 rounded-full border border-blue-800 truncate">
                          {j.department}
                        </span>

                        <div className="flex items-center space-x-2 shrink-0">
                          <button
                            onClick={() => handleToggleJobStatus(j)}
                            className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border transition-all ${
                              isOpen
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                                : "bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700"
                            }`}
                            title="Click to toggle OPEN / CLOSED status"
                          >
                            {isOpen ? "● OPEN" : "○ CLOSED"}
                          </button>

                          <button
                            onClick={() => {
                              setAppJobFilter(j.id);
                              setActiveTab("applications");
                            }}
                            className="bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 border border-amber-400/30 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center space-x-1"
                          >
                            <Users className="w-3 h-3" />
                            <span>{appCount} Applied</span>
                          </button>
                        </div>
                      </div>

                      {/* Title & Info */}
                      <div>
                        <h3 className="font-bold text-base text-white group-hover:text-amber-400 transition-colors">
                          {j.title}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {j.description}
                        </p>
                      </div>

                      {/* Qualification & Experience */}
                      <div className="text-xs space-y-1 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                        <div className="flex items-start space-x-2 text-slate-300">
                          <GraduationCap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span className="truncate"><strong>Qualification:</strong> {j.qualification || "Any Graduate"}</span>
                        </div>
                        <div className="flex items-start space-x-2 text-slate-300">
                          <Award className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                          <span className="truncate"><strong>Experience:</strong> {j.experience || "Fresher / Experienced"}</span>
                        </div>
                        {j.vacancies && (
                          <div className="flex items-center space-x-2 text-slate-400 text-[11px]">
                            <Building2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>{j.vacancies} Position(s) • {j.type?.replace("_", " ")}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions: Edit, Delete, View Applicants */}
                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                      <button
                        onClick={() => {
                          setAppJobFilter(j.id);
                          setActiveTab("applications");
                        }}
                        className="text-xs font-bold text-school-secondary hover:text-blue-300 flex items-center space-x-1"
                      >
                        <span>View {appCount} Applications</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleOpenEditJob(j)}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-colors border border-slate-800"
                        >
                          <Edit2 className="w-3 h-3 text-amber-400" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => setJobToDelete(j)}
                          className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900 text-rose-400 hover:text-white transition-colors border border-rose-900/40"
                          title="Delete Job Opening"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          TAB 2: CANDIDATE APPLICATIONS (MAINTAIN RECORDS)
         ======================================================== */}
      {activeTab === "applications" && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search candidate name, email, phone..."
                value={appSearch}
                onChange={(e) => setAppSearch(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              {/* Filter by Job */}
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-400 whitespace-nowrap">Job:</span>
                <select
                  value={appJobFilter}
                  onChange={(e) => setAppJobFilter(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-white text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-amber-400 max-w-xs truncate"
                >
                  <option value="ALL">All Jobs ({applications.length})</option>
                  {jobs.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter by Status */}
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-400 whitespace-nowrap">Status:</span>
                <select
                  value={appStatusFilter}
                  onChange={(e) => setAppStatusFilter(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-white text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-amber-400"
                >
                  <option value="ALL">All Status</option>
                  <option value="PENDING">Pending Review</option>
                  <option value="SHORTLISTED">Shortlisted</option>
                  <option value="INTERVIEWED">Interview Scheduled</option>
                  <option value="HIRED">Hired</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          {/* Applications Table */}
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-school-secondary mx-auto" />
              <p className="text-xs text-slate-400">Loading candidate records...</p>
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="text-center py-16 bg-slate-950 border border-slate-800 rounded-3xl p-8 space-y-3">
              <Users className="w-8 h-8 text-slate-600 mx-auto" />
              <h3 className="font-bold text-sm text-white">No Applications Found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Candidate submissions through the public careers portal will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                    <tr>
                      <th className="p-4">Candidate Profile</th>
                      <th className="p-4">Position Applied For</th>
                      <th className="p-4">Qualifications & Experience</th>
                      <th className="p-4">Applied Date</th>
                      <th className="p-4">Hiring Status</th>
                      <th className="p-4">Resume</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredApps.map((app) => {
                      return (
                        <tr key={app.id} className="hover:bg-slate-900/50 transition-colors group">
                          {/* Candidate Profile */}
                          <td className="p-4">
                            <div className="font-bold text-sm text-white flex items-center space-x-1.5">
                              <span>{app.applicantName}</span>
                            </div>
                            <div className="text-[11px] text-slate-400 space-y-0.5 mt-0.5">
                              <div className="flex items-center space-x-1">
                                <Mail className="w-3 h-3 text-amber-400 shrink-0" />
                                <span className="truncate">{app.email}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Phone className="w-3 h-3 text-emerald-400 shrink-0" />
                                <span>{app.phone}</span>
                              </div>
                            </div>
                          </td>

                          {/* Position */}
                          <td className="p-4">
                            <span className="font-bold text-white block">
                              {app.job?.title || "General Application"}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-400 block mt-0.5">
                              {app.job?.department || "Academic"}
                            </span>
                          </td>

                          {/* Qualifications & Experience */}
                          <td className="p-4">
                            <div className="text-white font-medium">{app.qualification}</div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              Exp: {app.experience}
                            </div>
                          </td>

                          {/* Date */}
                          <td className="p-4 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                            {formatDate(app.appliedAt)}
                          </td>

                          {/* Status Dropdown */}
                          <td className="p-4 whitespace-nowrap">
                            <select
                              value={app.status}
                              onChange={(e) => handleUpdateAppStatus(app.id, e.target.value)}
                              className={`text-[10px] font-extrabold px-2.5 py-1.5 rounded-xl border focus:outline-none cursor-pointer ${
                                app.status === "HIRED"
                                  ? "bg-emerald-950 text-emerald-300 border-emerald-700"
                                  : app.status === "SHORTLISTED"
                                  ? "bg-blue-950 text-blue-300 border-blue-700"
                                  : app.status === "INTERVIEWED"
                                  ? "bg-purple-950 text-purple-300 border-purple-700"
                                  : app.status === "REJECTED"
                                  ? "bg-rose-950 text-rose-300 border-rose-700"
                                  : "bg-amber-950 text-amber-300 border-amber-700"
                              }`}
                            >
                              <option value="PENDING">PENDING</option>
                              <option value="SHORTLISTED">SHORTLISTED</option>
                              <option value="INTERVIEWED">INTERVIEWED</option>
                              <option value="HIRED">HIRED</option>
                              <option value="REJECTED">REJECTED</option>
                            </select>
                          </td>

                          {/* Resume Link */}
                          <td className="p-4 whitespace-nowrap">
                            {app.resumeUrl ? (
                              <a
                                href={app.resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center space-x-1.5 text-xs text-blue-400 hover:text-blue-300 font-bold bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-800"
                              >
                                <Download className="w-3.5 h-3.5 text-amber-400" />
                                <span>CV / Resume</span>
                              </a>
                            ) : (
                              <span className="text-slate-500 italic">None</span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="p-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => setSelectedApp(app)}
                                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
                                title="View Full Cover Letter & Profile"
                              >
                                <Eye className="w-3.5 h-3.5 text-amber-400" />
                              </button>

                              <button
                                onClick={() => setAppToDelete(app)}
                                className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900 text-rose-400 hover:text-white border border-rose-900/40 transition-colors"
                                title="Delete Application Record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
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
          MODAL 1: ADD / EDIT JOB OPENING
         ======================================================== */}
      {isJobModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl my-8">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20 flex items-center justify-center">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {editingJob ? "Edit Job Opening" : "Post New Job Opening"}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Specify role, qualifications, department, and application deadline
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsJobModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitJob} className="p-6 space-y-4 overflow-y-auto text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Job Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PGT Physics Lead / Primary STEM Coach"
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-400 text-sm font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Department *</label>
                  <select
                    value={jobForm.department}
                    onChange={(e) => setJobForm({ ...jobForm, department: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-400"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Employment Type</label>
                  <select
                    value={jobForm.type}
                    onChange={(e) => setJobForm({ ...jobForm, type: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="FULL_TIME">Full Time</option>
                    <option value="PART_TIME">Part Time</option>
                    <option value="CONTRACT">Contractual / Visiting</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Vacancies</label>
                  <input
                    type="number"
                    min={1}
                    value={jobForm.vacancies}
                    onChange={(e) => setJobForm({ ...jobForm, vacancies: Number(e.target.value) || 1 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Application Deadline</label>
                  <input
                    type="date"
                    value={jobForm.deadline}
                    onChange={(e) => setJobForm({ ...jobForm, deadline: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Hiring Status</label>
                  <select
                    value={jobForm.status}
                    onChange={(e) => setJobForm({ ...jobForm, status: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="OPEN">OPEN (Accepting Applications)</option>
                    <option value="CLOSED">CLOSED (Archived)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Minimum Qualification *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. M.Sc. Physics with B.Ed. (Gold Medalist preferred)"
                    value={jobForm.qualification}
                    onChange={(e) => setJobForm({ ...jobForm, qualification: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Experience Required *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 3–7 Years in Reputed CBSE / Cambridge School"
                    value={jobForm.experience}
                    onChange={(e) => setJobForm({ ...jobForm, experience: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Role Overview & Responsibilities</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail the key responsibilities, curriculum scope, and school culture expectations..."
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-amber-400 resize-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Requirements & Skillsets</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Fluency in English, hands-on STEM lab expertise, CBSE evaluation familiarity..."
                  value={jobForm.requirements}
                  onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-amber-400 resize-none leading-relaxed"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsJobModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-school-secondary to-blue-600 hover:from-blue-600 hover:to-school-primary text-white font-bold px-6 py-2 rounded-xl shadow-lg transition-all"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingJob ? "Update Job Opening" : "Post Job Opening"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: CANDIDATE PROFILE & COVER LETTER DETAILS
         ======================================================== */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-school-secondary/20 text-school-secondary flex items-center justify-center font-bold text-sm">
                  {selectedApp.applicantName[0]}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{selectedApp.applicantName}</h3>
                  <p className="text-xs text-amber-400">
                    Applying for: {selectedApp.job?.title || "General Role"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs">
              {/* Contact Grid */}
              <div className="grid grid-cols-2 gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Email Address</span>
                  <a
                    href={`mailto:${selectedApp.email}`}
                    className="text-blue-400 hover:underline font-medium break-all"
                  >
                    {selectedApp.email}
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Phone Number</span>
                  <a
                    href={`tel:${selectedApp.phone}`}
                    className="text-emerald-400 hover:underline font-mono font-medium"
                  >
                    {selectedApp.phone}
                  </a>
                </div>
              </div>

              {/* Qualifications & Experience */}
              <div className="space-y-2 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Qualifications</span>
                  <p className="text-white font-semibold">{selectedApp.qualification}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Experience</span>
                  <p className="text-slate-300">{selectedApp.experience}</p>
                </div>
                {(selectedApp.currentCtc || selectedApp.expectedCtc) && (
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Current CTC</span>
                      <p className="text-white font-mono">{selectedApp.currentCtc || "Not Disclosed"}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Expected CTC</span>
                      <p className="text-amber-400 font-mono">{selectedApp.expectedCtc || "Negotiable"}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Cover Letter */}
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">
                  Cover Letter & Statement of Purpose
                </span>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-300 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">
                  {selectedApp.coverLetter || "No cover letter provided."}
                </div>
              </div>

              {/* Status Update & Actions */}
              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <span className="font-bold text-slate-400">Status:</span>
                  <select
                    value={selectedApp.status}
                    onChange={(e) => handleUpdateAppStatus(selectedApp.id, e.target.value)}
                    className="bg-slate-950 border border-slate-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="SHORTLISTED">SHORTLISTED</option>
                    <option value="INTERVIEWED">INTERVIEWED</option>
                    <option value="HIRED">HIRED</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>
                </div>

                {selectedApp.resumeUrl && (
                  <a
                    href={selectedApp.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold px-4 py-2 rounded-xl shadow transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download CV / Resume</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          CONFIRM DELETE JOB MODAL
         ======================================================== */}
      {jobToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-800/80 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-950 text-rose-400 flex items-center justify-center mx-auto border border-rose-800">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-white">Delete Job Opening?</h3>
              <p className="text-xs text-slate-400">
                Are you sure you want to permanently delete <strong>"{jobToDelete.title}"</strong>? All associated candidate applications will also be removed.
              </p>
            </div>
            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                onClick={() => setJobToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteJob}
                disabled={submitting}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-lg"
              >
                {submitting ? "Deleting..." : "Yes, Delete Job"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          CONFIRM DELETE APPLICATION MODAL
         ======================================================== */}
      {appToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-800/80 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-950 text-rose-400 flex items-center justify-center mx-auto border border-rose-800">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-white">Delete Application Record?</h3>
              <p className="text-xs text-slate-400">
                Delete candidate submission from <strong>"{appToDelete.applicantName}"</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                onClick={() => setAppToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteApplication}
                disabled={submitting}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-lg"
              >
                {submitting ? "Deleting..." : "Yes, Delete Record"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
