"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Send,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ChevronRight,
  Server,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function TestEmailPage() {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("Website Email Delivery Test - Cambridge International School");
  const [message, setMessage] = useState("This is an official verification email sent from the Cambridge International School CMS Dashboard.");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    async function loadDefaultRecipient() {
      try {
        const res = await fetch("/api/email/config");
        const data = await res.json();
        if (data.config) {
          setConfig(data.config);
          if (data.config.defaultRecipients) {
            setTo(data.config.defaultRecipients.split(",")[0].trim());
          } else if (data.config.fromEmail) {
            setTo(data.config.fromEmail);
          }
        }
      } catch (_) {}
    }
    loadDefaultRecipient();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!to) return;
    if (config?.authRequired && (!config?.smtpUser || !config?.smtpPass)) {
      setResult({
        success: false,
        error: "SMTP credentials not configured. Please go to Communications > Email Settings to enter your Username and Password / App Password.",
      });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/email/test-send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, subject, message }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setResult({ success: false, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 text-slate-100">
      {/* Header & Sub-navigation Tabs */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-amber-400 uppercase tracking-widest mb-1.5">
            <span>Communications</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span>Test Email</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight flex items-center gap-3">
            <Send className="w-8 h-8 text-amber-400" />
            Live Email Delivery Tester
          </h1>
          <p className="text-sm text-slate-200 mt-1 font-medium">
            Dispatch a real verification email to any address to confirm SMTP handshake and delivery.
          </p>
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
            <Server className="w-3.5 h-3.5 text-amber-400" />
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
            href="/admin/communications/test"
            className="px-4 py-2 rounded-xl text-xs font-black bg-amber-400 text-slate-950 shadow-md flex items-center gap-2"
          >
            <Send className="w-3.5 h-3.5 text-slate-950" />
            <span>Test Email</span>
          </Link>
        </div>
      </div>

      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        {config && config.authRequired && (!config.smtpUser || !config.smtpPass) && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/40 flex items-start gap-3 text-amber-200">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-400 mt-0.5" />
            <div className="text-xs sm:text-sm">
              <span className="font-extrabold text-white block mb-0.5">SMTP Authentication Credentials Required</span>
              <span>Your email settings do not have a Username or Password saved yet. Please configure credentials in </span>
              <Link href="/admin/communications/email" className="font-bold text-amber-400 hover:underline">
                Communications &rarr; Email Settings
              </Link>
              <span> before sending live test emails.</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-white uppercase tracking-wider mb-2">
              Send To Email Address <span className="text-rose-400">*</span>
            </label>
            <input
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="admin@school.com"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono font-semibold text-xs sm:text-sm focus:outline-none focus:border-amber-400"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-black text-white uppercase tracking-wider mb-2">
              Email Subject <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-semibold text-xs sm:text-sm focus:outline-none focus:border-amber-400"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-black text-white uppercase tracking-wider mb-2">
              Custom Message Body <span className="text-rose-400">*</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-medium text-xs sm:text-sm focus:outline-none focus:border-amber-400 leading-relaxed"
              required
            />
          </div>

          {result && (
            <div
              className={`p-4 rounded-xl text-xs font-bold border ${
                result.success
                  ? "bg-emerald-950 border-emerald-500 text-emerald-100"
                  : "bg-rose-950 border-rose-500 text-rose-100"
              }`}
            >
              {result.success ? (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-300 flex-shrink-0" />
                  <div>
                    <p className="font-extrabold text-sm">✓ Test email sent successfully!</p>
                    <p className="text-xs text-emerald-200 mt-1">
                      Message ID: <code className="font-mono bg-emerald-900/80 px-1 py-0.5 rounded">{result.messageId}</code> via {result.provider}.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2">
                  <XCircle className="w-5 h-5 text-rose-300 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-extrabold text-sm">✗ Failed to send test email</p>
                    <p className="text-xs text-rose-200 font-mono mt-1 leading-relaxed">
                      {result.error}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm shadow-xl shadow-blue-500/20 flex items-center gap-2 disabled:opacity-50"
            >
              <Send className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              <span>{loading ? "DISPATCHING EMAIL..." : "SEND TEST EMAIL NOW"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
