"use client";

export default function DivisionSection() {
  return (
    <section id="division" style={{ padding: "8rem 0", background: "rgba(10,22,40,0.5)" }}>
      <style>{`
        .division-header { text-align: center; margin-bottom: 4rem; }
        .division-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }
        .division-card { padding: 2.5rem; }
        .division-school-logo {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1.25rem;
          border-bottom: 1px solid rgba(201,168,76,0.15);
        }
        .division-school-logo img {
          width: 64px;
          height: 64px;
          object-fit: contain;
          filter: drop-shadow(0 0 10px rgba(88,44,131,0.6));
        }
        .division-school-logo-text {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }
        .division-school-logo-name {
          font-size: 0.9rem;
          font-weight: 800;
          color: var(--white);
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .division-school-logo-sub {
          font-size: 0.7rem;
          color: #a57fd6;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-weight: 600;
        }
        .division-card-title {
          font-size: 0.72rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--gold);
          font-weight: 600;
          margin-bottom: 1.25rem;
        }
        .division-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 0.75rem 0;
          border-bottom: 1px solid rgba(201,168,76,0.1);
          gap: 1rem;
        }
        .division-row:last-child { border-bottom: none; }
        .div-key {
          font-size: 0.75rem;
          color: var(--silver);
          letter-spacing: 0.05em;
          text-transform: uppercase;
          font-weight: 500;
          flex-shrink: 0;
        }
        .div-val {
          font-size: 0.875rem;
          color: var(--white);
          font-weight: 600;
          text-align: right;
        }
        @media (max-width: 700px) {
          .division-grid { grid-template-columns: 1fr; }
        }
      `}</style>
      <div className="section-wrapper">
        <div className="division-header fade-in">
          <p className="section-label">District Info</p>
          <h2 className="section-heading">Division & District</h2>
        </div>
        <div className="division-grid">
          <div className="division-card glass-card fade-in">
            <div className="division-card-title">Division</div>
            <div className="division-school-logo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://files.smartsites.parentsquare.com/5633/header_logo_img_if7fgb.png"
                alt="Fulshear High School Chargers"
              />
              <div className="division-school-logo-text">
                <span className="division-school-logo-name">Fulshear High School</span>
                <span className="division-school-logo-sub">Home of the Chargers · Est. 2016</span>
              </div>
            </div>
            {[
              ["Division",          "Division 3S — T-O District"],
              ["Lt. Governor",      "Meenakshiaayathi Chintalapally"],
              ["LTG Email",         "ltg3s@tokeyclub.com"],
              ["District Governor", "Hannah Nguyen"],
              ["Address",           "9302 Charger Way, Fulshear TX"],
              ["Phone",             "(832) 223-5000"],
            ].map(([k, v]) => (
              <div key={k} className="division-row">
                <span className="div-key">{k}</span>
                <span className="div-val">{v}</span>
              </div>
            ))}
          </div>
          <div className="division-card glass-card fade-in">
            <div className="division-card-title">Sponsor</div>
            {[
              ["Sponsoring Org",   "Texas-Oklahoma District"],
              ["Sponsor Contact",  "tokeyclub.com"],
              ["Sponsor Email",    "district@tokeyclub.com"],
              ["Parent Org",       "Kiwanis International"],
              ["Int'l Website",    "keyclub.org"],
              ["Founded",          "1925"],
            ].map(([k, v]) => (
              <div key={k} className="division-row">
                <span className="div-key">{k}</span>
                <span className="div-val">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
