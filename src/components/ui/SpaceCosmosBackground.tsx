"use client";

import React, { useEffect, useRef } from "react";

export default function SpaceCosmosBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Dynamic High-Performance Starfield & Shooting Stars Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Generate Stars with depth layers
    const STAR_COUNT = 160;
    interface Star {
      x: number;
      y: number;
      radius: number;
      baseAlpha: number;
      twinkleSpeed: number;
      twinklePhase: number;
      color: string;
      vx: number;
      vy: number;
    }

    const starColors = [
      "rgba(255, 255, 255,",
      "rgba(199, 210, 254,", // indigo
      "rgba(186, 230, 253,", // sky blue
      "rgba(254, 240, 138,", // warm yellow
      "rgba(245, 208, 254,", // light violet
    ];

    const stars: Star[] = Array.from({ length: STAR_COUNT }, () => {
      const colorPrefix = starColors[Math.floor(Math.random() * starColors.length)];
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.4,
        baseAlpha: Math.random() * 0.7 + 0.3,
        twinkleSpeed: Math.random() * 0.04 + 0.015,
        twinklePhase: Math.random() * Math.PI * 2,
        color: colorPrefix,
        vx: (Math.random() - 0.5) * 0.04, // subtle celestial drift
        vy: (Math.random() - 0.5) * 0.03,
      };
    });

    // Shooting Stars (Meteors)
    interface Meteor {
      x: number;
      y: number;
      length: number;
      speed: number;
      angle: number;
      alpha: number;
      active: boolean;
      color: string;
    }

    const meteors: Meteor[] = [];

    const spawnMeteor = () => {
      if (meteors.length > 2) return;
      meteors.push({
        x: Math.random() * (width * 0.8) + width * 0.1,
        y: Math.random() * (height * 0.4),
        length: Math.random() * 120 + 80,
        speed: Math.random() * 12 + 10,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2, // ~45 deg downward
        alpha: 1,
        active: true,
        color: Math.random() > 0.4 ? "rgba(56, 189, 248," : "rgba(253, 224, 71,",
      });
    };

    let meteorTimer = 0;

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw and update stars
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.twinklePhase += s.twinkleSpeed;
        const currentAlpha = s.baseAlpha * (0.6 + 0.4 * Math.sin(s.twinklePhase));

        // Celestial drift
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < 0) s.x = width;
        if (s.x > width) s.x = 0;
        if (s.y < 0) s.y = height;
        if (s.y > height) s.y = 0;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${s.color}${currentAlpha})`;
        ctx.fill();

        // Extra twinkle glare for brightest stars
        if (s.radius > 1.4 && currentAlpha > 0.75) {
          ctx.beginPath();
          ctx.strokeStyle = `${s.color}${currentAlpha * 0.4})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(s.x - 4, s.y);
          ctx.lineTo(s.x + 4, s.y);
          ctx.moveTo(s.x, s.y - 4);
          ctx.lineTo(s.x, s.y + 4);
          ctx.stroke();
        }
      }

      // 2. Spawn and update meteors
      meteorTimer++;
      if (meteorTimer % 220 === 0 && Math.random() > 0.3) {
        spawnMeteor();
      }

      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        if (!m.active) {
          meteors.splice(i, 1);
          continue;
        }

        const headX = m.x;
        const headY = m.y;
        const tailX = m.x - Math.cos(m.angle) * m.length;
        const tailY = m.y - Math.sin(m.angle) * m.length;

        const grad = ctx.createLinearGradient(headX, headY, tailX, tailY);
        grad.addColorStop(0, `${m.color}${m.alpha})`);
        grad.addColorStop(0.3, `${m.color}${m.alpha * 0.7})`);
        grad.addColorStop(1, `${m.color}0)`);

        ctx.beginPath();
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.8;
        ctx.moveTo(headX, headY);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        // Advance meteor
        m.x += Math.cos(m.angle) * m.speed;
        m.y += Math.sin(m.angle) * m.speed;
        m.alpha -= 0.018;

        if (m.alpha <= 0 || m.x > width + 100 || m.y > height + 100) {
          m.active = false;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none bg-[#020512]">
      {/* ========================================================================= */}
      {/* LAYER 0: PHOTOREALISTIC DEEP SPACE NEBULA & COSMOS BACKGROUND             */}
      {/* ========================================================================= */}
      <div
        className="absolute inset-[-10%] bg-cover bg-center bg-no-repeat transition-transform duration-1000 ease-out"
        style={{
          backgroundImage: "url('/images/space-deep-cosmos.jpg')",
          filter: "brightness(0.92) contrast(1.1)",
          animation: "cosmosDrift 45s ease-in-out infinite alternate",
        }}
      />

      {/* ========================================================================= */}
      {/* LAYER 1: INTERACTIVE DRIFTING STARFIELD & METEOR ENGINE                   */}
      {/* ========================================================================= */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-[1]" />

      {/* Atmospheric Cosmic Aura Lights */}
      <div
        className="absolute -top-32 -right-32 w-[900px] h-[900px] rounded-full blur-[160px] opacity-35 z-[2]"
        style={{
          background: "radial-gradient(circle, rgba(168,85,247,0.45) 0%, rgba(59,130,246,0.25) 50%, transparent 80%)",
          animation: "cosmicAuraPulse 24s ease-in-out infinite alternate",
        }}
      />
      <div
        className="absolute -bottom-40 -left-40 w-[950px] h-[950px] rounded-full blur-[170px] opacity-35 z-[2]"
        style={{
          background: "radial-gradient(circle, rgba(14,165,233,0.5) 0%, rgba(37,99,235,0.2) 55%, transparent 80%)",
          animation: "cosmicAuraPulseRev 28s ease-in-out infinite alternate",
        }}
      />

      {/* ========================================================================= */}
      {/* LAYER 2: MOVING CELESTIAL PLANETS (SATURN, JUPITER & ORBITING MOONS)      */}
      {/* ========================================================================= */}
      {/* 1. Ringed Planet Saturn with Tilted Golden Rings */}
      <div
        className="absolute top-[6%] right-[32%] sm:right-[36%] w-[260px] sm:w-[340px] md:w-[420px] aspect-[16/9] z-[3] pointer-events-none select-none"
        style={{
          animation: "saturnOrbitalMotion 32s ease-in-out infinite alternate",
          filter: "drop-shadow(0 0 25px rgba(245,158,11,0.2))",
        }}
      >
        <img
          src="/images/space-saturn-clean.png"
          alt="Saturn"
          className="w-full h-full object-contain transform -rotate-1"
        />
        {/* Distant Moon Dione */}
        <div
          className="absolute -bottom-2 -right-6 w-2.5 h-2.5 rounded-full bg-slate-300 shadow-[0_0_8px_rgba(255,255,255,0.8)]"
          style={{ animation: "moonOrbit1 16s ease-in-out infinite alternate" }}
        />
      </div>

      {/* 2. Banded Giant Planet Jupiter with Storms & Great Red Spot */}
      <div
        className="absolute top-[4%] -right-8 sm:right-[6%] w-[160px] sm:w-[220px] md:w-[270px] aspect-square z-[3] pointer-events-none select-none"
        style={{
          animation: "jupiterOrbitalMotion 38s ease-in-out infinite alternate",
          filter: "drop-shadow(0 0 30px rgba(234,179,8,0.25))",
        }}
      >
        <img
          src="/images/space-jupiter.png"
          alt="Jupiter"
          className="w-full h-full object-contain animate-[spin_360s_linear_infinite]"
        />
        {/* Galilean Moon Europa */}
        <div
          className="absolute bottom-6 -left-7 w-3.5 h-3.5 rounded-full bg-amber-100 shadow-[0_0_10px_rgba(251,191,36,0.9)]"
          style={{ animation: "moonOrbit2 18s ease-in-out infinite alternate" }}
        />
        {/* Galilean Moon Ganymede */}
        <div
          className="absolute -top-3 right-8 w-2.5 h-2.5 rounded-full bg-stone-200 shadow-[0_0_8px_rgba(255,255,255,0.7)]"
          style={{ animation: "moonOrbit3 22s ease-in-out infinite alternate" }}
        />
      </div>

      {/* ========================================================================= */}
      {/* LAYER 3: MOVING EARTH (GLOWING ATMOSPHERE, NIGHT CITY LIGHTS & ROTATION)  */}
      {/* ========================================================================= */}
      <div
        className="absolute -bottom-[28%] -left-[28%] sm:-bottom-[20%] sm:-left-[18%] md:-bottom-[15%] md:-left-[12%] lg:-left-[6%] w-[680px] sm:w-[860px] md:w-[1020px] lg:w-[1150px] aspect-square z-[4] pointer-events-none select-none"
        style={{
          animation: "earthOrbitalMotion 42s ease-in-out infinite alternate",
        }}
      >
        {/* Atmospheric Rayleigh Ozone Glow Limb */}
        <div
          className="absolute inset-[-4%] rounded-full blur-[40px] pointer-events-none"
          style={{
            background: "radial-gradient(circle at 35% 35%, rgba(56,189,248,0.45) 0%, rgba(14,165,233,0.3) 48%, rgba(2,6,23,0) 70%)",
            animation: "earthAtmosphereBreathing 12s ease-in-out infinite alternate",
          }}
        />

        {/* Photorealistic Earth Sphere */}
        <img
          src="/images/space-earth.png"
          alt="Planet Earth"
          className="w-full h-full object-contain relative z-10"
          style={{
            filter: "brightness(1.02) contrast(1.06)",
            animation: "earthGentleRotation 180s ease-in-out infinite alternate",
          }}
        />

        {/* Pulsing City Lights Night Aurora */}
        <div
          className="absolute top-[28%] right-[16%] w-[260px] h-[320px] rounded-full blur-[25px] opacity-40 pointer-events-none z-20"
          style={{
            background: "radial-gradient(ellipse at 50% 50%, rgba(245,158,11,0.5) 0%, rgba(217,119,6,0.2) 60%, transparent 80%)",
            animation: "cityLightsFlicker 6s ease-in-out infinite alternate",
          }}
        />
      </div>

      {/* ========================================================================= */}
      {/* LAYER 4: ACTIVE CRUISING SATELLITE (TRAVERSING ACROSS ORBIT)              */}
      {/* ========================================================================= */}
      <div
        className="absolute w-[90px] sm:w-[130px] md:w-[160px] aspect-square z-[5] pointer-events-none select-none"
        style={{
          animation: "satelliteFlybyTrajectory 50s linear infinite",
          filter: "drop-shadow(0 0 16px rgba(56,189,248,0.35))",
        }}
      >
        <img
          src="/images/space-probe.png"
          alt="Orbital Satellite Probe"
          className="w-full h-full object-contain transform -rotate-12"
        />

        {/* Satellite Navigation LED Beacon 1 (Emerald Ping) */}
        <div className="absolute top-[32%] left-[45%]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-300 shadow-[0_0_8px_#34d399]" />
          </span>
        </div>

        {/* Satellite Navigation LED Beacon 2 (Crimson Strobe) */}
        <div className="absolute top-[48%] right-[32%]">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-80" style={{ animationDuration: "1.4s" }} />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-400 shadow-[0_0_6px_#f43f5e]" />
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* LAYER 5: FOREGROUND SPACE STATION / MAIN SATELLITE (MICROGRAVITY DRIFT)    */}
      {/* ========================================================================= */}
      <div
        className="absolute -bottom-[8%] -right-[12%] sm:-bottom-[4%] sm:-right-[6%] md:right-[0%] w-[580px] sm:w-[780px] md:w-[940px] lg:w-[1100px] aspect-[16/9] z-[6] pointer-events-none select-none"
        style={{
          animation: "spaceStationAttitudeDrift 28s ease-in-out infinite alternate",
          filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.8)) brightness(0.98) contrast(1.05)",
        }}
      >
        <img
          src="/images/space-station-clean.png"
          alt="International Space Station"
          className="w-full h-full object-contain"
        />

        {/* Solar Panel Specular Sun Glint Sweep */}
        <div
          className="absolute top-[18%] right-[16%] w-[180px] h-[180px] rounded-full blur-[20px] pointer-events-none opacity-40"
          style={{
            background: "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(254,240,138,0.4) 40%, transparent 70%)",
            animation: "solarWingGlint 8s ease-in-out infinite alternate",
          }}
        />

        {/* Station Telemetry Navigation Beacons on Truss & Mast */}
        {/* 1. Main Communications Tower (Cyan Pulse) */}
        <div className="absolute top-[28%] left-[50.5%] pointer-events-none">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" style={{ animationDuration: "2s" }} />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-300 shadow-[0_0_10px_#38bdf8]" />
          </span>
        </div>

        {/* 2. Starboard Solar Truss Extremity (Emerald Green Telemetry) */}
        <div className="absolute top-[32%] right-[12%] pointer-events-none">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80" style={{ animationDuration: "1.7s" }} />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-300 shadow-[0_0_8px_#34d399]" />
          </span>
        </div>

        {/* 3. Port Solar Truss Extremity (Crimson Red Anti-Collision Strobe) */}
        <div className="absolute top-[34%] left-[10%] pointer-events-none">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-80" style={{ animationDuration: "1.3s" }} />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-400 shadow-[0_0_8px_#f43f5e]" />
          </span>
        </div>

        {/* 4. Docking Module Node (Amber Lock Status) */}
        <div className="absolute top-[56%] left-[49%] pointer-events-none">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" style={{ animationDuration: "2.5s" }} />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-300 shadow-[0_0_6px_#fbbf24]" />
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* LAYER 6: CINEMATIC VIGNETTE & CONTRAST BACKDROP FOR LOGIN CARD             */}
      {/* ========================================================================= */}
      <div
        className="absolute inset-0 pointer-events-none z-[7]"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(2,5,18,0.2) 0%, rgba(2,5,18,0.65) 60%, rgba(2,5,18,0.92) 100%)",
        }}
      />

      {/* ========================================================================= */}
      {/* KEYFRAME ANIMATIONS FOR ORBITAL & CELESTIAL MECHANICS                     */}
      {/* ========================================================================= */}
      <style jsx global>{`
        /* Deep Cosmos Milky Way Breathing Drift */
        @keyframes cosmosDrift {
          0% {
            transform: scale(1) translate3d(0, 0, 0);
          }
          50% {
            transform: scale(1.05) translate3d(-14px, -8px, 0);
          }
          100% {
            transform: scale(1.02) translate3d(10px, 8px, 0);
          }
        }

        /* Earth Orbital Floating & Rising Motion */
        @keyframes earthOrbitalMotion {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          33% {
            transform: translate3d(24px, -18px, 0) scale(1.025);
          }
          66% {
            transform: translate3d(-16px, 12px, 0) scale(0.985);
          }
          100% {
            transform: translate3d(18px, -10px, 0) scale(1.015);
          }
        }

        /* Earth Slow Axial Rotation */
        @keyframes earthGentleRotation {
          0% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(3.5deg);
          }
          100% {
            transform: rotate(-2.5deg);
          }
        }

        /* Atmospheric Ozone Limb Pulsing */
        @keyframes earthAtmosphereBreathing {
          0%, 100% {
            opacity: 0.75;
            transform: scale(0.97);
          }
          50% {
            opacity: 1;
            transform: scale(1.03);
          }
        }

        /* Night City Lights Shimmer */
        @keyframes cityLightsFlicker {
          0%, 100% {
            opacity: 0.35;
          }
          50% {
            opacity: 0.65;
          }
        }

        /* Saturn Orbital Float & Axial Inclination Wobble */
        @keyframes saturnOrbitalMotion {
          0% {
            transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
          }
          40% {
            transform: translate3d(28px, -16px, 0) rotate(2deg) scale(1.03);
          }
          80% {
            transform: translate3d(-20px, 18px, 0) rotate(-1.5deg) scale(0.97);
          }
          100% {
            transform: translate3d(12px, -8px, 0) rotate(1deg) scale(1.01);
          }
        }

        /* Jupiter Orbital Floating Drift */
        @keyframes jupiterOrbitalMotion {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(-26px, 22px, 0) scale(1.04);
          }
          100% {
            transform: translate3d(18px, -14px, 0) scale(0.97);
          }
        }

        /* Moon Orbits */
        @keyframes moonOrbit1 {
          0% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(14px, -10px, 0);
          }
          100% {
            transform: translate3d(-8px, 12px, 0);
          }
        }

        @keyframes moonOrbit2 {
          0% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(-18px, 8px, 0);
          }
          100% {
            transform: translate3d(12px, -14px, 0);
          }
        }

        @keyframes moonOrbit3 {
          0% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(12px, 14px, 0);
          }
          100% {
            transform: translate3d(-14px, -10px, 0);
          }
        }

        /* Cruising Satellite Traversing Across Orbit */
        @keyframes satelliteFlybyTrajectory {
          0% {
            top: 14%;
            left: -12%;
            transform: translate3d(0, 0, 0) scale(0.7) rotate(8deg);
            opacity: 0;
          }
          6% {
            opacity: 1;
          }
          48% {
            top: 26%;
            left: 45%;
            transform: translate3d(0, 0, 0) scale(0.95) rotate(14deg);
            opacity: 1;
          }
          92% {
            opacity: 1;
          }
          100% {
            top: 38%;
            left: 108%;
            transform: translate3d(0, 0, 0) scale(1.15) rotate(22deg);
            opacity: 0;
          }
        }

        /* Space Station Micro-Gravity Attitude Float */
        @keyframes spaceStationAttitudeDrift {
          0% {
            transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
          }
          35% {
            transform: translate3d(-20px, 14px, 0) rotate(-1.2deg) scale(1.02);
          }
          70% {
            transform: translate3d(16px, -18px, 0) rotate(1.4deg) scale(0.98);
          }
          100% {
            transform: translate3d(-10px, 8px, 0) rotate(-0.6deg) scale(1.01);
          }
        }

        /* Solar Wing Specular Sun Glint */
        @keyframes solarWingGlint {
          0%, 100% {
            opacity: 0.15;
            transform: scale(0.85);
          }
          50% {
            opacity: 0.85;
            transform: scale(1.25);
          }
        }

        /* Nebula Aura Breathing */
        @keyframes cosmicAuraPulse {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translate3d(20px, 25px, 0) scale(1.12);
            opacity: 0.45;
          }
        }

        @keyframes cosmicAuraPulseRev {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translate3d(-25px, -20px, 0) scale(1.1);
            opacity: 0.45;
          }
        }
      `}</style>
    </div>
  );
}
