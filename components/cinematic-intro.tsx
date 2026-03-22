"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const HERO_BG = "radial-gradient(ellipse 100% 90% at 50% 50%, #081530 0%, #020709 100%)";

type Phase = "roll" | "disperse" | "portal" | "done";

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  alpha: number; size: number; gold: boolean; orbitR: number;
}

const MASK_DELAY    = 200;
const MASK_DURATION = 1300;

function portalEase(t: number): number {
  if (t < 0.2) return (t / 0.2) * 0.4;
  const t2 = (t - 0.2) / 0.8;
  return 0.4 + 0.6 * (1 - Math.pow(1 - t2, 2.5));
}

export default function CinematicIntro() {
  const [phase, setPhase] = useState<Phase>("roll");
  const phaseRef          = useRef<Phase>("roll");
  const overlayRef        = useRef<HTMLDivElement>(null);
  const logoRef           = useRef<HTMLDivElement>(null);
  const canvasRef         = useRef<HTMLCanvasElement>(null);
  const timeoutsRef       = useRef<ReturnType<typeof setTimeout>[]>([]);
  const maskOpenRef       = useRef<number>(0);

  const addTimeout = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timeoutsRef.current.push(id);
  }, []);

  useEffect(() => {
    addTimeout(() => { phaseRef.current = "disperse"; setPhase("disperse"); }, 1900);
    addTimeout(() => { phaseRef.current = "portal";   setPhase("portal");   }, 2100);
    addTimeout(() => { phaseRef.current = "done";     setPhase("done");     }, 3800);
    return () => { timeoutsRef.current.forEach(clearTimeout); timeoutsRef.current = []; };
  }, [addTimeout]);

  // Overlay mask opens from center — reveals site through the portal
  useEffect(() => {
    if (phase !== "portal") return;
    const overlay = overlayRef.current;
    if (!overlay) return;

    const w = window.innerWidth, h = window.innerHeight;
    const maxR  = Math.hypot(w / 2, h / 2) + 30;
    const openAt = performance.now() + MASK_DELAY;
    maskOpenRef.current = openAt;

    let raf = 0;
    const tick = (now: number) => {
      const elapsed = now - openAt;
      if (elapsed < 0) { raf = requestAnimationFrame(tick); return; }
      const t = Math.min(elapsed / MASK_DURATION, 1);
      const r = portalEase(t) * maxR;
      // Sharper 2-stop edge = fewer gradient calculations per frame
      const m = `radial-gradient(circle at 50% 50%, transparent ${r}px, black ${r + 18}px)`;
      overlay.style.setProperty("-webkit-mask", m);
      overlay.style.setProperty("mask", m);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  // Canvas: particles + shockwave rings + portal edge ring
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width  = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    let shockR = 0;

    // Fewer particles, no trails — huge perf win
    const N = 120;
    const particles: Particle[] = Array.from({ length: N }, () => {
      const side = Math.floor(Math.random() * 4);
      let x: number, y: number;
      if      (side === 0) { x = Math.random() * w; y = -(Math.random() * 60 + 10); }
      else if (side === 1) { x = w + Math.random() * 60 + 10; y = Math.random() * h; }
      else if (side === 2) { x = Math.random() * w; y = h + Math.random() * 60 + 10; }
      else                 { x = -(Math.random() * 60 + 10); y = Math.random() * h; }
      const cx = w / 2, cy = h / 2;
      const d  = Math.hypot(cx - x, cy - y) || 1;
      const spd = Math.random() * 3 + 2.5;
      return {
        x, y,
        vx: ((cx - x) / d) * spd + (Math.random() - 0.5) * 0.4,
        vy: ((cy - y) / d) * spd + (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.4 + 0.6,
        size: Math.random() * 2.0 + 0.8,
        gold: Math.random() > 0.42,
        orbitR: Math.random() * 70 + 40,
      };
    });

    let raf = 0;
    const animate = () => {
      // Stop canvas entirely once portal starts — CSS mask handles the reveal smoothly
      if (phaseRef.current === "done" || phaseRef.current === "portal") return;
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2, cy = h / 2;
      const cur = phaseRef.current;

      // ── 2 shockwave rings (disperse only) ──
      if (cur === "disperse") {
        shockR += 12;
        const maxDim = Math.hypot(w, h);
        if (shockR < maxDim * 1.5) {
          const fade = Math.max(0, 1 - shockR / (maxDim * 0.65));
          ctx.beginPath(); ctx.arc(cx, cy, shockR, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(201,168,76,${fade * 0.65})`; ctx.lineWidth = 4; ctx.stroke();
          if (shockR > 24) {
            ctx.beginPath(); ctx.arc(cx, cy, shockR - 24, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(100,149,237,${fade * 0.35})`; ctx.lineWidth = 2; ctx.stroke();
          }
        }
      }

      // ── Particles (roll + disperse only) ──
      for (const p of particles) {
        const dx   = cx - p.x, dy = cy - p.y;
        const dist = Math.hypot(dx, dy) || 1;

        if (cur === "roll") {
          // Gravity + orbital tangential force
          const grav = Math.min(1.6, 130 / dist);
          p.vx += (dx / dist) * grav; p.vy += (dy / dist) * grav;
          if (dist < p.orbitR * 2.5) {
            const str = (1 - dist / (p.orbitR * 2.5)) * 2.2;
            p.vx += (-dy / dist) * str; p.vy += (dx / dist) * str;
          }
          const sp = Math.hypot(p.vx, p.vy);
          if (sp > 9) { p.vx = (p.vx / sp) * 9; p.vy = (p.vy / sp) * 9; }
          p.vx *= 0.95; p.vy *= 0.95;
        } else {
          // Spiral disperse
          const force = 0.5 + Math.min(9, 130 / (dist + 1));
          p.vx -= (dx / dist) * force; p.vy -= (dy / dist) * force;
          p.vx += (-dy / dist) * force * 0.5; p.vy += (dx / dist) * force * 0.5;
          p.vx *= 0.988; p.vy *= 0.988;
          if (p.x < -80 || p.x > w + 80 || p.y < -80 || p.y > h + 80) {
            p.alpha = Math.max(0, p.alpha - 0.025);
          }
        }
        p.x += p.vx; p.y += p.vy;
        if (p.alpha < 0.02) continue;

        // Soft glow halo
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = p.gold
          ? `rgba(201,168,76,${p.alpha * 0.12})`
          : `rgba(100,149,237,${p.alpha * 0.10})`;
        ctx.fill();

        // Core
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
          100% { opacity: 1; transform: translateX(0) rotateY(0deg) scale(1); }
        }
        @keyframes kc-coinSpin {
          from { transform: rotateY(0deg); }
          to   { transform: rotateY(360deg); }
        }
        @keyframes kc-halo {
          0%, 100% { opacity: 0.45; transform: scale(1); }
          50%      { opacity: 0.9;  transform: scale(1.18); }
        }
        @keyframes kc-portalBurst {
          0%   { opacity: 1;   transform: translateX(-50%) translateY(-50%) scale(1);   }
          20%  { opacity: 0.9; transform: translateX(-50%) translateY(-50%) scale(1.12); }
          100% { opacity: 0;   transform: translateX(-50%) translateY(-50%) scale(2.5);  }
        }
      `}</style>

      <div
        ref={overlayRef}
        style={{
          position: "fixed", inset: 0, zIndex: 9996, background: HERO_BG,
          opacity: isDone ? 0 : 1,
          transition: isDone ? "opacity 0.3s ease" : "none",
          pointerEvents: isDone ? "none" : "auto",
          transform: "translateZ(0)",
          willChange: "mask, opacity",
        }}
      />

      {/* Logo — always centered, bursts into portal */}
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
            animation: "kc-portalBurst 0.9s cubic-bezier(0.4, 0, 1, 1) forwards",
          }),
        }}
      >
        <div style={{
          position: "absolute", inset: "-38%", borderRadius: "50%", pointerEvents: "none",
          background: "radial-gradient(circle, rgba(201,168,76,0.72) 0%, rgba(26,58,143,0.52) 44%, transparent 70%)",
          animation: isPortal ? "none" : "kc-halo 1.4s ease-in-out infinite",
        }} />

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
              borderRadius: "50%",
              display: "block",
              animation: isPortal ? "none" : "kc-coinSpin 8s cubic-bezier(0.37,0,0.63,1) infinite",
              filter: isPortal ? "none" : "drop-shadow(0 0 35px rgba(201,168,76,0.9)) drop-shadow(0 0 90px rgba(26,58,143,0.75))",
            }}
          />
        </div>
      </div>

      {!isDone && (
        <canvas
          ref={canvasRef}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            width: "100%", height: "100%", display: "block",
            pointerEvents: "none", willChange: "contents",
          }}
        />
      )}
    </>
  );
}
