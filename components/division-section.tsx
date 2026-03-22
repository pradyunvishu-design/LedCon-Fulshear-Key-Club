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
            <div className="division-card-title">🏫 Division</div>
            {[
              ["School", "Fulshear High School"],
              ["Mascot", "Home of the Chargers"],
              ["Division", "[ Division # ]"],
              ["LTG Contact", "ltg@tokeyclub.com"],
              ["District Governor", "Hannah Nguyen"],
            ].map(([k, v]) => (
              <div key={k} className="division-row">
                <span className="div-key">{k}</span>
                <span className="div-val">{v}</span>
              </div>
            ))}
          </div>
          <div className="division-card glass-card fade-in">
            <div className="division-card-title">🌐 Sponsor</div>
            {[
              ["District", "Texas-Oklahoma District"],
              ["Website", "tokeyclub.com"],
              ["Parent Org", "Kiwanis International"],
              ["Int'l Website", "keyclub.org"],
              ["Founded", "1925"],
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
