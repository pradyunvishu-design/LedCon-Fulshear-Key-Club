"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// Matches hero section background exactly
const HERO_BG = "radial-gradient(ellipse 100% 90% at 50% 50%, #081530 0%, #020709 100%)";

type Phase = "roll" | "disperse" | "reveal" | "done";

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  alpha: number; size: number;
  gold: boolean;
  orbitR: number; // preferred orbit radius
}

export default function CinematicIntro() {
  const [phase, setPhase] = useState<Phase>("roll");
  const phaseRef     = useRef<Phase>("roll");
  const overlayRef   = useRef<HTMLDivElement>(null);
  const logoRef      = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const timeoutsRef  = useRef<ReturnType<typeof setTimeout>[]>([]);

  const addTimeout = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timeoutsRef.current.push(id);
  }, []);

  // ── Plays on EVERY page load — no storage check ──────────────────────────
  // Timeline (total ~3.5s):
  //   0ms    → roll    : logo at center, rolls in; particles rush in via gravity
  //   1900ms → disperse: spiral shockwave burst
  //   2100ms → reveal  : portal opens from center; logo floats up to hero position
  //   3500ms → done    : unmount
  useEffect(() => {
    addTimeout(() => { phaseRef.current = "disperse"; setPhase("disperse"); }, 1900);
    addTimeout(() => { phaseRef.current = "reveal";   setPhase("reveal");   }, 2100);
    addTimeout(() => { phaseRef.current = "done";     setPhase("done");     }, 3500);
    return () => { timeoutsRef.current.forEach(clearTimeout); timeoutsRef.current = []; };
  }, [addTimeout]);

  // ── Reveal: portal mask grows from viewport center + logo floats up ──────
  useEffect(() => {
    if (phase !== "reveal") return;
    const overlay = overlayRef.current;
    const logo    = logoRef.current;
    if (!overlay || !logo) return;

    const w = window.innerWidth;
    const h = window.innerHeight;
    // Portal opens from viewport center (where logo was)
    const cx = w / 2;
    const cy = h / 2;
    const maxR = Math.max(
      Math.hypot(cx, cy),
      Math.hypot(w - cx, cy),
      Math.hypot(cx, h - cy),
      Math.hypot(w - cx, h - cy)
    ) + 20;

    // Logo floats from center (50%) up to hero position (27%), then fades
    logo.style.transition = [
      "top 1.1s cubic-bezier(0.16,1,0.3,1)",
      "opacity 0.85s ease-in 0.35s",
    ].join(", ");
    logo.style.top     = "27%";
    logo.style.opacity = "0";

    // Portal mask: radial transparent hole expanding from center
    const duration = 1400;
    const start    = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const t      = Math.min((now - start) / duration, 1);
      const eased  = 1 - Math.pow(1 - t, 2.5); // fast open, soft finish
      const r      = eased * maxR;
      const mask   = `radial-gradient(circle at 50% 50%, transparent ${r}px, black ${r + 7}px)`;
      overlay.style.setProperty("-webkit-mask", mask);
      overlay.style.setProperty("mask", mask);
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  // ── Canvas: gravity → orbit → spiral disperse + shockwave rings ──────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width  = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    // All targeting viewport center (where the logo sits)
    const getCX = () => w / 2;
    const getCY = () => h / 2;

    let shockR = 0;

    // 260 particles from all 4 edges, initial velocity toward logo
    const N = 260;
    const particles: Particle[] = Array.from({ length: N }, () => {
      const side = Math.floor(Math.random() * 4);
      let x: number, y: number;
      if      (side === 0) { x = Math.random() * w; y = -(Math.random() * 80 + 10); }
      else if (side === 1) { x = w + Math.random() * 80 + 10; y = Math.random() * h; }
      else if (side === 2) { x = Math.random() * w; y = h + Math.random() * 80 + 10; }
      else                 { x = -(Math.random() * 80 + 10); y = Math.random() * h; }

      const cx  = w / 2, cy = h / 2;
      const d   = Math.hypot(cx - x, cy - y) || 1;
      const spd = Math.random() * 3 + 2.5; // 2.5–5.5 px/frame — fast enough to arrive quickly

      return {
        x, y,
        vx:     ((cx - x) / d) * spd + (Math.random() - 0.5) * 0.4,
        vy:     ((cy - y) / d) * spd + (Math.random() - 0.5) * 0.4,
        alpha:  Math.random() * 0.4 + 0.6,
        size:   Math.random() * 2.2 + 0.7,
        gold:   Math.random() > 0.42,
        orbitR: Math.random() * 75 + 40, // 40–115px orbit
      };
    });

    let raf = 0;

    const animate = () => {
      if (phaseRef.current === "done") return;
      ctx.clearRect(0, 0, w, h);

      const cx     = getCX();
      const cy     = getCY();
      const isBurst = phaseRef.current === "disperse" || phaseRef.current === "reveal";

      // ── Expanding shockwave rings (disperse + reveal phases) ──
      if (isBurst) {
        shockR += 14;
        const maxDim = Math.hypot(w, h);
        if (shockR < maxDim * 1.5) {
          const fade = Math.max(0, 1 - shockR / (maxDim * 0.6));

          // Gold outer ring
          ctx.beginPath();
          ctx.arc(cx, cy, shockR, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(201,168,76,${fade * 0.75})`;
          ctx.lineWidth = 5;
          ctx.stroke();

          // Blue inner ring (trailing behind)
          if (shockR > 16) {
            ctx.beginPath();
            ctx.arc(cx, cy, shockR - 16, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(100,149,237,${fade * 0.45})`;
            ctx.lineWidth = 2.5;
            ctx.stroke();
          }

          // Second smaller shockwave (delayed)
          if (shockR > 80) {
            const r2   = shockR - 80;
            const f2   = Math.max(0, 1 - r2 / (maxDim * 0.5));
            ctx.beginPath();
            ctx.arc(cx, cy, r2, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(201,168,76,${f2 * 0.35})`;
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        }
      }

      // ── Particles ──
      for (const p of particles) {
        const dx   = cx - p.x;
        const dy   = cy - p.y;
        const dist = Math.hypot(dx, dy) || 1;

        if (!isBurst) {
          // Gravity: pulls particles toward logo center
          const grav = Math.min(1.6, 130 / dist);
          p.vx += (dx / dist) * grav;
          p.vy += (dy / dist) * grav;

          // Orbital tangential kick — pushes into circular orbit when close
          if (dist < p.orbitR * 2.5) {
            const str = (1 - dist / (p.orbitR * 2.5)) * 2.2;
            p.vx += (-dy / dist) * str; // counter-clockwise tangent
            p.vy += ( dx / dist) * str;
          }

          // Speed cap + dampen so orbits stabilise
          const sp = Math.hypot(p.vx, p.vy);
          if (sp > 9) { p.vx = (p.vx / sp) * 9; p.vy = (p.vy / sp) * 9; }
          p.vx *= 0.952;
          p.vy *= 0.952;

        } else {
          // Spiral disperse: radial blast + tangential swirl = galaxy-arm pattern
          const force = 0.55 + Math.min(9, 130 / (dist + 1));
          p.vx -= (dx / dist) * force;
          p.vy -= (dy / dist) * force;
          p.vx += (-dy / dist) * force * 0.55; // swirl component
          p.vy += ( dx / dist) * force * 0.55;

          p.vx *= 0.987;
          p.vy *= 0.987;

          // Fade as they exit viewport
          if (p.x < -90 || p.x > w + 90 || p.y < -90 || p.y > h + 90) {
            p.alpha = Math.max(0, p.alpha - 0.022);
          }
        }

        p.x += p.vx;
        p.y += p.vy;
        if (p.alpha < 0.02) continue;

        // Soft outer glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 4.5, 0, Math.PI * 2);
        ctx.fillStyle = p.gold
          ? `rgba(201,168,76,${p.alpha * 0.14})`
          : `rgba(100,149,237,${p.alpha * 0.12})`;
        ctx.fill();

        // Bright core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.gold
          ? `rgba(201,168,76,${p.alpha})`
          : `rgba(100,149,237,${p.alpha})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    const onResize = () => {
      w = canvas.width  = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);

  if (phase === "done") return null;

  return (
    <>
      <style>{`
        @keyframes kc-rollIn {
          0%   { opacity: 0; transform: translateX(65vw) rotateY(900deg) scale(0.18); }
          100% { opacity: 1; transform: translateX(0)    rotateY(0deg)   scale(1);    }
        }
        @keyframes kc-coinSpin {
          from { transform: rotateY(0deg);   }
          to   { transform: rotateY(360deg); }
        }
        @keyframes kc-glow {
          0%, 100% { opacity: 0.5;  transform: scale(1);    }
          50%      { opacity: 1;    transform: scale(1.22); }
        }
      `}</style>

      {/* ── Dark overlay: hero-matching bg, portal-masked during reveal ── */}
      {/* Logo is OUTSIDE this div so the mask doesn't affect it */}
      <div
        ref={overlayRef}
        style={{
          position: "fixed", inset: 0, zIndex: 9996,
          background: HERO_BG,
        }}
      />

      {/* ── Logo: starts at viewport CENTER, floats up during reveal ── */}
      {/* Sits above overlay, unaffected by the portal mask */}
      <div
        ref={logoRef}
        style={{
          position: "fixed",
          top: "50%", left: "50%",
          transform: "translateX(-50%) translateY(-50%)",
          width: "min(320px, 45vmin)", height: "min(320px, 45vmin)",
          zIndex: 9998,
          perspective: "1200px",
        }}
      >
        {/* Pulsing radial glow halo */}
        <div style={{
          position: "absolute", inset: "-35%", borderRadius: "50%", pointerEvents: "none",
          background: "radial-gradient(circle, rgba(201,168,76,0.65) 0%, rgba(26,58,143,0.45) 45%, transparent 72%)",
          animation: "kc-glow 1.4s ease-in-out infinite",
        }} />

        {/* Rolls + flips in from the right */}
        <div style={{
          width: "100%", height: "100%",
          animation: "kc-rollIn 1.75s cubic-bezier(0.16,1,0.3,1) 0.05s both",
          transformStyle: "preserve-3d",
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/screen_transparent.png"
            alt="Key Club International Badge"
            style={{
              width: "100%", height: "100%", objectFit: "cover",
              borderRadius: "50%", clipPath: "circle(50% at 50% 50%)",
              display: "block",
              // Coin keeps spinning after entrance settles
              animation: "kc-coinSpin 8s cubic-bezier(0.37,0,0.63,1) 1.9s infinite",
              filter: [
                "drop-shadow(0 0 55px rgba(201,168,76,0.95))",
                "drop-shadow(0 0 120px rgba(26,58,143,0.75))",
                "drop-shadow(0 0 220px rgba(201,168,76,0.35))",
              ].join(" "),
            }}
          />
        </div>
      </div>

      {/* ── Particle canvas: topmost so particles are visible over everything ── */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed", inset: 0, zIndex: 9999,
          width: "100%", height: "100%", display: "block",
          pointerEvents: "none",
        }}
      />
    </>
  );
}
