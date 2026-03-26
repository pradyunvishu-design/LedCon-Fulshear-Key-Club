"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    fn(); // initialize
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Close menu on navigation
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const navCanvasRef = useRef<HTMLCanvasElement>(null);

  // Purple sparkle particles floating across the nav bar
  useEffect(() => {
    const canvas = navCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const N = 28;
    const pts = Array.from({ length: N }, () => ({
      x:     Math.random() * canvas.width,
      y:     Math.random() * canvas.height,
      vx:    (Math.random() - 0.5) * 0.4,
      vy:    (Math.random() - 0.5) * 0.25,
      r:     Math.random() * 1.2 + 0.3,
      alpha: Math.random() * 0.55 + 0.2,
      pulse: Math.random() * Math.PI * 2,
    }));

    let raf = 0;
    const draw = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        p.pulse += 0.018;
        const a = p.alpha * (0.7 + Math.sin(p.pulse) * 0.3);
        if (p.x < -4)  p.x = W + 4;
        if (p.x > W+4) p.x = -4;
        if (p.y < -4)  p.y = H + 4;
        if (p.y > H+4) p.y = -4;
        // Soft glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(150,60,240,${a * 0.12})`;
        ctx.fill();
        // Core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(175,90,255,${a})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Volunteer Matcher", href: "/#matcher" },
    { label: "Calendar", href: "/calendar" },
    { label: "About", href: "/#about" },
    { label: "Officers", href: "/#officers" },
    { label: "Links", href: "/#links" },
    { label: "Impact", href: "/#impact" },
    { label: "Contact", href: "/#contact" },
  ];

  return (
    <>
      <style>{`
        /* ───── NAV ───── */
        .kc-nav {
          position: fixed; top:0; left:0; right:0; z-index:100;
          display:flex; align-items:center; justify-content:space-between;
          padding:1.4rem 3rem;
          transition: padding 0.4s ease, background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;
          transform: translateZ(0);
          backface-visibility: hidden;
          overflow: hidden;
        }
        .nav-particle-canvas {
          position:absolute; inset:0; width:100%; height:100%;
          pointer-events:none; z-index:0;
        }
        .kc-nav.scrolled {
          background: rgba(5, 12, 25, 0.75);
          backdrop-filter: blur(32px) saturate(150%);
          -webkit-backdrop-filter: blur(32px) saturate(150%);
          border-bottom: 1px solid rgba(201, 168, 76, 0.35);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6), 0 0 25px rgba(201, 168, 76, 0.15);
          padding: 0.9rem 3rem;
        }
        .kc-nav-logo {
          font-size:1rem; font-weight:900; letter-spacing:0.12em;
          text-transform:uppercase; color:var(--white); position:relative;
          text-decoration:none;
        }
        .kc-nav-logo span { color:var(--gold); }
        .kc-nav-links { display:flex; gap:2rem; list-style:none; margin:0; padding:0; }
        .kc-nav-links a {
          font-size:0.7rem; font-weight:700; letter-spacing:0.12em;
          text-transform:uppercase; color:var(--silver);
          transition:color 0.2s; position:relative; text-decoration:none;
          white-space:nowrap;
        }
        .kc-nav-links a.active {
          color:var(--gold);
        }
        .kc-nav-links a::after {
          content:''; position:absolute; bottom:-3px; left:0;
          width:0; height:1px; background:var(--gold); transition:width 0.3s;
        }
        .kc-nav-links a.active::after {
          width:100%;
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
        .mobile-menu {
          position:fixed; inset:0; top:0; left:0; width:100vw; height:100vh;
          background:rgba(5,13,26,0.97); backdrop-filter:blur(10px);
          z-index:99; display:flex; flex-direction:column;
          align-items:center; justify-content:center; gap:2rem;
          opacity: 0; pointer-events: none; transition: opacity 0.3s;
        }
        .mobile-menu.open {
          opacity: 1; pointer-events: auto;
        }
        .mobile-menu a {
          font-size:1.5rem; font-weight:700; letter-spacing:0.15em;
          text-transform:uppercase; color:var(--white); transition:color 0.2s;
          text-decoration:none;
        }
        .mobile-menu a.active { color:var(--gold); }
        .mobile-menu a:hover { color:var(--gold); }
        @media(max-width:1100px){
          .kc-nav-links{ gap:1.2rem; }
          .kc-nav-links a{ font-size:0.63rem; letter-spacing:0.08em; }
        }
        @media(max-width:900px){
          .kc-nav{ padding:1rem 1.5rem; }
          .kc-nav.scrolled{ padding:0.75rem 1.5rem; }
          .kc-nav-links{ display:none; }
          .kc-hamburger{ display:flex; }
        }
      `}</style>
      <nav className={`kc-nav${scrolled ? " scrolled" : ""}`}>
        <canvas ref={navCanvasRef} className="nav-particle-canvas" />
        <Link href="/" className="kc-nav-logo" style={{position:"relative",zIndex:1}}>CFHS <span>·</span> KEY CLUB</Link>
        <ul className="kc-nav-links" style={{position:"relative",zIndex:1}}>
          {navLinks.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={pathname === l.href ? "active" : ""}>{l.label}</Link>
            </li>
          ))}
        </ul>
        <button className="kc-hamburger" style={{position:"relative",zIndex:1}} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span /><span /><span />
        </button>
      </nav>

      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        {navLinks.map((l) => (
          <Link key={l.href} href={l.href} className={pathname === l.href ? "active" : ""} onClick={() => setMenuOpen(false)}>
            {l.label}
          </Link>
        ))}
      </div>
    </>
  );
}
