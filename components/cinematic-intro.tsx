"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const HERO_BG = "radial-gradient(ellipse 100% 90% at 50% 50%, #081530 0%, #020709 100%)";

type Phase = "roll" | "disperse" | "portal" | "done";

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  alpha: number; size: number; gold: boolean; orbitR: number;
  trail: { x: number; y: number }[];
}

// Module-level constants shared by overlay and canvas
const MASK_DELAY    = 220;   // ms after portal phase starts before mask opens
const MASK_DURATION = 1580;  // ms to fully open

// Custom easing: fast initial burst then smooth cinematic sweep
function portalEase(t: number): number {
  if (t < 0.18) return (t / 0.18) * 0.38;
  const t2 = (t - 0.18) / 0.82;
  return 0.38 + 0.62 * (1 - Math.pow(1 - t2, 2.8));
}

export default function CinematicIntro() {
  const [phase, setPhase] = useState<Phase>("roll");
  const phaseRef          = useRef<Phase>("roll");
  const overlayRef        = useRef<HTMLDivElement>(null);
  const logoRef           = useRef<HTMLDivElement>(null);
  const canvasRef         = useRef<HTMLCanvasElement>(null);
  const timeoutsRef       = useRef<ReturnType<typeof setTimeout>[]>([]);
  const maskOpenRef       = useRef<number>(0); // absolute timestamp when mask starts

  const addTimeout = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timeoutsRef.current.push(id);
  }, []);

  useEffect(() => {
    addTimeout(() => { phaseRef.current = "disperse"; setPhase("disperse"); }, 1900);
    addTimeout(() => { phaseRef.current = "portal";   setPhase("portal");   }, 2100);
    addTimeout(() => { phaseRef.current = "done";     setPhase("done");     }, 3900);
    return () => { timeoutsRef.current.forEach(clearTimeout); timeoutsRef.current = []; };
  }, [addTimeout]);

  // Portal phase: grow the overlay mask from center outward
  useEffect(() => {
    if (phase !== "portal") return;
    const overlay = overlayRef.current;
    if (!overlay) return;

    const w = window.innerWidth, h = window.innerHeight;
    const maxR = Math.hypot(w / 2, h / 2) + 30;
    const openAt = performance.now() + MASK_DELAY;
    maskOpenRef.current = openAt;

    let raf = 0;
    const tick = (now: number) => {
      const elapsed = now - openAt;
      if (elapsed < 0) { raf = requestAnimationFrame(tick); return; }
      const t  = Math.min(elapsed / MASK_DURATION, 1);
      const r  = portalEase(t) * maxR;
      // Soft feathered edge — looks like light bleeding through
      const m  = `radial-gradient(circle at 50% 50%, transparent ${r}px, rgba(0,0,0,0.55) ${r + 14}px, black ${r + 40}px)`;
      overlay.style.setProperty("-webkit-mask", m);
      overlay.style.setProperty("mask", m);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  // Canvas: gravity → orbit → spiral disperse + portal edge glow ring
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width  = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    let shockR = 0;

    const N = 260;
    const particles: Particle[] = Array.from({ length: N }, () => {
      const side = Math.floor(Math.random() * 4);
      let x: number, y: number;
      if      (side === 0) { x = Math.random() * w; y = -(Math.random() * 80 + 10); }
      else if (side === 1) { x = w + Math.random() * 80 + 10; y = Math.random() * h; }
      else if (side === 2) { x = Math.random() * w; y = h + Math.random() * 80 + 10; }
      else                 { x = -(Math.random() * 80 + 10); y = Math.random() * h; }
      const cx = w / 2, cy = h / 2;
      const d  = Math.hypot(cx - x, cy - y) || 1;
      const spd = Math.random() * 3 + 2.5;
      return {
        x, y,
        vx: ((cx - x) / d) * spd + (Math.random() - 0.5) * 0.4,
        vy: ((cy - y) / d) * spd + (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.4 + 0.6,
        size: Math.random() * 2.2 + 0.7,
        gold: Math.random() > 0.42,
        orbitR: Math.random() * 75 + 40,
        trail: [],
      };
    });

    let raf = 0;
    const animate = () => {
      if (phaseRef.current === "done") return;
      ctx.clearRect(0, 0, w, h);

      const cx      = w / 2, cy = h / 2;
      const curPhase = phaseRef.current;
      const isBurst  = curPhase === "disperse" || curPhase === "portal";

      // ── Shockwave rings ──
      if (isBurst) {
        shockR += 11;
        const maxDim = Math.hypot(w, h);
        if (shockR < maxDim * 1.5) {
          const fade = Math.max(0, 1 - shockR / (maxDim * 0.65));
          ctx.beginPath(); ctx.arc(cx, cy, shockR, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(201,168,76,${fade * 0.65})`; ctx.lineWidth = 4; ctx.stroke();
          if (shockR > 22) {
            ctx.beginPath(); ctx.arc(cx, cy, shockR - 22, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(100,149,237,${fade * 0.38})`; ctx.lineWidth = 2; ctx.stroke();
          }
          if (shockR > 95) {
            const f2 = Math.max(0, 1 - (shockR - 95) / (maxDim * 0.5));
            ctx.beginPath(); ctx.arc(cx, cy, shockR - 95, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(201,168,76,${f2 * 0.28})`; ctx.lineWidth = 1.5; ctx.stroke();
          }
        }
      }

      // ── Portal phase: center burst + sweeping edge glow ring ──
      if (curPhase === "portal" && maskOpenRef.current > 0) {
        const elapsed = performance.now() - maskOpenRef.current;
        const maxR    = Math.hypot(w / 2, h / 2) + 30;

        // Radial center burst — fades out over 600ms as portal opens
        if (elapsed < 600) {
          const ba = (1 - elapsed / 600) * 0.85;
          const g  = ctx.createRadialGradient(cx, cy, 0, cx, cy, 320);
          g.addColorStop(0,    `rgba(255,248,220,${ba})`);
          g.addColorStop(0.2,  `rgba(220,180,80,${ba * 0.8})`);
          g.addColorStop(0.5,  `rgba(26,58,143,${ba * 0.4})`);
          g.addColorStop(1,    "transparent");
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, w, h);
        }

        // Portal edge ring — glowing circle at the current mask boundary
        if (elapsed > 0) {
          const t  = Math.min(elapsed / MASK_DURATION, 1);
          const r  = portalEase(t) * maxR;
          const ef = Math.max(0, 1 - t * 1.1); // fades as it reaches screen edges

          // Wide outer blue atmospheric halo
          ctx.beginPath(); ctx.arc(cx, cy, r + 28, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(80,120,240,${ef * 0.28})`; ctx.lineWidth = 22; ctx.stroke();

          // Mid gold glow band
          ctx.beginPath(); ctx.arc(cx, cy, r + 10, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(201,168,76,${ef * 0.55})`; ctx.lineWidth = 10; ctx.stroke();

          // Bright crisp gold edge
          ctx.beginPath(); ctx.arc(cx, cy, r + 3, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255,228,130,${ef * 0.85})`; ctx.lineWidth = 3; ctx.stroke();

          // Bright white inner leading edge
          ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255,252,240,${ef * 0.95})`; ctx.lineWidth = 1.5; ctx.stroke();

          // Inner trailing glow (inside the open portal)
          ctx.beginPath(); ctx.arc(cx, cy, Math.max(0, r - 15), 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(201,168,76,${ef * 0.22})`; ctx.lineWidth = 20; ctx.stroke();
        }
      }

      // ── Particles ──
      for (const p of particles) {
        const dx   = cx - p.x, dy = cy - p.y;
        const dist = Math.hypot(dx, dy) || 1;

        if (!isBurst) {
          // Gravity pull + tangential orbital force
          const grav = Math.min(1.6, 130 / dist);
          p.vx += (dx / dist) * grav; p.vy += (dy / dist) * grav;
          if (dist < p.orbitR * 2.5) {
            const str = (1 - dist / (p.orbitR * 2.5)) * 2.2;
            p.vx += (-dy / dist) * str; p.vy += (dx / dist) * str;
          }
          const sp = Math.hypot(p.vx, p.vy);
          if (sp > 9) { p.vx = (p.vx / sp) * 9; p.vy = (p.vy / sp) * 9; }
          p.vx *= 0.952; p.vy *= 0.952;
        } else {
          // Spiral disperse with angular momentum
          const force = 0.55 + Math.min(9, 130 / (dist + 1));
          p.vx -= (dx / dist) * force; p.vy -= (dy / dist) * force;
          p.vx += (-dy / dist) * force * 0.5; p.vy += (dx / dist) * force * 0.5;
          p.vx *= 0.988; p.vy *= 0.988;
          if (p.x < -90 || p.x > w + 90 || p.y < -90 || p.y > h + 90) {
            p.alpha = Math.max(0, p.alpha - 0.02);
          }
        }
        p.x += p.vx; p.y += p.vy;

        // Trail
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 9) p.trail.shift();
        if (p.alpha < 0.02) continue;

        // Draw trail with gradient opacity
        if (p.trail.length > 2) {
          for (let i = 1; i < p.trail.length; i++) {
            const ta = (i / p.trail.length) * p.alpha * 0.38;
            ctx.beginPath();
            ctx.moveTo(p.trail[i - 1].x, p.trail[i - 1].y);
            ctx.lineTo(p.trail[i].x, p.trail[i].y);
            ctx.strokeStyle = p.gold
              ? `rgba(220,180,80,${ta})`
              : `rgba(110,165,255,${ta})`;
            ctx.lineWidth = p.size * 0.65;
            ctx.stroke();
          }
        }

        // Glow halo
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 4.5, 0, Math.PI * 2);
        ctx.fillStyle = p.gold
          ? `rgba(201,168,76,${p.alpha * 0.12})`
          : `rgba(100,149,237,${p.alpha * 0.10})`;
        ctx.fill();

        // Core dot (slightly brighter color than gold/blue)
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.gold
          ? `rgba(255,215,100,${p.alpha})`
          : `rgba(140,185,255,${p.alpha})`;
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

  const isDone   = phase === "done";
  const isPortal = phase === "portal" || phase === "done";

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
        @keyframes kc-halo {
          0%, 100% { opacity: 0.45; transform: scale(1);    }
          50%      { opacity: 0.9;  transform: scale(1.18); }
        }
        /* Logo becomes the portal:
           1. Double pulse (energy building)
           2. Burst outward fading into nothing */
        @keyframes kc-portalBurst {
          0%   { opacity: 1;    transform: translateX(-50%) translateY(-50%) scale(1);    filter: brightness(1)   blur(0px);  }
          7%   { opacity: 1;    transform: translateX(-50%) translateY(-50%) scale(1.04); filter: brightness(3.5) blur(0px);  }
          14%  { opacity: 1;    transform: translateX(-50%) translateY(-50%) scale(0.99); filter: brightness(9)   blur(1px);  }
          22%  { opacity: 1;    transform: translateX(-50%) translateY(-50%) scale(1.02); filter: brightness(12)  blur(2px);  }
          34%  { opacity: 0.82; transform: translateX(-50%) translateY(-50%) scale(2.2);  filter: brightness(5)   blur(4px);  }
          58%  { opacity: 0.35; transform: translateX(-50%) translateY(-50%) scale(5.8);  filter: brightness(2)   blur(9px);  }
          100% { opacity: 0;    transform: translateX(-50%) translateY(-50%) scale(13);   filter: brightness(0.5) blur(20px); }
        }
      `}</style>

      {/* Overlay — removed when done */}
      {!isDone && (
        <div
          ref={overlayRef}
          style={{ position: "fixed", inset: 0, zIndex: 9996, background: HERO_BG }}
        />
      )}

      {/* Logo — stays centered; explodes into the portal on burst */}
      <div
        ref={logoRef}
        style={{
          position: "fixed",
          top: "50%", left: "50%",
          transform: "translateX(-50%) translateY(-50%)",
          width: "320px", height: "320px",
          zIndex: 9998,
          perspective: "1200px",
          pointerEvents: "none",
          willChange: "transform, opacity, filter",
          ...(isPortal && {
            animation: "kc-portalBurst 1.75s cubic-bezier(0.22,0,0.6,1) forwards",
          }),
        }}
      >
        {/* Pulsing halo */}
        <div style={{
          position: "absolute", inset: "-38%", borderRadius: "50%", pointerEvents: "none",
          background: "radial-gradient(circle, rgba(201,168,76,0.72) 0%, rgba(26,58,143,0.52) 44%, transparent 70%)",
          animation: "kc-halo 1.4s ease-in-out infinite",
        }} />

        {/* Roll-in + flip entrance */}
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
              animation: "kc-coinSpin 8s cubic-bezier(0.37,0,0.63,1) 0s infinite",
              filter: [
                "drop-shadow(0 0 40px rgba(201,168,76,1))",
                "drop-shadow(0 0 85px rgba(201,168,76,0.75))",
                "drop-shadow(0 0 170px rgba(26,58,143,0.9))",
                "drop-shadow(0 0 340px rgba(201,168,76,0.28))",
              ].join(" "),
            }}
          />
        </div>
      </div>

      {/* Canvas — removed when done */}
      {!isDone && (
        <canvas
          ref={canvasRef}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            width: "100%", height: "100%", display: "block",
            pointerEvents: "none",
          }}
        />
      )}
    </>
  );
}
