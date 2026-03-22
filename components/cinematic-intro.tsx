"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type Phase = "warp" | "zoom" | "reveal" | "done";

// ── Star: 3D perspective warp projection ────────────────────────────────────
class Star {
  x: number; y: number; z: number; prevZ: number;
  private w: number; private h: number;

  constructor(w: number, h: number) {
    this.w = w; this.h = h;
    this.x = (Math.random() - 0.5) * w * 2;
    this.y = (Math.random() - 0.5) * h * 2;
    this.z = Math.random() * w;
    this.prevZ = this.z;
  }

  update(speed: number): void {
    this.prevZ = this.z;
    this.z -= speed;
    if (this.z <= 0) {
      this.z = this.w; this.prevZ = this.z;
      this.x = (Math.random() - 0.5) * this.w * 2;
      this.y = (Math.random() - 0.5) * this.h * 2;
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const sx = (this.x / this.z) * this.w + this.w / 2;
    const sy = (this.y / this.z) * this.h + this.h / 2;
    const px = (this.x / this.prevZ) * this.w + this.w / 2;
    const py = (this.y / this.prevZ) * this.h + this.h / 2;
    if (sx < -10 || sx > this.w + 10 || sy < -10 || sy > this.h + 10) return;
    ctx.strokeStyle = Math.random() > 0.5 ? "#c9a84c" : "#1a3a8f";
    ctx.lineWidth = (1 - this.z / this.w) * 3;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(sx, sy);
    ctx.stroke();
  }
}

// ── Component ────────────────────────────────────────────────────────────────
export default function CinematicIntro() {
  const [phaseState, setPhaseState] = useState<Phase>("warp");
  const phaseRef    = useRef<Phase>("warp");
  const [shouldRender, setShouldRender] = useState(false);
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const rafRef      = useRef<number>(0);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const addTimeout = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timeoutsRef.current.push(id);
  }, []);

  // ── Session guard + phase sequencer ────────────────────────────────────────
  // Timeline:
  //   0ms  → warp  : stars blast at full speed
  //   500ms → zoom  : logo zooms in from a tiny point
  //   1300ms → reveal: logo expands huge + overlay fades → site appears from logo
  //   2000ms → done : unmount
  useEffect(() => {
    if (sessionStorage.getItem("introPlayed_v4")) return;
    sessionStorage.setItem("introPlayed_v4", "true");
    setShouldRender(true);

    addTimeout(() => { phaseRef.current = "zoom";   setPhaseState("zoom");   }, 500);
    addTimeout(() => { phaseRef.current = "reveal"; setPhaseState("reveal"); }, 1300);
    addTimeout(() => { phaseRef.current = "done";   setPhaseState("done");   }, 2000);

    return () => { timeoutsRef.current.forEach(clearTimeout); timeoutsRef.current = []; };
  }, [addTimeout]);

  // ── Canvas (runs once, phase-aware via ref) ─────────────────────────────────
  useEffect(() => {
    if (!shouldRender) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width  = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const stars = Array.from({ length: 400 }, () => new Star(w, h));
    const startTime = performance.now();

    const animate = (now: number) => {
      if (phaseRef.current === "done") return;
      const elapsed = now - startTime;
      // Jump straight to warp — ramp 10→40 over the first 500ms
      const speed = elapsed < 500 ? 10 + (elapsed / 500) * 30 : 40;
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, w, h);
      for (const star of stars) { star.update(speed); star.draw(ctx); }
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    const onResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener("resize", onResize); };
  }, [shouldRender]);

  if (!shouldRender || phaseState === "done") return null;

  const isWarp   = phaseState === "warp";
  const isZoom   = phaseState === "zoom";
  const isReveal = phaseState === "reveal";

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "#000", overflow: "hidden",
        display: "flex", alignItems: "center", justifyContent: "center",
        // During reveal: entire overlay fades to zero → site appears underneath
        opacity: isReveal ? 0 : 1,
        transition: isReveal ? "opacity 0.7s cubic-bezier(0.4,0,1,1)" : "none",
        pointerEvents: isReveal ? "none" : "auto",
      }}
    >
      {/* Starfield canvas */}
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
      />

      {/* Logo — zooms in then explodes outward as overlay fades */}
      <div
        style={{
          position: "relative", zIndex: 10,
          width: "72vmin", height: "72vmin",
          maxWidth: "560px", maxHeight: "560px",
          // warp:   tiny blurred speck
          // zoom:   snaps to full size sharp
          // reveal: blasts outward to 4× while fading
          opacity:   isWarp ? 0 : 1,
          transform: isWarp ? "scale(0.04)"
                   : isReveal ? "scale(4.5)"
                   : "scale(1)",
          filter:    isWarp ? "blur(40px)"
                   : isReveal ? "blur(8px)"
                   : "blur(0px)",
          transition: isReveal
            ? "transform 0.7s cubic-bezier(0.4,0,1,1), filter 0.5s ease-in"
            : "transform 0.75s cubic-bezier(0.16,1,0.3,1), opacity 0.35s ease-out, filter 0.6s ease-out",
          willChange: "transform, opacity, filter",
        }}
      >
        {/* Gold radial glow behind badge */}
        <div style={{
          position: "absolute", inset: "-25%", borderRadius: "50%", pointerEvents: "none",
          background: "radial-gradient(circle, rgba(201,168,76,0.3) 0%, rgba(26,58,143,0.18) 45%, transparent 72%)",
        }} />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/screen_transparent.png"
          alt="Key Club International Badge"
          style={{
            width: "100%", height: "100%", objectFit: "contain",
            position: "relative", zIndex: 1,
            filter: "drop-shadow(0 0 48px rgba(201,168,76,0.6)) drop-shadow(0 0 100px rgba(26,58,143,0.45))",
          }}
        />
      </div>
    </div>
  );
}
