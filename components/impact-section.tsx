"use client";
import { useState } from "react";

const chapters = [
  {
    tag: "Food Drive",
    title: "Slam Dunk! The Campus Food Drive",
    body: "Our members turned lunchtime into service time — collecting hundreds of bags of fresh produce and distributing them to students and families across campus. When the last bag hit the bin, there was only one thing left to say: SLAM DUNK.",
    photos: [
      { src: "/story/2.jpg",  caption: "Members handing out bags of fresh apples to students" },
      { src: "/story/3.jpg",  caption: "Slam Dunk! — the moment it all came together" },
    ],
  },
  {
    tag: "Service",
    title: "Service for Generations",
    body: "Inspired by Key Club International's centennial theme, our members spent an afternoon writing heartfelt cards and distributing care packages. Every card written, every shirt handed off — proof that kindness has no age limit.",
    photos: [
      { src: "/story/4.jpg",  caption: "Writing cards and preparing care items for community members" },
    ],
  },
  {
    tag: "Meetings",
    title: "Club Meetings & Kickoff",
    body: "Every great movement starts with people in a room who care. Our meetings are where ideas become projects, strangers become friends, and members find their why.",
    photos: [
      { src: "/story/5.jpg",  caption: "Club members gathered at our general meeting" },
      { src: "/story/9.jpg",  caption: "Officers and members ready for another week of service" },
    ],
  },
  {
    tag: "Centennial",
    title: "100 Years of Key Club",
    body: "Key Club International reached its centennial — and Fulshear showed up. We hosted a special celebration where members competed in teams to pitch creative service ideas. The winners got to pie the officers in the face. A century of service, one glorious mess.",
    photos: [
      { src: "/story/6.jpg",  caption: "Celebrating 100 years of Key Club at our chapter event" },
      { src: "/story/7.jpg",  caption: "Teams presenting their service ideas to the group" },
      { src: "/story/8.jpg",  caption: "Getting pied — the price of losing (and winning)" },
    ],
  },
  {
    tag: "Year-Round",
    title: "Feeding the Community",
    body: "Gloves on, sleeves rolled up. Our members regularly prepare and serve meals for community events and families in need. From foil-wrapped plates to full spreads, nothing brings people together like a warm meal made with care.",
    photos: [
      { src: "/story/14.jpg", caption: "Members prepping trays in the kitchen" },
      { src: "/story/15.jpg", caption: "The whole crew ready to serve" },
      { src: "/story/17.jpg", caption: "Cooking together for the community" },
    ],
  },
  {
    tag: "Year-Round",
    title: "Out in the Community",
    body: "Whether it's a large-scale community event at the cafeteria or a quick stop at a local landmark, Fulshear Key Club members show up with energy and purpose wherever they go.",
    photos: [
      { src: "/story/10.jpg", caption: "Community members gathering for a service event" },
      { src: "/story/16.jpg", caption: "A big crowd — and we were part of making it happen" },
      { src: "/story/1.jpg",  caption: "Members out representing Fulshear Key Club" },
    ],
  },
  {
    tag: "Cultural Events",
    title: "Celebrating Culture & Community",
    body: "From a dazzling lion dance with live fire to a Princess Night that filled a stage with hundreds of young girls — Fulshear Key Club knows that celebration is its own form of service. We create spaces where every community member feels seen.",
    photos: [
      { src: "/story/11.jpg", caption: "Traditional lion dancing with live fire at our cultural showcase" },
      { src: "/story/12.jpg", caption: "A member dressed up and ready for the formal night" },
      { src: "/story/13.jpg", caption: "Princess Night — a magical evening for young girls in our community" },
    ],
  },
];

