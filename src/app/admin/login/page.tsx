"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Lock, Mail, Key, ShieldCheck, ArrowRight, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@cismandi.edu.in");
  const [password, setPassword] = useState("Admin@12345");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const setDemoRole = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("Admin@12345");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Mountain Glow Backdrop */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-school-secondary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full glass-card rounded-3xl p-8 border border-white/10 shadow-2xl space-y-6 relative z-10 bg-slate-900/90 text-white">
        {/* Logo & Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-school-secondary to-blue-600 flex items-center justify-center text-amber-400 mx-auto shadow-lg border border-amber-400/30">
            <GraduationCap className="w-8 h-8" />
          </div>
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest block">
            Cambridge International School, Mandi
          </span>
          <h1 className="text-2xl font-bold font-heading text-white">
            Administrative CMS Portal
          </h1>
          <p className="text-xs text-slate-400">
            Secure Role-Based Content & Admissions Management
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-300 text-xs rounded-xl">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@cismandi.edu.in"
                className="w-full bg-slate-950/80 text-white pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">
              Password
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950/80 text-white pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-school-secondary to-blue-600 hover:from-blue-600 hover:to-school-primary text-white font-bold py-3 rounded-xl text-xs shadow-lg transition-all duration-200"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-amber-300" />
                <span>Authenticate & Access Dashboard</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Fast-Login Helper */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
            Quick-Fill Demo Credentials
          </p>
          <div className="grid grid-cols-3 gap-1.5 text-[11px]">
            <button
              type="button"
              onClick={() => setDemoRole("admin@cismandi.edu.in")}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold truncate border border-slate-700"
            >
              Super Admin
            </button>
            <button
              type="button"
              onClick={() => setDemoRole("principal@cismandi.edu.in")}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300 font-semibold truncate border border-slate-700"
            >
              Principal
            </button>
            <button
              type="button"
              onClick={() => setDemoRole("editor@cismandi.edu.in")}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 font-semibold truncate border border-slate-700"
            >
              Staff Editor
            </button>
          </div>
        </div>

        <div className="text-center pt-2">
          <Link href="/" className="text-xs text-slate-400 hover:text-white transition-colors">
            ← Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}
