"use client";

import { useState, useEffect } from "react";
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

  const navLinks = [
    { label: "Home", href: "/#hero" },
    { label: "AI Matcher", href: "/matcher" },
    { label: "Calendar", href: "/calendar" },
    { label: "About", href: "/about" },
    { label: "Officers", href: "/officers" },
    { label: "Impact", href: "/impact" },
    { label: "Contact", href: "/contact" },
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
          text-decoration:none;
        }
        .kc-nav-logo span { color:var(--gold); }
        .kc-nav-links { display:flex; gap:2.5rem; list-style:none; margin:0; padding:0; }
        .kc-nav-links a {
          font-size:0.72rem; font-weight:700; letter-spacing:0.14em;
          text-transform:uppercase; color:var(--silver);
          transition:color 0.2s; position:relative; text-decoration:none;
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
        @media(max-width:768px){
          .kc-nav{ padding:1rem 1.5rem; }
          .kc-nav.scrolled{ padding:0.75rem 1.5rem; }
          .kc-nav-links{ display:none; }
          .kc-hamburger{ display:flex; }
        }
      `}</style>
      <nav className={`kc-nav${scrolled ? " scrolled" : ""}`}>
        <Link href="/" className="kc-nav-logo">CFHS <span>·</span> KEY CLUB</Link>
        <ul className="kc-nav-links">
          {navLinks.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={pathname === l.href ? "active" : ""}>{l.label}</Link>
            </li>
          ))}
        </ul>
        <button className="kc-hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
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
