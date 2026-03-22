"use client";

export default function ImpactSection() {
  return (
    <section id="impact" className="pt-24 pb-16">
      <style>{`
        .impact-hero {
          text-align: center;
          margin-bottom: 4rem;
        }
        .impact-title {
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 900;
          letter-spacing: -0.03em;
          margin-bottom: 1rem;
        }
        .impact-title .highlight {
          background: linear-gradient(135deg, var(--gold-light) 0%, var(--gold) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .impact-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
          max-width: 1000px;
          margin: 0 auto;
        }
        .impact-card {
          padding: 2.5rem 2rem;
          text-align: center;
          border-radius: 20px;
          background: rgba(20, 30, 60, 0.4);
          border: 1px solid rgba(100, 149, 237, 0.15);
          backdrop-filter: blur(12px);
          position: relative;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .impact-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(100, 149, 237, 0.2);
          border-color: rgba(201, 168, 76, 0.4);
        }
        .impact-card::before {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--blue), var(--gold));
        }
        .impact-val {
          font-size: 3.5rem;
          font-weight: 900;
          color: white;
          line-height: 1;
          margin-bottom: 0.5rem;
        }
        .impact-label {
          font-size: 0.85rem;
          color: var(--gold);
          text-transform: uppercase;
          letter-spacing: 0.15em;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }
        .impact-desc {
          font-size: 0.85rem;
          color: var(--silver);
          opacity: 0.7;
        }
      `}</style>
      
      <div className="section-wrapper fade-in">
        <div className="impact-hero">
          <p className="section-label" style={{ justifyContent: "center" }}>2025–2026 Service Year</p>
          <h2 className="impact-title">Service Impact <br/><span className="highlight">Dashboard.</span></h2>
          <p style={{ color: "var(--silver)", maxWidth: "500px", margin: "0 auto", lineHeight: "1.7", fontSize: "1.05rem" }}>
            Real data. Real impact. Tracking every hour, every project, and every community member we've touched this year.
          </p>
        </div>

        <div className="impact-grid" style={{ marginBottom: "3rem" }}>
          <div className="impact-card fade-in" style={{ transitionDelay: '0s' }}>
            <div className="impact-val">1,847</div>
            <div className="impact-label">Hours</div>
            <div className="impact-desc">Total Service Hours</div>
          </div>
          <div className="impact-card fade-in" style={{ transitionDelay: '0.1s' }}>
            <div className="impact-val">32</div>
            <div className="impact-label">Projects</div>
            <div className="impact-desc">Service Events Completed</div>
          </div>
          <div className="impact-card fade-in" style={{ transitionDelay: '0.2s' }}>
            <div className="impact-val">48</div>
            <div className="impact-label">Members</div>
            <div className="impact-desc">Active Members</div>
          </div>
          <div className="impact-card fade-in" style={{ transitionDelay: '0.3s' }}>
            <div className="impact-val">~38</div>
            <div className="impact-label">Avg Hours</div>
            <div className="impact-desc">Per Member This Year</div>
          </div>
          <div className="impact-card fade-in" style={{ transitionDelay: '0.4s' }}>
            <div className="impact-val">$4.2K</div>
            <div className="impact-label">Funds Raised</div>
            <div className="impact-desc">For Charities & Causes</div>
          </div>
          <div className="impact-card fade-in" style={{ transitionDelay: '0.5s' }}>
            <div className="impact-val">12</div>
            <div className="impact-label">Local Partners</div>
            <div className="impact-desc">Organizations Supported</div>
          </div>
        </div>

        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center", background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "16px", padding: "2rem" }}>
          <h3 style={{ fontSize: "1.2rem", color: "white", marginBottom: "0.5rem" }}>Recent Highlights</h3>
          <p style={{ color: "var(--silver)", fontSize: "0.95rem", lineHeight: "1.6" }}>
            This year alone, our members have successfully hosted 3 community blood drives, partnered with the Houston Food Bank to package over 5,000 meals, and tutored 120+ local elementary students. Our commitment to service continues to grow every single week.
          </p>
        </div>
      </div>
    </section>
  );
}
