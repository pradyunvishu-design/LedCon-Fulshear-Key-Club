"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const HERO_BG = "radial-gradient(ellipse 100% 90% at 50% 50%, #081530 0%, #020709 100%)";

type Phase = "rollin" | "suck" | "orbit" | "disperse" | "done";

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  alpha: number; size: number; gold: boolean; orbitR: number;
}

export default function CinematicIntro() {
  const [phase, setPhase] = useState<Phase>("rollin");
  const phaseRef   = useRef<Phase>("rollin");
  const overlayRef = useRef<HTMLDivElement>(null);
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const timers     = useRef<ReturnType<typeof setTimeout>[]>([]);

  const addTimeout = useCallback((fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);

  useEffect(() => {
    addTimeout(() => { phaseRef.current = "suck";    setPhase("suck");    }, 1800);
    addTimeout(() => { phaseRef.current = "orbit";   setPhase("orbit");   }, 2500);
    addTimeout(() => { phaseRef.current = "disperse";setPhase("disperse");}, 3500);
    addTimeout(() => { phaseRef.current = "done";    setPhase("done");    }, 3900);
    // After overlay finishes fading (0.9s), mark intro complete so hero section appears
    addTimeout(() => { document.body.classList.add("intro-done"); }, 4850);
    return () => { timers.current.forEach(clearTimeout); timers.current = []; };
  }, [addTimeout]);

  // Canvas particles — spawn outside screen edges
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let w = (canvas.width  = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const N = 170;
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
      const spread   = (Math.random() - 0.5) * 0.85;
      const speed    = 0.9 + Math.random() * 2.0;
      return {
        x: px, y: py,
        vx: Math.cos(toCenter + spread) * speed,
        vy: Math.sin(toCenter + spread) * speed,
        alpha: Math.random() * 0.5 + 0.5,
        size:  Math.random() * 1.8 + 0.7,
        gold:  Math.random() > 0.45,
        orbitR: Math.random() * 70 + 35,
      };
    });

    let shockR = 0, raf = 0;

    const animate = () => {
      const cur = phaseRef.current;
      if (cur === "done") return;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2;

      if (cur === "disperse") {
        shockR += 16;
        const maxDim = Math.hypot(w, h);
        if (shockR < maxDim * 1.5) {
          const fade = Math.max(0, 1 - shockR / (maxDim * 0.6));
          ctx.beginPath(); ctx.arc(cx, cy, shockR, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(201,168,76,${fade * 0.7})`; ctx.lineWidth = 4; ctx.stroke();
          if (shockR > 28) {
            ctx.beginPath(); ctx.arc(cx, cy, shockR - 28, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(100,149,237,${fade * 0.4})`; ctx.lineWidth = 2; ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        const dx = cx - p.x, dy = cy - p.y;
        const dist = Math.hypot(dx, dy) || 1;

        if (cur === "rollin") {
          const pull = Math.min(0.4, 60 / (dist + 20));
          p.vx += (dx / dist) * pull; p.vy += (dy / dist) * pull;
          p.vx *= 0.985; p.vy *= 0.985;
        } else if (cur === "suck") {
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
        } else if (cur === "disperse") {
          const force = 1.2 + Math.min(12, 180 / (dist + 1));
          p.vx -= (dx / dist) * force; p.vy -= (dy / dist) * force;
          p.vx += (-dy / dist) * force * 0.4; p.vy += (dx / dist) * force * 0.4;
          p.vx *= 0.982; p.vy *= 0.982;
          if (p.x < -100 || p.x > w + 100 || p.y < -100 || p.y > h + 100)
            p.alpha = Math.max(0, p.alpha - 0.05);
        }

        p.x += p.vx; p.y += p.vy;
        if (p.alpha < 0.02) continue;

        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 4.5, 0, Math.PI * 2);
        ctx.fillStyle = p.gold ? `rgba(201,168,76,${p.alpha * 0.13})` : `rgba(100,149,237,${p.alpha * 0.10})`;
        ctx.fill();
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.gold ? `rgba(255,215,100,${p.alpha})` : `rgba(140,185,255,${p.alpha})`;
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
  const isSpinning = phase === "orbit" || phase === "disperse";
  const isDisperse = phase === "disperse";

  // Logo animation:
  // - rollin  → kc-rollIn (slow smooth slide from right with 3D flip)
  // - disperse → kc-logoDisperse (scales up + fades out with blur, matching particle disperse)
  const innerAnimation =
    phase === "rollin"   ? "kc-rollIn 1.8s cubic-bezier(0.16, 1, 0.3, 1) forwards" :
    isDisperse           ? "kc-logoDisperse 0.4s cubic-bezier(0.4, 0, 1, 1) forwards" :
    undefined;

  return (
    <>
      <style>{`
        @keyframes kc-rollIn {
          0%   { opacity: 0; transform: translateX(90vw) rotateY(-720deg) scale(0.1); }
          6%   { opacity: 1; }
          100% { opacity: 1; transform: translateX(0px) rotateY(0deg) scale(1); }
        }
        @keyframes kc-coinSpin {
          from { transform: rotateY(0deg); }
          to   { transform: rotateY(360deg); }
        }
        @keyframes kc-halo {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50%      { opacity: 0.9; transform: scale(1.2); }
        }
        @keyframes kc-logoDisperse {
          0%   { opacity: 1; transform: scale(1);   filter: blur(0px); }
          100% { opacity: 0; transform: scale(2.8); filter: blur(6px); }
        }
      `}</style>

      {/* Dark overlay — fades out when done, revealing the site */}
      <div
        ref={overlayRef}
        style={{
          position: "fixed", inset: 0, zIndex: 9996, background: HERO_BG,
          opacity: isDone ? 0 : 1,
          transition: isDone ? "opacity 0.9s ease" : "none",
          pointerEvents: isDone ? "none" : "auto",
          transform: "translateZ(0)",
          willChange: "opacity",
        }}
      />

      {/*
        WRAPPER: position fixed, ALWAYS centered via transform.
        display:none when done so the logo vanishes instantly behind
        the still-opaque overlay (which then fades over 0.9s).
      */}
      <div
        style={{
          position: "fixed",
          top: "50%", left: "50%",
          transform: "translateX(-50%) translateY(-50%)",
          width: "300px", height: "300px",
          zIndex: 9998,
          perspective: "1200px",
          pointerEvents: "none",
          display: isDone ? "none" : undefined,
        }}
      >
        {isSpinning && (
          <div style={{
            position: "absolute", inset: "-38%", borderRadius: "50%",
            pointerEvents: "none",
            background: "radial-gradient(circle, rgba(201,168,76,0.7) 0%, rgba(26,58,143,0.5) 44%, transparent 70%)",
            animation: "kc-halo 1.4s ease-in-out infinite",
          }} />
        )}

        {/* INNER div — all animations go here, wrapper stays stable */}
        <div style={{ width: "100%", height: "100%", animation: innerAnimation }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/screen_transparent.png"
            alt="Key Club Badge"
            style={{
              width: "100%", height: "100%", objectFit: "cover",
              borderRadius: "50%", display: "block",
              animation: isSpinning ? "kc-coinSpin 5s linear infinite" : "none",
              filter: "drop-shadow(0 0 35px rgba(201,168,76,0.9)) drop-shadow(0 0 90px rgba(26,58,143,0.75))",
            }}
          />
        </div>
      </div>

      {/* Canvas — stays in DOM, fades out when done */}
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
