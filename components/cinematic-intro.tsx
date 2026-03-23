"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const HERO_BG = "radial-gradient(ellipse 100% 90% at 50% 50%, #081530 0%, #020709 100%)";

type Phase = "rollin" | "clash" | "orbit" | "explode" | "done";

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  alpha: number; size: number;
  color: 0 | 1 | 2; // 0 = gold  1 = blue  2 = purple
  orbitR: number;
}

export default function CinematicIntro() {
  const [phase, setPhase] = useState<Phase>("rollin");
  const phaseRef  = useRef<Phase>("rollin");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timers    = useRef<ReturnType<typeof setTimeout>[]>([]);

  const addTimeout = useCallback((fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);

  useEffect(() => {
    // rollin:  0 → 1800ms  — both logos fly in from opposite sides
    // clash:   1800ms      — they collide, shockwave rings, logos shake
    // orbit:   2400ms      — logos spin together, particles orbit
    // explode: 3400ms      — everything bursts outward
    // done:    3800ms      — overlay fades, then site reveals
    addTimeout(() => { phaseRef.current = "clash";   setPhase("clash");   }, 1800);
    addTimeout(() => { phaseRef.current = "orbit";   setPhase("orbit");   }, 2400);
    addTimeout(() => { phaseRef.current = "explode"; setPhase("explode"); }, 3400);
    addTimeout(() => { phaseRef.current = "done";    setPhase("done");    }, 3800);
    addTimeout(() => { document.body.classList.add("intro-done"); }, 4700);
    return () => { timers.current.forEach(clearTimeout); timers.current = []; };
  }, [addTimeout]);

  // ── Canvas: particles + shockwave rings ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let w = (canvas.width  = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const N = 210;
    const particles: Particle[] = Array.from({ length: N }, () => {
      const cx = w / 2, cy = h / 2;
      const side = Math.floor(Math.random() * 4);
      const margin = 60 + Math.random() * 380;
      let px: number, py: number;
      if      (side === 0) { px = Math.random() * w; py = -margin; }
      else if (side === 1) { px = w + margin;         py = Math.random() * h; }
      else if (side === 2) { px = Math.random() * w; py = h + margin; }
      else                 { px = -margin;            py = Math.random() * h; }
      const toCenter = Math.atan2(cy - py, cx - px);
      const spread   = (Math.random() - 0.5) * 0.9;
      const speed    = 0.9 + Math.random() * 2.0;
      const r = Math.random();
      return {
        x: px, y: py,
        vx: Math.cos(toCenter + spread) * speed,
        vy: Math.sin(toCenter + spread) * speed,
        alpha:  Math.random() * 0.5 + 0.5,
        size:   Math.random() * 1.8 + 0.7,
        color:  r < 0.34 ? 0 : r < 0.67 ? 1 : 2,
        orbitR: Math.random() * 70 + 35,
      };
    });

    let shockR = 0;
    let lastPhase: Phase = "rollin";
    let raf = 0;

    const animate = () => {
      const cur = phaseRef.current;
      if (cur === "done") return;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2;

      // Reset shockwave counter on phase entry
      if (cur === "clash"   && lastPhase !== "clash")   shockR = 0;
      if (cur === "explode" && lastPhase !== "explode") shockR = 0;
      lastPhase = cur;

      // ── Shockwave rings (clash + explode) ──
      if (cur === "clash") {
        shockR += 9;
        const maxR = Math.hypot(w, h) * 0.55;
        if (shockR < maxR) {
          const fade = Math.max(0, 1 - shockR / maxR);
          ctx.beginPath(); ctx.arc(cx, cy, shockR, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(201,168,76,${fade * 0.9})`; ctx.lineWidth = 5; ctx.stroke();
          if (shockR > 22) {
            ctx.beginPath(); ctx.arc(cx, cy, shockR - 22, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(160,80,220,${fade * 0.75})`; ctx.lineWidth = 3.5; ctx.stroke();
          }
          if (shockR > 44) {
            ctx.beginPath(); ctx.arc(cx, cy, shockR - 44, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(100,149,237,${fade * 0.55})`; ctx.lineWidth = 2; ctx.stroke();
          }
        }
      }
      if (cur === "explode") {
        shockR += 18;
        const maxDim = Math.hypot(w, h);
        if (shockR < maxDim * 1.5) {
          const fade = Math.max(0, 1 - shockR / (maxDim * 0.7));
          ctx.beginPath(); ctx.arc(cx, cy, shockR, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(201,168,76,${fade * 0.85})`; ctx.lineWidth = 6; ctx.stroke();
          if (shockR > 30) {
            ctx.beginPath(); ctx.arc(cx, cy, shockR - 30, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(160,80,220,${fade * 0.65})`; ctx.lineWidth = 4; ctx.stroke();
          }
          if (shockR > 60) {
            ctx.beginPath(); ctx.arc(cx, cy, shockR - 60, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(100,149,237,${fade * 0.45})`; ctx.lineWidth = 2.5; ctx.stroke();
          }
        }
      }

      // ── Particles ──
      for (const p of particles) {
        const dx = cx - p.x, dy = cy - p.y;
        const dist = Math.hypot(dx, dy) || 1;

        if (cur === "rollin") {
          const pull = Math.min(0.4, 60 / (dist + 20));
          p.vx += (dx / dist) * pull; p.vy += (dy / dist) * pull;
          p.vx *= 0.985; p.vy *= 0.985;
        } else if (cur === "clash") {
          const pull = Math.min(14, 900 / (dist + 20));
          p.vx += (dx / dist) * pull; p.vy += (dy / dist) * pull;
          const spd = Math.hypot(p.vx, p.vy);
          if (spd > 28) { p.vx = (p.vx / spd) * 28; p.vy = (p.vy / spd) * 28; }
          p.vx *= 0.85; p.vy *= 0.85;
        } else if (cur === "orbit") {
          const grav = Math.min(2.5, 160 / dist);
          p.vx += (dx / dist) * grav; p.vy += (dy / dist) * grav;
          if (dist < p.orbitR * 2.8) {
            const str = (1 - dist / (p.orbitR * 2.8)) * 3.2;
            p.vx += (-dy / dist) * str; p.vy += (dx / dist) * str;
          }
          const sp = Math.hypot(p.vx, p.vy);
          if (sp > 12) { p.vx = (p.vx / sp) * 12; p.vy = (p.vy / sp) * 12; }
          p.vx *= 0.95; p.vy *= 0.95;
        } else if (cur === "explode") {
          const force = 1.5 + Math.min(14, 200 / (dist + 1));
          p.vx -= (dx / dist) * force; p.vy -= (dy / dist) * force;
          p.vx += (-dy / dist) * force * 0.45; p.vy += (dx / dist) * force * 0.45;
          p.vx *= 0.982; p.vy *= 0.982;
          if (p.x < -100 || p.x > w + 100 || p.y < -100 || p.y > h + 100)
            p.alpha = Math.max(0, p.alpha - 0.05);
        }

        p.x += p.vx; p.y += p.vy;
        if (p.alpha < 0.02) continue;

        // Glow halo
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 4.5, 0, Math.PI * 2);
        ctx.fillStyle =
          p.color === 0 ? `rgba(201,168,76,${p.alpha * 0.13})`  :
          p.color === 1 ? `rgba(100,149,237,${p.alpha * 0.10})` :
                          `rgba(138,43,226,${p.alpha * 0.13})`;
        ctx.fill();
        // Core dot
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle =
          p.color === 0 ? `rgba(255,215,100,${p.alpha})`  :
          p.color === 1 ? `rgba(140,185,255,${p.alpha})`  :
                          `rgba(200,100,255,${p.alpha})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    const onResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);

  const isDone     = phase === "done";
  const isSpinning = phase === "orbit" || phase === "explode";
  const isClash    = phase === "clash";
  const isExplode  = phase === "explode";

  // Key Club badge animation
  const kcAnim =
    phase === "rollin" ? "kc-rollInRight 1.8s cubic-bezier(0.16,1,0.3,1) forwards" :
    isClash            ? "kc-clashShake 0.6s cubic-bezier(0.36,0.07,0.19,0.97) forwards" :
    isExplode          ? "kc-logoDisperse 0.4s cubic-bezier(0.4,0,1,1) forwards" :
    undefined;

  // Chargers logo animation
  const charAnim =
    phase === "rollin" ? "kc-rollInLeft 1.8s cubic-bezier(0.16,1,0.3,1) forwards" :
    isClash            ? "kc-clashShake 0.6s cubic-bezier(0.36,0.07,0.19,0.97) forwards" :
    isExplode          ? "kc-logoDisperse 0.4s cubic-bezier(0.4,0,1,1) forwards" :
    undefined;

  const baseWrapper = {
    position: "fixed",
    top: "50%", left: "50%",
    transform: "translateX(-50%) translateY(-50%)",
    width: "280px", height: "280px",
    perspective: "1200px",
    pointerEvents: "none",
    display: isDone ? "none" : undefined,
  };

  return (
    <>
      <style>{`
        @keyframes kc-rollInRight {
          0%   { opacity: 0; transform: translateX(88vw) rotateY(-720deg) scale(0.1); }
          5%   { opacity: 1; }
          100% { opacity: 1; transform: translateX(0) rotateY(0deg) scale(1); }
        }
        @keyframes kc-rollInLeft {
          0%   { opacity: 0; transform: translateX(-88vw) rotateY(720deg) scale(0.1); }
          5%   { opacity: 1; }
          100% { opacity: 1; transform: translateX(0) rotateY(0deg) scale(1); }
        }
        @keyframes kc-coinSpin {
          from { transform: rotateY(0deg); }
          to   { transform: rotateY(360deg); }
        }
        @keyframes kc-clashShake {
          0%   { transform: scale(1)    rotate(0deg);  }
          18%  { transform: scale(1.14) rotate(4deg);  }
          36%  { transform: scale(0.92) rotate(-4deg); }
          54%  { transform: scale(1.07) rotate(2deg);  }
          72%  { transform: scale(0.97) rotate(-1deg); }
          100% { transform: scale(1)    rotate(0deg);  }
        }
        @keyframes kc-logoDisperse {
          0%   { opacity: 1; transform: scale(1);   filter: blur(0px); }
          100% { opacity: 0; transform: scale(2.8); filter: blur(6px); }
        }
        @keyframes kc-halo {
          0%, 100% { opacity: 0.35; transform: scale(1);   }
          50%      { opacity: 0.85; transform: scale(1.22); }
        }
      `}</style>

      {/* ── Dark overlay ── */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 9996, background: HERO_BG,
        opacity: isDone ? 0 : 1,
        transition: isDone ? "opacity 0.9s ease" : "none",
        pointerEvents: isDone ? "none" : "auto",
        transform: "translateZ(0)", willChange: "opacity",
      }} />

      {/* ── CHARGERS LOGO — flies in from LEFT, purple glow ── */}
      <div style={{ ...baseWrapper, zIndex: 9997 }}>
        {isSpinning && (
          <div style={{
            position: "absolute", inset: "-40%", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(160,80,220,0.6) 0%, rgba(100,40,180,0.35) 50%, transparent 70%)",
            animation: "kc-halo 1.4s ease-in-out infinite",
            pointerEvents: "none",
          }} />
        )}
        <div style={{ width: "100%", height: "100%", animation: charAnim }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/chargers-logo.png"
            alt="Fulshear Chargers"
            style={{
              width: "100%", height: "100%",
              objectFit: "contain", display: "block",
              animation: isSpinning ? "kc-coinSpin 5s linear infinite" : "none",
              filter: "drop-shadow(0 0 32px rgba(160,80,220,0.95)) drop-shadow(0 0 80px rgba(100,40,180,0.8))",
            }}
          />
        </div>
      </div>

      {/* ── KEY CLUB BADGE — flies in from RIGHT, gold glow ── */}
      <div style={{ ...baseWrapper, zIndex: 9998 }}>
        {isSpinning && (
          <div style={{
            position: "absolute", inset: "-40%", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(201,168,76,0.6) 0%, rgba(26,58,143,0.35) 50%, transparent 70%)",
            animation: "kc-halo 1.4s ease-in-out infinite 0.7s",
            pointerEvents: "none",
          }} />
        )}
        <div style={{ width: "100%", height: "100%", animation: kcAnim }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/screen_transparent.png"
            alt="Key Club Badge"
            style={{
              width: "100%", height: "100%",
              objectFit: "cover", borderRadius: "50%", display: "block",
              animation: isSpinning ? "kc-coinSpin 5s linear infinite" : "none",
              filter: "drop-shadow(0 0 32px rgba(201,168,76,0.95)) drop-shadow(0 0 80px rgba(26,58,143,0.8))",
            }}
          />
        </div>
      </div>

      {/* ── Canvas (particles + shockwave rings) ── */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed", inset: 0, zIndex: 9999,
          width: "100%", height: "100%", display: "block",
          pointerEvents: "none",
          opacity: isDone ? 0 : 1,
          transition: isDone ? "opacity 0.3s ease" : "none",
        }}
      />
    </>
  );
}
