"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Mail,
  Server,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Save,
  Send,
  RefreshCw,
  Eye,
  EyeOff,
  Power,
  Info,
  Lock,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Bell,
} from "lucide-react";

export default function EmailSettingsPage() {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  // Form State
  const [provider, setProvider] = useState("GMAIL");
  const [isEnabled, setIsEnabled] = useState(true);
  const [fromName, setFromName] = useState("Cambridge International School");
  const [fromEmail, setFromEmail] = useState("");
  const [replyToEmail, setReplyToEmail] = useState("");
  const [smtpHost, setSmtpHost] = useState("smtp.gmail.com");
  const [smtpPort, setSmtpPort] = useState(587);
  const [encryption, setEncryption] = useState("STARTTLS");
  const [authRequired, setAuthRequired] = useState(true);
  const [smtpUser, setSmtpUser] = useState("");
  const [smtpPass, setSmtpPass] = useState("");
  const [changePassword, setChangePassword] = useState(false);
  const [defaultRecipients, setDefaultRecipients] = useState("");
  const [defaultCc, setDefaultCc] = useState("");
  const [defaultBcc, setDefaultBcc] = useState("");

  // Test Email Modal
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [testTo, setTestTo] = useState("");
  const [testSubject, setTestSubject] = useState("Website Email Delivery Test");
  const [testMessage, setTestMessage] = useState("This is an official test email from the Cambridge International School CMS.");
  const [sendingTest, setSendingTest] = useState(false);
  const [sendResult, setSendResult] = useState<any>(null);

  // Notification message
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchConfig();
  }, []);

  const showToast = (type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 5000);
  };

  async function fetchConfig() {
    setLoading(true);
    try {
      const res = await fetch("/api/email/config");
      const data = await res.json();
      if (data.success && data.config) {
        const c = data.config;
        setConfig(c);
        setProvider(c.provider || "GMAIL");
        setIsEnabled(c.isEnabled ?? true);
        setFromName(c.fromName || "Cambridge International School");
        setFromEmail(c.fromEmail || "");
        setReplyToEmail(c.replyToEmail || "");
        setSmtpHost(c.smtpHost || (c.provider === "GMAIL" ? "smtp.gmail.com" : ""));
        setSmtpPort(c.smtpPort || 587);
        setEncryption(c.encryption || "STARTTLS");
        setAuthRequired(c.authRequired ?? true);
        setSmtpUser(c.smtpUser || "");
        setSmtpPass(c.smtpPass || "");
        setDefaultRecipients(c.defaultRecipients || "");
        setDefaultCc(c.defaultCc || "");
        setDefaultBcc(c.defaultBcc || "");
        if (c.defaultRecipients && !testTo) {
          setTestTo(c.defaultRecipients.split(",")[0].trim());
        }
      }
    } catch (err) {
      console.error(err);
      showToast("error", "Failed to load email configuration");
    } finally {
      setLoading(false);
    }
  }

  // Handle provider preset selection
  const handleProviderSelect = (selectedProvider: string) => {
    setProvider(selectedProvider);
    if (selectedProvider === "GMAIL") {
      setSmtpHost("smtp.gmail.com");
      setSmtpPort(587);
      setEncryption("STARTTLS");
      setAuthRequired(true);
    } else if (selectedProvider === "MICROSOFT") {
      setSmtpHost("smtp.office365.com");
      setSmtpPort(587);
      setEncryption("STARTTLS");
      setAuthRequired(true);
    } else if (selectedProvider === "SMTP" && smtpHost === "smtp.gmail.com") {
      setSmtpHost("mail.school.com");
      setSmtpPort(587);
      setEncryption("STARTTLS");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: any = {
        provider,
        isEnabled,
        fromName,
        fromEmail,
        replyToEmail,
        smtpHost,
        smtpPort: Number(smtpPort),
        encryption,
        authRequired,
        smtpUser,
        defaultRecipients,
        defaultCc,
        defaultBcc,
      };

      // Send password if newly typed (not masked bullets)
      if (smtpPass && !smtpPass.includes("•")) {
        payload.smtpPass = smtpPass.trim();
      }

      const res = await fetch("/api/email/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        showToast("success", "Email configuration saved successfully!");
        setChangePassword(false);
        fetchConfig();
      } else {
        showToast("error", data.error || "Failed to save settings");
      }
    } catch (err: any) {
      showToast("error", err.message || "Network error");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleEnabled = async () => {
    const nextState = !isEnabled;
    setIsEnabled(nextState);
    try {
      const res = await fetch("/api/email/config", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isEnabled: nextState }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("success", nextState ? "Email delivery active" : "Email delivery paused");
        fetchConfig();
      }
    } catch (err) {
      setIsEnabled(!nextState);
    }
  };

  const handleTestConnection = async () => {
    if (authRequired) {
      if (!smtpUser || !smtpUser.trim()) {
        showToast("error", "SMTP Username / Email is required before testing.");
        return;
      }
      const hasSavedPass = Boolean(config?.smtpPass);
      const hasTypedPass = Boolean(smtpPass && !smtpPass.includes("•"));
      if (!hasSavedPass && !hasTypedPass) {
        showToast("error", "Password / App Password is required. Please type your password before testing.");
        return;
      }
    }

    setTestingConnection(true);
    setTestResult(null);
    try {
      const payload: any = {
        provider,
        smtpHost,
        smtpPort: Number(smtpPort),
        encryption,
        authRequired,
        smtpUser: smtpUser.trim(),
      };
      if (smtpPass && !smtpPass.includes("•")) {
        payload.smtpPass = smtpPass.trim();
      }

      const res = await fetch("/api/email/test-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setTestResult(data);
      if (data.success) {
        showToast("success", "SMTP connection & authentication successful!");
      } else {
        showToast("error", data.error || "SMTP test failed");
      }
      fetchConfig();
    } catch (err: any) {
      setTestResult({
        success: false,
        error: err.message,
        message: "Failed to connect to SMTP server",
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testTo) {
      showToast("error", "Enter recipient email address");
      return;
    }
    setSendingTest(true);
    setSendResult(null);
    try {
      const res = await fetch("/api/email/test-send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: testTo,
          subject: testSubject,
          message: testMessage,
        }),
      });
      const data = await res.json();
      setSendResult(data);
      if (data.success) {
        showToast("success", `✓ Test email sent successfully to ${testTo}`);
      } else {
        showToast("error", data.error || "Failed to dispatch test email");
      }
    } catch (err: any) {
      setSendResult({ success: false, error: err.message });
      showToast("error", err.message || "Failed to send");
    } finally {
      setSendingTest(false);
    }
  };

  if (loading && !config) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-school-secondary border-t-amber-400 rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-400 font-semibold">Loading Email Management System...</p>
        </div>
      </div>
    );
  }

  // Status Badge calculation
  const statusType = !isEnabled
    ? "DISABLED"
    : config?.status || "NOT_CONFIGURED";

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-3 text-sm font-semibold transition-all border ${
            toast.type === "success"
              ? "bg-emerald-950/90 text-emerald-200 border-emerald-500/50"
              : "bg-rose-950/90 text-rose-200 border-rose-500/50"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-rose-400" />
          )}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Header & Sub-navigation Tabs */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">
              <span>Communications</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span>Email Settings</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight flex items-center gap-3">
              <Mail className="w-8 h-8 text-amber-400" />
              Email Management System
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Configure, test, monitor, and deliver all website notifications without touching source code.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleToggleEnabled}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all border ${
                isEnabled
                  ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20"
                  : "bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700"
              }`}
            >
              <Power className={`w-3.5 h-3.5 ${isEnabled ? "text-emerald-400" : "text-slate-500"}`} />
              <span>Notifications: {isEnabled ? "ON" : "PAUSED"}</span>
            </button>

            <button
              type="button"
              onClick={() => setTestModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 flex items-center gap-2 border border-blue-400/30 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Test Email</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-white/10 pb-3">
          <Link
            href="/admin/communications/email"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 text-slate-950 shadow-md flex items-center gap-2"
          >
            <Server className="w-3.5 h-3.5" />
            <span>Email Settings</span>
          </Link>
          <Link
            href="/admin/communications/alerts"
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Email Alerts</span>
          </Link>
          <Link
            href="/admin/communications/templates"
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email Templates</span>
          </Link>
          <Link
            href="/admin/communications/notifications"
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Form Notifications</span>
          </Link>
          <Link
            href="/admin/communications/logs"
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Email Logs & Queue</span>
          </Link>
          <Link
            href="/admin/communications/design"
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Email Branding & Design</span>
          </Link>
        </div>
      </div>

      {/* SECTION 8: Email Service Status Card */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center space-x-4">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-inner ${
                statusType === "CONNECTED"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : statusType === "DISABLED"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  : "bg-rose-500/20 text-rose-300 border border-rose-500/40"
              }`}
            >
              {statusType === "CONNECTED" ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : statusType === "DISABLED" ? (
                <Power className="w-6 h-6" />
              ) : (
                <AlertTriangle className="w-6 h-6" />
              )}
            </div>

            <div>
              <div className="flex items-center space-x-2.5">
                <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
                  Email Service Status:
                </span>
                <span
                  className={`text-xs font-black px-3 py-0.5 rounded-full ${
                    statusType === "CONNECTED"
                      ? "bg-emerald-400 text-slate-950 shadow-sm"
                      : statusType === "DISABLED"
                      ? "bg-amber-400 text-slate-950 shadow-sm"
                      : "bg-rose-500 text-white shadow-sm"
                  }`}
                >
                  ● {statusType.replace(/_/g, " ")}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-200 mt-1.5 font-medium">
                <span>
                  Provider: <strong className="text-white font-bold">{config?.provider || provider}</strong>
                </span>
                <span>•</span>
                <span>
                  Sender:{" "}
                  <strong className="text-white font-bold">{config?.fromEmail || config?.smtpUser || "Not configured"}</strong>
                </span>
                <span>•</span>
                <span>
                  Last test:{" "}
                  <span className="text-slate-300 font-semibold">
                    {config?.lastTestedAt
                      ? new Date(config.lastTestedAt).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : "Never"}
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testingConnection}
              className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-xs font-bold text-amber-300 hover:text-white border border-amber-400/40 flex items-center gap-2 transition-all disabled:opacity-50 shadow"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testingConnection ? "animate-spin" : ""}`} />
              <span>{testingConnection ? "Verifying Handshake..." : "Test Connection"}</span>
            </button>
          </div>
        </div>

        {/* Disabled Warning if OFF */}
        {!isEnabled && (
          <div className="mt-4 p-3.5 bg-amber-950/80 border border-amber-500/50 rounded-xl text-xs text-amber-100 flex items-center gap-2.5 font-medium">
            <Info className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>
              <strong className="text-amber-300">Email delivery is currently paused.</strong> Public form submissions are safely stored in the CMS database, but outbound notification emails will not be sent.
            </span>
          </div>
        )}

        {/* Live Test Diagnostic Output */}
        {testResult && (
          <div
            className={`mt-4 p-4 rounded-xl text-xs border ${
              testResult.success
                ? "bg-emerald-950/80 border-emerald-500 text-emerald-100"
                : "bg-rose-950/80 border-rose-500 text-rose-100"
            }`}
          >
            <div className="flex items-start gap-2.5">
              {testResult.success ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
              )}
              <div className="space-y-1.5 flex-1">
                <p className="font-extrabold text-sm">{testResult.message}</p>
                {testResult.error && <p className="text-rose-200 font-mono text-xs font-semibold leading-relaxed">{testResult.error}</p>}
                {testResult.details?.recommendation && (
                  <ul className="list-disc list-inside space-y-1 mt-2 text-slate-100 text-xs font-medium">
                    {testResult.details.recommendation.map((rec: string, i: number) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Configuration Form */}
      <form onSubmit={handleSave} className="space-y-8">
        {/* SECTION 2 & 3: Email Provider Selection */}
        <div className="p-6 sm:p-7 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 text-sm font-black text-amber-400 uppercase tracking-wider">
            <Server className="w-4 h-4 text-amber-400" />
            <span>Select Email Delivery Provider</span>
          </div>
          <p className="text-xs text-slate-200 font-medium">
            Choose your email infrastructure provider. The system abstracts SMTP logic so the website works seamlessly regardless of provider.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
            {[
              { id: "GMAIL", name: "Gmail SMTP", desc: "Recommended for school Gmail accounts using Google App Passwords." },
              { id: "SMTP", name: "Generic SMTP", desc: "Standard SMTP server with custom port & TLS credentials." },
              { id: "MICROSOFT", name: "Microsoft 365", desc: "Office 365 / Outlook institutional mail exchange." },
              { id: "OTHER", name: "Other SMTP / Relay", desc: "Amazon SES, Brevo, Resend, or custom SMTP relays." },
            ].map((p) => {
              const active = provider === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => handleProviderSelect(p.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    active
                      ? "bg-slate-950 border-amber-400 text-white shadow-lg ring-1 ring-amber-400/40"
                      : "bg-slate-950/70 border-slate-800 text-slate-200 hover:border-slate-700 hover:bg-slate-900"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-extrabold text-sm text-white">{p.name}</span>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        active ? "border-amber-400 bg-amber-400" : "border-slate-500"
                      }`}
                    >
                      {active && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 4 & 31: Gmail Specific Setup Guidance */}
        {provider === "GMAIL" && (
          <div className="p-6 rounded-2xl bg-amber-950/40 border border-amber-500/40 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-amber-300 font-black text-sm">
              <Info className="w-4 h-4 text-amber-400" />
              <span>First-Class Google / Gmail Setup Guide</span>
            </div>
            <div className="text-xs text-slate-100 space-y-2 leading-relaxed font-medium">
              <p className="font-bold text-white text-sm">
                Google requires modern authentication for sending automated website emails:
              </p>
              <ol className="list-decimal list-inside space-y-1.5 pl-1 text-slate-200">
                <li>Sign in to the Google account used by the school (e.g. <code className="text-amber-300 bg-slate-950 px-1.5 py-0.5 rounded font-bold border border-amber-400/30">school@gmail.com</code>).</li>
                <li>Go to <strong>Google Account Settings &rarr; Security</strong> and verify <strong>2-Step Verification</strong> is ON.</li>
                <li>Under "How you sign in to Google", select <strong>App passwords</strong> (or search "App passwords" in the search box).</li>
                <li>Create an App Password with the name <strong>"Website CMS"</strong>. Google will generate a 16-character code (e.g. <code className="text-amber-300 bg-slate-950 px-1.5 py-0.5 rounded font-bold border border-amber-400/30">abcd efgh ijkl mnop</code>).</li>
                <li>Copy and paste that 16-character code into the <strong>Password / App Password</strong> field below.</li>
              </ol>
              <div className="mt-3 p-3.5 bg-rose-950/70 border border-rose-500/60 rounded-xl text-rose-100 font-semibold">
                <strong className="text-rose-300">IMPORTANT SECURITY NOTICE:</strong> Your normal personal Gmail password must <u>NOT</u> be entered here. Always use a Google App Password.
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: SENDER INFORMATION */}
        <div className="p-6 sm:p-7 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
          <div className="flex items-center space-x-2 text-sm font-black text-amber-400 uppercase tracking-wider">
            <Mail className="w-4 h-4 text-amber-400" />
            <span>Sender Information</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-black text-white uppercase tracking-wider mb-2">
                From Name
              </label>
              <input
                type="text"
                value={fromName}
                onChange={(e) => setFromName(e.target.value)}
                placeholder="Cambridge International School"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-semibold text-xs sm:text-sm focus:outline-none focus:border-amber-400 transition-colors"
                required
              />
              <span className="text-xs text-slate-300 mt-1.5 block font-medium">Displayed as sender name in parent/admin inboxes.</span>
            </div>

            <div>
              <label className="block text-xs font-black text-white uppercase tracking-wider mb-2">
                From Email Address
              </label>
              <input
                type="email"
                value={fromEmail}
                onChange={(e) => setFromEmail(e.target.value)}
                placeholder="admissions@cismandi.edu.in"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono font-semibold text-xs sm:text-sm focus:outline-none focus:border-amber-400 transition-colors"
                required
              />
              <span className="text-xs text-slate-300 mt-1.5 block font-medium">The address that outbound emails are dispatched from.</span>
            </div>

            <div>
              <label className="block text-xs font-black text-white uppercase tracking-wider mb-2">
                Default Reply-To Email
              </label>
              <input
                type="email"
                value={replyToEmail}
                onChange={(e) => setReplyToEmail(e.target.value)}
                placeholder="office@cismandi.edu.in"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono font-semibold text-xs sm:text-sm focus:outline-none focus:border-amber-400 transition-colors"
              />
              <span className="text-xs text-slate-300 mt-1.5 block font-medium">Fallback reply address when forms don't specify visitor email.</span>
            </div>
          </div>
        </div>

        {/* SECTION 3, 5 & 32: SMTP SETTINGS */}
        <div className="p-6 sm:p-7 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
            <div className="flex items-center space-x-2 text-sm font-black text-amber-400 uppercase tracking-wider">
              <Server className="w-4 h-4 text-amber-400" />
              <span>SMTP Server Connection & Authentication</span>
            </div>
            <span className="text-xs text-slate-300 font-mono font-bold">
              🔒 Encrypted at rest (AES-256-GCM)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-black text-white uppercase tracking-wider">SMTP Host</label>
                <span className="text-xs font-mono font-bold text-amber-300">smtp.gmail.com</span>
              </div>
              <input
                type="text"
                value={smtpHost}
                onChange={(e) => setSmtpHost(e.target.value)}
                placeholder="smtp.gmail.com"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono font-semibold text-xs sm:text-sm focus:outline-none focus:border-amber-400 transition-colors"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-black text-white uppercase tracking-wider">SMTP Port</label>
                <span className="text-xs font-mono font-bold text-amber-300">587 / 465</span>
              </div>
              <input
                type="number"
                value={smtpPort}
                onChange={(e) => setSmtpPort(Number(e.target.value))}
                placeholder="587"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono font-semibold text-xs sm:text-sm focus:outline-none focus:border-amber-400 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black text-white uppercase tracking-wider mb-2">Encryption / Security</label>
              <select
                value={encryption}
                onChange={(e) => setEncryption(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-semibold text-xs sm:text-sm focus:outline-none focus:border-amber-400 transition-colors"
              >
                <option value="STARTTLS" className="bg-slate-900 text-white">STARTTLS (Standard Port 587)</option>
                <option value="SSL_TLS" className="bg-slate-900 text-white">SSL / TLS (Standard Port 465)</option>
                <option value="NONE" className="bg-slate-900 text-white">None (Plain / Local relay)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-black text-white uppercase tracking-wider mb-2">
                SMTP Username
              </label>
              <input
                type="text"
                value={smtpUser}
                onChange={(e) => setSmtpUser(e.target.value)}
                placeholder="your-account@gmail.com"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono font-semibold text-xs sm:text-sm focus:outline-none focus:border-amber-400 transition-colors"
                required={authRequired}
              />
              <span className="text-xs text-slate-300 mt-1.5 block font-medium">Complete email address for Gmail / Microsoft 365.</span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Password / App Password</span>
                </label>
                {!changePassword && config?.smtpPass && (
                  <button
                    type="button"
                    onClick={() => {
                      setChangePassword(true);
                      setSmtpPass("");
                    }}
                    className="text-xs font-black text-amber-400 hover:text-amber-300 hover:underline"
                  >
                    Change Password
                  </button>
                )}
              </div>

              {!changePassword && config?.smtpPass ? (
                <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-300 font-mono text-sm font-semibold">
                  <span>••••••••••••••••</span>
                  <span className="text-xs text-emerald-400 font-black bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-500/40">
                    Saved & Encrypted
                  </span>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <input
                    type="password"
                    value={smtpPass}
                    onChange={(e) => setSmtpPass(e.target.value)}
                    placeholder={
                      provider === "GMAIL"
                        ? "Enter 16-character Google App Password (e.g. abcd efgh ijkl mnop)"
                        : "Enter SMTP account password"
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-amber-400/80 text-white font-mono text-xs sm:text-sm font-semibold focus:outline-none focus:border-amber-400 transition-colors shadow-inner placeholder:text-slate-500"
                    required={authRequired && !config?.smtpPass}
                  />
                  {changePassword && config?.smtpPass && (
                    <button
                      type="button"
                      onClick={() => {
                        setChangePassword(false);
                        setSmtpPass(config?.smtpPass || "");
                      }}
                      className="text-xs text-slate-300 hover:text-white font-semibold underline"
                    >
                      Cancel password edit
                    </button>
                  )}
                </div>
              )}
              <span className="text-xs text-slate-300 mt-1.5 block font-medium">
                {provider === "GMAIL"
                  ? "For Gmail, enter your 16-character Google App Password. Spaces will be handled automatically."
                  : "Never shared publicly or returned in plain text to the browser."}
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 3 & 16: DEFAULT RECIPIENTS */}
        <div className="p-6 sm:p-7 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 text-sm font-black text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-3">
            <Mail className="w-4 h-4 text-amber-400" />
            <span>Default Administrative Recipients</span>
          </div>
          <p className="text-xs text-slate-200 font-medium">
            Fallback recipients for system alerts and general notifications when forms don't have custom routing. Separate multiple emails with commas.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            <div>
              <label className="block text-xs font-black text-white uppercase tracking-wider mb-2">
                Default Notification Email (TO)
              </label>
              <input
                type="text"
                value={defaultRecipients}
                onChange={(e) => setDefaultRecipients(e.target.value)}
                placeholder="admissions@cismandi.edu.in, principal@cismandi.edu.in"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono font-semibold text-xs sm:text-sm focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-white uppercase tracking-wider mb-2">
                Default CC
              </label>
              <input
                type="text"
                value={defaultCc}
                onChange={(e) => setDefaultCc(e.target.value)}
                placeholder="office@cismandi.edu.in"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono font-semibold text-xs sm:text-sm focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-white uppercase tracking-wider mb-2">
                Default BCC
              </label>
              <input
                type="text"
                value={defaultBcc}
                onChange={(e) => setDefaultBcc(e.target.value)}
                placeholder="audit@cismandi.edu.in"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono font-semibold text-xs sm:text-sm focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testingConnection}
              className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-black text-amber-300 hover:text-white border border-amber-400/40 hover:border-amber-400 flex items-center gap-2 transition-all disabled:opacity-50 shadow-md"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testingConnection ? "animate-spin" : ""}`} />
              <span>{testingConnection ? "Testing Handshake..." : "TEST CONNECTION"}</span>
            </button>

            <button
              type="button"
              onClick={() => setTestModalOpen(true)}
              className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-black text-slate-100 hover:text-white border border-slate-700 hover:border-slate-600 flex items-center gap-2 transition-all shadow-md"
            >
              <Send className="w-3.5 h-3.5 text-blue-400" />
              <span>SEND TEST EMAIL</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Save className={`w-4 h-4 ${saving ? "animate-spin" : ""}`} />
            <span>{saving ? "SAVING SETTINGS..." : "SAVE EMAIL SETTINGS"}</span>
          </button>
        </div>
      </form>

      {/* SECTION 7: SEND TEST EMAIL MODAL */}
      {testModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2 text-white font-black text-lg">
                <Send className="w-5 h-5 text-amber-400" />
                <span>Send Live Test Email</span>
              </div>
              <button
                onClick={() => setTestModalOpen(false)}
                className="text-slate-300 hover:text-white font-bold text-lg p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendTestEmail} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-white uppercase tracking-wider mb-2">
                  Send To Email Address <span className="text-rose-400">*</span>
                </label>
                <input
                  type="email"
                  value={testTo}
                  onChange={(e) => setTestTo(e.target.value)}
                  placeholder="admin@example.com"
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
                  value={testSubject}
                  onChange={(e) => setTestSubject(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-semibold text-xs sm:text-sm focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-white uppercase tracking-wider mb-2">
                  Test Message Body <span className="text-rose-400">*</span>
                </label>
                <textarea
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-medium text-xs sm:text-sm focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              {sendResult && (
                <div
                  className={`p-4 rounded-xl text-xs font-bold border ${
                    sendResult.success
                      ? "bg-emerald-950 border-emerald-500 text-emerald-100"
                      : "bg-rose-950 border-rose-500 text-rose-100"
                  }`}
                >
                  {sendResult.success ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-300 flex-shrink-0" />
                      <span>✓ Test email sent successfully! Verified in Email Delivery Logs.</span>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2">
                      <XCircle className="w-5 h-5 text-rose-300 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-extrabold text-sm">Failed to send test email</p>
                        <p className="text-xs font-mono text-rose-200 mt-1">{sendResult.error}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setTestModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-800"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={sendingTest}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg flex items-center gap-2 disabled:opacity-50"
                >
                  <Send className={`w-3.5 h-3.5 ${sendingTest ? "animate-spin" : ""}`} />
                  <span>{sendingTest ? "Sending Test..." : "SEND TEST EMAIL NOW"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
