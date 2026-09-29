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
import SpaceCosmosBackground from "@/components/ui/SpaceCosmosBackground";

declare global {
  interface Window {
    google?: any;
  }
}

function GoogleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

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

  // 5-Attempt Security Lockout State
  const [lockoutRemaining, setLockoutRemaining] = useState<number | null>(null);
  const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(null);

  // Active countdown timer for temporary account lockout
  useEffect(() => {
    if (lockoutRemaining === null || lockoutRemaining <= 0) return;

    const interval = setInterval(() => {
      setLockoutRemaining((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          setError("Lockout duration has elapsed. You may now attempt to sign in.");
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [lockoutRemaining]);

  const formatLockoutTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Google SSO State
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleClientId, setGoogleClientId] = useState<string | null>(null);
  const [googleConfigured, setGoogleConfigured] = useState(false);
  const [googleInstructionsOpen, setGoogleInstructionsOpen] = useState(false);

  // CAPTCHA State with immediate fallback code
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [captchaCode, setCaptchaCode] = useState<string>("8K4X9B");
  const [captchaInput, setCaptchaInput] = useState("");
  const [isCaptchaValid, setIsCaptchaValid] = useState<boolean | null>(null);
  const [captchaSpinning, setCaptchaSpinning] = useState(false);

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

  // Google SSO Credential Handler
  const handleGoogleCredentialResponse = useCallback(
    async (response: any) => {
      if (!response?.credential) return;
      setGoogleLoading(true);
      setError("");

      try {
        const res = await fetch("/api/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            credential: response.credential,
            rememberMe,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Google authentication failed.");
        }

        if (data.token) {
          try {
            localStorage.setItem("cis_jwt_token", data.token);
          } catch (_) {}
        }

        router.push(callbackUrl);
        router.refresh();
      } catch (err: any) {
        setError(err.message || "Failed to sign in with Google.");
        triggerShake();
      } finally {
        setGoogleLoading(false);
      }
    },
    [callbackUrl, rememberMe, router]
  );

  const handleGoogleSignInClick = () => {
    if (googleConfigured && googleClientId) {
      if (typeof window !== "undefined" && window.google?.accounts?.id) {
        window.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            window.location.href = "/api/auth/google";
          }
        });
      } else {
        window.location.href = "/api/auth/google";
      }
    } else {
      setGoogleInstructionsOpen((prev) => !prev);
    }
  };

  // Verify existing auth and setup Google SSO on mount
  useEffect(() => {
    const urlError = searchParams.get("error");
    if (urlError) {
      setError(urlError);
    }

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

    // Check Google SSO public configuration
    fetch("/api/auth/google/config")
      .then((res) => res.json())
      .then((data) => {
        if (data.clientId) {
          setGoogleClientId(data.clientId);
          setGoogleConfigured(true);

          if (!document.getElementById("google-gsi-client")) {
            const script = document.createElement("script");
            script.id = "google-gsi-client";
            script.src = "https://accounts.google.com/gsi/client";
            script.async = true;
            script.defer = true;
            script.onload = () => {
              if (window.google?.accounts?.id) {
                window.google.accounts.id.initialize({
                  client_id: data.clientId,
                  callback: handleGoogleCredentialResponse,
                });
              }
            };
            document.body.appendChild(script);
          }
        }
      })
      .catch(() => {});
  }, [callbackUrl, router, searchParams, handleGoogleCredentialResponse]);


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
        if (data.isLocked && data.remainingSeconds) {
          setLockoutRemaining(data.remainingSeconds);
        } else if (data.attemptsRemaining !== undefined) {
          setAttemptsRemaining(data.attemptsRemaining);
        }
        throw new Error(data.error || "Invalid administrator credentials. Access denied.");
      }

      // Reset lockout/attempts on success
      setLockoutRemaining(null);
      setAttemptsRemaining(null);

      if (data.token) {
        try {
          localStorage.setItem("cis_jwt_token", data.token);
        } catch (_) {}
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
    <div className="relative p-[1.5px] rounded-[32px] overflow-hidden shadow-2xl shadow-black/80 max-w-md w-full">
      {/* 1. Razor-Thin Rotating Laser Beam strictly on the border track */}
      <div
        className="absolute inset-[-150%] animate-[spin_5s_linear_infinite] pointer-events-none"
        style={{
          background:
            "conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 280deg, #F59E0B 320deg, #0066FF 345deg, #00F0FF 360deg)",
        }}
      />

      {/* 2. Main Solid Card Container (0% light bleed inside, static & steady on hover) */}
      <div
        className={`relative rounded-[30.5px] p-7 sm:p-9 bg-slate-950 text-white space-y-6 z-10 overflow-hidden border border-white/5 ${
          shaking ? "animate-[shake_0.5s_ease-in-out]" : ""
        }`}
      >

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

        {/* Security Lockout Alert Banner or Standard Error */}
        {lockoutRemaining !== null ? (
          <div className="p-4 bg-gradient-to-br from-rose-950/95 via-red-950/85 to-rose-900/90 border-2 border-rose-500/80 text-rose-100 rounded-2xl space-y-3 shadow-2xl shadow-rose-950/90 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-rose-200 font-black text-xs uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse shrink-0" />
                <span>Account Blocked • 5 Min Lockout</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-rose-500/30 text-rose-200 font-mono text-xs font-black border border-rose-400/40">
                {formatLockoutTimer(lockoutRemaining)}
              </span>
            </div>
            <p className="text-xs text-rose-100 leading-relaxed font-medium">
              5 consecutive incorrect password/credential attempts were entered for this user ID. For security, access is temporarily locked.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-amber-200 bg-black/60 px-3 py-2 rounded-xl border border-amber-500/30">
              <Mail className="w-3.5 h-3.5 shrink-0 text-amber-400" />
              <span>A security alert notification email has been dispatched.</span>
            </div>
          </div>
        ) : error ? (
          <div className="p-3.5 bg-rose-950/85 border border-rose-700 text-rose-200 text-xs rounded-2xl space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200 shadow-lg shadow-rose-950/50">
            <div className="flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed font-medium">{error}</span>
            </div>
            {attemptsRemaining !== null && attemptsRemaining > 0 && attemptsRemaining < 5 && (
              <div className="pl-6.5 text-[11px] text-amber-300 font-semibold flex items-center gap-1.5 pt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block animate-ping" />
                <span>Security Notice: 5 wrong attempts will lock this account for 5 minutes.</span>
              </div>
            )}
          </div>
        ) : null}

        {/* Google Single Sign-On (SSO) */}
        <div className="space-y-3 pt-1">
          <button
            type="button"
            onClick={handleGoogleSignInClick}
            disabled={googleLoading || loading}
            className="w-full relative group overflow-hidden flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-lg shadow-black/20 hover:shadow-xl transition-all duration-200 border border-slate-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer active:scale-[0.99]"
          >
            {googleLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-700" />
                <span className="tracking-wide text-slate-800">Verifying Google Account...</span>
              </>
            ) : (
              <>
                <GoogleIcon className="w-4 h-4 shrink-0" />
                <span className="tracking-wide">Sign in with Google</span>
              </>
            )}
          </button>

          {/* Quick Setup Hint if not configured yet */}
          {googleInstructionsOpen && !googleConfigured && (
            <div className="p-3.5 rounded-xl bg-slate-900 border border-amber-400/40 text-[11px] text-slate-300 space-y-2 animate-in fade-in slide-in-from-top-1 shadow-lg">
              <div className="flex items-center gap-1.5 font-bold text-amber-300">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Google Single Sign-On Ready</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                To connect your Google Workspace or Gmail OAuth, add your Client ID to your project{" "}
                <code className="bg-slate-950 px-1 py-0.5 rounded text-amber-300 font-mono text-[10px] border border-slate-800">
                  .env
                </code>{" "}
                file:
              </p>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[10px] text-amber-200 overflow-x-auto select-all leading-normal">
                GOOGLE_CLIENT_ID=&quot;your-id.apps.googleusercontent.com&quot;
                <br />
                GOOGLE_CLIENT_SECRET=&quot;your-secret&quot;
              </div>
              <p className="text-[10px] text-slate-400 flex items-center justify-between">
                <span>Authorized redirect URI:</span>
                <code className="text-amber-300 font-mono">/api/auth/google/callback</code>
              </p>
            </div>
          )}

          {/* Clean Modern Divider */}
          <div className="relative flex items-center justify-center pt-1">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-slate-950 px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest shrink-0">
              or continue with credentials
            </span>
            <div className="border-t border-slate-800 w-full" />
          </div>
        </div>

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
                  disabled={loading || lockoutRemaining !== null}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@cambridgemandi.com"
                  autoComplete="off"
                  className="w-full bg-transparent text-white pl-3 pr-4 py-3 text-xs focus:outline-none placeholder:text-slate-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
                  disabled={loading || lockoutRemaining !== null}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={checkCapsLock}
                  onKeyUp={checkCapsLock}
                  placeholder="••••••••••••"
                  autoComplete="new-password"
                  className="w-full bg-transparent text-white pl-3 pr-10 py-3 text-xs focus:outline-none placeholder:text-slate-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
                  disabled={loading || lockoutRemaining !== null}
                  maxLength={6}
                  value={captchaInput}
                  onChange={handleCaptchaChange}
                  placeholder="Enter 6 chars"
                  className={`w-full bg-slate-950 text-white px-3 py-3 text-xs rounded-xl border font-mono uppercase tracking-widest focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
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
                disabled={loading || lockoutRemaining !== null}
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-amber-400 focus:ring-amber-400/40 focus:ring-offset-slate-950 cursor-pointer accent-amber-400 transition-transform group-hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
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
            disabled={loading || lockoutRemaining !== null}
            className={`w-full relative group overflow-hidden inline-flex items-center justify-center space-x-2 font-bold py-3.5 rounded-xl text-xs transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99] border ${
              lockoutRemaining !== null
                ? "bg-rose-950/80 text-rose-300 border-rose-500/40 cursor-not-allowed shadow-[0_0_20px_rgba(244,63,94,0.25)]"
                : "bg-gradient-to-r from-school-secondary via-blue-600 to-indigo-600 hover:from-blue-500 hover:to-school-secondary text-white cursor-pointer border-blue-400/30 shadow-[0_0_25px_rgba(0,102,255,0.45)] hover:shadow-[0_0_35px_rgba(245,158,11,0.45)]"
            }`}
          >
            {/* Shimmer sweep */}
            {lockoutRemaining === null && (
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
            )}

            {lockoutRemaining !== null ? (
              <>
                <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" />
                <span className="tracking-wide">Account Blocked ({formatLockoutTimer(lockoutRemaining)})</span>
              </>
            ) : loading ? (
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
    <div className="min-h-screen bg-[#020512] flex flex-col justify-center items-center p-4 relative overflow-hidden select-none">
      {/* Living Celestial Cosmos: Moving Earth, Twinkling Starfield & Meteors, Floating Saturn & Jupiter, and Cruising Satellites */}
      <SpaceCosmosBackground />


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
