"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const router = useRouter();

  // ─── ADVANCED PARTICLE + AURORA CANVAS ───
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    // Particle config
    const N = 60; // Reduced from 180 for performance optimization
    type Particle = {
      x: number; y: number;
      vx: number; vy: number;
      r: number; alpha: number;
      gold: boolean;
      trail: { x: number; y: number }[];
    };
    const particles: Particle[] = [];
    for (let i = 0; i < N; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.55,
        vy: (Math.random() - 0.5) * 0.55,
        r: Math.random() * 2.8 + 0.8,
        alpha: Math.random() * 0.85 + 0.2,
        gold: Math.random() > 0.65,
        trail: [],
      });
    }

    // Shooting stars / comets
    type Star = { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; size: number; };
    const stars: Star[] = [];
    let starTimer = 0;

    let auroraPhase = 0;

    const spawnStar = () => {
      const side = Math.random() > 0.5;
      stars.push({
        x: side ? -10 : Math.random() * W,
        y: side ? Math.random() * H * 0.6 : -10,
        vx: (Math.random() * 2 + 2) * (side ? 1 : 0.5),
        vy: (Math.random() * 1.5 + 0.8) * (side ? 0.5 : 1),
        life: 0,
        maxLife: 70 + Math.random() * 50,
        size: Math.random() * 1.5 + 0.8,
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // ── AURORA BACKGROUND ──
      auroraPhase += 0.003;
      for (let i = 0; i < 4; i++) {
        const grad = ctx.createRadialGradient(
          W * (0.2 + Math.sin(auroraPhase + i * 2.1) * 0.4),
          H * (0.35 + Math.cos(auroraPhase * 0.7 + i * 1.5) * 0.3),
          0,
          W * 0.5, H * 0.5, W * 0.75
        );
        if (i === 0) {
          grad.addColorStop(0, `rgba(26,58,143,${0.15 + Math.sin(auroraPhase) * 0.05})`);
          grad.addColorStop(1, "transparent");
        } else if (i === 1) {
          grad.addColorStop(0, `rgba(201,168,76,${0.07 + Math.sin(auroraPhase * 1.3) * 0.03})`);
          grad.addColorStop(1, "transparent");
        } else if (i === 2) {
          grad.addColorStop(0, `rgba(60,120,220,${0.1 + Math.cos(auroraPhase * 0.9) * 0.04})`);
          grad.addColorStop(1, "transparent");
        } else {
          grad.addColorStop(0, `rgba(100,60,200,${0.05 + Math.sin(auroraPhase * 1.7) * 0.02})`);
          grad.addColorStop(1, "transparent");
        }
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);
      }

      // ── GRID LINES (subtle) ──
      ctx.strokeStyle = "rgba(201,168,76,0.025)";
      ctx.lineWidth = 1;
      const gridSize = 80;
      for (let x = 0; x < W; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      // ── SHOOTING STARS / COMETS ──
      starTimer++;
      if (starTimer > 70 + Math.random() * 100) {
        spawnStar(); starTimer = 0;
      }
      for (let i = stars.length - 1; i >= 0; i--) {
        const s = stars[i];
        s.x += s.vx; s.y += s.vy; s.life++;
        const progress = s.life / s.maxLife;
        const trailLen = 90 * (1 - progress);
        const alpha = (1 - progress) * 0.9;

        // Comet tail gradient
        const tdx = -s.vx / Math.sqrt(s.vx * s.vx + s.vy * s.vy);
        const tdy = -s.vy / Math.sqrt(s.vx * s.vx + s.vy * s.vy);
        const tailGrad = ctx.createLinearGradient(
          s.x, s.y,
          s.x + tdx * trailLen, s.y + tdy * trailLen
        );
        tailGrad.addColorStop(0, `rgba(255,255,230,${alpha})`);
        tailGrad.addColorStop(0.3, `rgba(201,168,76,${alpha * 0.5})`);
        tailGrad.addColorStop(1, "transparent");

        ctx.beginPath();
        ctx.strokeStyle = tailGrad;
        ctx.lineWidth = s.size * 1.5;
        ctx.lineCap = "round";
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x + tdx * trailLen, s.y + tdy * trailLen);
        ctx.stroke();

        // Comet head glow
        const headGrad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 4);
        headGrad.addColorStop(0, `rgba(255,255,255,${alpha * 0.9})`);
        headGrad.addColorStop(0.4, `rgba(201,168,76,${alpha * 0.4})`);
        headGrad.addColorStop(1, "transparent");
        ctx.fillStyle = headGrad;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 4, 0, Math.PI * 2);
        ctx.fill();

        if (s.life >= s.maxLife || s.x > W + 100 || s.y > H + 100) stars.splice(i, 1);
      }

      // ── PARTICLES with mouse repulsion ──
      const mx = mousePos.current.x;
      const my = mousePos.current.y;

      particles.forEach((p) => {
        // Mouse repulsion / attraction (blend)
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const repelRadius = 140;
        if (dist < repelRadius && dist > 0) {
          const force = (repelRadius - dist) / repelRadius;
          p.vx += (dx / dist) * force * 1.0;
          p.vy += (dy / dist) * force * 1.0;
        }

        // Dampen velocity
        p.vx *= 0.96;
        p.vy *= 0.96;

        // Base drift
        if (Math.abs(p.vx) < 0.12) p.vx += (Math.random() - 0.5) * 0.06;
        if (Math.abs(p.vy) < 0.12) p.vy += (Math.random() - 0.5) * 0.06;

        // Clamp speed
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 3.5) { p.vx = (p.vx / speed) * 3.5; p.vy = (p.vy / speed) * 3.5; }

        // Move
        p.x += p.vx; p.y += p.vy;

        // Wrap
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10;
        if (p.y > H + 10) p.y = -10;

        // trail
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 10) p.trail.shift();

        // Draw trail
        if (p.trail.length > 1) {
          for (let t = 1; t < p.trail.length; t++) {
            const ta = (t / p.trail.length) * p.alpha * 0.45;
            ctx.beginPath();
            ctx.strokeStyle = p.gold ? `rgba(201,168,76,${ta})` : `rgba(100,149,237,${ta})`;
            ctx.lineWidth = p.r * 0.5;
            ctx.moveTo(p.trail[t - 1].x, p.trail[t - 1].y);
            ctx.lineTo(p.trail[t].x, p.trail[t].y);
            ctx.stroke();
          }
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.gold
          ? `rgba(201,168,76,${p.alpha})`
          : `rgba(100,149,237,${p.alpha})`;
        ctx.fill();

        // Glow for bigger particles
        if (p.r > 1.8) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 3.5, 0, Math.PI * 2);
          ctx.fillStyle = p.gold
            ? `rgba(201,168,76,0.04)`
            : `rgba(100,149,237,0.04)`;
          ctx.fill();
        }
      });

      // ── CONNECTIONS ──
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 110) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(201,168,76,${0.09 * (1 - d / 110)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    const onResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", onResize); };
  }, []);

  // ─── MOUSE TRACKING ───
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // ─── REMOVED SCROLL NAV LOGIC ───

  return (
    <>
      <style>{`
        /* ───── GLOBAL HERO KEYFRAMES ───── */
        @keyframes coinFlip {
          0%   { transform: rotateY(0deg); }
          18%  { transform: rotateY(0deg); }      /* pause: show KC front */
          38%  { transform: rotateY(180deg); }    /* flip to Chargers */
          58%  { transform: rotateY(180deg); }    /* pause: show Chargers back */
          78%  { transform: rotateY(360deg); }    /* flip back to KC */
          100% { transform: rotateY(360deg); }    /* pause before loop */
        }
        @keyframes ringPulse {
          0%,100% { transform: scale(1);   opacity: 0.55; }
          50%      { transform: scale(1.07); opacity: 1;   }
        }
        @keyframes ringPulse2 {
          0%,100% { transform: scale(1);    opacity: 0.3; }
          50%      { transform: scale(1.14); opacity: 0.75; }
        }
        @keyframes floatY {
          0%,100% { transform: translateY(0) perspective(1200px); }
          50%      { transform: translateY(-18px) perspective(1200px); }
        }
        @keyframes shimmerText {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes scrollBounce {
          0%,100% { transform: translateX(-50%) translateY(0); }
          50%      { transform: translateX(-50%) translateY(10px); }
        }
        @keyframes navReveal {
          from { opacity:0; transform:translateY(-16px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes slideFlipEntrance {
          0% { opacity: 0; transform: translateX(80vw) rotateY(1080deg) scale(0.2); }
          100% { opacity: 1; transform: translateX(0) rotateY(0) scale(1); }
        }
        @keyframes fadeUpStagger {
          0% { opacity: 0; transform: translateY(40px) scale(0.95); filter: blur(4px); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        @keyframes conicSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes conicSpinRev {
          from { transform: rotate(360deg); }
          to   { transform: rotate(0deg); }
        }
        @keyframes pulseGlow {
          0%,100% { opacity:0.6; }
          50%      { opacity:1; }
        }
        @keyframes edgeGlint {
          0%,100% { opacity:0.3; }
          50%      { opacity:0.8; }
        }

        /* ── Hide hero until cinematic intro finishes ── */
        #hero { transition: opacity 0.7s ease; }
        body:not(.intro-done) #hero { opacity: 0; }

        /* ───── NAV ───── */
        .kc-nav {
          position: fixed; top:0; left:0; right:0; z-index:100;
          display:flex; align-items:center; justify-content:space-between;
          padding:1.4rem 3rem;
          transition: all 0.4s ease;
          animation: navReveal 0.8s ease both;
        }
        .kc-nav.scrolled {
          background: rgba(5,13,26,0.88);
          backdrop-filter:blur(24px); -webkit-backdrop-filter:blur(24px);
          border-bottom:1px solid rgba(201,168,76,0.2);
          padding:0.9rem 3rem;
        }
        .kc-nav-logo {
          font-size:1rem; font-weight:900; letter-spacing:0.12em;
          text-transform:uppercase; color:var(--white); position:relative;
        }
        .kc-nav-logo span { color:var(--gold); }
        .kc-nav-links { display:flex; gap:2.5rem; list-style:none; }
        .kc-nav-links a {
          font-size:0.72rem; font-weight:700; letter-spacing:0.14em;
          text-transform:uppercase; color:var(--silver);
          transition:color 0.2s; position:relative;
        }
        .kc-nav-links a::after {
          content:''; position:absolute; bottom:-3px; left:0;
          width:0; height:1px; background:var(--gold); transition:width 0.3s;
        }
        .kc-nav-links a:hover { color:var(--gold); }
        .kc-nav-links a:hover::after { width:100%; }
        .kc-hamburger {
          display:none; flex-direction:column; gap:5px;
          cursor:pointer; background:none; border:none; padding:4px;
        }
        .kc-hamburger span {
          display:block; width:24px; height:2px;
          background:var(--white); border-radius:2px; transition:all 0.3s;
        }
        @media(max-width:768px){
          .kc-nav{ padding:1rem 1.5rem; }
          .kc-nav.scrolled{ padding:0.75rem 1.5rem; }
          .kc-nav-links{ display:none; }
          .kc-hamburger{ display:flex; }
          .mobile-menu{
            position:fixed; inset:0;
            background:rgba(5,13,26,0.97);
            z-index:99; display:flex; flex-direction:column;
            align-items:center; justify-content:center; gap:2rem;
          }
          .mobile-menu a{
            font-size:1.5rem; font-weight:700; letter-spacing:0.15em;
            text-transform:uppercase; color:var(--white); transition:color 0.2s;
          }
          .mobile-menu a:hover{ color:var(--gold); }
        }

        @media(max-width:600px){
          .hero-logo-outer        { width:220px; height:220px; }
          .logo-conic-ring        { width:212px; height:212px; }
          .logo-ring-1            { width:208px; height:208px; }
          .logo-ring-2            { width:240px; height:240px; }
          .logo-ring-3            { width:265px; height:265px; }
          .logo-ring-4            { width:290px; height:290px; }
          .hero-logo-coin         { width:180px; height:180px; }
          .coin-edge              { width:180px; height:180px; }
          .hero-chargers-bg       { width:200px !important; height:200px !important; }
          .hero-title             { font-size: clamp(2.8rem, 14vw, 5rem); }
          .hero-subtitle          { font-size: 0.8rem; }
          .hero-district-label    { font-size: 0.58rem; letter-spacing: 0.1em; }
          .hero-cta-group         { gap: 0.75rem; flex-wrap: wrap; justify-content: center; }
          .hero-cta-primary,
          .hero-cta-secondary     { font-size: 0.78rem; padding: 0.7rem 1.4rem; }
        }

        /* ───── HERO ───── */
        .hero-section {
          position:relative; width:100vw; height:100vh;
          display:flex; flex-direction:column;
          align-items:center; justify-content:center; overflow:hidden;
          background: radial-gradient(ellipse 100% 90% at 50% 50%, #081530 0%, #020709 100%);
        }
        .hero-canvas { position:absolute; inset:0; pointer-events:none; z-index:0; }

        /* Centre glow beneath logo */
        .hero-center-glow {
          display: none;
        }

        /* ───── LOGO WRAPPER ───── */
        .hero-logo-entrance {
          animation: slideFlipEntrance 2.2s cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: 0.2s;
          margin-bottom:1.5rem;
          perspective: 1200px;
        }
        .hero-logo-outer {
          position:relative; z-index:2;
          display:flex; align-items:center; justify-content:center;
          width:400px; height:400px;
          animation: floatY 7s ease-in-out infinite 2.4s; /* delay float until entrance is done */
        }

        /* Animated conic gradient border ring */
        .logo-conic-ring {
          position:absolute;
          width:385px; height:385px;
          border-radius:50%;
          z-index:0; pointer-events:none;
        }
        .logo-conic-ring::before {
          content:'';
          position:absolute; inset:-2px; border-radius:50%;
          background: conic-gradient(
            from 0deg,
            transparent 0deg,
            rgba(201,168,76,0.9) 60deg,
            rgba(100,149,237,0.7) 120deg,
            transparent 180deg,
            rgba(201,168,76,0.5) 240deg,
            rgba(255,255,255,0.8) 300deg,
            transparent 360deg
          );
          animation: conicSpin 4s linear infinite;
          border-radius:50%;
          mask: radial-gradient(farthest-side, transparent calc(100% - 3px), white calc(100% - 2px));
          -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 3px), white calc(100% - 2px));
        }

        /* Ring halos */
        .logo-ring {
          position:absolute; border-radius:50%; pointer-events:none;
        }
        .logo-ring-1 {
          width:376px; height:376px;
          border:1.5px solid rgba(201,168,76,0.5);
          box-shadow: 0 0 20px rgba(201,168,76,0.2), inset 0 0 20px rgba(201,168,76,0.05);
          animation: ringPulse 3.5s ease-in-out infinite;
        }
        .logo-ring-2 {
          width:430px; height:430px;
          border:1px solid rgba(100,149,237,0.3);
          animation: ringPulse2 5s ease-in-out infinite;
        }
        .logo-ring-3 {
          width:498px; height:498px;
          border:1px dashed rgba(201,168,76,0.18);
          animation: ringPulse 8s ease-in-out infinite reverse;
        }
        .logo-ring-4 {
          width:560px; height:560px;
          border:0.5px solid rgba(100,149,237,0.1);
          animation: ringPulse2 11s ease-in-out infinite;
        }

        /* ─── 3D COIN CONTAINER ─── */
        .hero-logo-coin {
          width:320px; height:320px;
          position:relative; z-index:1;
          transform-style: preserve-3d;
          animation: coinFlip 11s cubic-bezier(0.37, 0, 0.63, 1) infinite;
          /* Optimized drop-shadow for performance */
          filter: drop-shadow(0 0 40px rgba(201,168,76,0.6)) drop-shadow(0 0 100px rgba(26,58,143,0.4));
        }
        .hero-logo-coin:hover {
          animation-play-state: paused;
        }

        /* Front face of the coin */
        .coin-face {
          position:absolute; inset:0;
          border-radius:50%;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          overflow: hidden;
        }
        .coin-front {
          z-index:2;
        }
        .coin-front img {
          width:100%; height:100%;
          object-fit: cover;
          border-radius:50%;
          clip-path: circle(50% at 50% 50%);
        }

        /* Back face of the coin — Fulshear Chargers logo */
        .coin-back {
          transform: rotateY(180deg);
          z-index:1;
          background: #0a0212;
        }
        .coin-back img {
          width:100%; height:100%;
          object-fit: contain;
          border-radius:50%;
          clip-path: circle(50% at 50% 50%);
        }

        /* Coin edge - visible when flipping sideways */
        .coin-edge {
          position:absolute;
          width:320px; height:320px;
          border-radius:50%;
          border: 6px solid transparent;
          background:
            linear-gradient(135deg, #b89a3d, #d4b04a, #c9a84c, #937628) border-box;
          -webkit-mask:
            linear-gradient(#fff 0 0) padding-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          transform: translateZ(-3px);
          animation: edgeGlint 4s ease-in-out infinite;
        }

        /* Shimmer overlay on logo */
        .logo-shimmer {
          position:absolute; inset:0; border-radius:50%;
          background: conic-gradient(
            from 0deg,
            transparent 0%,
            rgba(255,255,255,0.12) 15%,
            transparent 30%,
            rgba(255,255,255,0.06) 60%,
            transparent 80%
          );
          animation: conicSpin 5s linear infinite;
          pointer-events:none;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        /* ───── HERO TEXT ───── */
        .hero-content {
          position:relative; z-index:2;
          text-align:center;
          display:flex; flex-direction:column;
          align-items:center; gap:0;
        }
        .hero-district-label {
          font-size:0.68rem; letter-spacing:0.28em; text-transform:uppercase;
          color:var(--gold); font-weight:600;
          margin-bottom:0; opacity:0; 
          animation: fadeUpStagger 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; animation-delay: 1.2s;
        }
        .hero-title {
          font-size: clamp(4rem, 11vw, 9.5rem);
          font-weight:900; line-height:0.88;
          letter-spacing:-0.03em; margin-bottom:1.2rem;
          opacity:0; 
          animation: fadeUpStagger 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; animation-delay: 1.4s;
        }
        .hero-title .line1 { color:#fff; display:block; }
        .hero-title .line2 {
          display:block;
          background: linear-gradient(90deg,
            var(--gold-dark) 0%,
            var(--gold-light) 25%,
            #fff8dc 50%,
            var(--gold-light) 75%,
            var(--gold-dark) 100%);
          background-size:200% auto;
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          background-clip:text;
          animation: shimmerText 2.5s linear infinite;
        }
        .hero-subtitle {
          font-size:1rem; color:var(--silver);
          letter-spacing:0.06em; margin-bottom:2.5rem; font-weight:400;
          opacity:0; 
          animation: fadeUpStagger 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; animation-delay: 1.6s;
        }
        .hero-subtitle span { color:var(--gold); margin:0 0.5rem; }
        .hero-buttons { 
          display:flex; gap:1rem; flex-wrap:wrap; justify-content:center; 
          opacity: 0;
          animation: fadeUpStagger 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; animation-delay: 1.8s;
        }

        /* Enhanced buttons */
        .btn-hero-primary {
          display:inline-flex; align-items:center; gap:0.5rem;
          padding:1rem 2.4rem;
          background: linear-gradient(135deg, #1a3a8f 0%, #2555e8 50%, #1a3a8f 100%);
          background-size:200% auto;
          color:white; font-weight:800; font-size:0.85rem;
          letter-spacing:0.1em; border-radius:10px;
          border:1px solid rgba(100,149,237,0.4); cursor:pointer;
          transition: all 0.35s cubic-bezier(0.16,1,0.3,1);
          text-transform:uppercase; position:relative; overflow:hidden;
          box-shadow: 0 4px 20px rgba(26,58,143,0.35), inset 0 1px 0 rgba(255,255,255,0.15);
        }
        .btn-hero-primary::before {
          content:''; position:absolute; inset:0;
          background:linear-gradient(135deg,rgba(255,255,255,0.12),transparent);
          opacity:0; transition:opacity 0.3s;
        }
        .btn-hero-primary:hover {
          background-position: right center;
          transform:translateY(-5px);
          box-shadow: 0 20px 45px rgba(26,58,143,0.65), 0 0 0 1px rgba(201,168,76,0.5),
                      0 0 60px rgba(26,58,143,0.3);
        }
        .btn-hero-primary:hover::before { opacity:1; }

        .btn-hero-secondary {
          display:inline-flex; align-items:center; gap:0.5rem;
          padding:1rem 2.4rem;
          background:transparent; color:var(--gold);
          font-weight:800; font-size:0.85rem; letter-spacing:0.1em;
          border-radius:10px; border:1.5px solid var(--gold); cursor:pointer;
          transition:all 0.35s cubic-bezier(0.16,1,0.3,1);
          text-transform:uppercase; position:relative; overflow:hidden;
          box-shadow: 0 4px 20px rgba(201,168,76,0.15), inset 0 0 20px rgba(201,168,76,0.03);
        }
        .btn-hero-secondary::before {
          content:''; position:absolute; inset:0;
          background: linear-gradient(135deg, var(--gold), #f0c85a);
          transform:scaleX(0);
          transform-origin:left; transition:transform 0.35s ease;
          z-index:-1;
        }
        .btn-hero-secondary:hover {
          color:var(--navy);
          transform:translateY(-5px);
          box-shadow: 0 20px 45px rgba(201,168,76,0.4), 0 0 60px rgba(201,168,76,0.2);
        }
        .btn-hero-secondary:hover::before { transform:scaleX(1); }

        /* Scroll hint */
        .hero-scroll-entrance {
          position:absolute; bottom:2.5rem; left:50%; z-index:2;
          animation: fadeUpStagger 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: 2.2s;
        }
        .hero-scroll-hint {
          display:flex; flex-direction:column; align-items:center; gap:0.5rem;
          animation:scrollBounce 2.5s infinite 3s; cursor:pointer;
        }
        .hero-scroll-hint span {
          font-size:0.6rem; letter-spacing:0.22em; color:var(--silver);
          opacity:0.45; text-transform:uppercase;
        }
        .hero-scroll-line {
          width:1px; height:55px;
          background:linear-gradient(to bottom, var(--gold), transparent);
          opacity:0.6;
        }
      `}</style>



      {/* HERO */}
      <section id="hero" className="hero-section" ref={heroRef}>
        <canvas className="hero-canvas" ref={canvasRef} />
        <div className="hero-center-glow" style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)" }} />

        <div className="hero-content">
          {/* ── Spinning coin logo ── */}
          <div className="hero-logo-entrance">
            <div className="hero-logo-outer">
              <div className="logo-conic-ring" />
              <div className="logo-ring logo-ring-1" />
              <div className="logo-ring logo-ring-2" />
              <div className="logo-ring logo-ring-3" />
              <div className="logo-ring logo-ring-4" />
              {/* Fulshear logo behind the coin — faint, purple-tinted */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/chargers-logo.png"
                alt=""
                aria-hidden="true"
                className="hero-chargers-bg"
                style={{
                  position:"absolute",
                  width:"370px", height:"370px",
                  objectFit:"contain",
                  opacity:0.18,
                  filter:"blur(1px) drop-shadow(0 0 18px rgba(160,80,220,0.6)) saturate(0.7)",
                  zIndex:0,
                  pointerEvents:"none",
                  animation:"floatY 7s ease-in-out infinite 2.4s",
                }}
              />
              <div className="hero-logo-coin">
                <div className="coin-face coin-front">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/screen_transparent.png" alt="Key Club Badge" />
                  <div className="logo-shimmer" />
                </div>
                <div className="coin-face coin-back">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/chargers-logo.png" alt="Fulshear Chargers" />
                </div>
                <div className="coin-edge" />
              </div>
            </div>
          </div>

          <p className="hero-district-label">
            Texas · Oklahoma District &nbsp;·&nbsp; Key Club International &nbsp;·&nbsp; Since 1925
          </p>

          <h1 className="hero-title">
            <span className="line1">FULSHEAR</span>
            <span className="line2">KEY CLUB</span>
          </h1>

          <p className="hero-subtitle">
            Serving our Community
            <span>·</span>
            Building Tomorrow&apos;s Leaders
          </p>

          <div className="hero-buttons">
            <Link href="/about" className="btn-hero-primary">Explore →</Link>
            <Link href="/contact" className="btn-hero-secondary">Join Us</Link>
          </div>
        </div>

        <div className="hero-scroll-entrance">
          <div
            className="hero-scroll-hint"
            onClick={() => router.push('/about')}
          >
            <span>Scroll</span>
            <div className="hero-scroll-line" />
          </div>
        </div>
      </section>
    </>
  );
}
