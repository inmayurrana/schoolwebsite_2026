"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  Mail,
  Server,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Save,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Send,
  Sliders,
  AlertCircle,
  Database,
  HelpCircle,
  Info,
} from "lucide-react";

export default function EmailAlertsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Alert toggles per Requirement 18
  const [newAdmission, setNewAdmission] = useState(true);
  const [newContact, setNewContact] = useState(true);
  const [newCareer, setNewCareer] = useState(true);
  const [newEventRsvp, setNewEventRsvp] = useState(true);
  const [newFeedback, setNewFeedback] = useState(true);
  const [systemError, setSystemError] = useState(true);
  const [backupFailure, setBackupFailure] = useState(true);
  const [deliveryFailure, setDeliveryFailure] = useState(true);

  // Recipients
  const [recipients, setRecipients] = useState("admin@cismandi.edu.in, principal@cismandi.edu.in");
  const [digestMode, setDigestMode] = useState("INSTANT");

  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showToast = (type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  async function fetchAlerts() {
    setLoading(true);
    try {
      const res = await fetch("/api/email/alerts");
      const data = await res.json();
      if (data.success && data.alerts) {
        const a = data.alerts;
        setNewAdmission(a.alert_new_admission ?? true);
        setNewContact(a.alert_new_contact ?? true);
        setNewCareer(a.alert_new_career ?? true);
        setNewEventRsvp(a.alert_new_event_rsvp ?? true);
        setNewFeedback(a.alert_new_feedback ?? true);
        setSystemError(a.alert_system_error ?? true);
        setBackupFailure(a.alert_backup_failure ?? true);
        setDeliveryFailure(a.alert_delivery_failure ?? true);
        setRecipients(a.alert_recipients || "admin@cismandi.edu.in");
        setDigestMode(a.alert_digest_mode || "INSTANT");
      }
    } catch (err) {
      showToast("error", "Failed to load email alert settings");
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        alert_new_admission: newAdmission,
        alert_new_contact: newContact,
        alert_new_career: newCareer,
        alert_new_event_rsvp: newEventRsvp,
        alert_new_feedback: newFeedback,
        alert_system_error: systemError,
        alert_backup_failure: backupFailure,
        alert_delivery_failure: deliveryFailure,
        alert_recipients: recipients,
        alert_digest_mode: digestMode,
      };

      const res = await fetch("/api/email/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        showToast("success", "Admin email alert preferences saved successfully!");
      } else {
        showToast("error", data.error || "Failed to save alerts");
      }
    } catch (err: any) {
      showToast("error", err.message || "Network error");
    } finally {
      setSaving(false);
    }
  };

  const alertTriggers = [
    {
      id: "admission",
      title: "New Admission Enquiry",
      desc: "Instant notification when a prospective student admission form is submitted.",
      checked: newAdmission,
      setter: setNewAdmission,
      badge: "High Priority",
      badgeColor: "bg-blue-500/20 text-blue-300 border-blue-400/30",
    },
    {
      id: "contact",
      title: "New Contact Message",
      desc: "Triggers when a visitor, parent, or community member submits the contact form.",
      checked: newContact,
      setter: setNewContact,
      badge: "Standard",
      badgeColor: "bg-slate-800 text-slate-100 border border-slate-700",
    },
    {
      id: "career",
      title: "New Career Application",
      desc: "Alerts the HR / Principal desk whenever an educator or staff CV is submitted.",
      checked: newCareer,
      setter: setNewCareer,
      badge: "HR & Recruitment",
      badgeColor: "bg-purple-500/20 text-purple-300 border-purple-400/30",
    },
    {
      id: "event",
      title: "New Event Registration / RSVP",
      desc: "Notifies coordinators when someone registers for school seminars or open houses.",
      checked: newEventRsvp,
      setter: setNewEventRsvp,
      badge: "Events",
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-400/30",
    },
    {
      id: "feedback",
      title: "New Feedback Submission",
      desc: "Alerts leadership when feedback or suggestions are recorded on the portal.",
      checked: newFeedback,
      setter: setNewFeedback,
      badge: "Community",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-400/30",
    },
    {
      id: "system_error",
      title: "System / Database Error Alert",
      desc: "Sends urgent technical alerts if unhandled server exceptions occur.",
      checked: systemError,
      setter: setSystemError,
      badge: "Critical Alert",
      badgeColor: "bg-rose-500/20 text-rose-300 border-rose-400/30",
    },
    {
      id: "backup_failure",
      title: "Backup Failure Warning",
      desc: "Alerts the admin team if automated CMS database snapshots or syncs fail.",
      checked: backupFailure,
      setter: setBackupFailure,
      badge: "System Alert",
      badgeColor: "bg-rose-500/20 text-rose-300 border-rose-400/30",
    },
    {
      id: "delivery_failure",
      title: "Email Delivery Failure Alert",
      desc: "Notifies administrators immediately if outbound SMTP emails encounter persistent errors.",
      checked: deliveryFailure,
      setter: setDeliveryFailure,
      badge: "Reliability",
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-400/30",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16 text-slate-100">
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
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-amber-400 uppercase tracking-widest mb-1.5">
            <span>Communications</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span>Email Alerts</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight flex items-center gap-3">
            <Bell className="w-8 h-8 text-amber-400" />
            Administrative Email Alerts & Triggers
          </h1>
          <p className="text-sm text-slate-200 mt-1 font-medium">
            Configure automated instant email alerts for new form submissions, system events, backups, and delivery errors.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
          <Link
            href="/admin/communications/email"
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white bg-slate-900 border border-slate-700 hover:bg-slate-800 transition-all flex items-center gap-2"
          >
            <Server className="w-3.5 h-3.5 text-blue-400" />
            <span>Email Settings</span>
          </Link>
          <Link
            href="/admin/communications/alerts"
            className="px-4 py-2 rounded-xl text-xs font-black bg-amber-400 text-slate-950 shadow-md flex items-center gap-2"
          >
            <Bell className="w-3.5 h-3.5 text-slate-950" />
            <span>Email Alerts</span>
          </Link>
          <Link
            href="/admin/communications/templates"
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white bg-slate-900 border border-slate-700 hover:bg-slate-800 transition-all flex items-center gap-2"
          >
            <Mail className="w-3.5 h-3.5 text-purple-400" />
            <span>Email Templates</span>
          </Link>
          <Link
            href="/admin/communications/notifications"
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white bg-slate-900 border border-slate-700 hover:bg-slate-800 transition-all flex items-center gap-2"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Form Notifications</span>
          </Link>
          <Link
            href="/admin/communications/logs"
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white bg-slate-900 border border-slate-700 hover:bg-slate-800 transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
            <span>Email Logs & Queue</span>
          </Link>
          <Link
            href="/admin/communications/test"
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white bg-slate-900 border border-slate-700 hover:bg-slate-800 transition-all flex items-center gap-2"
          >
            <Send className="w-3.5 h-3.5 text-amber-400" />
            <span>Test Email</span>
          </Link>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Recipients Header */}
        <div className="p-6 sm:p-7 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 text-sm font-black text-amber-400 uppercase tracking-wider">
            <Mail className="w-4 h-4 text-amber-400" />
            <span>Target Alert Inboxes</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            <div className="md:col-span-2">
              <label className="block text-xs font-black text-white uppercase tracking-wider mb-2">
                Admin Alert Recipient Inboxes (Comma Separated)
              </label>
              <input
                type="text"
                value={recipients}
                onChange={(e) => setRecipients(e.target.value)}
                placeholder="admin@school.com, principal@school.com"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs sm:text-sm font-semibold focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 placeholder:text-slate-500 shadow-inner"
                required
              />
              <span className="text-xs text-slate-300 mt-1.5 block">
                All checked alerts below will be delivered to these email addresses.
              </span>
            </div>

            <div>
              <label className="block text-xs font-black text-white uppercase tracking-wider mb-2">
                Delivery Mode
              </label>
              <select
                value={digestMode}
                onChange={(e) => setDigestMode(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-semibold text-xs sm:text-sm focus:outline-none focus:border-amber-400"
              >
                <option value="INSTANT" className="bg-slate-900 text-white">⚡ Instant Real-Time Alert</option>
                <option value="HOURLY" className="bg-slate-900 text-white">Hourly Batch Summary</option>
                <option value="DAILY" className="bg-slate-900 text-white">Daily Morning Digest</option>
              </select>
              <span className="text-xs text-amber-300/80 mt-1.5 block font-medium">
                Instant delivery is recommended for admission leads and errors.
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 18: 8 INDEPENDENT TRIGGER TOGGLES */}
        <div className="p-6 sm:p-7 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
            <div className="flex items-center space-x-2 text-sm font-black text-amber-400 uppercase tracking-wider">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>Event & Submission Triggers</span>
            </div>
            <span className="text-xs text-slate-300 font-medium">
              Each notification trigger can be enabled or disabled independently
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {alertTriggers.map((item) => (
              <div
                key={item.id}
                onClick={() => item.setter(!item.checked)}
                className={`p-4 sm:p-5 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                  item.checked
                    ? "bg-slate-950 border-amber-400 text-white shadow-md ring-1 ring-amber-400/40"
                    : "bg-slate-950/80 border-slate-800 text-slate-200 hover:border-slate-700 hover:bg-slate-900"
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-white">{item.title}</span>
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed">{item.desc}</p>
                </div>

                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={(e) => {
                    e.stopPropagation();
                    item.setter(e.target.checked);
                  }}
                  className="w-5 h-5 rounded text-amber-400 focus:ring-amber-400 bg-slate-900 border-slate-600 mt-1 cursor-pointer flex-shrink-0"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Save className={`w-4 h-4 ${saving ? "animate-spin" : ""}`} />
            <span>{saving ? "SAVING ALERT SETTINGS..." : "SAVE ALERT PREFERENCES"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
