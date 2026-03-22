"use client";

const stats = [
  { value: "17,000+", label: "T-O District Members" },
  { value: "1925", label: "Year Founded" },
  { value: "33", label: "Global Districts" },
  { value: "∞", label: "Community Impact" },
];

export default function AboutSection() {
  return (
    <section id="about" style={{ padding: "9rem 0 7rem", position: "relative", overflow: "hidden" }}>
      <style>{`
        .about-bg-glow {
          position:absolute; inset:0; pointer-events:none;
          background:
            radial-gradient(ellipse 60% 65% at 80% 50%, rgba(26,58,143,0.18) 0%, transparent 70%),
            radial-gradient(ellipse 45% 55% at 10% 80%, rgba(201,168,76,0.1) 0%, transparent 60%),
            radial-gradient(ellipse 30% 40% at 50% 0%, rgba(100,149,237,0.07) 0%, transparent 50%);
        }
        .about-grid {
          display:grid; grid-template-columns:1fr;
          gap:5rem; align-items:center; margin-bottom:5rem; text-align:center;
        }
        .about-text { position:relative; z-index:1; }
        .about-desc {
          font-size:1.05rem; color:var(--silver);
          line-height:1.9; margin-bottom:1.75rem;
        }
        .about-desc strong { color:var(--gold); font-weight:700; }

        /* Rich text card */
        .about-text-card {
          background: linear-gradient(135deg, rgba(26,58,143,0.1) 0%, rgba(8,21,48,0.8) 100%);
          border:1px solid rgba(201,168,76,0.15);
          border-radius:16px; padding:2rem;
          margin-bottom:1.75rem;
          position:relative; overflow:hidden;
        }
        .about-text-card::before {
          content:'';
          position:absolute; top:0; left:0; right:0;
          height:2px;
          background:linear-gradient(90deg, transparent, rgba(201,168,76,0.6), transparent);
        }
        .about-text-card::after {
          content:'';
          position:absolute; inset:0;
          background:linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 50%);
          pointer-events:none;
        }

        .about-visual {
          display:flex; align-items:center; justify-content:center;
          position:relative;
        }
        .about-logo-ring {
          position:absolute; border-radius:50%; pointer-events:none;
        }
        .about-ring-1 {
          width:310px; height:310px;
          border:1.5px solid rgba(201,168,76,0.4);
          box-shadow: 0 0 24px rgba(201,168,76,0.15), inset 0 0 24px rgba(201,168,76,0.05);
          animation:ringPulse 4s ease-in-out infinite;
        }
        .about-ring-2 {
          width:375px; height:375px;
          border:1px solid rgba(26,58,143,0.3);
          animation:ringPulse2 6.5s ease-in-out infinite;
        }
        .about-ring-3 {
          width:440px; height:440px;
          border:0.5px dashed rgba(201,168,76,0.12);
          animation:ringPulse 9s ease-in-out infinite reverse;
        }

        /* Spinning conic border on about logo */
        .about-logo-conic {
          position:absolute;
          width:295px; height:295px;
          border-radius:50%;
          z-index:1;
          pointer-events:none;
        }
        .about-logo-conic::before {
          content:'';
          position:absolute; inset:-2px; border-radius:50%;
          background: conic-gradient(
            from 0deg,
            transparent 0deg,
            rgba(201,168,76,0.8) 72deg,
            transparent 144deg,
            rgba(100,149,237,0.6) 216deg,
            transparent 288deg,
            rgba(201,168,76,0.4) 360deg
          );
          animation: conicSpin 6s linear infinite;
          mask: radial-gradient(farthest-side, transparent calc(100% - 3px), white calc(100% - 2px));
          -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 3px), white calc(100% - 2px));
        }

        .about-logo-img {
          width:270px; height:270px; object-fit:cover;
          position:relative; z-index:2;
          border-radius:50%;
          clip-path: circle(50% at 50% 50%);
          filter:
            drop-shadow(0 0 35px rgba(201,168,76,0.65))
            drop-shadow(0 0 70px rgba(26,58,143,0.5))
            drop-shadow(0 0 120px rgba(201,168,76,0.25));
          animation:floatAbout 7.5s ease-in-out infinite;
        }
        @keyframes floatAbout {
          0%,100%{ transform:translateY(0) rotate(0deg); }
          50%{ transform:translateY(-16px) rotate(3deg); }
        }
        @keyframes conicSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes ringPulse {
          0%,100%{ transform:scale(1); opacity:0.5; }
          50%{ transform:scale(1.06); opacity:1; }
        }
        @keyframes ringPulse2 {
          0%,100%{ transform:scale(1); opacity:0.3; }
          50%{ transform:scale(1.12); opacity:0.7; }
        }

        .stats-grid {
          display:grid; grid-template-columns:repeat(4,1fr); gap:1.5rem;
        }
        .stat-card { padding:2rem 1.5rem; text-align:center; position:relative; }
        .stat-card::after {
          content:'';
          position:absolute; bottom:0; left:10%; right:10%;
          height:1px;
          background:linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent);
          opacity:0; transition:opacity 0.3s;
        }
        .stat-card:hover::after { opacity:1; }
        .stat-icon {
          font-size:2rem; margin-bottom:0.75rem; display:block;
          filter:drop-shadow(0 0 8px rgba(201,168,76,0.4));
        }
        .stat-value {
          font-size:2.8rem; font-weight:900; letter-spacing:-0.03em;
          line-height:1; margin-bottom:0.4rem;
          background:linear-gradient(135deg, #fff 0%, var(--gold-light) 50%, var(--gold) 100%);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          background-clip:text;
        }
        .stat-label {
          font-size:0.7rem; color:var(--silver);
          letter-spacing:0.12em; text-transform:uppercase; font-weight:600;
        }
        .visit-btn {
          display:inline-flex; align-items:center; gap:0.6rem;
          padding:0.85rem 1.85rem;
          border:1.5px solid rgba(201,168,76,0.6); color:var(--gold);
          font-weight:700; font-size:0.78rem; letter-spacing:0.1em;
          border-radius:10px; text-transform:uppercase;
          transition:all 0.3s ease;
          position:relative; overflow:hidden;
          box-shadow: 0 4px 15px rgba(201,168,76,0.1);
        }
        .visit-btn::before {
          content:''; position:absolute; inset:0;
          background:linear-gradient(135deg, var(--gold), #f0c85a);
          transform:scaleX(0); transform-origin:left;
          transition:transform 0.35s ease; z-index:-1;
        }
        .visit-btn:hover {
          color:var(--navy);
          box-shadow:0 12px 35px rgba(201,168,76,0.4);
          transform:translateY(-3px);
        }
        .visit-btn:hover::before { transform:scaleX(1); }

        @media(max-width:900px){
          .about-grid{ grid-template-columns:1fr; gap:3rem; }
          .about-visual{ order:-1; }
          .stats-grid{ grid-template-columns:repeat(2,1fr); }
          .about-logo-img{ width:200px; height:200px; }
          .about-ring-1{ width:230px; height:230px; }
          .about-ring-2{ width:290px; height:290px; }
          .about-logo-conic{ width:220px; height:220px; }
        }
        @media(max-width:500px){
          .stats-grid{ grid-template-columns:1fr 1fr; }
        }
      `}</style>

      <div className="about-bg-glow" />
      <div className="section-wrapper">
        <div className="about-grid">
          <div className="about-text slide-in-left">
            <p className="section-label">Who We Are</p>
            <h2 className="section-heading">What is Key Club?</h2>

            <div className="about-text-card">
              <p className="about-desc">
                Key Club International is the <strong>oldest and largest</strong> service organization for high school students. Our student-led club teaches leadership through service, preparing members to become caring and capable leaders.
              </p>
            </div>

            <div className="about-text-card">
              <p className="about-desc" style={{ marginBottom: 0 }}>
                As part of the <strong>Texas-Oklahoma District</strong>, Fulshear Key Club carries on a century-long tradition of building character, developing leadership, and transforming communities — one act of service at a time.
              </p>
            </div>

            <a href="https://www.keyclub.org" target="_blank" rel="noopener noreferrer" className="visit-btn" style={{ marginTop: "1.5rem" }}>
              Visit keyclub.org ↗
            </a>
          </div>
        </div>

        <div className="stats-grid">
          {stats.map((s, i) => (
            <div key={s.label} className="stat-card glass-card fade-in" style={{ transitionDelay: `${i * 0.1}s` }}>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
