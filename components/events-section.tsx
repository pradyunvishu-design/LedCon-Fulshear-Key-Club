"use client";

const events = [
  {
    date: "Apr 05",
    title: "Divisional Council Meeting",
    desc: "Monthly division gathering. Officers are required to attend.",
    tag: "Officers Required",
    tagColor: "var(--gold)",
    tagGlow: "rgba(201,168,76,0.25)",
  },
  {
    date: "Apr 12",
    title: "Community Food Drive",
    desc: "Fulshear Community Center. Please bring non-perishable food items.",
    tag: "Volunteer",
    tagColor: "#4a9eff",
    tagGlow: "rgba(74,158,255,0.25)",
  },
  {
    date: "Apr 22",
    title: "Earth Day Park Cleanup",
    desc: "Local parks throughout Fulshear. Gloves and bags provided.",
    tag: "Service",
    tagColor: "#4ecb71",
    tagGlow: "rgba(78,203,113,0.25)",
  },
];

export default function EventsSection() {
  return (
    <section id="events" style={{ padding: "8rem 0", position: "relative", overflow: "hidden" }}>
      <style>{`
        .events-bg {
          position:absolute; inset:0; pointer-events:none;
          background:
            radial-gradient(ellipse 60% 60% at 30% 50%, rgba(26,58,143,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 40% 50% at 80% 30%, rgba(201,168,76,0.07) 0%, transparent 50%);
        }
        .events-header { text-align: center; margin-bottom: 4rem; }
        .events-list { display: flex; flex-direction: column; gap: 1.25rem; max-width: 820px; margin: 0 auto; }
        .event-card {
          display: grid;
          grid-template-columns: 90px 1fr auto;
          gap: 1.75rem;
          align-items: center;
          padding: 1.85rem 2rem;
          position:relative; overflow:hidden;
          transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .event-card::before {
          content:'';
          position:absolute; top:0; left:0; bottom:0;
          width:3px;
          background:linear-gradient(to bottom, var(--ec-color, var(--gold)), transparent);
          opacity:0.7;
        }
        .event-card::after {
          content:'';
          position:absolute; inset:0;
          background: linear-gradient(90deg, var(--ec-glow, rgba(201,168,76,0.06)) 0%, transparent 30%);
          opacity:0; transition:opacity 0.35s; pointer-events:none;
        }
        .event-card:hover::after { opacity:1; }
        .event-card:hover {
          transform: translateX(6px);
          box-shadow: 0 20px 50px rgba(0,0,0,0.4), -4px 0 30px var(--ec-glow, rgba(201,168,76,0.15));
        }
        .event-date-block {
          text-align: center;
          background: linear-gradient(135deg, rgba(26,58,143,0.2), rgba(8,21,48,0.6));
          border:1px solid rgba(201,168,76,0.15);
          border-radius:12px;
          padding:0.75rem 0.5rem;
        }
        .event-date .month { font-size: 0.6rem; letter-spacing:0.12em; opacity: 0.7; text-transform:uppercase; color:var(--silver); }
        .event-date .day { font-size: 1.9rem; font-weight: 900; line-height: 1.1; color:var(--gold); }
        .event-icon { font-size:1.2rem; display:block; margin-top:0.25rem; }
        .event-title {
          font-size: 1.05rem; font-weight: 800;
          color: var(--white); margin-bottom: 0.35rem; letter-spacing:-0.01em;
        }
        .event-desc { font-size: 0.875rem; color: var(--silver); line-height:1.6; }
        .event-tag {
          font-size: 0.62rem; font-weight: 800; letter-spacing: 0.14em;
          text-transform: uppercase; padding: 0.4rem 0.85rem;
          border-radius: 20px; border: 1.5px solid; white-space: nowrap;
          box-shadow: 0 0 15px var(--ec-glow, rgba(201,168,76,0.15));
        }
        @media (max-width: 600px) {
          .event-card { grid-template-columns: 75px 1fr; }
          .event-tag { display: none; }
        }
      `}</style>
      <div className="events-bg" />
      <div className="section-wrapper">
        <div className="events-header fade-in">
          <p className="section-label">Stay Updated</p>
          <h2 className="section-heading">Upcoming Events</h2>
        </div>
        <div className="events-list">
          {events.map((ev) => {
            const [month, day] = ev.date.split(" ");
            return (
              <div
                key={ev.title}
                className="event-card glass-card fade-in"
                style={{ "--ec-color": ev.tagColor, "--ec-glow": ev.tagGlow } as React.CSSProperties}
              >
                <div className="event-date-block">
                  <div className="event-date">
                    <div className="month">{month}</div>
                    <div className="day">{day}</div>
                  </div>
                </div>
                <div>
                  <div className="event-title">{ev.title}</div>
                  <div className="event-desc">{ev.desc}</div>
                </div>
                <div className="event-tag" style={{ color: ev.tagColor, borderColor: ev.tagColor }}>
                  {ev.tag}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
