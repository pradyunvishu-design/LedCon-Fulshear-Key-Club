"use client";

// Gallery images — paste URLs from keyclubfulshear.vercel.app gallery here:
const storyImages = [
  "", // Entry 1 — Club Founded
  "", // Entry 2 — Community Roots
  "", // Entry 3 — Food Bank
  "", // Entry 4 — Blood Drive
  "", // Entry 5 — Tutoring
];

const stories = [
  {
    year: "2016",
    title: "A Club is Founded",
    body: "When Fulshear High School opened its doors, so did Key Club — one of the first student organizations at CFHS. We joined Division 3S of the Texas-Oklahoma District, becoming part of a 17,000-member network dedicated to service.",
  },
  {
    year: "2022",
    title: "Growing Community Roots",
    body: "As membership grew, so did our reach. Members launched recurring service projects across Fulshear — from community food drives at the Fulshear Community Center to clean-up events at local parks. Service became our identity.",
  },
  {
    year: "2023",
    title: "Houston Food Bank Partnership",
    body: "We partnered with the Houston Food Bank to package over 5,000 meals for families in the greater Fulshear area. This became one of our largest and most impactful events of the year — and we've done it every year since.",
  },
  {
    year: "2024",
    title: "Blood Drive Initiative",
    body: "Our club hosted 3 community blood drives across Fort Bend County, connecting local donors with hospitals in need. Each drive brought members, families, and community members together for a single lifesaving mission.",
  },
  {
    year: "2025",
    title: "Tutoring & Education Outreach",
    body: "We launched a peer tutoring program that reached 120+ local elementary students every semester. Seeing younger kids light up with understanding — that's what Key Club is all about. The program continues to grow every year.",
  },
];

