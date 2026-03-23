"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const HERO_BG = "radial-gradient(ellipse 100% 90% at 50% 50%, #081530 0%, #020709 100%)";

type Phase = "rollin" | "suck" | "orbit" | "disperse" | "portal" | "done";

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  alpha: number; size: number;
  color: 0 | 1 | 2; // 0=gold  1=blue  2=purple
  orbitR: number;
}

export default function CinematicIntro() {
  const [phase, setPhase]           = useState<Phase>("rollin");
  const [chargersSrc, setChargersSrc] = useState<string>("");
  const [maskPx, setMaskPx]         = useState<number>(0);
  const phaseRef  = useRef<Phase>("rollin");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timers    = useRef<ReturnType<typeof setTimeout>[]>([]);

  const addTimeout = useCallback((fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);

  // ── Load Chargers PNG (background already removed) + apply circular crop ──
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const SIZE = 512;
      const c = document.createElement("canvas");
      c.width = SIZE; c.height = SIZE;
      const ctx2 = c.getContext("2d");
      if (!ctx2) return;
      // Circular clip so only the inscribed circle is drawn — clean edges
      ctx2.beginPath();
      ctx2.arc(SIZE / 2, SIZE / 2, SIZE / 2, 0, Math.PI * 2);
      ctx2.clip();
      ctx2.drawImage(img, 0, 0, SIZE, SIZE);
      setChargersSrc(c.toDataURL("image/png"));
    };
    img.src = "/chargers-logo.png";
  }, []);

  // ── Phase timeline ──
  useEffect(() => {
    // rollin  0 → 1000ms
    // suck    1000 → 1700ms
    // orbit   1700 → 2800ms
    // disperse 2800 → 3100ms
    // portal  3100 → 4500ms
    // done    4500ms
    addTimeout(() => { phaseRef.current = "suck";     setPhase("suck");     }, 1000);
    addTimeout(() => { phaseRef.current = "orbit";    setPhase("orbit");    }, 1700);
    addTimeout(() => { phaseRef.current = "disperse"; setPhase("disperse"); }, 2800);
    addTimeout(() => { phaseRef.current = "portal";   setPhase("portal");   }, 3100);
    addTimeout(() => { phaseRef.current = "done";     setPhase("done");
                       document.body.classList.add("intro-done");           }, 4500);
    return () => { timers.current.forEach(clearTimeout); timers.current = []; };
  }, [addTimeout]);

  // ── Portal: animate circular hole in the overlay ──
  // Logo disappears first (kc-portalBurst 0.45s), then hole expands 250ms later
  useEffect(() => {
    if (phase !== "portal") return;
    let raf = 0;
    const DELAY    = 250;   // wait for logo to be ~55% faded
    const DURATION = 1050;  // hole fully open at 3100+250+1050 = 4400ms
    const start    = Date.now() + DELAY;
    const maxR     = Math.hypot(window.innerWidth, window.innerHeight) / 2 + 40;
    const tick = () => {
      const now = Date.now();
      if (now < start) { raf = requestAnimationFrame(tick); return; }
      const t      = Math.min(1, (now - start) / DURATION);
      const eased  = 1 - Math.pow(1 - t, 2); // ease-out quad
      setMaskPx(eased * maxR);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

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
      const side   = Math.floor(Math.random() * 4);
      const margin = 60 + Math.random() * 350;
      let px: number, py: number;
      if      (side === 0) { px = Math.random() * w; py = -margin; }
      else if (side === 1) { px = w + margin;         py = Math.random() * h; }
      else if (side === 2) { px = Math.random() * w; py = h + margin; }
      else                 { px = -margin;            py = Math.random() * h; }
      const toCenter = Math.atan2(cy - py, cx - px);
      const spread   = (Math.random() - 0.5) * 0.9;
      const r        = Math.random();
      return {
        x: px, y: py,
        vx: Math.cos(toCenter + spread) * (0.9 + Math.random() * 2),
        vy: Math.sin(toCenter + spread) * (0.9 + Math.random() * 2),
        alpha:  Math.random() * 0.5 + 0.5,
        size:   Math.random() * 1.8 + 0.7,
        color:  r < 0.34 ? 0 : r < 0.67 ? 1 : 2,
        orbitR: Math.random() * 70 + 35,
      };
    });

    let shockR = 0, lastPhase: Phase = "rollin", raf = 0;

    const animate = () => {
      const cur = phaseRef.current;
      if (cur === "done") return;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2;

      if (cur === "suck"     && lastPhase !== "suck")     shockR = 0;
      if (cur === "disperse" && lastPhase !== "disperse") shockR = 0;
      lastPhase = cur;

      // ── Shockwave rings ──
      if (cur === "suck" || cur === "disperse") {
        shockR += cur === "disperse" ? 18 : 9;
        const maxR = Math.hypot(w, h) * (cur === "disperse" ? 1.5 : 0.55);
        const norm = cur === "disperse" ? maxR / 1.5 * 0.7 : maxR;
        if (shockR < maxR) {
          const fade = Math.max(0, 1 - shockR / norm);
          const lw   = cur === "disperse" ? [6, 4, 2.5] : [5, 3.5, 2];
          [[201,168,76],[160,80,220],[100,149,237]].forEach(([r,g,b], idx) => {
            const offset = idx * (cur === "disperse" ? 30 : 22);
            if (shockR > offset) {
              ctx.beginPath(); ctx.arc(cx, cy, shockR - offset, 0, Math.PI * 2);
              ctx.strokeStyle = `rgba(${r},${g},${b},${fade * (0.9 - idx * 0.2)})`;
              ctx.lineWidth = lw[idx]; ctx.stroke();
            }
          });
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
        } else if (cur === "disperse" || cur === "portal") {
          const force = 1.5 + Math.min(14, 200 / (dist + 1));
          p.vx -= (dx / dist) * force; p.vy -= (dy / dist) * force;
          p.vx += (-dy / dist) * force * 0.45; p.vy += (dx / dist) * force * 0.45;
          p.vx *= 0.982; p.vy *= 0.982;
          if (p.x < -100 || p.x > w + 100 || p.y < -100 || p.y > h + 100)
            p.alpha = Math.max(0, p.alpha - 0.05);
        }

        p.x += p.vx; p.y += p.vy;
        if (p.alpha < 0.02) continue;

        const colors: [number,number,number][] = [[201,168,76],[100,149,237],[138,43,226]];
        const dotColors = ["rgba(255,215,100", "rgba(140,185,255", "rgba(200,100,255"];
        const [cr,cg,cb] = colors[p.color];
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 4.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${p.alpha * 0.13})`; ctx.fill();
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${dotColors[p.color]},${p.alpha})`; ctx.fill();
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    const onResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);

  const isDone     = phase === "done";
  const isPortal   = phase === "portal";
  const isSpinning = phase === "orbit" || phase === "disperse";
  const isDisperse = phase === "disperse";
  const isSuck     = phase === "suck";

  const kcAnim =
    phase === "rollin" ? "kc-rollInRight 1.0s cubic-bezier(0.16,1,0.3,1) forwards" :
    isSuck             ? "kc-suckIn 0.7s cubic-bezier(0.4,0,1,1) forwards" :
    isDisperse         ? "kc-logoDisperse 0.35s cubic-bezier(0.4,0,1,1) forwards" :
    isPortal           ? "kc-portalBurst 0.45s cubic-bezier(0.4,0,1,1) forwards" :
    undefined;

  const charAnim =
    phase === "rollin" ? "kc-rollInLeft 1.0s cubic-bezier(0.16,1,0.3,1) forwards" :
    isSuck             ? "kc-suckIn 0.7s cubic-bezier(0.4,0,1,1) forwards" :
    isDisperse         ? "kc-logoDisperse 0.35s cubic-bezier(0.4,0,1,1) forwards" :
    isPortal           ? "kc-portalBurst 0.45s cubic-bezier(0.4,0,1,1) forwards" :
    undefined;

  const baseWrapper = {
    position:     "fixed"  as const,
    top: "50%", left: "50%",
    transform:    "translateX(-50%) translateY(-50%)",
    width: "280px", height: "280px",
    perspective:  "1200px",
    pointerEvents:"none" as const,
    display: isDone ? "none" as const : undefined,
  };

  // Circular hole mask — grows during portal phase to reveal the hero
  const holeMask = maskPx > 0
    ? `radial-gradient(circle, transparent ${maskPx}px, #020709 ${maskPx + 3}px)`
    : undefined;

  return (
    <>
      <style>{`
        @keyframes kc-rollInRight {
          0%   { opacity:0; transform:translateX(88vw) rotateY(-720deg) scale(0.1); }
          5%   { opacity:1; }
          100% { opacity:1; transform:translateX(0) rotateY(0deg) scale(1); }
        }
        @keyframes kc-rollInLeft {
          0%   { opacity:0; transform:translateX(-88vw) rotateY(720deg) scale(0.1); }
          5%   { opacity:1; }
          100% { opacity:1; transform:translateX(0) rotateY(0deg) scale(1); }
        }
        @keyframes kc-coinSpin {
          from { transform:rotateY(0deg); }
          to   { transform:rotateY(360deg); }
        }
        @keyframes kc-suckIn {
          0%   { transform:scale(1); }
          60%  { transform:scale(1.12); }
          100% { transform:scale(0.95); }
        }
        @keyframes kc-logoDisperse {
          0%   { opacity:1; transform:scale(1);   filter:blur(0px); }
          100% { opacity:0; transform:scale(2.6); filter:blur(5px); }
        }
        @keyframes kc-portalBurst {
          0%   { opacity:1; transform:scale(1); }
          100% { opacity:0; transform:scale(1.5); }
        }
        @keyframes kc-halo {
          0%,100% { opacity:0.35; transform:scale(1); }
          50%     { opacity:0.85; transform:scale(1.22); }
        }
      `}</style>

      {/* Dark overlay — has a growing circular hole punched out during portal */}
      <div style={{
        position:"fixed", inset:0, zIndex:9996, background:HERO_BG,
        opacity: isDone ? 0 : 1,
        transition: isDone ? "opacity 0.3s ease" : "none",
        pointerEvents: isDone ? "none" : "auto",
        transform:"translateZ(0)", willChange:"opacity, mask-image",
        ...(holeMask ? {
          maskImage:        holeMask,
          WebkitMaskImage:  holeMask,
        } : {}),
      } as React.CSSProperties} />

      {/* ── CHARGERS — from LEFT, purple ── */}
      <div style={{ ...baseWrapper, zIndex: 9997 }}>
        {isSpinning && (
          <div style={{
            position:"absolute", inset:"-45%", borderRadius:"50%",
            background:"radial-gradient(circle, rgba(160,80,220,0.55) 0%, rgba(100,40,180,0.25) 55%, transparent 72%)",
            animation:"kc-halo 1.6s ease-in-out infinite",
            pointerEvents:"none",
          }} />
        )}
        <div style={{ width:"100%", height:"100%", animation:charAnim, position:"relative" }}>
          <div style={{
            position:"absolute", inset:0, borderRadius:"50%", overflow:"hidden",
            background:"#0a0212",
            boxShadow:"0 0 0 2px rgba(180,100,255,0.45), 0 0 18px rgba(160,80,220,0.5)",
            animation: isSpinning ? "kc-coinSpin 5s linear infinite" : "none",
          }}>
            {chargersSrc && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={chargersSrc}
                alt="Fulshear Chargers"
                style={{
                  width:"100%", height:"100%",
                  objectFit:"contain", display:"block",
                  filter:"drop-shadow(0 0 7px rgba(180,100,255,0.55))",
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* ── KEY CLUB — from RIGHT, gold ── */}
      <div style={{ ...baseWrapper, zIndex: 9998 }}>
        {isSpinning && (
          <div style={{
            position:"absolute", inset:"-45%", borderRadius:"50%",
            background:"radial-gradient(circle, rgba(201,168,76,0.55) 0%, rgba(26,58,143,0.25) 55%, transparent 72%)",
            animation:"kc-halo 1.6s ease-in-out infinite 0.8s",
            pointerEvents:"none",
          }} />
        )}
        <div style={{ width:"100%", height:"100%", animation:kcAnim, position:"relative" }}>
          <div style={{
            position:"absolute", inset:0, borderRadius:"50%", overflow:"hidden",
            background:"#020709",
            boxShadow:"0 0 0 2px rgba(201,168,76,0.5), 0 0 18px rgba(201,168,76,0.45)",
            animation: isSpinning ? "kc-coinSpin 5s linear infinite" : "none",
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/screen_transparent.png"
              alt="Key Club Badge"
              style={{
                width:"100%", height:"100%",
                objectFit:"cover", display:"block",
                filter:"drop-shadow(0 0 7px rgba(201,168,76,0.5))",
              }}
            />
          </div>
        </div>
      </div>

      {/* Canvas — particles + shockwave rings */}
      <canvas
        ref={canvasRef}
        style={{
          position:"fixed", inset:0, zIndex:9999,
          width:"100%", height:"100%", display:"block",
          pointerEvents:"none",
          opacity: isDone ? 0 : 1,
          transition: isDone ? "opacity 0.3s ease" : "none",
        }}
      />
    </>
  );
}
