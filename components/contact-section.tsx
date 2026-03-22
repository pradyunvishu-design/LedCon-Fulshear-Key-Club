"use client";

const contacts = [
  {
    title: "Club Email",
    val: "fulshearkeyclub@lcisd.org",
    sub: "Managed by Webmaster",
    href: "mailto:fulshearkeyclub@lcisd.org",
    glow: "rgba(201,168,76,0.3)",
    border: "rgba(201,168,76,0.5)",
  },
  {
    title: "Instagram",
    val: "@fulshearkeyclub",
    sub: "DM us anytime",
    href: "https://instagram.com/fulshearkeyclub",
    glow: "rgba(200,80,180,0.3)",
    border: "rgba(200,80,180,0.5)",
  },
  {
    title: "Lt. Governor",
    val: "M. Chintalapally",
    sub: "ltg3s@tokeyclub.com",
    href: "mailto:ltg3s@tokeyclub.com",
    glow: "rgba(100,149,237,0.3)",
    border: "rgba(100,149,237,0.5)",
  },
  {
    title: "School Address",
    val: "9302 Charger Way",
    sub: "Fulshear, TX 77441",
    href: "https://maps.google.com/?q=9302+Charger+Way+Fulshear+TX+77441",
    glow: "rgba(255,140,0,0.3)",
    border: "rgba(255,140,0,0.5)",
  },
  {
    title: "District Tech",
    val: "Website Submissions",
    sub: "techpro@tokeyclub.com",
    href: "mailto:techpro@tokeyclub.com",
    glow: "rgba(78,203,113,0.3)",
    border: "rgba(78,203,113,0.5)",
  },
  {
    title: "Meetings",
    val: "LGI Room",
    sub: "1st Tuesday of every month · 4:00 PM",
    href: "#",
    glow: "rgba(201,168,76,0.3)",
    border: "rgba(201,168,76,0.5)",
  },
  {
    title: "Remind 101",
    val: "@cfhs-key",
    sub: "Text to 81010",
    href: "#",
    glow: "rgba(100,200,255,0.3)",
    border: "rgba(100,200,255,0.5)",
  },
];

export default function ContactSection() {
  return (
    <section id="contact" style={{ padding: "8rem 0 4rem", position: "relative", overflow: "hidden" }}>
      <style>{`
        .contact-bg {
          position:absolute; inset:0; pointer-events:none;
          background:
            radial-gradient(ellipse 70% 60% at 50% 100%, rgba(26,58,143,0.15) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 80% 20%, rgba(201,168,76,0.07) 0%, transparent 50%);
        }
        .contact-header { text-align: center; margin-bottom: 4rem; }
        .contact-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
          margin-bottom: 6rem;
        }
        .contact-card {
          padding: 2.25rem 1.5rem;
          text-align: center;
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
          display:block;
        }
        .contact-card::before {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--cc-border, rgba(201,168,76,0.5)), transparent);
          opacity: 0.4; transition:opacity 0.3s;
        }
        .contact-card::after {
          content:'';
          position:absolute; inset:0;
          background:radial-gradient(ellipse 80% 80% at 50% 100%, var(--cc-glow, rgba(201,168,76,0.12)) 0%, transparent 70%);
          opacity:0; transition:opacity 0.4s; pointer-events:none;
        }
        .contact-card:hover::before { opacity:1; }
        .contact-card:hover::after  { opacity:1; }
        .contact-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 25px 55px rgba(0,0,0,0.5), 0 0 40px var(--cc-glow, rgba(201,168,76,0.2));
          border-color: var(--cc-border, rgba(201,168,76,0.5)) !important;
        }
        .contact-icon-wrap {
          width:60px; height:60px; border-radius:50%;
          background:linear-gradient(135deg,rgba(26,58,143,0.3),rgba(8,21,48,0.8));
          border:1px solid rgba(255,255,255,0.08);
          display:flex; align-items:center; justify-content:center;
          margin:0 auto 1.2rem;
          transition:box-shadow 0.3s, transform 0.3s;
        }
        .contact-card:hover .contact-icon-wrap {
          box-shadow: 0 0 25px var(--cc-glow, rgba(201,168,76,0.3));
          transform:scale(1.1);
        }
        .contact-icon { font-size: 1.6rem; display: block; }
        .contact-title {
          font-size: 0.65rem; letter-spacing: 0.2em;
          text-transform: uppercase; color: var(--gold);
          font-weight: 700; margin-bottom: 0.5rem;
        }
        .contact-val {
          font-size: 0.88rem; font-weight: 700;
          color: var(--white); margin-bottom: 0.3rem; word-break: break-all;
        }
        .contact-sub { font-size: 0.72rem; color: var(--silver); opacity:0.8; }
        .site-footer {
          border-top: 1px solid rgba(201,168,76,0.15);
          padding-top: 3rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .footer-logo {
          font-size: 1rem; font-weight: 900;
          letter-spacing: 0.12em; color: var(--white); text-transform:uppercase;
        }
        .footer-logo span { color: var(--gold); }
        .footer-links { display:flex; gap:1.5rem; list-style:none; }
        .footer-links a {
          font-size:0.7rem; color:var(--silver); letter-spacing:0.1em;
          text-transform:uppercase; transition:color 0.2s;
        }
        .footer-links a:hover { color:var(--gold); }
        .footer-copy { font-size: 0.72rem; color: var(--silver); opacity: 0.5; text-align: right; }
        .contact-card-last { grid-column: 2; }
        @media (max-width: 900px) {
          .contact-grid { grid-template-columns: repeat(2, 1fr); }
          .contact-card-last { grid-column: auto; }
          .footer-links { display:none; }
        }
        @media (max-width: 500px) {
          .contact-grid { grid-template-columns: 1fr; }
          .footer-copy { text-align:center; width:100%; }
        }
      `}</style>
      <div className="contact-bg" />
      <div className="section-wrapper">
        <div className="contact-header slide-in-left">
          <p className="section-label">Get In Touch</p>
          <h2 className="section-heading">Contact Us</h2>
        </div>
        <div className="contact-grid">
          {contacts.map((c, i) => (
            <a
              key={c.title}
              href={c.href}
              className={`contact-card glass-card fade-in${i === contacts.length - 1 ? " contact-card-last" : ""}`}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              style={{ "--cc-glow": c.glow, "--cc-border": c.border } as React.CSSProperties}
            >
              <div className="contact-icon-wrap">
              </div>
              <div className="contact-title">{c.title}</div>
              <div className="contact-val">{c.val}</div>
              <div className="contact-sub">{c.sub}</div>
            </a>
          ))}
        </div>
        <div className="site-footer">
          <div className="footer-logo">CFHS <span>·</span> Key Club</div>
          <ul className="footer-links">
            {["about", "events", "officers", "contact"].map((l) => (
              <li key={l}><a href={`#${l}`}>{l}</a></li>
            ))}
          </ul>
          <div className="footer-copy">© 2026 Fulshear Key Club · Texas-Oklahoma District · All Rights Reserved</div>
        </div>
      </div>
    </section>
  );
}
