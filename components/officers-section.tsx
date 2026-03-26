"use client";

const officers = [
  { title: "President",     name: "Bisan Abdalla",        year: "Class of 2027", email: "ba309494@students.lcisd.org",  quote: "I love engaging with different communities and making a positive impact by helping out!", image: "/officers/bisan.png",   photoScale: "scale(2.6)", photoOrigin: "50% 36%" },
  { title: "Vice President",name: "Takashi Orellana",     year: "Class of 2026", email: "to256067@students.lcisd.org",  quote: "I love volunteering and getting to connect more with my community & friends.", image: "/officers/takashi.png", photoScale: "scale(2.6)", photoOrigin: "50% 36%" },
  { title: "Secretary",     name: "Ziruo Yin",            year: "Class of 2027", email: "zy708820@students.lcisd.org",  quote: "I love that we are able to provide volunteer opportunities and participate in them.", image: "/officers/ziruo.png",   photoScale: "scale(2.6)", photoOrigin: "50% 40%" },
  { title: "Treasurer",     name: "Max Brito",            year: "Class of 2027", email: "mb308473@students.lcisd.org",  quote: "I love connecting with members and providing a way to better our communities.", image: "/officers/max.png",     photoScale: "scale(2.2)", photoOrigin: "50% 46%" },
  { title: "Editor",        name: "Ahlon Steward",        year: "Class of 2027", email: "AS203213@students.lcisd.org",  quote: "I love how everyone in Key Club is one big community.", image: "/officers/ahlon.png",   photoScale: "scale(1.3)", photoOrigin: "50% 22%" },
  { title: "Webmaster",     name: "Sesandi Devanarayana", year: "Class of 2027", email: "sd255062@students.lcisd.org",  quote: "I love the impact we are able to leave behind on communities by helping out!", image: "/officers/sesandi.png", photoScale: "scale(2.6)", photoOrigin: "50% 40%" },
];

const colors: Record<string, { glow: string; border: string; fallback: string }> = {
  "President":      { glow: "rgba(201,168,76,0.45)",  border: "rgba(201,168,76,0.7)",   fallback: "linear-gradient(135deg,#c9a84c,#f0c85a)" },
  "Vice President": { glow: "rgba(100,149,237,0.4)",  border: "rgba(100,149,237,0.65)", fallback: "linear-gradient(135deg,#1a3a8f,#4a80e8)" },
  "Secretary":      { glow: "rgba(201,168,76,0.35)",  border: "rgba(201,168,76,0.55)",  fallback: "linear-gradient(135deg,#8c6e28,#c9a84c)" },
  "Treasurer":      { glow: "rgba(100,149,237,0.35)", border: "rgba(100,149,237,0.55)", fallback: "linear-gradient(135deg,#0f2044,#1a3a8f)" },
  "Editor":         { glow: "rgba(201,168,76,0.35)",  border: "rgba(201,168,76,0.5)",   fallback: "linear-gradient(135deg,#c9a84c,#e8c870)" },
  "Webmaster":      { glow: "rgba(100,149,237,0.4)",  border: "rgba(100,149,237,0.6)",  fallback: "linear-gradient(135deg,#1a3a8f,#3a6de8)" },
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

        /* Avatar photo */
        .officer-avatar {
          width: 110px; height: 110px;
          border-radius: 50%;
          background: var(--oc-fallback, linear-gradient(135deg,#c9a84c,#f0c85a));
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 1.25rem;
          position: relative; z-index: 1;
          box-shadow: 0 0 0 3px rgba(255,255,255,0.08), 0 0 24px var(--oc-glow, rgba(201,168,76,0.3));
          transition: box-shadow 0.3s, transform 0.3s;
          overflow: hidden;
        }
        .officer-card:hover .officer-avatar {
          box-shadow: 0 0 0 3px rgba(255,255,255,0.14), 0 0 40px var(--oc-glow, rgba(201,168,76,0.5));
          transform: scale(1.06);
        }
        .officer-avatar img {
          width: 100%; height: 100%;
          object-fit: cover;
          border-radius: 50%;
          display: block;
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
        @media (max-width: 480px) {
          .officer-card  { padding: 1.5rem 1rem 1.25rem; }
          .officer-name  { font-size: 0.95rem; }
          .officer-title { font-size: 0.6rem; }
          .officer-year  { font-size: 0.7rem; }
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
                  "--oc-fallback": c.fallback,
                  "--oc-glow-color": c.glow,
                } as React.CSSProperties}
              >
                <div className="officer-avatar">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={o.image} alt={o.name} style={{ transform: o.photoScale, transformOrigin: o.photoOrigin }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                </div>
                <div className="officer-title">{o.title}</div>
                <div className="officer-name">{o.name}</div>
                <div className="officer-year">{o.year}</div>
                <a href={`mailto:${o.email}`} className="officer-email">{o.email}</a>
                <div className="officer-quote">"{o.quote}"</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
