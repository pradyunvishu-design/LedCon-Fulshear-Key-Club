"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// Hero section background — exactly matching the site
const HERO_BG = "radial-gradient(ellipse 100% 90% at 50% 50%, #081530 0%, #020709 100%)";

// Logo sits at (50% width, 27% height) in the hero viewport
const LOGO_CX_PCT = 50;
const LOGO_CY_PCT = 27;

type Phase = "roll" | "disperse" | "reveal" | "done";

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  alpha: number; size: number;
  gold: boolean;
  orbitR: number; // preferred orbit radius around logo
}

export default function CinematicIntro() {
  const [phaseState, setPhaseState] = useState<Phase>("roll");
  const phaseRef    = useRef<Phase>("roll");
  const [shouldRender, setShouldRender] = useState(false);
  const overlayRef  = useRef<HTMLDivElement>(null);
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const addTimeout = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timeoutsRef.current.push(id);
  }, []);

  // ── First-ever-visit guard ───────────────────────────────────────────────
  // On refresh/return: hero's own slideFlipEntrance + coinFlip plays naturally
  useEffect(() => {
    if (localStorage.getItem("kc_intro_v2")) return;
    localStorage.setItem("kc_intro_v2", "1");
    setShouldRender(true);

    // Timeline:
    //  0ms    → roll    : hero bg appears, logo rolls in, particles drift via gravity
    //  3400ms → disperse: spiral shockwave + particle burst
    //  3600ms → reveal  : portal mask expands from logo center (site revealed outward)
    //  5200ms → done    : unmount
    addTimeout(() => { phaseRef.current = "disperse"; setPhaseState("disperse"); }, 3400);
    addTimeout(() => { phaseRef.current = "reveal";   setPhaseState("reveal");   }, 3600);
    addTimeout(() => { phaseRef.current = "done";     setPhaseState("done");     }, 5200);

    return () => { timeoutsRef.current.forEach(clearTimeout); timeoutsRef.current = []; };
  }, [addTimeout]);

  // ── Reveal: CSS mask portal growing from logo center ────────────────────
  useEffect(() => {
    if (phaseState !== "reveal") return;
    const overlay = overlayRef.current;
    if (!overlay) return;

    const w = window.innerWidth;
    const h = window.innerHeight;
    const cx = (LOGO_CX_PCT / 100) * w;
    const cy = (LOGO_CY_PCT / 100) * h;

    // Radius that reaches every corner of the viewport from the logo center
    const maxR = Math.max(
      Math.hypot(cx, cy),
      Math.hypot(w - cx, cy),
      Math.hypot(cx, h - cy),
      Math.hypot(w - cx, h - cy)
    ) + 20;

    const duration = 1600;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      // Ease-out: fast at first, slow finish — like a portal snapping open
      const eased = 1 - Math.pow(1 - t, 2.5);
      const r = eased * maxR;

      const m = `radial-gradient(circle at ${LOGO_CX_PCT}% ${LOGO_CY_PCT}%, transparent ${r}px, black ${r + 6}px)`;
      overlay.style.setProperty("-webkit-mask", m);
      overlay.style.setProperty("mask", m);

      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phaseState]);

  // ── Canvas: gravity → orbit → spiral disperse + shockwave ───────────────
  useEffect(() => {
    if (!shouldRender) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width  = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const getCX = () => (LOGO_CX_PCT / 100) * w;
    const getCY = () => (LOGO_CY_PCT / 100) * h;

    let shockR = 0;

    // 220 particles: spawn from all 4 edges, initial velocity toward logo
    const N = 220;
    const particles: Particle[] = Array.from({ length: N }, () => {
      const side = Math.floor(Math.random() * 4);
      let x: number, y: number;
      if      (side === 0) { x = Math.random() * w; y = -(Math.random() * 60 + 10); }
      else if (side === 1) { x = w + Math.random() * 60 + 10; y = Math.random() * h; }
      else if (side === 2) { x = Math.random() * w; y = h + Math.random() * 60 + 10; }
      else                 { x = -(Math.random() * 60 + 10); y = Math.random() * h; }

      // Point toward logo position with slow initial speed
      const cx = getCX(), cy = getCY();
      const d   = Math.hypot(cx - x, cy - y) || 1;
      const spd = Math.random() * 1.4 + 0.3; // px/frame — intentionally slow

      return {
        x, y,
        vx: ((cx - x) / d) * spd + (Math.random() - 0.5) * 0.25,
        vy: ((cy - y) / d) * spd + (Math.random() - 0.5) * 0.25,
        alpha:  Math.random() * 0.45 + 0.55,
        size:   Math.random() * 2.2  + 0.6,
        gold:   Math.random() > 0.42,
        orbitR: Math.random() * 70   + 40,   // 40–110 px orbital radius
      };
    });

    let raf = 0;

    const animate = () => {
      if (phaseRef.current === "done") return;
      ctx.clearRect(0, 0, w, h);

      const cx   = getCX();
      const cy   = getCY();
      const phase = phaseRef.current;
      const isBurst = phase === "disperse" || phase === "reveal";

      // ── Shockwave ring (disperse + reveal phases) ──
      if (isBurst) {
        shockR += 12;
        const maxDim = Math.hypot(w, h);
        if (shockR < maxDim * 1.4) {
          const fade = Math.max(0, 1 - shockR / (maxDim * 0.65));

          // Gold outer ring
          ctx.beginPath();
          ctx.arc(cx, cy, shockR, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(201,168,76,${fade * 0.7})`;
          ctx.lineWidth = 5;
          ctx.stroke();

          // Blue inner ring
          if (shockR > 14) {
            ctx.beginPath();
            ctx.arc(cx, cy, shockR - 14, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(100,149,237,${fade * 0.4})`;
            ctx.lineWidth = 2.5;
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
          // ── GRAVITY: slow pull toward logo (feels like real gravity) ──
          const grav = Math.min(0.55, 55 / dist);
          p.vx += (dx / dist) * grav;
          p.vy += (dy / dist) * grav;

          // ── ORBIT: tangential push when approaching logo ──
          // Gives particles a sideways kick, putting them into elliptical orbits
          if (dist < p.orbitR * 2.4) {
            const tx  = -dy / dist; // perpendicular (counter-clockwise)
            const ty  =  dx / dist;
            const str = (1 - dist / (p.orbitR * 2.4)) * 1.5;
            p.vx += tx * str;
            p.vy += ty * str;
          }

          // Speed cap + dampen so they settle into stable orbits
          const sp = Math.hypot(p.vx, p.vy);
          if (sp > 5.5) { p.vx = p.vx / sp * 5.5; p.vy = p.vy / sp * 5.5; }
          p.vx *= 0.965;
          p.vy *= 0.965;

        } else {
          // ── SPIRAL DISPERSE: radial + tangential kick ──
          const force = 0.45 + Math.min(6, 100 / (dist + 1));
          p.vx -= (dx / dist) * force;
          p.vy -= (dy / dist) * force;
          // Tangential swirl makes dispersion look like a galaxy arm
          p.vx += (-dy / dist) * force * 0.5;
          p.vy += ( dx / dist) * force * 0.5;

          p.vx *= 0.985;
          p.vy *= 0.985;

          // Fade once off-screen
          if (p.x < -90 || p.x > w + 90 || p.y < -90 || p.y > h + 90) {
            p.alpha = Math.max(0, p.alpha - 0.018);
          }
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.alpha < 0.02) continue;

        // Soft outer glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 4.5, 0, Math.PI * 2);
        ctx.fillStyle = p.gold
          ? `rgba(201,168,76,${p.alpha * 0.13})`
          : `rgba(100,149,237,${p.alpha * 0.11})`;
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

    const onResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, [shouldRender]);

  if (!shouldRender || phaseState === "done") return null;

  return (
    <>
      <style>{`
        @keyframes kc-slideFlip {
          0%   { opacity: 0; transform: translateX(75vw) rotateY(1080deg) scale(0.2); }
          100% { opacity: 1; transform: translateX(0)    rotateY(0deg)    scale(1);   }
        }
        @keyframes kc-coinSpin {
          from { transform: rotateY(0deg);   }
          to   { transform: rotateY(360deg); }
        }
        @keyframes kc-haloPulse {
          0%, 100% { opacity: 0.5;  transform: scale(1);    }
          50%      { opacity: 1;    transform: scale(1.2);  }
        }
      `}</style>

      {/* ── Overlay: hero-matched background, portal-masked during reveal ── */}
      <div
        ref={overlayRef}
        style={{
          position: "fixed", inset: 0, zIndex: 9998,
          background: HERO_BG,
          overflow: "hidden",
        }}
      >
        {/* Logo — sits at same position as the hero section logo */}
        <div style={{
          position: "absolute",
          top: `${LOGO_CY_PCT}%`, left: `${LOGO_CX_PCT}%`,
          transform: "translateX(-50%) translateY(-50%)",
          width: "min(320px, 45vmin)", height: "min(320px, 45vmin)",
          zIndex: 2, perspective: "1200px",
        }}>
          {/* Pulsing radial glow halo */}
          <div style={{
            position: "absolute", inset: "-35%", borderRadius: "50%", pointerEvents: "none",
            background: "radial-gradient(circle, rgba(201,168,76,0.6) 0%, rgba(26,58,143,0.4) 45%, transparent 72%)",
            animation: "kc-haloPulse 1.5s ease-in-out infinite",
          }} />

          {/* Entrance: rolls + flips in from the right */}
          <div style={{
            width: "100%", height: "100%",
            animation: "kc-slideFlip 2.0s cubic-bezier(0.16,1,0.3,1) 0.1s both",
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
                // Continuous coin spin after entrance settles (~2.25s)
                animation: "kc-coinSpin 8s cubic-bezier(0.37,0,0.63,1) 2.25s infinite",
                filter: [
                  "drop-shadow(0 0 50px rgba(201,168,76,0.9))",
                  "drop-shadow(0 0 110px rgba(26,58,143,0.7))",
                ].join(" "),
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Canvas: sits ABOVE overlay so particles are visible over revealed site ── */}
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
