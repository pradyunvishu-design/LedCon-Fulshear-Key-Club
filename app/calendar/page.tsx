"use client";

import { useState, useEffect } from "react";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const eventsMap: Record<number, { title: string; time: string; loc: string; type: string; lat: number; lng: number; desc?: string }> = {
  4:  { title: "Divisional Council Meeting", time: "5:00 PM – 6:30 PM",  loc: "Fulshear High School",          type: "Meeting",   lat: 29.684, lng: -95.912, desc: "Monthly council meeting with division officers and chapter representatives." },
  8:  { title: "Community Food Pantry",       time: "9:00 AM – 12:00 PM", loc: "5757 Flewellen Oaks Ln #303",  type: "Volunteer", lat: 29.742, lng: -95.895, desc: "Help sort and distribute groceries to families in need at the local food pantry." },
  12: { title: "Park Clean-up",               time: "8:00 AM – 11:00 AM", loc: "Cross Creek Ranch",             type: "Service",   lat: 29.718, lng: -95.923, desc: "Community park beautification — bring gloves and wear closed-toe shoes." },
  7:  { title: "Key Club General Meeting",    time: "4:00 PM – 5:00 PM",  loc: "Fulshear High School · LGI Room", type: "Meeting",   lat: 29.684, lng: -95.912, desc: "All-member general meeting — held the 1st Tuesday of every month. Attendance required for service hour credit." },
  18: { title: "H-E-B Food Drive",            time: "10:00 AM – 2:00 PM", loc: "4950 FM 1463, Katy, TX",        type: "Service",   lat: 29.736, lng: -95.834, desc: "Stand outside H-E-B and collect non-perishable food donations for local families." },
  23: { title: "Children's Book Reading",     time: "4:00 PM – 5:30 PM",  loc: "Fulshear Branch Library",       type: "Volunteer", lat: 29.689, lng: -95.899, desc: "Read to kids ages 4–8 at the library. Great for members who love working with children." },
  25: { title: "Marathon Water Station",      time: "6:00 AM – 11:00 AM", loc: "Cinco Ranch Blvd",              type: "Service",   lat: 29.740, lng: -95.820, desc: "Staff a water station along the route and cheer on runners at the community marathon." },
  31: { title: "End of Month Social",         time: "6:00 PM – 8:00 PM",  loc: "Fulshear Town Square",          type: "Social",    lat: 29.688, lng: -95.898, desc: "Celebrate a great month with fellow members. Food, fun, and club bonding." },
};

const calendarDays = [
  ...Array.from({ length: 3 }, (_, i) => ({ date: 29 + i, currentMonth: false })),
  ...Array.from({ length: 31 }, (_, i) => ({ date: i + 1, currentMonth: true })),
  ...Array.from({ length: 1 }, (_, i) => ({ date: i + 1, currentMonth: false })),
];

const typeColors: Record<string, string> = {
  Meeting:   "rgba(100,149,237,1)",
  Volunteer: "rgba(201,168,76,1)",
  Service:   "rgba(80,200,120,1)",
  Social:    "rgba(200,100,200,1)",
};

const typeBg: Record<string, string> = {
  Meeting:   "rgba(100,149,237,0.15)",
  Volunteer: "rgba(201,168,76,0.12)",
  Service:   "rgba(80,200,120,0.12)",
  Social:    "rgba(200,100,200,0.12)",
};

type Event = typeof eventsMap[number];

