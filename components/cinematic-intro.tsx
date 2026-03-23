"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const HERO_BG = "radial-gradient(ellipse 100% 90% at 50% 50%, #081530 0%, #020709 100%)";

type Phase = "rollin" | "merge" | "disperse" | "reveal" | "done";

interface Particle {
  x: number; y: number; px: number; py: number;
  vx: number; vy: number;
  alpha: number;
  baseSize: number;
  color: 0 | 1 | 2;
  tier: 0 | 1 | 2;
  orbitR: number;
  orbitSpeed: number;
  orbitAngle: number;
}

export default function CinematicIntro() {
  // Play once per browser session — skip if already seen this visit
  const [show] = useState(() => {
    if (typeof window === "undefined") return true;
    return sessionStorage.getItem("kc-intro-played") !== "1";
  });

  const [phase, setPhase]   = useState<Phase>("rollin");
  const [maskPx, setMaskPx] = useState<number>(0);
  const phaseRef  = useRef<Phase>("rollin");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timers    = useRef<ReturnType<typeof setTimeout>[]>([]);

  const go = useCallback((p: Phase, ms: number) => {
    timers.current.push(setTimeout(() => {
      phaseRef.current = p;
      setPhase(p);
      if (p === "done") {
        document.body.classList.add("intro-done");
        sessionStorage.setItem("kc-intro-played", "1");
      }
    }, ms));
  }, []);

  useEffect(() => {
    if (!show) {
      document.body.classList.add("intro-done");
      return;
    }
    go("merge",    1600);
    go("disperse", 3200);
    go("reveal",   3800);
    go("done",     5100);
    return () => { timers.current.forEach(clearTimeout); timers.current = []; };
  }, [go, show]);

  // ── Reveal: circular hole grows in the overlay ──
  useEffect(() => {
    if (phase !== "reveal") return;
    let raf = 0;
    const DURATION = 1100;
    const start    = Date.now() + 200;
    const maxR     = Math.hypot(window.innerWidth, window.innerHeight) / 2 + 80;
    const tick = () => {
      const t = Math.min(1, (Date.now() - start) / DURATION);
      if (t > 0) setMaskPx((1 - Math.pow(1 - t, 2.5)) * maxR);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  // ── Canvas ──
  useEffect(() => {
    if (!show) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let w = (canvas.width  = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const N = 450;
    const particles: Particle[] = Array.from({ length: N }, (_, i) => {
      const cx  = w / 2, cy = h / 2;
      const ang = (i / N) * Math.PI * 2 + Math.random() * 0.4;
      const r   = Math.random();
      const tier = i < N * 0.5 ? 0 : i < N * 0.85 ? 1 : 2;
      const radius = tier === 0
        ? 80  + Math.random() * Math.max(w, h) * 0.5
        : tier === 1
        ? 60  + Math.random() * Math.max(w, h) * 0.38
        : 40  + Math.random() * Math.max(w, h) * 0.22;
      const px = cx + Math.cos(ang) * radius;
      const py = cy + Math.sin(ang) * radius;
      return {
        x: px, y: py, px, py,
        vx: 0, vy: 0,
        alpha:    tier === 2 ? 0.45 + Math.random() * 0.35 : 0.55 + Math.random() * 0.45,
        baseSize: tier === 0 ? 0.4 + Math.random() * 0.7
                : tier === 1 ? 1.0 + Math.random() * 1.2
                             : 2.0 + Math.random() * 1.8,
        color: r < 0.34 ? 0 : r < 0.67 ? 1 : 2,
        tier: tier as 0 | 1 | 2,
        orbitR:     25 + Math.random() * 80,
        orbitSpeed: (0.008 + Math.random() * 0.018) * (Math.random() < 0.5 ? 1 : -1),
        orbitAngle: ang,
      };
    });

    let flashAlpha   = 0;
    let flashRadius  = 0;
    let mergeFlashed = false;

    // Shockwave ring that expands on disperse
    let shockwaveR      = 0;
    let shockwaveAlpha  = 0;
    let disperseShocked = false;

    let raf = 0;

    const animate = () => {
      const cur = phaseRef.current;
      if (cur === "done") { ctx.clearRect(0, 0, w, h); return; }

      ctx.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2;

      if (cur === "merge" && !mergeFlashed) {
        mergeFlashed = true;
        flashAlpha  = 1;
        flashRadius = 0;
      }

      if (cur === "disperse" && !disperseShocked) {
        disperseShocked = true;
        shockwaveAlpha  = 0.95;
        shockwaveR      = 20;
      }

      // Merge flash
      if (flashAlpha > 0) {
        flashRadius += 22;
        flashAlpha  *= 0.84;
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, flashRadius);
        grad.addColorStop(0,   `rgba(255,245,200,${flashAlpha * 0.9})`);
        grad.addColorStop(0.3, `rgba(201,168,76, ${flashAlpha * 0.55})`);
        grad.addColorStop(0.7, `rgba(160,80,220, ${flashAlpha * 0.25})`);
        grad.addColorStop(1,   `rgba(0,0,0,0)`);
        ctx.beginPath(); ctx.arc(cx, cy, flashRadius, 0, Math.PI * 2);
        ctx.fillStyle = grad; ctx.fill();
      }

      // Disperse shockwave
      if (shockwaveAlpha > 0.01) {
        shockwaveR    += 20;
        shockwaveAlpha *= 0.88;
        ctx.beginPath();
        ctx.arc(cx, cy, shockwaveR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(200,100,255,${shockwaveAlpha * 0.55})`;
        ctx.lineWidth   = 4 + shockwaveAlpha * 5;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx, cy, shockwaveR * 1.45, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(201,168,76,${shockwaveAlpha * 0.3})`;
        ctx.lineWidth   = 2;
        ctx.stroke();
      }

      for (const p of particles) {
        p.px = p.x; p.py = p.y;

        const dx   = cx - p.x, dy = cy - p.y;
        const dist = Math.hypot(dx, dy) || 1;

        if (cur === "rollin") {
          const pull = Math.min(0.25, 30 / (dist + 40));
          p.vx += (dx / dist) * pull + (Math.random() - 0.5) * 0.08;
          p.vy += (dy / dist) * pull + (Math.random() - 0.5) * 0.08;
          p.vx *= 0.975; p.vy *= 0.975;

        } else if (cur === "merge") {
          const pull = Math.min(4.5, 280 / (dist + 1));
          p.vx += (dx / dist) * pull;
          p.vy += (dy / dist) * pull;
          const orbitZone = p.orbitR * 4;
          if (dist < orbitZone) {
            const str = Math.pow(1 - dist / orbitZone, 1.5) * 6;
            p.vx += (-dy / dist) * str;
            p.vy +=  (dx / dist) * str;
          }
          const sp = Math.hypot(p.vx, p.vy);
          if (sp > 16) { p.vx = (p.vx / sp) * 16; p.vy = (p.vy / sp) * 16; }
          p.vx *= 0.935; p.vy *= 0.935;

        } else if (cur === "disperse" || cur === "reveal") {
          const push = 3.5 + Math.min(22, 350 / (dist + 1));
          p.vx -= (dx / dist) * push;
          p.vy -= (dy / dist) * push;
          p.vx += (-dy / dist) * push * 0.4;
          p.vy +=  (dx / dist) * push * 0.4;
          p.vx *= 0.972; p.vy *= 0.972;
          const offscreen = p.x < -150 || p.x > w + 150 || p.y < -150 || p.y > h + 150;
          if (offscreen) p.alpha = Math.max(0, p.alpha - 0.06);
        }

        p.x += p.vx; p.y += p.vy;
        if (p.alpha < 0.018) continue;

        const speed = Math.hypot(p.vx, p.vy);
        const palette: [number,number,number][] = [
          [220, 183, 90], [110, 158, 245], [168, 60, 240],
        ];
        const [cr, cg, cb] = palette[p.color];

        if (p.tier === 2) {
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.baseSize * 6);
          g.addColorStop(0,   `rgba(${cr},${cg},${cb},${p.alpha * 0.55})`);
          g.addColorStop(0.5, `rgba(${cr},${cg},${cb},${p.alpha * 0.2})`);
          g.addColorStop(1,   `rgba(${cr},${cg},${cb},0)`);
          ctx.beginPath(); ctx.arc(p.x, p.y, p.baseSize * 6, 0, Math.PI * 2);
          ctx.fillStyle = g; ctx.fill();
        }

        if (speed > 3 && p.tier !== 2) {
          ctx.beginPath();
          ctx.moveTo(p.px, p.py);
          ctx.lineTo(p.x,  p.y);
          ctx.strokeStyle = `rgba(${cr},${cg},${cb},${p.alpha * Math.min(1, speed / 10) * 0.55})`;
          ctx.lineWidth   = p.baseSize * 0.7;
          ctx.lineCap     = "round";
          ctx.stroke();
        }

        ctx.beginPath(); ctx.arc(p.x, p.y, p.baseSize * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${p.alpha * 0.12})`; ctx.fill();
        ctx.beginPath(); ctx.arc(p.x, p.y, p.baseSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${p.alpha})`; ctx.fill();
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
  }, [show]);

  if (!show) return null;

  const isDone     = phase === "done";
  const isDisperse = phase === "disperse";
  const isReveal   = phase === "reveal";
  const isMerge    = phase === "merge";
  const isSpinning = isMerge || isDisperse || isReveal;

  const logoAnim = (side: "left" | "right") => {
    if (phase === "rollin")
      return side === "left"
        ? "kc-rollInLeft 1.6s cubic-bezier(0.08,0.92,0.2,1) forwards"
        : "kc-rollInRight 1.6s cubic-bezier(0.08,0.92,0.2,1) forwards";
    if (isDisperse || isReveal)
      return "kc-logoOut 0.6s cubic-bezier(0.4,0,1,1) forwards";
    return undefined;
  };

  const baseWrapper = {
    position:     "fixed" as const,
    top: "50%", left: "50%",
    transform:    "translateX(-50%) translateY(-50%)",
    width: "290px", height: "290px",
    perspective:  "1400px",
    pointerEvents:"none" as const,
    display: isDone ? "none" as const : undefined,
  };

  const holeMask = maskPx > 0
    ? `radial-gradient(circle, transparent ${maskPx}px, #020709 ${maskPx + 5}px)`
    : undefined;

  return (
    <>
      <style>{`
        @keyframes kc-rollInLeft {
          0%   { opacity:0; transform:translateX(-95vw) rotateY(-720deg) scale(0.04); }
          5%   { opacity:0.8; }
          85%  { transform:translateX(4vw) rotateY(8deg) scale(1.04); }
          100% { opacity:1; transform:translateX(0) rotateY(0deg) scale(1); }
        }
        @keyframes kc-rollInRight {
          0%   { opacity:0; transform:translateX(95vw) rotateY(720deg) scale(0.04); }
          5%   { opacity:0.8; }
          85%  { transform:translateX(-4vw) rotateY(-8deg) scale(1.04); }
          100% { opacity:1; transform:translateX(0) rotateY(0deg) scale(1); }
        }
        @keyframes kc-coinSpin {
          from { transform:rotateY(0deg); }
          to   { transform:rotateY(360deg); }
        }
        @keyframes kc-logoOut {
          0%   { opacity:1; transform:scale(1);   filter:blur(0px); }
          40%  { opacity:0.7; transform:scale(1.4); filter:blur(2px); }
          100% { opacity:0; transform:scale(3.2); filter:blur(10px); }
        }
        @keyframes kc-halo {
          0%,100% { opacity:0.28; transform:scale(1); }
          50%     { opacity:0.75; transform:scale(1.18); }
        }
        @media(max-width:600px){
          .kc-logo-wrap { width:160px !important; height:160px !important; }
        }
      `}</style>

      {/* Dark overlay with growing hole during reveal */}
      <div style={{
        position:"fixed", inset:0, zIndex:9996, background:HERO_BG,
        opacity: isDone ? 0 : 1,
        transition: isDone ? "opacity 0.3s ease" : "none",
        pointerEvents: isDone ? "none" : "auto",
        transform:"translateZ(0)",
        ...(holeMask ? { maskImage:holeMask, WebkitMaskImage:holeMask } : {}),
      } as React.CSSProperties} />

      {/* ── CHARGERS — from LEFT ── */}
      <div className="kc-logo-wrap" style={{ ...baseWrapper, zIndex: 9998 }}>
        <div style={{
          position:"absolute", inset:"-44%", borderRadius:"50%",
          background:"radial-gradient(circle, rgba(145,65,215,0.38) 0%, rgba(100,40,180,0.1) 55%, transparent 72%)",
          animation:"kc-halo 2.4s ease-in-out infinite",
          pointerEvents:"none",
        }} />
        <div style={{ width:"100%", height:"100%", animation:logoAnim("left"), position:"relative" }}>
          <div style={{
            position:"absolute", inset:0, borderRadius:"50%", overflow:"hidden",
            boxShadow:"0 0 0 1.5px rgba(165,85,255,0.55), 0 0 28px rgba(145,65,215,0.5), 0 0 70px rgba(120,45,200,0.2)",
            animation: isSpinning ? "kc-coinSpin 4s linear infinite" : "none",
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/chargers-logo.png" alt="Fulshear Chargers"
              style={{ width:"100%", height:"100%", objectFit:"contain", display:"block" }}
            />
          </div>
        </div>
      </div>

      {/* ── KEY CLUB — from RIGHT ── */}
      <div className="kc-logo-wrap" style={{ ...baseWrapper, zIndex: 9999 }}>
        <div style={{
          position:"absolute", inset:"-44%", borderRadius:"50%",
          background:"radial-gradient(circle, rgba(201,168,76,0.38) 0%, rgba(180,140,50,0.1) 55%, transparent 72%)",
          animation:"kc-halo 2.4s ease-in-out infinite 1.2s",
          pointerEvents:"none",
        }} />
        <div style={{ width:"100%", height:"100%", animation:logoAnim("right"), position:"relative" }}>
          <div style={{
            position:"absolute", inset:0, borderRadius:"50%", overflow:"hidden",
            boxShadow:"0 0 0 1.5px rgba(201,168,76,0.6), 0 0 28px rgba(201,168,76,0.5), 0 0 70px rgba(201,168,76,0.2)",
            animation: isSpinning ? "kc-coinSpin 4s linear infinite" : "none",
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/screen_transparent.png" alt="Key Club Badge"
              style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
            />
          </div>
        </div>
      </div>

      {/* Canvas — particles + flash + shockwave */}
      <canvas ref={canvasRef} style={{
        position:"fixed", inset:0, zIndex:10000,
        width:"100%", height:"100%", display:"block",
        pointerEvents:"none",
        opacity: isDone ? 0 : 1,
        transition: isDone ? "opacity 0.3s ease" : "none",
      }} />
    </>
  );
}
