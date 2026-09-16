"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  GraduationCap,
  Lock,
  Mail,
  Key,
  Eye,
  EyeOff,
  ShieldCheck,
  Loader2,
  AlertCircle,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check if already authenticated on mount
  useEffect(() => {
    async function verifyExistingAuth() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (res.ok && data.authenticated) {
          router.replace(callbackUrl);
          return;
        }
      } catch (err) {
        // Not authenticated
      } finally {
        setCheckingAuth(false);
      }
    }
    verifyExistingAuth();
  }, [callbackUrl, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter your admin email and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
          rememberMe,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Invalid administrator credentials. Access denied.");
      }

      // Successful login
      router.push(callbackUrl);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please try again.");
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-school-secondary border-t-amber-400 rounded-full animate-spin" />
        <p className="text-xs font-semibold text-slate-400">Verifying secure session...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full glass-card rounded-3xl p-8 sm:p-10 border border-white/10 shadow-2xl space-y-6 relative z-10 bg-slate-900/95 text-white backdrop-blur-2xl">
      {/* School Emblem & Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-school-secondary to-blue-600 flex items-center justify-center text-amber-400 mx-auto shadow-xl border border-amber-400/30">
          <GraduationCap className="w-9 h-9" />
        </div>
        <div>
          <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest block">
            Cambridge International School, Mandi
          </span>
          <h1 className="text-2xl font-black font-heading text-white tracking-tight mt-0.5">
            Admin CMS Portal
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Sign in with authorized administrator credentials
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-3.5 bg-rose-950/80 border border-rose-800 text-rose-200 text-xs rounded-2xl flex items-start space-x-2.5 animate-in fade-in slide-in-from-top-2 duration-200 shadow-md">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span className="leading-relaxed font-medium">{error}</span>
        </div>
      )}

      {/* Secure Login Form */}
      <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">
        {/* Email Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
            <span>Admin Email</span>
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered admin email"
              autoComplete="off"
              className="w-full bg-slate-950 text-white pl-10 pr-4 py-3 text-xs rounded-xl border border-slate-700/80 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all placeholder:text-slate-600 font-medium"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300">Password</label>
          <div className="relative">
            <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your secure password"
              autoComplete="new-password"
              className="w-full bg-slate-950 text-white pl-10 pr-10 py-3 text-xs rounded-xl border border-slate-700/80 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all placeholder:text-slate-600 font-medium"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-200 transition-colors"
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Remember Me & Session Duration */}
        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center space-x-2 text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-amber-400 focus:ring-amber-400/40 focus:ring-offset-slate-950 cursor-pointer accent-amber-400"
            />
            <span className="text-[11px] font-medium">Keep me signed in (7 days)</span>
          </label>
          <span className="text-[10px] text-slate-500">
            {rememberMe ? "Persistent" : "Session only"}
          </span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-school-secondary via-blue-600 to-school-primary hover:from-blue-600 hover:to-school-secondary text-white font-bold py-3.5 rounded-xl text-xs shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-blue-500/20 active:scale-[0.99] cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Verifying Credentials...</span>
            </>
          ) : (
            <>
              <Lock className="w-3.5 h-3.5 text-amber-300" />
              <span>Secure Authenticate & Enter</span>
            </>
          )}
        </button>
      </form>

      {/* Security Guarantee Notice */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-center space-x-2 text-slate-400 text-[11px]">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>256-Bit Encrypted Portal • Authorized Personnel Only</span>
      </div>

      {/* Return to Public Website */}
      <div className="text-center pt-1">
        <Link
          href="/"
          className="text-xs text-slate-400 hover:text-amber-400 transition-colors inline-flex items-center space-x-1"
        >
          <span>← Return to Public Website</span>
        </Link>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Ambient Mountain Glow Backdrop */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-school-secondary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

      <Suspense
        fallback={
          <div className="min-h-[400px] flex items-center justify-center text-white">
            <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
