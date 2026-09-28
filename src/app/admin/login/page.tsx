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
  ArrowRight,
  Fingerprint,
} from "lucide-react";
import Link from "next/link";

function generateRandomCode(): string {
  const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"; // No ambiguous characters (0, O, 1, I)
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

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

  // CAPTCHA State with immediate fallback code
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [captchaCode, setCaptchaCode] = useState<string>("8K4X9B");
  const [captchaInput, setCaptchaInput] = useState("");
  const [isCaptchaValid, setIsCaptchaValid] = useState<boolean | null>(null);
  const [captchaSpinning, setCaptchaSpinning] = useState(false);

  // 3D Parallax & Tactile State
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [shaking, setShaking] = useState(false);

  const triggerShake = () => {
    setShaking(true);
    setTimeout(() => setShaking(false), 600);
  };

  // Generate & render cryptographic canvas CAPTCHA
  const generateCaptcha = useCallback(() => {
    setCaptchaSpinning(true);
    setTimeout(() => setCaptchaSpinning(false), 450);

    const newCode = generateRandomCode();
    setCaptchaCode(newCode);
    setIsCaptchaValid(null);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width || 160;
    const height = canvas.height || 48;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Deep tech cyber gradient
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, "#061325");
    grad.addColorStop(0.5, "#0b223c");
    grad.addColorStop(1, "#07172b");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 16) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 16) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Security bezier curves
    const colors = ["#F59E0B", "#38BDF8", "#10B981", "#A78BFA"];
    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = colors[i % colors.length];
      ctx.lineWidth = 1.6;
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

    // Character drawing with distinct rotation and color
    const charSpacing = width / (newCode.length + 1);
    const charHues = ["#FBBF24", "#38BDF8", "#34D399", "#A78BFA", "#F59E0B", "#60A5FA"];

    for (let i = 0; i < newCode.length; i++) {
      const char = newCode[i];
      ctx.save();
      const x = (i + 1) * charSpacing;
      const y = height / 2 + (Math.random() * 4 - 2);
      const angle = (Math.random() * 24 - 12) * (Math.PI / 180);

      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.font = `900 24px monospace`;
      ctx.fillStyle = charHues[i % charHues.length];
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "rgba(0,0,0,0.85)";
      ctx.shadowBlur = 6;
      ctx.fillText(char, 0, 0);
      ctx.restore();
    }
  }, []);

  useEffect(() => {
    // Generate fresh code and draw on canvas
    const timer = setTimeout(() => {
      generateCaptcha();
    }, 50);
    return () => clearTimeout(timer);
  }, [generateCaptcha]);

  // Audio speech accessibility
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

  const handleCaptchaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase();
    setCaptchaInput(val);
    if (val.length === 6) {
      setIsCaptchaValid(val === captchaCode.toUpperCase());
    } else {
      setIsCaptchaValid(null);
    }
  };

  // Verify existing auth on mount
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

  // Mouse tilt parallax
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -5;
    const rY = ((x - centerX) / centerX) * 5;

    setRotateX(rX);
    setRotateY(rY);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.15,
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  const checkCapsLock = (e: React.KeyboardEvent) => {
    if (e.getModifierState) {
      setCapsLockActive(e.getModifierState("CapsLock"));
    }
  };

  // Password strength
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: "", color: "bg-slate-800", text: "text-slate-500" };
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
        return { score: 4, label: "Encrypted", color: "bg-emerald-500", text: "text-emerald-400" };
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
      setError("Please enter the anti-bot verification code.");
      triggerShake();
      return;
    }

    if (captchaInput.trim().toUpperCase() !== captchaCode.toUpperCase()) {
      setError("Incorrect verification code. A new code has been generated.");
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
    /* ========================================================================= */
    /* LUMINOUS TRAVELING BORDER BEAM WRAPPER                                    */
    /* ========================================================================= */
    <div className="relative p-[1.5px] rounded-[32px] overflow-hidden group shadow-2xl shadow-black/80 max-w-md w-full">
      {/* 1. Razor-Thin Rotating Laser Beam strictly on the border track */}
      <div
        className="absolute inset-[-150%] animate-[spin_5s_linear_infinite] pointer-events-none"
        style={{
          background:
            "conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 280deg, #F59E0B 320deg, #0066FF 345deg, #00F0FF 360deg)",
        }}
      />

      {/* 2. Main Solid Card Container (0% light bleed inside) */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: rotateX === 0 && rotateY === 0 ? "transform 0.5s ease-out" : "none",
        }}
        className={`relative rounded-[30.5px] p-7 sm:p-9 bg-slate-950 text-white space-y-6 z-10 transition-shadow duration-300 overflow-hidden border border-white/5 ${
          shaking ? "animate-[shake_0.5s_ease-in-out]" : ""
        }`}
      >
        {/* Dynamic 3D Glare */}
        <div
          className="pointer-events-none absolute -inset-px rounded-[30px] transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 350px at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,${glarePos.opacity}), transparent 80%)`,
          }}
        />

        {/* School Emblem & Header */}
        <div className="text-center space-y-3 relative">
          <div className="relative inline-block">
            {/* Animated Ring of Light */}
            <div className="absolute -inset-2 bg-gradient-to-r from-amber-400 via-blue-500 to-cyan-400 rounded-3xl blur-md opacity-75 animate-pulse" />
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-school-secondary via-blue-600 to-school-primary flex items-center justify-center text-amber-400 relative shadow-2xl border border-white/25">
              <GraduationCap className="w-9 h-9 transform hover:scale-110 transition-transform duration-300" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 bg-amber-400/15 border border-amber-400/30 px-3 py-1 rounded-full text-[10px] font-bold text-amber-300 uppercase tracking-widest shadow-sm">
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

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 bg-rose-950/85 border border-rose-700 text-rose-200 text-xs rounded-2xl flex items-start space-x-2.5 animate-in fade-in slide-in-from-top-2 duration-200 shadow-lg shadow-rose-950/50">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed font-medium">{error}</span>
          </div>
        )}

        {/* Secure Login Form */}
        <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">
          {/* Email Field with Glowing Border on Focus */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>Admin Email</span>
              <span className="text-[10px] text-slate-500 font-normal">Encrypted SSO</span>
            </label>
            <div className="relative group rounded-xl p-[1px] transition-all duration-300 focus-within:bg-gradient-to-r focus-within:from-amber-400 focus-within:to-blue-500 focus-within:shadow-[0_0_20px_rgba(245,158,11,0.25)]">
              <div className="relative flex items-center bg-slate-900 rounded-[11px] overflow-hidden">
                <Mail className="w-4 h-4 text-slate-400 ml-3.5 group-focus-within:text-amber-400 transition-colors shrink-0" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@cambridgemandi.com"
                  autoComplete="off"
                  className="w-full bg-transparent text-white pl-3 pr-4 py-3 text-xs focus:outline-none placeholder:text-slate-600 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Password Field with Glowing Border on Focus */}
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
            <div className="relative group rounded-xl p-[1px] transition-all duration-300 focus-within:bg-gradient-to-r focus-within:from-amber-400 focus-within:to-blue-500 focus-within:shadow-[0_0_20px_rgba(245,158,11,0.25)]">
              <div className="relative flex items-center bg-slate-900 rounded-[11px] overflow-hidden">
                <Key className="w-4 h-4 text-slate-400 ml-3.5 group-focus-within:text-amber-400 transition-colors shrink-0" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={checkCapsLock}
                  onKeyUp={checkCapsLock}
                  placeholder="••••••••••••"
                  autoComplete="new-password"
                  className="w-full bg-transparent text-white pl-3 pr-10 py-3 text-xs focus:outline-none placeholder:text-slate-600 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-amber-300 transition-colors cursor-pointer"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
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
          {/* HIGH-TECH ANTI-BOT VERIFICATION BOX (CANVAS + GUARANTEED CRISP DOM OVERLAY) */}
          {/* ========================================================================= */}
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 space-y-2.5 shadow-inner">
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
                  className="p-1.5 rounded-lg text-slate-400 hover:text-sky-400 hover:bg-sky-400/10 transition-colors cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={generateCaptcha}
                  title="Generate new verification code"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-400/10 transition-colors cursor-pointer"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${captchaSpinning ? "animate-spin" : ""}`}
                  />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Graphic Code Container with Guaranteed Visual Rendering */}
              <div
                onClick={generateCaptcha}
                title="Click image to refresh security code"
                className="relative w-[150px] h-[46px] rounded-xl overflow-hidden border border-slate-600/90 shadow-inner flex items-center justify-center bg-slate-950 cursor-pointer select-none group"
              >
                {/* Dynamic Canvas */}
                <canvas
                  ref={canvasRef}
                  width={150}
                  height={46}
                  className="absolute inset-0 block w-full h-full"
                />

                {/* DOM Crisp Overlay for Guaranteed Visibility */}
                <div className="relative z-10 flex items-center justify-center space-x-1.5 font-mono text-base font-black tracking-widest pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                  {captchaCode.split("").map((c, i) => {
                    const colors = [
                      "text-amber-400",
                      "text-sky-400",
                      "text-emerald-400",
                      "text-purple-400",
                      "text-yellow-300",
                      "text-blue-300",
                    ];
                    return (
                      <span key={i} className={`${colors[i % colors.length]}`}>
                        {c}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Input Field with Validation State */}
              <div className="relative flex-1">
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={captchaInput}
                  onChange={handleCaptchaChange}
                  placeholder="Enter 6 chars"
                  className={`w-full bg-slate-950 text-white px-3 py-3 text-xs rounded-xl border font-mono uppercase tracking-widest focus:outline-none transition-all ${
                    isCaptchaValid === true
                      ? "border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-300"
                      : isCaptchaValid === false
                      ? "border-rose-500 ring-2 ring-rose-500/20 text-rose-300"
                      : "border-slate-700/80 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                  }`}
                />
                {isCaptchaValid === true && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 absolute right-2.5 top-3.5 animate-in zoom-in-50" />
                )}
              </div>
            </div>
            <p className="text-[10px] text-slate-400 flex items-center justify-between">
              <span>Type characters shown in security box</span>
              <span className="text-slate-500 font-mono">Case-insensitive</span>
            </p>
          </div>

          {/* Remember Me */}
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

          {/* Glowing Luminous Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full relative group overflow-hidden inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-school-secondary via-blue-600 to-indigo-600 hover:from-blue-500 hover:to-school-secondary text-white font-bold py-3.5 rounded-xl text-xs shadow-[0_0_25px_rgba(0,102,255,0.45)] hover:shadow-[0_0_35px_rgba(245,158,11,0.45)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99] cursor-pointer border border-blue-400/30"
          >
            {/* Shimmer sweep */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

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

        {/* Shake Keyframe */}
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
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#030914] flex flex-col justify-center items-center p-4 relative overflow-hidden select-none">
      {/* Authentic Deep Space Canvas: Real Stars, Real Celestial Planets & Real Orbital Satellite */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none bg-[#020512]">
        {/* Layer 0: Photorealistic Real Space Cosmos with Earth, Saturn, Jupiter, Starfield & Orbital Satellite */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 ease-out"
          style={{
            backgroundImage: "url('/images/real-space-satellite.jpg')",
            filter: "brightness(0.92) contrast(1.08)",
            animation: "spaceDrift 30s ease-in-out infinite alternate",
          }}
        />

        {/* Layer 1: Real Satellite Orbital Telemetry Indicators (Pulsing Nav Beacon LEDs on Satellite Array) */}
        {/* Top-Right Satellite Nav Beacon - Emerald Green Telemetry */}
        <div className="absolute top-[24%] right-[22%] sm:right-[26%] pointer-events-none z-10">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-300 shadow-[0_0_8px_#34d399]" />
          </span>
        </div>
        {/* Top-Right Satellite Solar Truss Strobe - Crimson Red Beacon */}
        <div className="absolute top-[28%] right-[19%] sm:right-[23%] pointer-events-none z-10">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-80" style={{ animationDuration: "1.8s" }} />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-400 shadow-[0_0_6px_#f43f5e]" />
          </span>
        </div>
        {/* Top-Right Satellite Communication Dish - Cyan Pulse */}
        <div className="absolute top-[21%] right-[28%] sm:right-[31%] pointer-events-none z-10">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-70" style={{ animationDuration: "2.4s" }} />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-300 shadow-[0_0_8px_#38bdf8]" />
          </span>
        </div>

        {/* Layer 2: Cosmic Space Aura & Interstellar Light Sheen */}
        {/* Earth Atmospheric Limb Aura (Bottom-Left / Center Glow) */}
        <div
          className="absolute -bottom-20 -left-20 w-[800px] h-[800px] rounded-full blur-[140px] opacity-35 pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(14,165,233,0.55) 0%, rgba(59,130,246,0.3) 45%, rgba(15,23,42,0.1) 75%, transparent 85%)",
            animation: "spaceAuraDrift1 22s ease-in-out infinite alternate",
          }}
        />

        {/* Ringed Saturn & Deep Galaxy Violet Aura (Top-Right) */}
        <div
          className="absolute -top-20 -right-20 w-[850px] h-[850px] rounded-full blur-[150px] opacity-30 pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(168,85,247,0.45) 0%, rgba(245,158,11,0.2) 40%, rgba(99,102,241,0.15) 70%, transparent 85%)",
            animation: "spaceAuraDrift2 26s ease-in-out infinite alternate",
          }}
        />

        {/* Layer 3: Brilliant Star Flares with 4-Point Diffraction Crosses */}
        {/* Real Star Flare 1 (Top Left Deep Space) */}
        <div
          className="absolute top-[12%] left-[16%] pointer-events-none"
          style={{ animation: "starShine 3.4s ease-in-out infinite alternate" }}
        >
          <div className="relative flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_12px_#ffffff]" />
            <div className="absolute w-8 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent" />
            <div className="absolute h-8 w-[1.5px] bg-gradient-to-b from-transparent via-white to-transparent" />
            <div className="absolute w-4 h-[1px] bg-cyan-200 transform rotate-45" />
            <div className="absolute w-4 h-[1px] bg-cyan-200 transform -rotate-45" />
          </div>
        </div>

        {/* Real Star Flare 2 (Top Center Cosmic Void) */}
        <div
          className="absolute top-[7%] left-[48%] pointer-events-none"
          style={{ animation: "starShine 4.2s ease-in-out 1s infinite alternate" }}
        >
          <div className="relative flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-cyan-100 shadow-[0_0_14px_#38bdf8]" />
            <div className="absolute w-9 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-100 to-transparent" />
            <div className="absolute h-9 w-[1.5px] bg-gradient-to-b from-transparent via-cyan-100 to-transparent" />
          </div>
        </div>

        {/* Real Star Flare 3 (Right Edge Deep Nebula) */}
        <div
          className="absolute top-[44%] right-[8%] pointer-events-none"
          style={{ animation: "starShine 3.8s ease-in-out 0.6s infinite alternate" }}
        >
          <div className="relative flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-100 shadow-[0_0_12px_#fbbf24]" />
            <div className="absolute w-7 h-[1.5px] bg-gradient-to-r from-transparent via-amber-100 to-transparent" />
            <div className="absolute h-7 w-[1.5px] bg-gradient-to-b from-transparent via-amber-100 to-transparent" />
          </div>
        </div>

        {/* Real Star Flare 4 (Bottom-Right Deep Cosmos) */}
        <div
          className="absolute bottom-[18%] right-[18%] pointer-events-none"
          style={{ animation: "starShine 4.6s ease-in-out 1.4s infinite alternate" }}
        >
          <div className="relative flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-purple-100 shadow-[0_0_14px_#c084fc]" />
            <div className="absolute w-8 h-[1.5px] bg-gradient-to-r from-transparent via-purple-100 to-transparent" />
            <div className="absolute h-8 w-[1.5px] bg-gradient-to-b from-transparent via-purple-100 to-transparent" />
          </div>
        </div>

        {/* Real Star Flare 5 (Mid-Left Horizon) */}
        <div
          className="absolute top-[52%] left-[8%] pointer-events-none"
          style={{ animation: "starShine 3.6s ease-in-out 0.8s infinite alternate" }}
        >
          <div className="relative flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_#ffffff]" />
            <div className="absolute w-6 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent" />
            <div className="absolute h-6 w-[1.5px] bg-gradient-to-b from-transparent via-white to-transparent" />
          </div>
        </div>

        {/* Layer 4: High-Velocity Meteor / Shooting Star Streaks */}
        <div
          className="absolute top-[14%] right-[32%] pointer-events-none"
          style={{ animation: "meteorStreak1 10s ease-in-out infinite" }}
        >
          <div className="w-36 h-[2px] bg-gradient-to-r from-white via-cyan-400 to-transparent rounded-full shadow-[0_0_8px_#38bdf8] transform -rotate-[35deg]" />
        </div>

        <div
          className="absolute top-[36%] left-[24%] pointer-events-none"
          style={{ animation: "meteorStreak2 14s ease-in-out 6s infinite" }}
        >
          <div className="w-28 h-[1.5px] bg-gradient-to-r from-white via-amber-300 to-transparent rounded-full shadow-[0_0_8px_#fde047] transform -rotate-[35deg]" />
        </div>

        {/* Layer 5: Deep Space Vignette (Preserves maximum contrast for admin login card) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 50%, rgba(2,5,18,0.3) 0%, rgba(2,5,18,0.65) 60%, rgba(2,5,18,0.92) 100%)",
          }}
        />

        {/* Keyframes for Deep Space Phenomena */}
        <style jsx global>{`
          @keyframes starShine {
            0% {
              transform: scale(0.8) rotate(0deg);
              opacity: 0.45;
            }
            50% {
              transform: scale(1.3) rotate(45deg);
              opacity: 1;
            }
            100% {
              transform: scale(0.85) rotate(90deg);
              opacity: 0.55;
            }
          }

          @keyframes planetFloat {
            0% {
              transform: translate3d(0, 0, 0) rotate(0deg);
            }
            50% {
              transform: translate3d(4px, -12px, 0) rotate(1.5deg);
            }
            100% {
              transform: translate3d(-3px, 6px, 0) rotate(-1deg);
            }
          }

          @keyframes planetFloatRev {
            0% {
              transform: translate3d(0, 0, 0) rotate(0deg);
            }
            50% {
              transform: translate3d(-6px, 10px, 0) rotate(-1.5deg);
            }
            100% {
              transform: translate3d(5px, -5px, 0) rotate(1deg);
            }
          }

          @keyframes spaceDrift {
            0% {
              transform: scale(1) translate3d(0, 0, 0);
            }
            50% {
              transform: scale(1.04) translate3d(-10px, -8px, 0);
            }
            100% {
              transform: scale(1.02) translate3d(8px, 6px, 0);
            }
          }

          @keyframes spaceAuraDrift1 {
            0% {
              transform: translate3d(0, 0, 0) scale(1);
            }
            50% {
              transform: translate3d(30px, 20px, 0) scale(1.08);
            }
            100% {
              transform: translate3d(-20px, 15px, 0) scale(0.95);
            }
          }

          @keyframes spaceAuraDrift2 {
            0% {
              transform: translate3d(0, 0, 0) scale(1);
            }
            50% {
              transform: translate3d(-25px, -20px, 0) scale(1.1);
            }
            100% {
              transform: translate3d(20px, -10px, 0) scale(0.96);
            }
          }

          @keyframes spaceCoreGlow {
            0%, 100% {
              opacity: 0.25;
              transform: translate(-50%, -50%) scale(0.95);
            }
            50% {
              opacity: 0.4;
              transform: translate(-50%, -50%) scale(1.06);
            }
          }

          @keyframes meteorStreak1 {
            0% {
              transform: translate3d(120px, -60px, 0);
              opacity: 0;
            }
            8% {
              opacity: 1;
            }
            18% {
              transform: translate3d(-280px, 140px, 0);
              opacity: 0;
            }
            100% {
              transform: translate3d(-280px, 140px, 0);
              opacity: 0;
            }
          }

          @keyframes meteorStreak2 {
            0% {
              transform: translate3d(100px, -50px, 0);
              opacity: 0;
            }
            8% {
              opacity: 0.95;
            }
            16% {
              transform: translate3d(-240px, 120px, 0);
              opacity: 0;
            }
            100% {
              transform: translate3d(-240px, 120px, 0);
              opacity: 0;
            }
          }
        `}</style>
      </div>


      {/* Main Suspended Form with Luminous Border */}
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
