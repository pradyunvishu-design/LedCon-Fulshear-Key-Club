"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type Phase = "warp" | "logo" | "exit" | "done";

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

export default function CinematicIntro() {
  const [phaseState, setPhaseState] = useState<Phase>("warp");
  const phaseRef = useRef<Phase>("warp");
  const [shouldRender, setShouldRender] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const addTimeout = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timeoutsRef.current.push(id);
    return id;
  }, []);

  // Session guard + phase sequencer
  useEffect(() => {
    const hasPlayed = sessionStorage.getItem("introPlayed_v3");
    if (hasPlayed) return;
    sessionStorage.setItem("introPlayed_v3", "true");
    setShouldRender(true);

    addTimeout(() => { phaseRef.current = "logo"; setPhaseState("logo"); }, 2000);
    addTimeout(() => { phaseRef.current = "exit"; setPhaseState("exit"); }, 4200);
    addTimeout(() => { phaseRef.current = "done"; setPhaseState("done"); }, 5500);

    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, [addTimeout]);

  // Canvas loop — starts once, runs for full duration, reads phase via ref
  useEffect(() => {
    if (!shouldRender) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const stars: Star[] = Array.from({ length: 400 }, () => new Star(w, h));
    const startTime = performance.now();

    const animate = (now: number) => {
      if (phaseRef.current === "done") return;

      const elapsed = now - startTime;
      let speed: number;
      if (elapsed < 2000) {
        // Ramp up from crawl → warp speed over first 2 seconds
        speed = 2 + (elapsed / 2000) * 30;
      } else if (phaseRef.current === "exit") {
        // Gently slow down as the overlay rolls away
        speed = Math.max(8, 32 - (elapsed - 4200) / 50);
      } else {
        speed = 32;
      }

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, w, h);
      for (const star of stars) {
        star.update(speed);
        star.draw(ctx);
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      // Stars self-recycle via z<=0 branch — no need to recreate
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [shouldRender]);

  if (!shouldRender || phaseState === "done") return null;

  const logoVisible = phaseState === "logo";
  const logoExiting = phaseState === "exit";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#000",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // Roll-up: entire overlay slides off the top
        transform: logoExiting ? "translateY(-100%)" : "translateY(0)",
        transition: logoExiting
          ? "transform 1.3s cubic-bezier(0.76, 0, 0.24, 1)"
          : "none",
      }}
    >
      {/* Starfield canvas */}
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
      />

      {/* Logo — CSS transitions drive scale + blur + opacity */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "75vmin",
          height: "75vmin",
          maxWidth: "600px",
          maxHeight: "600px",
          opacity: logoVisible ? 1 : 0,
          transform: logoVisible
            ? "scale(1)"
            : logoExiting
            ? "scale(1.5)"
            : "scale(0.05)",
          filter: logoVisible
            ? "blur(0px)"
            : logoExiting
            ? "blur(20px)"
            : "blur(40px)",
          transition: logoExiting
            ? "transform 1.0s ease-in, opacity 0.6s ease-in, filter 0.8s ease-in"
            : "transform 1.8s cubic-bezier(0.16,1,0.3,1), opacity 0.6s ease-out, filter 1.4s ease-out",
          willChange: "transform, opacity, filter",
        }}
      >
        {/* Radial glow halo behind the badge */}
        <div
          style={{
            position: "absolute",
            inset: "-20%",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(201,168,76,0.25) 0%, rgba(26,58,143,0.15) 40%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <img
          src="/screen_transparent.png"
          alt="Key Club International Badge"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            position: "relative",
            zIndex: 1,
            filter:
              "drop-shadow(0 0 40px rgba(201,168,76,0.55)) drop-shadow(0 0 80px rgba(26,58,143,0.4))",
          }}
        />
      </div>
    </div>
  );
}