export default function CalendarPage() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    const els = document.querySelectorAll(".fade-in");
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); observer.unobserve(e.target); } }),
      { threshold: 0.05 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const eventList = Object.entries(eventsMap)
    .map(([day, ev]) => ({ day: Number(day), ...ev }))
    .sort((a, b) => a.day - b.day);

  const handleDayClick = (day: { date: number; currentMonth: boolean }) => {
    if (day.currentMonth && eventsMap[day.date]) {
      setSelectedEvent(eventsMap[day.date]);
    }
  };

  return (
    <main style={{ minHeight: "100vh", position: "relative", display: "flex", flexDirection: "column", paddingTop: "8rem", paddingBottom: "4rem" }}>
      <style>{`
        .calendar-page-bg {
          position:absolute; inset:0; pointer-events:none; z-index:0;
          background:
            radial-gradient(circle at 10% 20%, rgba(26,58,143,0.1) 0%, transparent 60%),
            radial-gradient(circle at 90% 80%, rgba(201,168,76,0.06) 0%, transparent 50%);
        }
        .cal-page-content {
          position:relative; z-index:2;
          max-width:1400px; width:100%; margin:0 auto; padding:0 1.5rem;
          flex-grow:1; display:flex; flex-direction:column;
        }
        .cal-page-header { text-align:center; margin-bottom:3rem; }
        .cal-page-header p { color:var(--silver); font-size:0.95rem; max-width:480px; margin:0 auto; line-height:1.7; }

        .cal-dashboard {
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:2.5rem;
          align-items:start;
        }

        /* ── CALENDAR ── */
        .cal-shell {
          background:rgba(10,15,30,0.7);
          border-radius:20px;
          border:1px solid rgba(100,149,237,0.15);
          backdrop-filter:blur(24px); -webkit-backdrop-filter:blur(24px);
          padding:2.5rem;
          box-shadow:0 20px 50px rgba(0,0,0,0.5);
          position:sticky; top:6rem;
        }
        .cal-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem; }
        .cal-title-area { text-align:center; flex-grow:1; }
        .cal-subtitle { font-size:0.75rem; color:var(--gold); letter-spacing:0.15em; text-transform:uppercase; margin-bottom:0.2rem; font-weight:700; }
        .cal-title { font-size:1.8rem; font-weight:800; color:white; }
        .cal-events-count { font-size:0.8rem; color:var(--silver); margin-top:0.15rem; }
        .cal-nav-btn { background:transparent; border:none; color:var(--gold); font-size:1.5rem; cursor:pointer; padding:0.5rem; transition:transform 0.2s; }
        .cal-nav-btn:hover { transform:scale(1.1); }

        .cal-grid {
          display:grid;
          grid-template-columns:repeat(7,1fr);
          gap:8px;
        }
        .cal-day-header { text-align:center; font-size:0.75rem; color:var(--silver); padding-bottom:0.75rem; font-weight:600; letter-spacing:0.05em; }
        .cal-day {
          background:rgba(255,255,255,0.03);
          border-radius:10px;
          padding:0.6rem 0.3rem;
          text-align:center;
          display:flex; flex-direction:column; align-items:center; justify-content:center;
          border:1px solid rgba(255,255,255,0.05);
          transition:all 0.2s;
          min-height:64px;
        }
        .cal-day.interactive {
          cursor:pointer;
          background:rgba(26,58,143,0.15);
          border-color:rgba(100,149,237,0.3);
        }
        .cal-day.interactive:hover, .cal-day.interactive.selected {
          background:rgba(201,168,76,0.15); border-color:rgba(201,168,76,0.5);
          transform:translateY(-2px); box-shadow:0 8px 16px rgba(201,168,76,0.1);
        }
        .cal-day.muted { opacity:0.25; pointer-events:none; border-color:transparent; }
        .cal-day-num { font-size:1.1rem; font-weight:700; color:white; margin-bottom:0.3rem; }
        .cal-day-dot { width:6px; height:6px; background:var(--gold); border-radius:50%; box-shadow:0 0 6px var(--gold); }

        /* ── EVENT LIST ── */
        .event-list-panel {
          background:rgba(10,15,30,0.7);
          border-radius:20px;
          border:1px solid rgba(100,149,237,0.15);
          backdrop-filter:blur(24px); -webkit-backdrop-filter:blur(24px);
          padding:2rem;
          box-shadow:0 20px 50px rgba(0,0,0,0.5);
          display:flex; flex-direction:column; gap:0.75rem;
        }
        .event-list-heading {
          font-size:0.75rem; font-weight:700; letter-spacing:0.18em; text-transform:uppercase;
          color:var(--gold); margin-bottom:0.5rem;
        }
        .event-list-item {
          display:flex; align-items:center; gap:1rem;
          padding:1rem 1.25rem;
          border-radius:12px;
          background:rgba(255,255,255,0.03);
          border:1px solid rgba(255,255,255,0.06);
          cursor:pointer;
          transition:all 0.2s;
        }
        .event-list-item:hover, .event-list-item.active {
          background:rgba(201,168,76,0.08);
          border-color:rgba(201,168,76,0.35);
          transform:translateX(4px);
        }
        .event-list-date {
          min-width:3.2rem; text-align:center;
          display:flex; flex-direction:column; align-items:center;
          gap:0.1rem;
        }
        .event-list-day-num { font-size:1.6rem; font-weight:900; color:white; line-height:1; }
        .event-list-day-label { font-size:0.62rem; color:var(--gold); font-weight:700; letter-spacing:0.1em; text-transform:uppercase; }
        .event-list-divider { width:1px; height:40px; background:rgba(255,255,255,0.08); flex-shrink:0; }
        .event-list-info { flex-grow:1; min-width:0; }
        .event-list-title { font-size:0.92rem; font-weight:700; color:white; margin-bottom:0.2rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .event-list-meta { font-size:0.75rem; color:var(--silver); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .event-list-badge {
          font-size:0.62rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase;
          padding:0.2rem 0.55rem; border-radius:999px; flex-shrink:0;
          border:1px solid;
        }
        .event-list-arrow { color:var(--silver); font-size:1rem; flex-shrink:0; opacity:0.5; }

        /* ── MODAL OVERLAY ── */
        .event-modal-overlay {
          position:fixed; inset:0; z-index:9990;
          background:rgba(0,0,0,0.82);
          display:flex; align-items:center; justify-content:center;
          padding:1.5rem;
          animation:lbFadeIn 0.2s ease;
        }
        @keyframes lbFadeIn { from{opacity:0} to{opacity:1} }
        .event-modal {
          background:rgba(10,15,35,0.97);
          border:1px solid rgba(201,168,76,0.25);
          border-radius:20px;
          width:100%; max-width:680px;
          box-shadow:0 40px 100px rgba(0,0,0,0.7), 0 0 60px rgba(201,168,76,0.07);
          overflow:hidden;
          animation:modalZoom 0.25s cubic-bezier(0.22,1,0.36,1);
          max-height:90vh; display:flex; flex-direction:column;
        }
        @keyframes modalZoom { from{transform:scale(0.92);opacity:0} to{transform:scale(1);opacity:1} }
        .event-modal-header {
          padding:1.75rem 2rem 1.25rem;
          border-bottom:1px solid rgba(255,255,255,0.06);
          display:flex; align-items:flex-start; justify-content:space-between; gap:1rem;
        }
        .event-modal-badge {
          display:inline-block; padding:0.25rem 0.8rem; border-radius:999px;
          font-size:0.7rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase;
          margin-bottom:0.75rem; border:1px solid;
        }
        .event-modal-title { font-size:1.6rem; font-weight:900; color:white; line-height:1.2; }
        .modal-close-btn {
          background:rgba(255,255,255,0.06); border:none; color:rgba(255,255,255,0.6);
          font-size:1.3rem; width:36px; height:36px; border-radius:50%; cursor:pointer;
          display:flex; align-items:center; justify-content:center;
          transition:all 0.2s; flex-shrink:0;
        }
        .modal-close-btn:hover { background:rgba(201,168,76,0.15); color:var(--gold); }
        .event-modal-body { padding:1.5rem 2rem; overflow-y:auto; flex-grow:1; }
        .event-modal-detail { display:flex; align-items:flex-start; gap:0.75rem; margin-bottom:0.85rem; }
        .event-modal-detail-icon { color:var(--gold); font-size:1rem; flex-shrink:0; margin-top:0.1rem; }
        .event-modal-detail-label { font-size:0.7rem; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:var(--gold); margin-bottom:0.15rem; }
        .event-modal-detail-val { font-size:0.9rem; color:var(--silver); }
        .event-modal-desc { font-size:0.9rem; color:var(--silver); line-height:1.65; margin:1.25rem 0; padding:1.25rem; background:rgba(255,255,255,0.03); border-radius:10px; border:1px solid rgba(255,255,255,0.06); }
        .event-modal-map {
          margin-top:0.5rem; border-radius:12px; overflow:hidden;
          height:260px; border:1px solid rgba(255,255,255,0.08);
          background:#0a0f1e;
        }
        .event-modal-map iframe { width:100%; height:100%; border:0; display:block; }

        @media(max-width:900px){
          .cal-dashboard { grid-template-columns:1fr; }
          .cal-shell { position:static; }
        }
        @media(max-width:500px){
          .cal-grid { gap:4px; }
          .cal-day { min-height:52px; }
        }
      `}</style>

      <div className="calendar-page-bg" />

      <div className="cal-page-content">
        <div className="cal-page-header fade-in">
          <p className="section-label" style={{ justifyContent: "center" }}>Schedule</p>
          <h1 className="section-heading">Event Calendar</h1>
          <p>Tap a date or select an event to see full details and directions.</p>
        </div>

        <div className="cal-dashboard">

          {/* LEFT: CALENDAR */}
          <div className="cal-shell fade-in">
            <div className="cal-header">
              <button className="cal-nav-btn">‹</button>
              <div className="cal-title-area">
                <div className="cal-subtitle">Key Club Events</div>
                <div className="cal-title">January 2026</div>
                <div className="cal-events-count">{Object.keys(eventsMap).length} upcoming events</div>
              </div>
              <button className="cal-nav-btn">›</button>
            </div>
            <div className="cal-grid">
              {daysOfWeek.map(d => <div key={d} className="cal-day-header">{d}</div>)}
              {calendarDays.map((day, i) => {
                const hasEvent = day.currentMonth && eventsMap[day.date];
                const isSelected = selectedEvent && selectedEvent === eventsMap[day.date];
                return (
                  <div
                    key={i}
                    className={`cal-day${!day.currentMonth ? " muted" : ""}${hasEvent ? " interactive" : ""}${isSelected ? " selected" : ""}`}
                    onClick={() => handleDayClick(day)}
                  >
                    <span className="cal-day-num">{day.date}</span>
                    {hasEvent && <span className="cal-day-dot" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: EVENT LIST */}
          <div className="event-list-panel fade-in" style={{ transitionDelay: "0.1s" }}>
            <div className="event-list-heading">Upcoming Events</div>
            {eventList.map((ev) => {
              const color  = typeColors[ev.type] ?? "var(--silver)";
              const bg     = typeBg[ev.type]     ?? "rgba(255,255,255,0.08)";
              const isActive = selectedEvent === eventsMap[ev.day];
              return (
                <div
                  key={ev.day}
                  className={`event-list-item${isActive ? " active" : ""}`}
                  onClick={() => setSelectedEvent(eventsMap[ev.day])}
                >
                  <div className="event-list-date">
                    <span className="event-list-day-num">{ev.day}</span>
                    <span className="event-list-day-label">Jan</span>
                  </div>
                  <div className="event-list-divider" />
                  <div className="event-list-info">
                    <div className="event-list-title">{ev.title}</div>
                    <div className="event-list-meta">⏱ {ev.time}</div>
                  </div>
                  <span
                    className="event-list-badge"
                    style={{ color, background: bg, borderColor: color }}
                  >{ev.type}</span>
                  <span className="event-list-arrow">›</span>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* MODAL */}
      {selectedEvent && (
        <div className="event-modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="event-modal" onClick={(e) => e.stopPropagation()}>
            <div className="event-modal-header">
              <div>
                <span
                  className="event-modal-badge"
                  style={{
                    color: typeColors[selectedEvent.type] ?? "var(--silver)",
                    background: typeBg[selectedEvent.type] ?? "rgba(255,255,255,0.08)",
                    borderColor: typeColors[selectedEvent.type] ?? "var(--silver)",
                  }}
                >{selectedEvent.type}</span>
                <h2 className="event-modal-title">{selectedEvent.title}</h2>
              </div>
              <button className="modal-close-btn" onClick={() => setSelectedEvent(null)}>✕</button>
            </div>
            <div className="event-modal-body">
              <div className="event-modal-detail">
                <span className="event-modal-detail-icon">⏱</span>
                <div>
                  <div className="event-modal-detail-label">Time</div>
                  <div className="event-modal-detail-val">{selectedEvent.time}</div>
                </div>
              </div>
              <div className="event-modal-detail">
                <span className="event-modal-detail-icon">📍</span>
                <div>
                  <div className="event-modal-detail-label">Location</div>
                  <div className="event-modal-detail-val">{selectedEvent.loc}</div>
                </div>
              </div>
              {selectedEvent.desc && (
                <div className="event-modal-desc">{selectedEvent.desc}</div>
              )}
              <div className="event-modal-map">
                <iframe
                  loading="lazy"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedEvent.loc)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
