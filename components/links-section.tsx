"use client";

const links = [
  {
    icon: "🔗",
    title: "ClassLink",
    desc: "Access SchooLinks & Canvas",
    url: "https://login.classlink.com/my/lcisd",
    label: "login.classlink.com",
  },
  {
    icon: "📸",
    title: "Club Instagram",
    desc: "Follow us @fulshearkeyclub",
    url: "https://instagram.com/fulshearkeyclub",
    label: "@fulshearkeyclub",
  },
  {
    icon: "🌐",
    title: "District Website",
    desc: "Texas-Oklahoma Key Club District",
    url: "https://tokeyclub.com",
    label: "tokeyclub.com",
  },
  {
    icon: "🌍",
    title: "Key Club International",
    desc: "Official KCI Site",
    url: "https://www.keyclub.org",
    label: "keyclub.org",
  },
];

export default function LinksSection() {
  return (
    <section id="links" style={{ padding: "8rem 0" }}>
      <style>{`
        .links-header { text-align: center; margin-bottom: 4rem; }
        .links-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }
        .link-card {
          padding: 2rem;
          display: flex;
          gap: 1.25rem;
          align-items: flex-start;
          cursor: pointer;
        }
        .link-icon {
          font-size: 2rem;
          flex-shrink: 0;
          line-height: 1;
        }
        .link-title {
          font-size: 1rem;
          font-weight: 700;
          color: var(--white);
          margin-bottom: 0.2rem;
        }
        .link-desc {
          font-size: 0.8rem;
          color: var(--silver);
          margin-bottom: 0.5rem;
        }
        .link-url {
          font-size: 0.75rem;
          color: var(--gold);
          font-weight: 600;
          letter-spacing: 0.02em;
        }
        @media (max-width: 650px) {
          .links-grid { grid-template-columns: 1fr; }
          .link-card  { padding: 1.25rem; }
          .link-title { font-size: 0.9rem; }
        }
      `}</style>
      <div className="section-wrapper">
        <div className="links-header fade-in">
          <p className="section-label">Resources</p>
          <h2 className="section-heading">Important Links</h2>
        </div>
        <div className="links-grid">
          {links.map((l) => (
            <a key={l.title} href={l.url} target="_blank" rel="noopener noreferrer" className="link-card glass-card fade-in">
              <span className="link-icon">{l.icon}</span>
              <div>
                <div className="link-title">{l.title}</div>
                <div className="link-desc">{l.desc}</div>
                <div className="link-url">{l.label} ↗</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
