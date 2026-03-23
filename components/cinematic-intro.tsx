"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const HERO_BG = "radial-gradient(ellipse 100% 90% at 50% 50%, #081530 0%, #020709 100%)";

type Phase = "rollin" | "merge" | "disperse" | "reveal" | "done";

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  alpha: number; size: number;
  color: 0 | 1 | 2; // 0=gold  1=blue  2=purple
  orbitR: number;
  angle: number;
}

export default function CinematicIntro() {
  const [phase, setPhase]   = useState<Phase>("rollin");
  const [maskPx, setMaskPx] = useState<number>(0);
  const phaseRef  = useRef<Phase>("rollin");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timers    = useRef<ReturnType<typeof setTimeout>[]>([]);

  const go = useCallback((p: Phase, ms: number) => {
    timers.current.push(setTimeout(() => {
      phaseRef.current = p;
      setPhase(p);
      if (p === "done") document.body.classList.add("intro-done");
    }, ms));
  }, []);

  // ── Phase timeline ──
  useEffect(() => {
    // rollin   0 → 1200ms  – logos glide in from sides
    // merge    1200 → 2600ms – both logos spin together, particles orbit
    // disperse 2600 → 3100ms – logos + particles fly outward
    // reveal   3100 → 4400ms – overlay hole expands
    // done     4400ms
    go("merge",    1200);
    go("disperse", 2600);
    go("reveal",   3100);
    go("done",     4400);
    return () => { timers.current.forEach(clearTimeout); timers.current = []; };
  }, [go]);

  // ── Reveal: circular hole grows in overlay ──
  useEffect(() => {
    if (phase !== "reveal") return;
    let raf = 0;
    const DURATION = 1100;
    const start    = Date.now() + 180; // slight delay so logos finish fading
    const maxR     = Math.hypot(window.innerWidth, window.innerHeight) / 2 + 60;
    const tick = () => {
      const t = Math.min(1, (Date.now() - start) / DURATION);
      if (t > 0) {
        const eased = 1 - Math.pow(1 - t, 2.2);
        setMaskPx(eased * maxR);
      }
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  // ── Canvas: particles ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let w = (canvas.width  = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const N = 240;
    const particles: Particle[] = Array.from({ length: N }, () => {
      const cx = w / 2, cy = h / 2;
      const ang    = Math.random() * Math.PI * 2;
      const radius = 160 + Math.random() * Math.max(w, h) * 0.45;
      const r      = Math.random();
      return {
        x: cx + Math.cos(ang) * radius,
        y: cy + Math.sin(ang) * radius,
        vx: 0, vy: 0,
        alpha: Math.random() * 0.5 + 0.5,
        size:  Math.random() * 1.8 + 0.5,
        color: r < 0.34 ? 0 : r < 0.67 ? 1 : 2,
        orbitR: Math.random() * 65 + 30,
        angle:  ang,
      };
    });

    let raf = 0;

    const animate = () => {
      const cur = phaseRef.current;
      if (cur === "done") { ctx.clearRect(0, 0, w, h); return; }
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2;

      for (const p of particles) {
        const dx = cx - p.x, dy = cy - p.y;
        const dist = Math.hypot(dx, dy) || 1;

        if (cur === "rollin") {
          // Gently drift inward
          const pull = Math.min(0.3, 40 / (dist + 30));
          p.vx += (dx / dist) * pull;
          p.vy += (dy / dist) * pull;
          p.vx *= 0.97; p.vy *= 0.97;

        } else if (cur === "merge") {
          // Pull toward center, then orbit
          const pull = Math.min(3, 220 / (dist + 1));
          p.vx += (dx / dist) * pull;
          p.vy += (dy / dist) * pull;
          if (dist < p.orbitR * 3.5) {
            // Tangential force → smooth orbit
            const str = (1 - dist / (p.orbitR * 3.5)) * 4.5;
            p.vx += (-dy / dist) * str;
            p.vy += (dx  / dist) * str;
          }
          const sp = Math.hypot(p.vx, p.vy);
          if (sp > 14) { p.vx = (p.vx / sp) * 14; p.vy = (p.vy / sp) * 14; }
          p.vx *= 0.94; p.vy *= 0.94;

        } else if (cur === "disperse" || cur === "reveal") {
          // Explode outward with slight swirl
          const push = 2.2 + Math.min(18, 280 / (dist + 1));
          p.vx -= (dx / dist) * push;
          p.vy -= (dy / dist) * push;
          p.vx += (-dy / dist) * push * 0.35;
          p.vy += (dx  / dist) * push * 0.35;
          p.vx *= 0.976; p.vy *= 0.976;
          if (p.x < -120 || p.x > w + 120 || p.y < -120 || p.y > h + 120)
            p.alpha = Math.max(0, p.alpha - 0.04);
        }

        p.x += p.vx; p.y += p.vy;
        if (p.alpha < 0.02) continue;

        const palettes: [number,number,number][] = [
          [201, 168,  76],
          [100, 149, 237],
          [138,  43, 226],
        ];
        const dotLabels = ["rgba(255,215,100", "rgba(140,185,255", "rgba(200,100,255"];
        const [cr, cg, cb] = palettes[p.color];

        // Soft outer glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${p.alpha * 0.12})`;
        ctx.fill();
        // Core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${dotLabels[p.color]},${p.alpha})`;
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

  const isDone     = phase === "done";
  const isMerge    = phase === "merge";
  const isDisperse = phase === "disperse";
  const isReveal   = phase === "reveal";
  const isSpinning = isMerge || isDisperse || isReveal;

  // Logo animation per phase
  const logoAnim = (side: "left" | "right") => {
    if (phase === "rollin") {
      return side === "left"
        ? "kc-rollInLeft 1.2s cubic-bezier(0.16,1,0.3,1) forwards"
        : "kc-rollInRight 1.2s cubic-bezier(0.16,1,0.3,1) forwards";
    }
    if (isDisperse || isReveal) return "kc-logoOut 0.5s cubic-bezier(0.4,0,1,1) forwards";
    return undefined; // merge: just sit at center
  };

  const baseWrapper = {
    position:     "fixed" as const,
    top: "50%", left: "50%",
    transform:    "translateX(-50%) translateY(-50%)",
    width: "280px", height: "280px",
    perspective:  "1200px",
    pointerEvents:"none" as const,
    display: isDone ? "none" as const : undefined,
  };

  const holeMask = maskPx > 0
    ? `radial-gradient(circle, transparent ${maskPx}px, #020709 ${maskPx + 4}px)`
    : undefined;

  return (
    <>
      <style>{`
        @keyframes kc-rollInLeft {
          0%   { opacity:0; transform:translateX(-90vw) rotateY(600deg) scale(0.08); }
          6%   { opacity:1; }
          100% { opacity:1; transform:translateX(0) rotateY(0deg) scale(1); }
        }
        @keyframes kc-rollInRight {
          0%   { opacity:0; transform:translateX(90vw) rotateY(-600deg) scale(0.08); }
          6%   { opacity:1; }
          100% { opacity:1; transform:translateX(0) rotateY(0deg) scale(1); }
        }
        @keyframes kc-coinSpin {
          from { transform:rotateY(0deg); }
          to   { transform:rotateY(360deg); }
        }
        @keyframes kc-logoOut {
          0%   { opacity:1; transform:scale(1);   filter:blur(0px); }
          100% { opacity:0; transform:scale(2.8); filter:blur(6px); }
        }
        @keyframes kc-halo {
          0%,100% { opacity:0.3; transform:scale(1); }
          50%     { opacity:0.8; transform:scale(1.2); }
        }
      `}</style>

      {/* Dark overlay with growing hole during reveal */}
      <div style={{
        position:"fixed", inset:0, zIndex:9996, background:HERO_BG,
        opacity: isDone ? 0 : 1,
        transition: isDone ? "opacity 0.25s ease" : "none",
        pointerEvents: isDone ? "none" : "auto",
        transform:"translateZ(0)",
        ...(holeMask ? {
          maskImage:       holeMask,
          WebkitMaskImage: holeMask,
        } : {}),
      } as React.CSSProperties} />

      {/* ── CHARGERS — from LEFT, purple ── */}
      <div style={{ ...baseWrapper, zIndex: 9997 }}>
        <div style={{
          position:"absolute", inset:"-42%", borderRadius:"50%",
          background:"radial-gradient(circle, rgba(150,70,210,0.4) 0%, rgba(100,40,180,0.12) 55%, transparent 72%)",
          animation:"kc-halo 2.2s ease-in-out infinite",
          pointerEvents:"none",
        }} />
        <div style={{ width:"100%", height:"100%", animation:logoAnim("left"), position:"relative" }}>
          <div style={{
            position:"absolute", inset:0, borderRadius:"50%", overflow:"hidden",
            boxShadow:"0 0 0 2px rgba(170,90,255,0.5), 0 0 24px rgba(150,70,220,0.5), 0 0 60px rgba(130,50,210,0.18)",
            animation: isSpinning ? "kc-coinSpin 4.5s linear infinite" : "none",
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/chargers-logo.png" alt="Fulshear Chargers"
              style={{ width:"100%", height:"100%", objectFit:"contain", display:"block" }}
            />
          </div>
        </div>
      </div>

      {/* ── KEY CLUB — from RIGHT, gold ── */}
      <div style={{ ...baseWrapper, zIndex: 9998 }}>
        <div style={{
          position:"absolute", inset:"-42%", borderRadius:"50%",
          background:"radial-gradient(circle, rgba(201,168,76,0.4) 0%, rgba(180,140,50,0.12) 55%, transparent 72%)",
          animation:"kc-halo 2.2s ease-in-out infinite 1.1s",
          pointerEvents:"none",
        }} />
        <div style={{ width:"100%", height:"100%", animation:logoAnim("right"), position:"relative" }}>
          <div style={{
            position:"absolute", inset:0, borderRadius:"50%", overflow:"hidden",
            boxShadow:"0 0 0 2px rgba(201,168,76,0.55), 0 0 24px rgba(201,168,76,0.5), 0 0 60px rgba(201,168,76,0.18)",
            animation: isSpinning ? "kc-coinSpin 4.5s linear infinite" : "none",
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/screen_transparent.png" alt="Key Club Badge"
              style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
            />
          </div>
        </div>
      </div>

      {/* Canvas — particles */}
      <canvas ref={canvasRef} style={{
        position:"fixed", inset:0, zIndex:9999,
        width:"100%", height:"100%", display:"block",
        pointerEvents:"none",
        opacity: isDone ? 0 : 1,
        transition: isDone ? "opacity 0.25s ease" : "none",
      }} />
    </>
  );
}
