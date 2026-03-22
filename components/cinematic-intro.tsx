"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type Phase = "black" | "roll" | "disperse" | "wipe" | "done";

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  alpha: number; size: number; gold: boolean;
}

export default function CinematicIntro() {
  const [phaseState, setPhaseState] = useState<Phase>("black");
  const phaseRef    = useRef<Phase>("black");
  const [shouldRender, setShouldRender] = useState(false);
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const addTimeout = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timeoutsRef.current.push(id);
  }, []);

  // First-ever-visit only (localStorage persists across sessions)
  // On refresh the hero's own slideFlipEntrance + coinFlip plays naturally
  useEffect(() => {
    if (localStorage.getItem("kc_intro_v2")) return;
    localStorage.setItem("kc_intro_v2", "1");
    setShouldRender(true);

    //  0ms  → black  : pure black screen
    // 500ms → roll   : logo rolls in + particles stream from sides
    // 2900ms→ disperse: particles burst outward from logo
    // 3700ms→ wipe   : overlay slides up — site appears from top
    // 5000ms→ done   : unmount
    addTimeout(() => { phaseRef.current = "roll";     setPhaseState("roll");     }, 500);
    addTimeout(() => { phaseRef.current = "disperse"; setPhaseState("disperse"); }, 2900);
    addTimeout(() => { phaseRef.current = "wipe";     setPhaseState("wipe");     }, 3700);
    addTimeout(() => { phaseRef.current = "done";     setPhaseState("done");     }, 5000);

    return () => { timeoutsRef.current.forEach(clearTimeout); timeoutsRef.current = []; };
  }, [addTimeout]);

  // Particle canvas — starts when roll begins (500ms after mount)
  useEffect(() => {
    if (!shouldRender) return;
    let raf = 0;
    let resizeFn: (() => void) | null = null;

    const rollId = setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      let w = (canvas.width  = window.innerWidth);
      let h = (canvas.height = window.innerHeight);
      // Logo center at hero position (~27% from top, horizontally centered)
      const logoCX = () => w / 2;
      const logoCY = () => h * 0.27;

      // 220 particles — half on left edge, half on right edge
      const N = 220;
      const particles: Particle[] = Array.from({ length: N }, (_, i) => {
        const onLeft = i < N / 2;
        return {
          x:  onLeft ? -(Math.random() * w * 0.25 + 10) : w + Math.random() * w * 0.25 + 10,
          y:  Math.random() * h,
          vx: onLeft ? Math.random() * 5 + 2 : -(Math.random() * 5 + 2),
          vy: (Math.random() - 0.5) * 2,
          alpha: Math.random() * 0.55 + 0.45,
          size:  Math.random() * 2 + 0.7,
          gold:  Math.random() > 0.4,
        };
      });

      const animate = () => {
        if (phaseRef.current === "done") return;
        ctx.clearRect(0, 0, w, h);

        const cx = logoCX();
        const cy = logoCY();
        const isDisperse = phaseRef.current === "disperse" || phaseRef.current === "wipe";

        for (const p of particles) {
          const dx   = cx - p.x;
          const dy   = cy - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;

          if (!isDisperse) {
            // Attract: pull toward logo center
            const force = Math.min(0.45, 35 / (dist + 5));
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
            // Slow down when orbiting close to logo
            if (dist < 55) { p.vx *= 0.82; p.vy *= 0.82; }
          } else {
            // Disperse: burst outward with strong initial kick
            const force = 0.3 + Math.min(5, 90 / (dist + 1));
            p.vx -= (dx / dist) * force;
            p.vy -= (dy / dist) * force;
          }

          p.vx *= 0.97;
          p.vy *= 0.97;
          p.x  += p.vx;
          p.y  += p.vy;

          // Fade particles that fly off-screen after burst
          if (isDisperse && (p.x < -80 || p.x > w + 80 || p.y < -80 || p.y > h + 80)) {
            p.alpha = Math.max(0, p.alpha - 0.014);
          }

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

      resizeFn = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
      window.addEventListener("resize", resizeFn);
    }, 500);

    return () => {
      clearTimeout(rollId);
      cancelAnimationFrame(raf);
      if (resizeFn) window.removeEventListener("resize", resizeFn);
    };
  }, [shouldRender]);

  if (!shouldRender || phaseState === "done") return null;

  const isWipe  = phaseState === "wipe";
  const isBlack = phaseState === "black";

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "#000", overflow: "hidden",
      // Wipe: slides entire overlay upward — site appears from the top
      transform:  isWipe ? "translateY(-100%)" : "translateY(0)",
      transition: isWipe ? "transform 1.3s cubic-bezier(0.76,0,0.24,1)" : "none",
    }}>
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
          0%, 100% { opacity: 0.55; transform: scale(1);    }
          50%      { opacity: 1;    transform: scale(1.18); }
        }
      `}</style>

      {/* Particle canvas — transparent, black background comes from parent */}
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block", pointerEvents: "none" }}
      />

      {/* Logo — visible from roll phase onward, positioned at hero logo location */}
      {!isBlack && (
        <div style={{
          position: "absolute",
          top: "27%", left: "50%",
          // Center the logo at the hero logo's viewport position
          transform: "translateX(-50%) translateY(-50%)",
          width: "min(320px, 45vmin)", height: "min(320px, 45vmin)",
          zIndex: 10,
          perspective: "1200px",
        }}>
          {/* Radial glow halo that pulses behind the badge */}
          <div style={{
            position: "absolute", inset: "-35%", borderRadius: "50%", pointerEvents: "none",
            background: "radial-gradient(circle, rgba(201,168,76,0.6) 0%, rgba(26,58,143,0.4) 45%, transparent 72%)",
            animation: "kc-haloPulse 1.5s ease-in-out infinite",
          }} />

          {/* Entrance: rolls in from the right with 3-rotation flip */}
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
                // Coin keeps spinning continuously after entrance settles
                animation: "kc-coinSpin 8s cubic-bezier(0.37,0,0.63,1) 2.25s infinite",
                filter: [
                  "drop-shadow(0 0 50px rgba(201,168,76,0.85))",
                  "drop-shadow(0 0 110px rgba(26,58,143,0.65))",
                  "drop-shadow(0 0 200px rgba(201,168,76,0.3))",
                ].join(" "),
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