export default function ImpactSection() {
  return (
    <section id="impact" style={{ padding: "8rem 0 4rem", position: "relative" }}>
      <style>{`
        /* ── OUR STORY ── */
        .story-section { margin-bottom: 7rem; }
        .story-header { text-align: center; margin-bottom: 5rem; }
        .story-header p { color: var(--silver); max-width: 520px; margin: 0 auto; line-height: 1.7; font-size: 1rem; }

        .story-entry {
          display: flex;
          align-items: center;
          gap: 4rem;
          margin-bottom: 5rem;
        }
        .story-entry.reverse { flex-direction: row-reverse; }

        .story-text-col { flex: 1; min-width: 0; }
        .story-img-col  { flex: 1; min-width: 0; }

        .story-year {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--navy-mid);
          background: var(--gold);
          padding: 0.3rem 0.85rem;
          border-radius: 999px;
          margin-bottom: 1rem;
        }
        .story-title {
          font-size: clamp(1.4rem, 3vw, 2rem);
          font-weight: 900;
          color: var(--white);
          line-height: 1.15;
          margin-bottom: 1rem;
          letter-spacing: -0.02em;
        }
        .story-body {
          color: var(--silver);
          line-height: 1.75;
          font-size: 0.95rem;
        }

        .story-img-wrap {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          aspect-ratio: 4 / 3;
          border: 1px solid rgba(201,168,76,0.25);
          box-shadow: 0 0 40px rgba(201,168,76,0.12), 0 20px 60px rgba(0,0,0,0.4);
        }
        .story-img-wrap img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease;
        }
        .story-img-wrap:hover img { transform: scale(1.04); }
        .story-img-placeholder {
          width: 100%; height: 100%;
          background: linear-gradient(135deg, #0f2044 0%, #081530 50%, #030810 100%);
          display: flex; align-items: center; justify-content: center;
          flex-direction: column; gap: 0.75rem;
        }
        .story-img-placeholder span {
          font-size: 0.7rem; letter-spacing: 0.2em;
          text-transform: uppercase; color: rgba(201,168,76,0.5);
          font-weight: 600;
        }

        .story-connector {
          width: 1px;
          height: 4rem;
          background: linear-gradient(to bottom, rgba(201,168,76,0.4), transparent);
          margin: 0 auto 5rem;
        }

        @media (max-width: 768px) {
          .story-entry, .story-entry.reverse { flex-direction: column; gap: 2rem; }
          .story-img-col { order: -1; }
        }

        /* ── IMPACT DASHBOARD ── */
        .impact-hero { text-align: center; margin-bottom: 4rem; }
        .impact-title {
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 900; letter-spacing: -0.03em; margin-bottom: 1rem;
        }
        .impact-title .highlight {
          background: linear-gradient(135deg, var(--gold-light) 0%, var(--gold) 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .impact-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem; max-width: 1000px; margin: 0 auto;
        }
        .impact-card {
          padding: 2.5rem 2rem; text-align: center;
          border-radius: 20px; background: rgba(20,30,60,0.4);
          border: 1px solid rgba(100,149,237,0.15);
          backdrop-filter: blur(12px);
          position: relative; overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .impact-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(100,149,237,0.2);
          border-color: rgba(201,168,76,0.4);
        }
        .impact-card::before {
          content: ''; position: absolute; bottom: 0; left: 0; right: 0;
          height: 3px; background: linear-gradient(90deg, var(--accent-blue), var(--gold));
        }
        .impact-val   { font-size: 3.5rem; font-weight: 900; color: white; line-height: 1; margin-bottom: 0.5rem; }
        .impact-label { font-size: 0.85rem; color: var(--gold); text-transform: uppercase; letter-spacing: 0.15em; font-weight: 700; margin-bottom: 0.25rem; }
        .impact-desc  { font-size: 0.85rem; color: var(--silver); opacity: 0.7; }
      `}</style>

      <div className="section-wrapper">

        {/* ── OUR STORY ── */}
        <div className="story-section">
          <div className="story-header fade-in">
            <p className="section-label" style={{ justifyContent: "center" }}>Club History</p>
            <h2 className="section-heading">Our Story</h2>
            <p>From Day 1 at Fulshear High School to thousands of meals packed and hundreds of students tutored — this is how we got here.</p>
          </div>

          {stories.map((s, i) => {
            const isReverse = i % 2 === 1;
            const imgSrc    = storyImages[i];
            return (
              <div key={s.year}>
                <div className={`story-entry${isReverse ? " reverse" : ""}`}>
                  <div className={`story-text-col ${isReverse ? "slide-in-right" : "slide-in-left"}`}>
                    <span className="story-year">{s.year}</span>
                    <h3 className="story-title">{s.title}</h3>
                    <p className="story-body">{s.body}</p>
                  </div>
                  <div className={`story-img-col ${isReverse ? "slide-in-left" : "slide-in-right"}`}>
                    <div className="story-img-wrap">
                      {imgSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={imgSrc} alt={s.title} />
                      ) : (
                        <div className="story-img-placeholder">
                          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,76,0.35)" strokeWidth="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="3"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <path d="m21 15-5-5L5 21"/>
                          </svg>
                          <span>Photo coming soon</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {i < stories.length - 1 && <div className="story-connector" />}
              </div>
            );
          })}
        </div>

        {/* ── IMPACT DASHBOARD ── */}
        <div style={{ borderTop: "1px solid rgba(201,168,76,0.15)", paddingTop: "6rem" }}>
          <div className="impact-hero fade-in">
            <p className="section-label" style={{ justifyContent: "center" }}>2025–2026 Service Year</p>
            <h2 className="impact-title">Service Impact <br/><span className="highlight">Dashboard.</span></h2>
            <p style={{ color: "var(--silver)", maxWidth: "500px", margin: "0 auto", lineHeight: "1.7", fontSize: "1.05rem" }}>
              Real data. Real impact. Tracking every hour, every project, and every community member we&apos;ve touched this year.
            </p>
          </div>

          <div className="impact-grid" style={{ marginBottom: "3rem" }}>
            {[
              { val: "1,847", label: "Hours",         desc: "Total Service Hours" },
              { val: "32",    label: "Projects",      desc: "Service Events Completed" },
              { val: "48",    label: "Members",       desc: "Active Members" },
              { val: "~38",   label: "Avg Hours",     desc: "Per Member This Year" },
              { val: "$4.2K", label: "Funds Raised",  desc: "For Charities & Causes" },
              { val: "12",    label: "Local Partners", desc: "Organizations Supported" },
            ].map((c, i) => (
              <div key={c.label} className="impact-card fade-in" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="impact-val">{c.val}</div>
                <div className="impact-label">{c.label}</div>
                <div className="impact-desc">{c.desc}</div>
              </div>
            ))}
          </div>

          <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center", background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "16px", padding: "2rem" }}>
            <h3 style={{ fontSize: "1.2rem", color: "white", marginBottom: "0.5rem" }}>Recent Highlights</h3>
            <p style={{ color: "var(--silver)", fontSize: "0.95rem", lineHeight: "1.6" }}>
              This year alone, our members have successfully hosted 3 community blood drives, partnered with the Houston Food Bank to package over 5,000 meals, and tutored 120+ local elementary students. Our commitment to service continues to grow every single week.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
