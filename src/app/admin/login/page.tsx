"use client";

import React, { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  GraduationCap,
  Lock,
  Mail,
  Key,
  Eye,
  EyeOff,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  AlertCircle,
  RefreshCw,
  Volume2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Fingerprint,
} from "lucide-react";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);

  // CAPTCHA State
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [captchaCode, setCaptchaCode] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [isCaptchaValid, setIsCaptchaValid] = useState<boolean | null>(null);
  const [captchaSpinning, setCaptchaSpinning] = useState(false);

  // Advanced Interactive Effects State
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [shaking, setShaking] = useState(false);

  // Trigger tactile shake animation
  const triggerShake = () => {
    setShaking(true);
    setTimeout(() => setShaking(false), 600);
  };

  // Generate a cryptographically styled canvas CAPTCHA
  const generateCaptcha = useCallback(() => {
    setCaptchaSpinning(true);
    setTimeout(() => setCaptchaSpinning(false), 500);

    const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"; // Avoid ambiguous characters (0, O, 1, I)
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setIsCaptchaValid(null);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Reset & clear
    ctx.clearRect(0, 0, width, height);

    // Deep tech gradient background
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, "#07172b");
    grad.addColorStop(0.5, "#0b223c");
    grad.addColorStop(1, "#061325");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Subtle background mesh grid
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 15) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 15) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Security interference curves
    const lineColors = [
      "rgba(245, 158, 11, 0.45)",
      "rgba(59, 130, 246, 0.55)",
      "rgba(16, 185, 129, 0.45)",
      "rgba(168, 85, 247, 0.5)",
    ];
    for (let i = 0; i < 4; i++) {
      ctx.strokeStyle = lineColors[i % lineColors.length];
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(Math.random() * 20, Math.random() * height);
      ctx.bezierCurveTo(
        Math.random() * width,
        Math.random() * height,
        Math.random() * width,
        Math.random() * height,
        width - Math.random() * 20,
        Math.random() * height
      );
      ctx.stroke();
    }

    // Random security noise points
    for (let i = 0; i < 55; i++) {
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.25})`;
      ctx.beginPath();
      ctx.arc(
        Math.random() * width,
        Math.random() * height,
        Math.random() * 1.5,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    // Draw characters with distinct vibrant colors, rotations, and slight jitter
    const charHues = ["#F59E0B", "#38BDF8", "#34D399", "#A78BFA", "#FBBF24", "#60A5FA"];
    const charSpacing = width / (code.length + 1);

    for (let i = 0; i < code.length; i++) {
      const char = code[i];
      ctx.save();
      const x = (i + 1) * charSpacing;
      const y = height / 2 + (Math.random() * 6 - 3);
      const angle = (Math.random() * 28 - 14) * (Math.PI / 180);

      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.font = `900 ${22 + Math.floor(Math.random() * 4)}px monospace`;
      ctx.fillStyle = charHues[i % charHues.length];
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "rgba(0,0,0,0.8)";
      ctx.shadowBlur = 6;
      ctx.fillText(char, 0, 0);
      ctx.restore();
    }
  }, []);

  // Initialize CAPTCHA once canvas is mounted
  useEffect(() => {
    generateCaptcha();
  }, [generateCaptcha]);

  // Audio accessibility readout for CAPTCHA
  const speakCaptcha = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const textToSpeak = captchaCode.split("").join(" . ");
      const utterance = new SpeechSynthesisUtterance(`Security verification code is: ${textToSpeak}`);
      utterance.rate = 0.85;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Live CAPTCHA validation
  const handleCaptchaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase();
    setCaptchaInput(val);
    if (val.length === 6) {
      setIsCaptchaValid(val === captchaCode.toUpperCase());
    } else {
      setIsCaptchaValid(null);
    }
  };

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

  // Handle 3D Mouse Parallax Tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -5; // max 5 deg tilt
    const rY = ((x - centerX) / centerX) * 5;

    setRotateX(rX);
    setRotateY(rY);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.12,
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  // Keyboard Caps Lock detection
  const checkCapsLock = (e: React.KeyboardEvent) => {
    if (e.getModifierState) {
      setCapsLockActive(e.getModifierState("CapsLock"));
    }
  };

  // Dynamic Password Strength Calculator
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: "", color: "bg-slate-800" };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 1:
        return { score: 1, label: "Basic", color: "bg-rose-500", text: "text-rose-400" };
      case 2:
        return { score: 2, label: "Medium", color: "bg-amber-500", text: "text-amber-400" };
      case 3:
        return { score: 3, label: "Strong", color: "bg-sky-500", text: "text-sky-400" };
      case 4:
        return { score: 4, label: "Military-Grade", color: "bg-emerald-500", text: "text-emerald-400" };
      default:
        return { score: 0, label: "", color: "bg-slate-800", text: "text-slate-500" };
    }
  };

  const passwordStrength = getPasswordStrength(password);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter your admin email and password.");
      triggerShake();
      return;
    }

    if (!captchaInput.trim()) {
      setError("Please complete the security CAPTCHA verification.");
      triggerShake();
      return;
    }

    if (captchaInput.trim().toUpperCase() !== captchaCode.toUpperCase()) {
      setError("Incorrect security CAPTCHA code. A new code has been generated.");
      triggerShake();
      generateCaptcha();
      setCaptchaInput("");
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
      triggerShake();
      generateCaptcha();
      setCaptchaInput("");
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-school-secondary border-t-amber-400 rounded-full animate-spin shadow-lg shadow-amber-400/20" />
        <p className="text-xs font-semibold text-slate-300 tracking-wide uppercase">
          Verifying Security Handshake...
        </p>
      </div>
    );
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: rotateX === 0 && rotateY === 0 ? "transform 0.5s ease-out" : "none",
      }}
      className={`max-w-md w-full rounded-3xl p-7 sm:p-9 border border-white/15 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_rgba(0,102,255,0.18)] space-y-6 relative z-10 bg-slate-900/90 text-white backdrop-blur-2xl transition-shadow duration-300 overflow-hidden ${
        shaking ? "animate-[shake_0.5s_ease-in-out]" : ""
      }`}
    >
      {/* 3D Dynamic Glare Effect Overlay */}
      <div
        className="pointer-events-none absolute -inset-px rounded-3xl transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle 350px at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,${glarePos.opacity}), transparent 80%)`,
        }}
      />

      {/* Top Ambient Glow Ribbon */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-school-secondary via-amber-400 to-emerald-400 opacity-90" />

      {/* School Emblem & Header */}
      <div className="text-center space-y-3 relative">
        <div className="relative inline-block">
          {/* Animated Halo Ring */}
          <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-400 via-blue-500 to-indigo-600 rounded-3xl blur-md opacity-70 animate-pulse" />
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-school-secondary via-blue-600 to-school-primary flex items-center justify-center text-amber-400 relative shadow-2xl border border-white/20">
            <GraduationCap className="w-9 h-9 transform hover:scale-110 transition-transform" />
          </div>
        </div>

        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 bg-amber-400/10 border border-amber-400/25 px-3 py-1 rounded-full text-[10px] font-bold text-amber-300 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
            <span>Authorized Administrator Portal</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black font-heading tracking-tight text-white mt-1">
            CAMBRIDGE INTERNATIONAL SCHOOL, MANDI
          </h1>
          <p className="text-xs text-slate-400">
            Sign in with authorized administrator credentials
          </p>
        </div>
      </div>

      {/* Error Alert with Tactile Animation */}
      {error && (
        <div className="p-3.5 bg-rose-950/80 border border-rose-700/80 text-rose-200 text-xs rounded-2xl flex items-start space-x-2.5 animate-in fade-in slide-in-from-top-2 duration-200 shadow-lg shadow-rose-950/40">
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
            <span className="text-[10px] text-slate-500 font-normal">Encrypted SSO</span>
          </label>
          <div className="relative group">
            <Mail className="w-4 h-4 text-slate-400 group-focus-within:text-amber-400 transition-colors absolute left-3.5 top-3.5" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@cambridgemandi.com"
              autoComplete="off"
              className="w-full bg-slate-950/80 text-white pl-10 pr-4 py-3 text-xs rounded-xl border border-slate-700/80 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/25 transition-all placeholder:text-slate-600 font-medium"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label className="font-bold text-slate-300">Password</label>
            {capsLockActive && (
              <span className="text-[10px] font-bold text-amber-400 flex items-center space-x-1 animate-pulse">
                <ShieldAlert className="w-3 h-3" />
                <span>Caps Lock is ON</span>
              </span>
            )}
          </div>
          <div className="relative group">
            <Key className="w-4 h-4 text-slate-400 group-focus-within:text-amber-400 transition-colors absolute left-3.5 top-3.5" />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={checkCapsLock}
              onKeyUp={checkCapsLock}
              placeholder="••••••••••••"
              autoComplete="new-password"
              className="w-full bg-slate-950/80 text-white pl-10 pr-10 py-3 text-xs rounded-xl border border-slate-700/80 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/25 transition-all placeholder:text-slate-600 font-medium"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-3.5 text-slate-400 hover:text-amber-300 transition-colors cursor-pointer"
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Password Strength Indicator */}
          {password && (
            <div className="pt-1 space-y-1 animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-slate-400">Security Strength:</span>
                <span className={`font-bold ${passwordStrength.text}`}>
                  {passwordStrength.label}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1 h-1">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`h-full rounded-full transition-all duration-300 ${
                      step <= passwordStrength.score ? passwordStrength.color : "bg-slate-800"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* INTERACTIVE GRAPHICAL SECURITY CAPTCHA */}
        {/* ========================================================================= */}
        <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-300 flex items-center space-x-1.5">
              <Fingerprint className="w-3.5 h-3.5 text-amber-400" />
              <span>Anti-Bot Verification</span>
            </span>
            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={speakCaptcha}
                title="Listen to verification code"
                className="p-1 rounded-lg text-slate-400 hover:text-sky-400 hover:bg-sky-400/10 transition-colors cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={generateCaptcha}
                title="Generate new verification code"
                className="p-1 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-400/10 transition-colors cursor-pointer"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${captchaSpinning ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Visual Distorted Canvas */}
            <div className="rounded-xl overflow-hidden border border-slate-700/80 shadow-inner flex-shrink-0 bg-slate-900">
              <canvas
                ref={canvasRef}
                width={150}
                height={44}
                className="block select-none cursor-pointer hover:opacity-95 transition-opacity"
                onClick={generateCaptcha}
                title="Click image to refresh code"
              />
            </div>

            {/* User Input Field */}
            <div className="relative flex-1">
              <input
                type="text"
                required
                maxLength={6}
                value={captchaInput}
                onChange={handleCaptchaChange}
                placeholder="Enter 6 chars"
                className={`w-full bg-slate-900 text-white px-3 py-2.5 text-xs rounded-xl border font-mono uppercase tracking-widest focus:outline-none transition-all ${
                  isCaptchaValid === true
                    ? "border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-300"
                    : isCaptchaValid === false
                    ? "border-rose-500 ring-2 ring-rose-500/20 text-rose-300"
                    : "border-slate-700/80 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                }`}
              />
              {isCaptchaValid === true && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 absolute right-2.5 top-2.5 animate-in zoom-in-50" />
              )}
            </div>
          </div>
          <p className="text-[10px] text-slate-500 flex items-center justify-between">
            <span>Type characters shown in the security box</span>
            <span className="text-slate-600 font-mono">Case-insensitive</span>
          </p>
        </div>

        {/* Remember Me & Session Duration */}
        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center space-x-2 text-slate-300 cursor-pointer select-none group">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-amber-400 focus:ring-amber-400/40 focus:ring-offset-slate-950 cursor-pointer accent-amber-400 transition-transform group-hover:scale-110"
            />
            <span className="text-[11px] font-medium group-hover:text-white transition-colors">
              Keep me signed in (7 days)
            </span>
          </label>
          <span className="text-[10px] text-slate-500 font-medium">
            {rememberMe ? "Persistent Session" : "Session Only"}
          </span>
        </div>

        {/* Submit Button with Dynamic Hover & Glow */}
        <button
          type="submit"
          disabled={loading}
          className="w-full relative group overflow-hidden inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-school-secondary via-blue-600 to-indigo-600 hover:from-blue-500 hover:to-school-secondary text-white font-bold py-3.5 rounded-xl text-xs shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-blue-500/25 active:scale-[0.99] cursor-pointer border border-blue-400/20"
        >
          {/* Shimmer sweep animation */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Verifying Cryptographic Tokens...</span>
            </>
          ) : (
            <>
              <Lock className="w-3.5 h-3.5 text-amber-300 group-hover:rotate-12 transition-transform" />
              <span className="tracking-wide">Secure Authenticate & Enter</span>
              <ArrowRight className="w-3.5 h-3.5 text-blue-200 group-hover:translate-x-1 transition-transform" />
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
      <div className="text-center pt-0.5">
        <Link
          href="/"
          className="text-xs text-slate-400 hover:text-amber-400 transition-colors inline-flex items-center space-x-1.5 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          <span>Return to Public Website</span>
        </Link>
      </div>

      {/* Custom Keyframe Animation for Shake */}
      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#051329] flex flex-col justify-center items-center p-4 relative overflow-hidden select-none">
      {/* Dynamic Cyber Grid Background Pattern */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      {/* Multi-Layered Floating Aurora Orbs */}
      <div className="absolute -top-40 -left-40 w-[480px] h-[480px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse duration-[8000ms]" />
      <div className="absolute -bottom-40 -right-40 w-[480px] h-[480px] bg-amber-400/15 rounded-full blur-[120px] pointer-events-none animate-pulse duration-[7000ms]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Suspended Form */}
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