export default function ImpactSection() {
  const [lightbox, setLightbox] = useState<{ src: string; caption: string } | null>(null);

  return (
    <section id="impact" style={{ padding: "8rem 0 4rem", position: "relative" }}>
      <style>{`
        /* ── OUR STORY ── */
        .story-section { margin-bottom: 7rem; }
        .story-header { text-align: center; margin-bottom: 5rem; }
        .story-header p { color: var(--silver); max-width: 520px; margin: 0 auto; line-height: 1.7; font-size: 1rem; }

        .chapter-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
          margin-bottom: 0;
        }
        .chapter-row.reverse { direction: rtl; }
        .chapter-row.reverse > * { direction: ltr; }

        .chapter-text { }
        .story-year {
          display: inline-block;
          font-size: 0.7rem; font-weight: 800;
          letter-spacing: 0.25em; text-transform: uppercase;
          color: var(--navy-mid); background: var(--gold);
          padding: 0.3rem 0.85rem; border-radius: 999px;
          margin-bottom: 0.85rem;
        }
        .story-title {
          font-size: clamp(1.4rem, 3vw, 2rem); font-weight: 900;
          color: var(--white); line-height: 1.15;
          margin-bottom: 0.75rem; letter-spacing: -0.02em;
        }
        .story-body { color: var(--silver); line-height: 1.75; font-size: 0.95rem; }

        .photo-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
        }
        .photo-grid.cols-1 { grid-template-columns: 1fr; }
        .photo-grid.cols-2 { grid-template-columns: repeat(2, 1fr); }

        .photo-card {
          position: relative; border-radius: 12px; overflow: hidden;
          height: 210px;
          border: 1px solid rgba(201,168,76,0.2);
          box-shadow: 0 8px 30px rgba(0,0,0,0.35);
          cursor: pointer;
        }
        .photo-card img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          transition: transform 0.4s ease;
        }
        .photo-card:hover img { transform: scale(1.06); }
        .photo-caption {
          position: absolute; bottom: 0; left: 0; right: 0;
          padding: 0.6rem 0.85rem;
          background: linear-gradient(to top, rgba(2,7,9,0.88), transparent);
          font-size: 0.72rem; color: rgba(255,255,255,0.85);
          letter-spacing: 0.03em; line-height: 1.4;
          transform: translateY(100%); transition: transform 0.3s ease;
        }
        .photo-card:hover .photo-caption { transform: translateY(0); }

        .story-divider {
          width: 1px; height: 4rem;
          background: linear-gradient(to bottom, rgba(201,168,76,0.35), transparent);
          margin: 4rem auto;
        }

        /* ── LIGHTBOX ── */
        .lightbox-overlay {
          position: fixed; inset: 0; z-index: 99999;
          background: rgba(0,0,0,0.92);
          display: flex; align-items: center; justify-content: center;
          padding: 1.5rem;
          animation: lbFadeIn 0.2s ease;
        }
        @keyframes lbFadeIn { from { opacity: 0 } to { opacity: 1 } }
        .lightbox-img {
          max-width: 90vw; max-height: 85vh;
          border-radius: 12px;
          box-shadow: 0 0 80px rgba(201,168,76,0.2), 0 30px 80px rgba(0,0,0,0.6);
          object-fit: contain;
          animation: lbZoomIn 0.25s cubic-bezier(0.22,1,0.36,1);
        }
        @keyframes lbZoomIn { from { transform: scale(0.88); opacity: 0 } to { transform: scale(1); opacity: 1 } }
        .lightbox-caption {
          position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%);
          color: rgba(255,255,255,0.75); font-size: 0.85rem;
          letter-spacing: 0.04em; text-align: center;
          max-width: 600px; padding: 0 1rem;
        }
        .lightbox-close {
          position: absolute; top: 1.25rem; right: 1.5rem;
          background: none; border: none; cursor: pointer;
          color: rgba(255,255,255,0.6); font-size: 2rem; line-height: 1;
          transition: color 0.2s;
        }
        .lightbox-close:hover { color: var(--gold); }

        @media (max-width: 768px) {
          .chapter-row, .chapter-row.reverse { grid-template-columns: 1fr; direction: ltr; gap: 2rem; }
          .photo-grid.cols-2 { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
          .photo-grid { grid-template-columns: repeat(2, 1fr); }
          .photo-grid.cols-1 { grid-template-columns: 1fr; }
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
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem; max-width: 1000px; margin: 0 auto;
        }
        .impact-card:nth-child(5) { grid-column: 2; }
        .impact-card:nth-child(6) { grid-column: 3; }
        @media(max-width:800px){
          .impact-grid { grid-template-columns: repeat(2, 1fr); }
          .impact-card:nth-child(5), .impact-card:nth-child(6) { grid-column: auto; }
        }
        @media(max-width:480px){
          .impact-grid { grid-template-columns: 1fr; }
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
            <p>Food drives, cultural celebrations, cooking for the community, 100-year milestones — here&apos;s what we&apos;ve been up to.</p>
          </div>

          {chapters.map((ch, i) => {
            const isReverse = i % 2 === 1;
            const colClass = ch.photos.length === 1 ? "cols-1" : ch.photos.length === 2 ? "cols-2" : "";
            return (
              <div key={ch.title}>
                <div className={`chapter-row fade-in${isReverse ? " reverse" : ""}`} style={{ transitionDelay: `${i * 0.05}s` }}>
                  <div className="chapter-text">
                    <span className="story-year">{ch.tag}</span>
                    <h3 className="story-title">{ch.title}</h3>
                    <p className="story-body">{ch.body}</p>
                  </div>
                  <div className={`photo-grid ${colClass}`}>
                    {ch.photos.map((p) => (
                      <div key={p.src} className="photo-card" onClick={() => setLightbox(p)}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.src} alt={p.caption} />
                        <div className="photo-caption">{p.caption}</div>
                      </div>
                    ))}
                  </div>
                </div>
                {i < chapters.length - 1 && <div className="story-divider" />}
              </div>
            );
          })}
        </div>

        {/* ── LIGHTBOX ── */}
        {lightbox && (
          <div className="lightbox-overlay" onClick={() => setLightbox(null)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="lightbox-img" src={lightbox.src} alt={lightbox.caption} onClick={(e) => e.stopPropagation()} />
            <button className="lightbox-close" onClick={() => setLightbox(null)}>✕</button>
            {lightbox.caption && <p className="lightbox-caption">{lightbox.caption}</p>}
          </div>
        )}

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
            <h3 style={{ fontSize: "1.2rem", color: "white", marginBottom: "0.5rem" }}>This Year in Service</h3>
            <p style={{ color: "var(--silver)", fontSize: "0.95rem", lineHeight: "1.6" }}>
              From packing lunches at the Fulshear Community Center every month to showing up at festivals, food drives, and school events across Fort Bend County — our members put in real hours for real people. Every number on this dashboard represents someone our club showed up for.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
