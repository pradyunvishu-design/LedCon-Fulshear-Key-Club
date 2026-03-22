"use client";

import { useEffect, useRef, useState } from "react";

export default function CinematicIntro() {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setMounted(true);
    const hasPlayed = sessionStorage.getItem("introPlayed_v2");
    if (!hasPlayed) {
      setIsVisible(true);
      setIsAnimating(true);
      sessionStorage.setItem("introPlayed_v2", "true");
    }
  }, []);

  useEffect(() => {
    if (!isAnimating || !canvasRef.current || !mounted) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const stars: any[] = [];
    const numStars = 400;

    class Star {
      x: number; y: number; z: number; prevZ: number;
      constructor() {
        this.x = (Math.random() - 0.5) * w * 2;
        this.y = (Math.random() - 0.5) * h * 2;
        this.z = Math.random() * w;
        this.prevZ = this.z;
      }
      update(speed: number) {
        this.prevZ = this.z;
        this.z -= speed;
        if (this.z <= 0) {
          this.z = w;
          this.prevZ = this.z;
          this.x = (Math.random() - 0.5) * w * 2;
          this.y = (Math.random() - 0.5) * h * 2;
        }
      }
      draw() {
        if (!ctx) return;
        const sx = (this.x / this.z) * w + w / 2;
        const sy = (this.y / this.z) * h + h / 2;
        const px = (this.x / this.prevZ) * w + w / 2;
        const py = (this.y / this.prevZ) * h + h / 2;
        ctx.strokeStyle = Math.random() > 0.5 ? "#c9a84c" : "#1a3a8f";
        ctx.lineWidth = (1 - this.z / w) * 3;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.stroke();
      }
    }

    for (let i = 0; i < numStars; i++) stars.push(new Star());

    let speed = 2;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      speed = elapsed < 2000 ? 2 + (elapsed / 2000) * 30 : 32;
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, w, h);
      stars.forEach(star => { star.update(speed); star.draw(); });
      animationFrameId = requestAnimationFrame(animate);

      if (elapsed > 4000 && !isExiting) {
         setIsExiting(true);
         setTimeout(() => setIsAnimating(false), 1500);
      }
    };

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    animate();
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [isAnimating, mounted, isExiting]);

  if (!mounted || !isVisible || !isAnimating) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "black",
        transition: "transform 1.2s cubic-bezier(0.76, 0, 0.24, 1)",
        transform: isExiting ? "translateY(-100%)" : "translateY(0)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden"
      }}
    >
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
      <div 
        style={{
          position: "relative",
          zIndex: 10,
          width: "400px",
          height: "400px",
          opacity: isExiting ? 0 : 1,
          transform: isExiting ? "scale(1.5)" : "scale(1)",
          transition: "all 1.5s ease-out",
          filter: isExiting ? "blur(20px)" : "blur(0)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <img 
          src="/screen_transparent.png" 
          alt="Key Club" 
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>
    </div>
  );
}
