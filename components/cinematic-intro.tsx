"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const HERO_BG = "radial-gradient(ellipse 100% 90% at 50% 50%, #081530 0%, #020709 100%)";

// Phases: logo rolls in → particles suck in → orbit → disperse → portal reveals site
type Phase = "rollin" | "suck" | "orbit" | "disperse" | "portal" | "done";

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  alpha: number; size: number; gold: boolean; orbitR: number;
}

const MASK_DURATION = 1400;

function portalEase(t: number): number {
  return 1 - Math.pow(1 - t, 2.5);
}

export default function CinematicIntro() {
  const [phase, setPhase] = useState<Phase>("rollin");
  const phaseRef    = useRef<Phase>("rollin");
  const overlayRef  = useRef<HTMLDivElement>(null);
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const addTimeout = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timeoutsRef.current.push(id);
  }, []);

  useEffect(() => {
    // Timeline:
    //   0       → 1500ms  rollin   (logo rolls in from right)
    //   1500ms  → 2200ms  suck     (particles rush toward logo)
    //   2200ms  → 3700ms  orbit    (particles orbit logo)
    //   3700ms  → 4000ms  disperse (particles explode outward)
    //   4000ms  → 5500ms  portal   (logo expands, circle reveals site)
    //   5500ms+           done
    addTimeout(() => { phaseRef.current = "suck";    setPhase("suck");    }, 1500);
    addTimeout(() => { phaseRef.current = "orbit";   setPhase("orbit");   }, 2200);
    addTimeout(() => { phaseRef.current = "disperse";setPhase("disperse");}, 3700);
    addTimeout(() => { phaseRef.current = "portal";  setPhase("portal");  }, 4000);
    addTimeout(() => { phaseRef.current = "done";    setPhase("done");    }, 5500);
    return () => { timeoutsRef.current.forEach(clearTimeout); timeoutsRef.current = []; };
  }, [addTimeout]);

  // Portal mask: JS-driven radial-gradient expands from center, revealing site
  useEffect(() => {
    if (phase !== "portal") return;
    const overlay = overlayRef.current;
    if (!overlay) return;
    const w = window.innerWidth, h = window.innerHeight;
    const maxR = Math.hypot(w / 2, h / 2) + 30;
    const openAt = performance.now() + 80;
    let raf = 0;
    const tick = (now: number) => {
      const elapsed = now - openAt;
      if (elapsed < 0) { raf = requestAnimationFrame(tick); return; }
      const t   = Math.min(elapsed / MASK_DURATION, 1);
      const r   = portalEase(t) * maxR;
      const m   = `radial-gradient(circle at 50% 50%, transparent ${r}px, black ${r + 20}px)`;
      overlay.style.setProperty("-webkit-mask", m);
      overlay.style.setProperty("mask", m);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  // Canvas: particles with phase-based physics
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width  = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    // Particles start spread around the screen
    const N = 130;
    const particles: Particle[] = Array.from({ length: N }, () => {
      const angle  = Math.random() * Math.PI * 2;
      const minDist = Math.min(w, h) * 0.15;
      const maxDist = Math.min(w, h) * 0.48;
      const dist   = Math.random() * (maxDist - minDist) + minDist;
      return {
        x: w / 2 + Math.cos(angle) * dist,
        y: h / 2 + Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        alpha:  Math.random() * 0.5 + 0.5,
        size:   Math.random() * 1.8 + 0.7,
        gold:   Math.random() > 0.45,
        orbitR: Math.random() * 70 + 35,
      };
    });

    let shockR = 0;
    let raf    = 0;

    const animate = () => {
      const cur = phaseRef.current;
      if (cur === "portal" || cur === "done") return;

      ctx.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2;

      // Shockwave rings during disperse
      if (cur === "disperse") {
        shockR += 14;
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
        const dx   = cx - p.x;
        const dy   = cy - p.y;
        const dist = Math.hypot(dx, dy) || 1;

        if (cur === "rollin") {
          // Gentle idle drift while logo rolls in
          p.vx += (Math.random() - 0.5) * 0.015;
          p.vy += (Math.random() - 0.5) * 0.015;
          p.vx *= 0.99; p.vy *= 0.99;

        } else if (cur === "suck") {
          // Strong gravity sucks particles toward the logo
          const pull = Math.min(8, 600 / (dist + 20));
          p.vx += (dx / dist) * pull;
          p.vy += (dy / dist) * pull;
          const spd = Math.hypot(p.vx, p.vy);
          if (spd > 22) { p.vx = (p.vx / spd) * 22; p.vy = (p.vy / spd) * 22; }
          p.vx *= 0.88; p.vy *= 0.88;

        } else if (cur === "orbit") {
          // Gravity toward center + tangential force to bend path into orbit
          const grav = Math.min(2.2, 140 / dist);
          p.vx += (dx / dist) * grav;
          p.vy += (dy / dist) * grav;
          if (dist < p.orbitR * 2.8) {
            const str = (1 - dist / (p.orbitR * 2.8)) * 3.0;
            p.vx += (-dy / dist) * str;
            p.vy += ( dx / dist) * str;
          }
          const sp = Math.hypot(p.vx, p.vy);
          if (sp > 11) { p.vx = (p.vx / sp) * 11; p.vy = (p.vy / sp) * 11; }
          p.vx *= 0.95; p.vy *= 0.95;

        } else if (cur === "disperse") {
          // Explode outward with spiral
          const force = 1.0 + Math.min(10, 160 / (dist + 1));
          p.vx -= (dx / dist) * force;
          p.vy -= (dy / dist) * force;
          p.vx += (-dy / dist) * force * 0.45;
          p.vy += ( dx / dist) * force * 0.45;
          p.vx *= 0.984; p.vy *= 0.984;
          if (p.x < -100 || p.x > w + 100 || p.y < -100 || p.y > h + 100)
            p.alpha = Math.max(0, p.alpha - 0.04);
        }

        p.x += p.vx; p.y += p.vy;
        if (p.alpha < 0.02) continue;

        // Glow halo
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 4.5, 0, Math.PI * 2);
        ctx.fillStyle = p.gold
          ? `rgba(201,168,76,${p.alpha * 0.13})`
          : `rgba(100,149,237,${p.alpha * 0.10})`;
        ctx.fill();

        // Core dot
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.gold
          ? `rgba(255,215,100,${p.alpha})`
          : `rgba(140,185,255,${p.alpha})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    const onResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);

  const isDone      = phase === "done";
  const isPortal    = phase === "portal" || phase === "done";
  const isSpinning  = phase === "orbit"  || phase === "disperse";

  return (
    <>
      <style>{`
        /* Logo rolls in from the right with a 3D coin-flip */
        @keyframes kc-rollIn {
          0%   { opacity: 0; transform: translateX(90vw) rotateY(-720deg) scale(0.1); }
          6%   { opacity: 1; }
          100% { opacity: 1; transform: translateX(0px) rotateY(0deg)   scale(1);   }
        }
        /* Continuous coin spin during orbit */
        @keyframes kc-coinSpin {
          from { transform: rotateY(0deg); }
          to   { transform: rotateY(360deg); }
        }
        /* Halo pulse around logo during orbit */
        @keyframes kc-halo {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50%      { opacity: 0.9; transform: scale(1.2); }
        }
        /* Logo expands and fades into portal on disperse */
        @keyframes kc-portalBurst {
          0%   { opacity: 1;   transform: translateX(-50%) translateY(-50%) scale(1);   }
          20%  { opacity: 0.9; transform: translateX(-50%) translateY(-50%) scale(1.18); }
          100% { opacity: 0;   transform: translateX(-50%) translateY(-50%) scale(3.2);  }
        }
      `}</style>

      {/* Dark overlay — circle cut-out expands during portal phase */}
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

      {/* ── LOGO WRAPPER ──
          • During portal/done: plays kc-portalBurst (translates from center)
          • Otherwise: sits centered via inline transform
          • Has perspective so child rotateY looks 3D
      */}
      <div
        style={{
          position: "fixed",
          top: "50%", left: "50%",
          width: "300px", height: "300px",
          zIndex: 9998,
          perspective: "1200px",
          pointerEvents: "none",
          willChange: "transform, opacity",
          ...(isPortal
            ? { animation: "kc-portalBurst 1.05s cubic-bezier(0.4, 0, 1, 1) forwards" }
            : { transform: "translateX(-50%) translateY(-50%)" }
          ),
        }}
      >
        {/* Halo glow ring — visible during orbit + disperse */}
        {isSpinning && (
          <div style={{
            position: "absolute", inset: "-38%", borderRadius: "50%",
            pointerEvents: "none",
            background: "radial-gradient(circle, rgba(201,168,76,0.7) 0%, rgba(26,58,143,0.5) 44%, transparent 70%)",
            animation: "kc-halo 1.4s ease-in-out infinite",
          }} />
        )}

        {/* Inner div: plays kc-rollIn, then stays at natural position */}
        <div
          style={{
            width: "100%", height: "100%",
            ...(phase === "rollin"
              ? { animation: "kc-rollIn 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards" }
              : {}
            ),
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/screen_transparent.png"
            alt="Key Club International Badge"
            style={{
              width: "100%", height: "100%", objectFit: "cover",
              borderRadius: "50%", display: "block",
              animation: isSpinning ? "kc-coinSpin 5s linear infinite" : "none",
              filter: isPortal
                ? "none"
                : "drop-shadow(0 0 35px rgba(201,168,76,0.9)) drop-shadow(0 0 90px rgba(26,58,143,0.75))",
            }}
          />
        </div>
      </div>

      {/* Canvas sits on top — hidden once done */}
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
