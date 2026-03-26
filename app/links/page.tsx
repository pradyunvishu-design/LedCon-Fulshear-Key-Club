"use client";

const linkGroups = [
  {
    label: "Club Resources",
    color: "rgba(201,168,76,0.35)",
    border: "rgba(201,168,76,0.6)",
    links: [
      { title: "Event Sign-Ups", desc: "Register for upcoming service events", href: "https://www.signupgenius.com", icon: "📋" },
      { title: "Contact Officers", desc: "fulshearkeyclub@lcisd.org", href: "mailto:fulshearkeyclub@lcisd.org", icon: "✉️" },
    ],
  },
  {
    label: "Social Media",
    color: "rgba(200,80,180,0.35)",
    border: "rgba(200,80,180,0.6)",
    links: [
      { title: "Instagram", desc: "@fulshearkeyclub — photos, updates & events", href: "https://www.instagram.com/fulshearkeyclub", icon: "📸" },
      { title: "T-O District Instagram", desc: "@tokeyclub — Texas-Oklahoma district updates", href: "https://www.instagram.com/tokeyclub", icon: "📸" },
      { title: "Texas Key Club Instagram", desc: "@texaskeyclub — statewide Key Club news", href: "https://www.instagram.com/texaskeyclub", icon: "📸" },
    ],
  },
  {
    label: "District & International",
    color: "rgba(100,149,237,0.35)",
    border: "rgba(100,149,237,0.6)",
    links: [
      { title: "Texas-Oklahoma District", desc: "Official TOK district site — events, news, resources", href: "https://www.tokeyclub.com", icon: "🌟" },
      { title: "Key Club International", desc: "Global headquarters for Key Club", href: "https://www.keyclub.org", icon: "🌍" },
      { title: "Kiwanis International", desc: "The parent organization of Key Club", href: "https://www.kiwanis.org", icon: "🤝" },
      { title: "Circle K International", desc: "Key Club's college-level equivalent", href: "https://www.circlek.org", icon: "🎓" },
      { title: "KIWIN'S", desc: "Kiwanis-family club for young women", href: "https://www.tokeyclub.com", icon: "💜" },
    ],
  },
  {
    label: "Volunteering",
    color: "rgba(78,203,113,0.35)",
    border: "rgba(78,203,113,0.6)",
    links: [
      { title: "VolunteerMatch", desc: "Find local service opportunities near Fulshear", href: "https://www.volunteermatch.org", icon: "🙌" },
      { title: "Idealist", desc: "Nonprofit volunteer listings nationwide", href: "https://www.idealist.org", icon: "💡" },
      { title: "DoSomething.org", desc: "Youth-led campaigns and actions", href: "https://www.dosomething.org", icon: "⚡" },
    ],
  },
];

export default function LinksPage() {
  return (
    <main style={{ minHeight: "100vh", paddingTop: "7rem", paddingBottom: "6rem", position: "relative", overflow: "hidden" }}>
      <style>{`
        .links-bg {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background:
            radial-gradient(ellipse 80% 60% at 20% 20%, rgba(26,58,143,0.18) 0%, transparent 55%),
            radial-gradient(ellipse 60% 50% at 80% 80%, rgba(201,168,76,0.1) 0%, transparent 50%),
            radial-gradient(ellipse 50% 40% at 50% 50%, rgba(26,58,143,0.08) 0%, transparent 60%);
        }
        .links-inner { position: relative; z-index: 1; max-width: 1100px; margin: 0 auto; padding: 0 2rem; }
        .links-header { text-align: center; margin-bottom: 4rem; }
        .links-group { margin-bottom: 3.5rem; }
        .links-group-label {
          font-size: 0.65rem; font-weight: 800; letter-spacing: 0.26em;
          text-transform: uppercase; color: var(--gold); margin-bottom: 1.25rem;
          display: flex; align-items: center; gap: 0.75rem;
        }
        .links-group-label::after {
          content: ''; flex: 1; height: 1px;
          background: linear-gradient(90deg, rgba(201,168,76,0.4), transparent);
        }
        .links-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 320px));
          gap: 1rem;
          justify-content: center;
        }
        .link-card {
          display: flex; align-items: flex-start; gap: 1rem;
          padding: 1.4rem 1.5rem;
          border-radius: 14px; text-decoration: none;
          background: linear-gradient(135deg, rgba(26,58,143,0.1) 0%, rgba(8,21,48,0.85) 100%);
          border: 1px solid rgba(201,168,76,0.15);
          backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          transition: all 0.35s cubic-bezier(0.16,1,0.3,1);
          position: relative; overflow: hidden;
        }
        .link-card::before {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(ellipse 80% 80% at 50% 0%, var(--lc-glow, rgba(201,168,76,0.08)) 0%, transparent 70%);
          opacity: 0; transition: opacity 0.35s;
        }
        .link-card:hover { transform: translateY(-6px); }
        .link-card:hover::before { opacity: 1; }
        .link-icon {
          font-size: 1.5rem; line-height: 1; flex-shrink: 0;
          width: 42px; height: 42px;
          background: rgba(255,255,255,0.05); border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          transition: transform 0.3s;
        }
        .link-card:hover .link-icon { transform: scale(1.15); }
        .link-card-body { min-width: 0; }
        .link-card-title {
          font-size: 0.88rem; font-weight: 700; color: var(--white);
          margin-bottom: 0.3rem; letter-spacing: -0.01em;
        }
        .link-card-desc { font-size: 0.72rem; color: var(--silver); line-height: 1.4; }
        .link-arrow {
          margin-left: auto; color: var(--silver); opacity: 0.4;
          font-size: 1rem; flex-shrink: 0; align-self: center;
          transition: opacity 0.25s, transform 0.25s;
        }
        .link-card:hover .link-arrow { opacity: 0.9; transform: translateX(4px); }

        @media (max-width: 600px) {
          .links-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="links-bg" />
      <div className="links-inner">
        <div className="links-header">
          <p className="section-label">Quick Access</p>
          <h1 className="section-heading">Important Links</h1>
          <p style={{ color: "var(--silver)", fontSize: "0.95rem", maxWidth: "500px", margin: "0 auto" }}>
            Everything you need for Fulshear Key Club — service resources, social, district news, and more.
          </p>
        </div>

        {linkGroups.map((group) => (
          <div key={group.label} className="links-group">
            <div className="links-group-label">{group.label}</div>
            <div className="links-grid">
              {group.links.map((link) => (
                <a
                  key={link.title}
                  href={link.href}
                  className="link-card"
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  style={{
                    "--lc-glow": group.color,
                    borderColor: "rgba(255,255,255,0.06)",
                  } as React.CSSProperties}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = group.border;
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 50px rgba(0,0,0,0.5), 0 0 30px ${group.color}`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  }}
                >
                  <div className="link-icon">{link.icon}</div>
                  <div className="link-card-body">
                    <div className="link-card-title">{link.title}</div>
                    <div className="link-card-desc">{link.desc}</div>
                  </div>
                  <span className="link-arrow">→</span>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
