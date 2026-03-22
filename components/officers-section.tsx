"use client";

const officers = [
  { title: "President", name: "Sarah Jenkins", year: "Class of 2026", email: "president@lcisd.org", quote: "Dedicated to expanding our reach." },
  { title: "Vice President", name: "Marcus Chen", year: "Class of 2026", email: "vicepresident@lcisd.org", quote: "Service is the rent we pay for living." },
  { title: "Secretary", name: "Emily Rodriguez", year: "Class of 2026", email: "secretary@lcisd.org", quote: "Organization is the key to success." },
  { title: "Treasurer", name: "David Kim", year: "Class of 2026", email: "treasurer@lcisd.org", quote: "Ensuring our resources fuel our mission." },
  { title: "Editor", name: "Aaliyah Smith", year: "Class of 2026", email: "editor@lcisd.org", quote: "Capturing our memories and milestones." },
  { title: "Webmaster", name: "Jordan Taylor", year: "Class of 2026", email: "webmaster@lcisd.org", quote: "Connecting us through technology." },
];

const icons: Record<string, string> = {
  "President": "👑",
  "Vice President": "⭐",
  "Secretary": "📋",
  "Treasurer": "💰",
  "Editor": "✏️",
  "Webmaster": "💻",
};

const colors: Record<string, { glow: string; border: string; avatar: string }> = {
  "President":      { glow: "rgba(201,168,76,0.45)",  border: "rgba(201,168,76,0.7)",   avatar: "linear-gradient(135deg,#c9a84c,#f0c85a)" },
  "Vice President": { glow: "rgba(100,149,237,0.4)",  border: "rgba(100,149,237,0.65)", avatar: "linear-gradient(135deg,#1a3a8f,#4a80e8)" },
  "Secretary":      { glow: "rgba(201,168,76,0.35)",  border: "rgba(201,168,76,0.55)",  avatar: "linear-gradient(135deg,#8c6e28,#c9a84c)" },
  "Treasurer":      { glow: "rgba(100,149,237,0.35)", border: "rgba(100,149,237,0.55)", avatar: "linear-gradient(135deg,#0f2044,#1a3a8f)" },
  "Editor":         { glow: "rgba(201,168,76,0.35)",  border: "rgba(201,168,76,0.5)",   avatar: "linear-gradient(135deg,#c9a84c,#e8c870)" },
  "Webmaster":      { glow: "rgba(100,149,237,0.4)",  border: "rgba(100,149,237,0.6)",  avatar: "linear-gradient(135deg,#1a3a8f,#3a6de8)" },
};

export default function OfficersSection() {
  return (
    <section id="officers" style={{ padding: "8rem 0", position: "relative", overflow: "hidden" }}>
      <style>{`
        .officers-bg {
          position:absolute; inset:0; pointer-events:none;
          background:
            radial-gradient(ellipse 70% 60% at 50% 0%, rgba(26,58,143,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 20% 80%, rgba(201,168,76,0.07) 0%, transparent 50%);
        }
        .officers-header { text-align: center; margin-bottom: 4rem; }
        .officers-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        .officer-card {
          padding: 2.5rem 1.75rem 2rem;
          text-align: center;
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .officer-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: var(--oc-border, linear-gradient(90deg, transparent, rgba(201,168,76,0.6), transparent));
          transition: opacity 0.3s;
        }
        .officer-card::after {
          content: '';
          position:absolute; inset:0;
          background: radial-gradient(ellipse 80% 60% at 50% 0%, var(--oc-glow-color, rgba(201,168,76,0.08)) 0%, transparent 70%);
          opacity:0; transition:opacity 0.4s; pointer-events:none;
        }
        .officer-card:hover::after { opacity:1; }
        .officer-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 30px 60px rgba(0,0,0,0.5), 0 0 40px var(--oc-glow, rgba(201,168,76,0.2));
          border-color: var(--oc-border-color, rgba(201,168,76,0.5)) !important;
        }

        /* Avatar circle */
        .officer-avatar {
          width: 72px; height: 72px;
          border-radius: 50%;
          background: var(--oc-avatar, linear-gradient(135deg,#c9a84c,#f0c85a));
          display:flex; align-items:center; justify-content:center;
          margin: 0 auto 1.25rem;
          position:relative; z-index:1;
          box-shadow: 0 0 0 2px rgba(255,255,255,0.06), 0 0 20px var(--oc-glow, rgba(201,168,76,0.3));
          transition: box-shadow 0.3s, transform 0.3s;
        }
        .officer-card:hover .officer-avatar {
          box-shadow: 0 0 0 2px rgba(255,255,255,0.1), 0 0 35px var(--oc-glow, rgba(201,168,76,0.5));
          transform: scale(1.08);
        }
        .officer-icon {
          font-size: 2rem;
          display: block;
          filter: drop-shadow(0 2px 6px rgba(0,0,0,0.5));
        }

        .officer-title {
          font-size: 0.65rem;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: var(--gold);
          font-weight: 700;
          margin-bottom: 0.5rem;
          position:relative; z-index:1;
        }
        .officer-name {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--white);
          margin-bottom: 0.3rem;
          position:relative; z-index:1;
          letter-spacing:-0.01em;
        }
        .officer-year {
          font-size: 0.78rem;
          color: var(--silver);
          margin-bottom: 0.85rem;
          position:relative; z-index:1;
        }
        .officer-email {
          font-size: 0.7rem;
          color: rgba(100,149,237,0.85);
          letter-spacing: 0.02em;
          position:relative; z-index:1;
          transition:color 0.2s;
        }
        .officer-card:hover .officer-email { color: #7ab8ff; }
        .officer-quote {
          font-size: 0.8rem;
          color: var(--silver);
          font-style: italic;
          margin-top: 1rem;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(255,255,255,0.05);
          position:relative; z-index:1;
          line-height: 1.4;
        }

        @media (max-width: 900px) {
          .officers-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 550px) {
          .officers-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="officers-bg" />
      <div className="section-wrapper">
        <div className="officers-header slide-in-left">
          <p className="section-label">Club Leadership</p>
          <h2 className="section-heading">Meet Our Officers</h2>
        </div>
        <div className="officers-grid">
          {officers.map((o) => {
            const c = colors[o.title];
            return (
              <div
                key={o.title}
                className="officer-card glass-card fade-in"
                style={{
                  "--oc-glow": c.glow,
                  "--oc-border": `linear-gradient(90deg, transparent, ${c.border}, transparent)`,
                  "--oc-border-color": c.border,
                  "--oc-avatar": c.avatar,
                  "--oc-glow-color": c.glow,
                } as React.CSSProperties}
              >
                <div className="officer-avatar">
                </div>
                <div className="officer-title">{o.title}</div>
                <div className="officer-name">{o.name}</div>
                <div className="officer-year">{o.year}</div>
                <div className="officer-email">{o.email}</div>
                <div className="officer-quote">"{o.quote}"</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
