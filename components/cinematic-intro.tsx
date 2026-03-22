"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const HERO_BG = "radial-gradient(ellipse 100% 90% at 50% 50%, #081530 0%, #020709 100%)";

type Phase = "roll" | "disperse" | "portal" | "done";

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  alpha: number; size: number; gold: boolean; orbitR: number;
}

export default function CinematicIntro() {
  const [phase, setPhase]  = useState<Phase>("roll");
  const phaseRef           = useRef<Phase>("roll");
  const overlayRef         = useRef<HTMLDivElement>(null);
  const logoRef            = useRef<HTMLDivElement>(null);
  const canvasRef          = useRef<HTMLCanvasElement>(null);
  const timeoutsRef        = useRef<ReturnType<typeof setTimeout>[]>([]);

  const addTimeout = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timeoutsRef.current.push(id);
  }, []);

  useEffect(() => {
    addTimeout(() => { phaseRef.current = "disperse"; setPhase("disperse"); }, 1900);
    addTimeout(() => { phaseRef.current = "portal";   setPhase("portal");   }, 2100);
    addTimeout(() => { phaseRef.current = "done";     setPhase("done");     }, 3600);
    return () => { timeoutsRef.current.forEach(clearTimeout); timeoutsRef.current = []; };
  }, [addTimeout]);

  // Portal phase: overlay mask opens from the logo center while logo expands + fades
  useEffect(() => {
    if (phase !== "portal") return;
    const overlay = overlayRef.current;
    if (!overlay) return;

    const w = window.innerWidth, h = window.innerHeight;
    const maxR = Math.max(
      Math.hypot(w / 2, h / 2),
      Math.hypot(w - w / 2, h / 2),
      Math.hypot(w / 2, h - h / 2),
      Math.hypot(w - w / 2, h - h / 2)
    ) + 20;

    // Short delay so the logo flash happens before the mask opens
    const maskDelay = 180;
    const duration  = 1300;
    const startTime = performance.now() + maskDelay;
    let raf = 0;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      if (elapsed < 0) { raf = requestAnimationFrame(tick); return; }
      const t = Math.min(elapsed / duration, 1);
      // Ease-out-cubic: fast open, then slows as it covers the viewport
      const r = (1 - Math.pow(1 - t, 3)) * maxR;
      const m = `radial-gradient(circle at 50% 50%, transparent ${r}px, black ${r + 10}px)`;
      overlay.style.setProperty("-webkit-mask", m);
      overlay.style.setProperty("mask", m);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  // Canvas: gravity → orbit → spiral disperse + shockwave rings
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const getCX = () => w / 2;
    const getCY = () => h / 2;
    let shockR = 0;

    const N = 280;
    const particles: Particle[] = Array.from({ length: N }, () => {
      const side = Math.floor(Math.random() * 4);
      let x: number, y: number;
      if      (side === 0) { x = Math.random() * w; y = -(Math.random() * 80 + 10); }
      else if (side === 1) { x = w + Math.random() * 80 + 10; y = Math.random() * h; }
      else if (side === 2) { x = Math.random() * w; y = h + Math.random() * 80 + 10; }
      else                 { x = -(Math.random() * 80 + 10); y = Math.random() * h; }
      const cx = w / 2, cy = h / 2;
      const d   = Math.hypot(cx - x, cy - y) || 1;
      const spd = Math.random() * 3 + 2.5;
      return {
        x, y,
        vx: ((cx - x) / d) * spd + (Math.random() - 0.5) * 0.4,
        vy: ((cy - y) / d) * spd + (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.4 + 0.6,
        size: Math.random() * 2.2 + 0.7,
        gold: Math.random() > 0.42,
        orbitR: Math.random() * 75 + 40,
      };
    });

    let raf = 0;
    const animate = () => {
      if (phaseRef.current === "done") return;
      ctx.clearRect(0, 0, w, h);
      const cx = getCX(), cy = getCY();
      const isBurst = phaseRef.current === "disperse" || phaseRef.current === "portal";

      // Shockwave rings
      if (isBurst) {
        shockR += 14;
        const maxDim = Math.hypot(w, h);
        if (shockR < maxDim * 1.5) {
          const fade = Math.max(0, 1 - shockR / (maxDim * 0.6));
          ctx.beginPath(); ctx.arc(cx, cy, shockR, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(201,168,76,${fade * 0.75})`; ctx.lineWidth = 5; ctx.stroke();
          if (shockR > 16) {
            ctx.beginPath(); ctx.arc(cx, cy, shockR - 16, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(100,149,237,${fade * 0.45})`; ctx.lineWidth = 2.5; ctx.stroke();
          }
          if (shockR > 80) {
            const f2 = Math.max(0, 1 - (shockR - 80) / (maxDim * 0.5));
            ctx.beginPath(); ctx.arc(cx, cy, shockR - 80, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(201,168,76,${f2 * 0.35})`; ctx.lineWidth = 2; ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        const dx = cx - p.x, dy = cy - p.y;
        const dist = Math.hypot(dx, dy) || 1;

        if (!isBurst) {
          const grav = Math.min(1.6, 130 / dist);
          p.vx += (dx / dist) * grav; p.vy += (dy / dist) * grav;
          if (dist < p.orbitR * 2.5) {
            const str = (1 - dist / (p.orbitR * 2.5)) * 2.2;
            p.vx += (-dy / dist) * str; p.vy += (dx / dist) * str;
          }
          const sp = Math.hypot(p.vx, p.vy);
          if (sp > 9) { p.vx = p.vx / sp * 9; p.vy = p.vy / sp * 9; }
          p.vx *= 0.952; p.vy *= 0.952;
        } else {
          const force = 0.55 + Math.min(9, 130 / (dist + 1));
          p.vx -= (dx / dist) * force; p.vy -= (dy / dist) * force;
          p.vx += (-dy / dist) * force * 0.55; p.vy += (dx / dist) * force * 0.55;
          p.vx *= 0.987; p.vy *= 0.987;
          if (p.x < -90 || p.x > w + 90 || p.y < -90 || p.y > h + 90) {
            p.alpha = Math.max(0, p.alpha - 0.022);
          }
        }
        p.x += p.vx; p.y += p.vy;
        if (p.alpha < 0.02) continue;

        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 4.5, 0, Math.PI * 2);
        ctx.fillStyle = p.gold ? `rgba(201,168,76,${p.alpha * 0.14})` : `rgba(100,149,237,${p.alpha * 0.12})`;
        ctx.fill();
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.gold ? `rgba(201,168,76,${p.alpha})` : `rgba(100,149,237,${p.alpha})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    const onResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
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
        @keyframes kc-glow {
          0%, 100% { opacity: 0.5;  transform: scale(1);    }
          50%      { opacity: 1;    transform: scale(1.22); }
        }
        /* Logo BECOMES the portal: flash bright, then expand into a glowing ring */
        @keyframes kc-portalBurst {
          0%   {
            opacity: 1;
            transform: translateX(-50%) translateY(-50%) scale(1);
            filter: brightness(1) blur(0px);
          }
          10%  {
            opacity: 1;
            transform: translateX(-50%) translateY(-50%) scale(1.06);
            filter: brightness(6) blur(1px);
          }
          35%  {
            opacity: 0.8;
            transform: translateX(-50%) translateY(-50%) scale(2.5);
            filter: brightness(3) blur(3px);
          }
          100% {
            opacity: 0;
            transform: translateX(-50%) translateY(-50%) scale(10);
            filter: brightness(1) blur(14px);
          }
        }
      `}</style>

      {/* Overlay — removed when done */}
      {!isDone && (
        <div
          ref={overlayRef}
          style={{ position: "fixed", inset: 0, zIndex: 9996, background: HERO_BG }}
        />
      )}

      {/* Logo — stays at center, transforms into the portal on burst */}
      <div
        ref={logoRef}
        style={{
          position: "fixed",
          top: "50%", left: "50%",
          // CSS animation overrides this transform during portal phase
          transform: "translateX(-50%) translateY(-50%)",
          width: "320px", height: "320px",
          zIndex: 9998,
          perspective: "1200px",
          pointerEvents: "none",
          ...(isPortal && {
            animation: "kc-portalBurst 1.5s cubic-bezier(0.25,0,0.8,1) forwards",
          }),
        }}
      >
        {/* Pulsing radial halo — also expands with the burst */}
        <div style={{
          position: "absolute", inset: "-35%", borderRadius: "50%", pointerEvents: "none",
          background: "radial-gradient(circle, rgba(201,168,76,0.65) 0%, rgba(26,58,143,0.45) 45%, transparent 72%)",
          animation: "kc-glow 1.4s ease-in-out infinite",
        }} />

        {/* Entrance roll + continuous spin */}
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
                "drop-shadow(0 0 55px rgba(201,168,76,0.95))",
                "drop-shadow(0 0 120px rgba(26,58,143,0.75))",
                "drop-shadow(0 0 220px rgba(201,168,76,0.35))",
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
