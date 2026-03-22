"use client";

import { useState, useEffect } from "react";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS_OF_WEEK = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

// Events keyed by "YYYY-M-D" (month is 0-based to match JS Date)
const allEvents: Record<string, { title: string; time: string; loc: string; type: string; desc: string }[]> = {
  "2026-2-4":  [{ title: "Divisional Council Meeting",  time: "5:00 PM – 6:30 PM",  loc: "Fulshear High School",              type: "Meeting",   desc: "Monthly council meeting with division officers and chapter representatives." }],
  "2026-2-7":  [{ title: "Key Club General Meeting",    time: "4:00 PM – 5:00 PM",  loc: "Fulshear High School · LGI Room",  type: "Meeting",   desc: "All-member general meeting — held the 1st Tuesday of every month. Attendance required for service hour credit." }],
  "2026-2-8":  [{ title: "Community Food Pantry",       time: "9:00 AM – 12:00 PM", loc: "5757 Flewellen Oaks Ln #303",      type: "Volunteer", desc: "Help sort and distribute groceries to families in need at the local food pantry." }],
  "2026-2-12": [{ title: "Park Clean-up",               time: "8:00 AM – 11:00 AM", loc: "Cross Creek Ranch",                type: "Service",   desc: "Community park beautification — bring gloves and wear closed-toe shoes." }],
  "2026-2-18": [{ title: "H-E-B Food Drive",            time: "10:00 AM – 2:00 PM", loc: "4950 FM 1463, Katy, TX",           type: "Service",   desc: "Stand outside H-E-B and collect non-perishable food donations for local families." }],
  "2026-2-23": [{ title: "Children's Book Reading",     time: "4:00 PM – 5:30 PM",  loc: "Fulshear Branch Library",          type: "Volunteer", desc: "Read to kids ages 4–8 at the library. Great for members who love working with children." }],
  "2026-2-25": [{ title: "Marathon Water Station",      time: "6:00 AM – 11:00 AM", loc: "Cinco Ranch Blvd",                 type: "Service",   desc: "Staff a water station along the route and cheer on runners at the community marathon." }],
  "2026-2-28": [{ title: "End of Month Social",         time: "6:00 PM – 8:00 PM",  loc: "Fulshear Town Square",             type: "Social",    desc: "Celebrate a great month with fellow members. Food, fun, and club bonding." }],

  "2026-3-4":  [{ title: "Divisional Council Meeting",  time: "5:00 PM – 6:30 PM",  loc: "Fulshear High School",              type: "Meeting",   desc: "Monthly council meeting with division officers and chapter representatives." }],
  "2026-3-7":  [{ title: "Key Club General Meeting",    time: "4:00 PM – 5:00 PM",  loc: "Fulshear High School · LGI Room",  type: "Meeting",   desc: "All-member general meeting — held the 1st Tuesday of every month. Attendance required for service hour credit." }],
  "2026-3-12": [{ title: "Park Clean-up",               time: "8:00 AM – 11:00 AM", loc: "Cross Creek Ranch",                type: "Service",   desc: "Community park beautification — bring gloves and wear closed-toe shoes." }],
  "2026-3-15": [{ title: "Bake Sale Fundraiser",        time: "7:30 AM – 3:00 PM",  loc: "Fulshear High School Lobby",       type: "Fundraiser",desc: "Annual bake sale to raise funds for district conference travel and club supplies." }],
  "2026-3-19": [{ title: "H-E-B Food Drive",            time: "10:00 AM – 2:00 PM", loc: "4950 FM 1463, Katy, TX",           type: "Service",   desc: "Stand outside H-E-B and collect non-perishable food donations for local families." }],
  "2026-3-22": [{ title: "Spring Clean the Creek",      time: "8:00 AM – 12:00 PM", loc: "Barker Reservoir Park",            type: "Service",   desc: "Join partners from Cross Creek Ranch HOA to remove trash and invasive plants along the waterway." }],
  "2026-3-28": [{ title: "Pediatric Hospital Visit",    time: "1:00 PM – 4:00 PM",  loc: "Texas Children's Hospital Katy",  type: "Volunteer", desc: "Bring crafts and spend time with pediatric patients. Background check required in advance." }],

  "2026-4-1":  [{ title: "Divisional Council Meeting",  time: "5:00 PM – 6:30 PM",  loc: "Fulshear High School",              type: "Meeting",   desc: "Monthly council meeting with division officers and chapter representatives." }],
  "2026-4-7":  [{ title: "Key Club General Meeting",    time: "4:00 PM – 5:00 PM",  loc: "Fulshear High School · LGI Room",  type: "Meeting",   desc: "All-member general meeting — held the 1st Tuesday of every month. Attendance required for service hour credit." }],
  "2026-4-11": [{ title: "Earth Day Park Cleanup",      time: "8:00 AM – 12:00 PM", loc: "Exploration Park, Fulshear",       type: "Service",   desc: "Celebrate Earth Day by removing litter and planting native wildflowers at Exploration Park." }],
  "2026-4-18": [{ title: "Blood Drive Volunteer",       time: "9:00 AM – 3:00 PM",  loc: "Fulshear High School Cafeteria",   type: "Volunteer", desc: "Volunteer at the school's annual blood drive — help with check-in, refreshments, and donor support." }],
  "2026-4-25": [{ title: "Senior Center Visit",         time: "2:00 PM – 5:00 PM",  loc: "Cinco Ranch Senior Living",        type: "Volunteer", desc: "Spend the afternoon with residents — play games, share stories, and bring homemade cards." }],
};

const typeColors: Record<string, string> = {
  Meeting:    "rgba(100,149,237,1)",
  Volunteer:  "rgba(201,168,76,1)",
  Service:    "rgba(80,200,120,1)",
  Social:     "rgba(200,100,200,1)",
  Fundraiser: "rgba(255,140,60,1)",
};
const typeBg: Record<string, string> = {
  Meeting:    "rgba(100,149,237,0.15)",
  Volunteer:  "rgba(201,168,76,0.12)",
  Service:    "rgba(80,200,120,0.12)",
  Social:     "rgba(200,100,200,0.12)",
  Fundraiser: "rgba(255,140,60,0.12)",
};

type EventItem = { title: string; time: string; loc: string; type: string; desc: string; day: number };

export default function CalendarPage() {
  const today = new Date();
  const [viewYear,  setViewYear]  = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth()); // 0-based
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  useEffect(() => {
    const els = document.querySelectorAll(".fade-in");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } }),
      { threshold: 0.05 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Navigate months
  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  };

  // Build calendar grid
  const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth  = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrev   = new Date(viewYear, viewMonth, 0).getDate();

  const gridDays: { date: number; current: boolean }[] = [];
  for (let i = firstWeekday - 1; i >= 0; i--)
    gridDays.push({ date: daysInPrev - i, current: false });
  for (let d = 1; d <= daysInMonth; d++)
    gridDays.push({ date: d, current: true });
  const trailing = (7 - (gridDays.length % 7)) % 7;
  for (let d = 1; d <= trailing; d++)
    gridDays.push({ date: d, current: false });

  // Events for viewed month
  const monthEvents: EventItem[] = Object.entries(allEvents)
    .filter(([key]) => {
      const [y, m] = key.split("-").map(Number);
      return y === viewYear && m === viewMonth;
    })
    .flatMap(([key, evs]) => {
      const day = Number(key.split("-")[2]);
      return evs.map(ev => ({ ...ev, day }));
    })
    .sort((a, b) => a.day - b.day);

  const eventsByDay: Record<number, EventItem[]> = {};
  monthEvents.forEach(ev => {
    if (!eventsByDay[ev.day]) eventsByDay[ev.day] = [];
    eventsByDay[ev.day].push(ev);
  });

  const isToday = (d: number) =>
    d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

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
        .cal-page-header p { color:var(--silver); font-size:0.95rem; max-width:480px; margin:0.75rem auto 0; line-height:1.7; }
        .cal-dashboard { display:grid; grid-template-columns:1fr 1fr; gap:2.5rem; align-items:start; }

        /* ── CALENDAR ── */
        .cal-shell {
          background:rgba(10,15,30,0.7); border-radius:20px;
          border:1px solid rgba(100,149,237,0.15);
          backdrop-filter:blur(24px); -webkit-backdrop-filter:blur(24px);
          padding:2.5rem; box-shadow:0 20px 50px rgba(0,0,0,0.5);
          position:sticky; top:6rem;
        }
        .cal-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem; }
        .cal-title-area { text-align:center; flex-grow:1; }
        .cal-subtitle { font-size:0.72rem; color:var(--gold); letter-spacing:0.15em; text-transform:uppercase; margin-bottom:0.2rem; font-weight:700; }
        .cal-title { font-size:1.75rem; font-weight:800; color:white; }
        .cal-events-count { font-size:0.78rem; color:var(--silver); margin-top:0.2rem; }
        .cal-nav-btn {
          background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08);
          color:var(--gold); font-size:1.3rem; cursor:pointer; padding:0.4rem 0.7rem;
          border-radius:8px; transition:all 0.2s; line-height:1;
        }
        .cal-nav-btn:hover { background:rgba(201,168,76,0.12); border-color:rgba(201,168,76,0.4); transform:scale(1.08); }
        .cal-grid { display:grid; grid-template-columns:repeat(7,1fr); gap:6px; }
        .cal-day-header { text-align:center; font-size:0.7rem; color:var(--silver); padding-bottom:0.6rem; font-weight:600; letter-spacing:0.05em; }
        .cal-day {
          background:rgba(255,255,255,0.02); border-radius:8px;
          padding:0.45rem 0.2rem; text-align:center;
          display:flex; flex-direction:column; align-items:center; justify-content:flex-start;
          border:1px solid rgba(255,255,255,0.04); transition:all 0.18s; min-height:58px;
        }
        .cal-day.has-event {
          cursor:pointer; background:rgba(26,58,143,0.12);
          border-color:rgba(100,149,237,0.25);
        }
        .cal-day.has-event:hover, .cal-day.has-event.selected {
          background:rgba(201,168,76,0.12); border-color:rgba(201,168,76,0.5);
          transform:translateY(-2px); box-shadow:0 6px 16px rgba(201,168,76,0.1);
        }
        .cal-day.is-today .cal-day-num {
          background:var(--gold); color:#000; border-radius:50%;
          width:26px; height:26px; display:flex; align-items:center; justify-content:center;
          font-size:0.85rem; margin:0 auto 0.25rem;
        }
        .cal-day.muted { opacity:0.2; pointer-events:none; border-color:transparent; background:transparent; }
        .cal-day-num { font-size:0.9rem; font-weight:700; color:white; margin-bottom:0.2rem; }
        .cal-day-dots { display:flex; gap:2px; justify-content:center; flex-wrap:wrap; padding:0 2px; }
        .cal-dot { width:5px; height:5px; border-radius:50%; flex-shrink:0; }

        /* ── EVENT LIST ── */
        .event-list-panel {
          background:rgba(10,15,30,0.7); border-radius:20px;
          border:1px solid rgba(100,149,237,0.15);
          backdrop-filter:blur(24px); -webkit-backdrop-filter:blur(24px);
          padding:2rem; box-shadow:0 20px 50px rgba(0,0,0,0.5);
          display:flex; flex-direction:column; gap:0.65rem;
        }
        .event-list-heading { font-size:0.72rem; font-weight:700; letter-spacing:0.18em; text-transform:uppercase; color:var(--gold); margin-bottom:0.25rem; }
        .event-list-empty { text-align:center; color:var(--silver); opacity:0.5; padding:3rem 1rem; font-size:0.9rem; }
        .event-list-item {
          display:flex; align-items:center; gap:0.9rem;
          padding:0.9rem 1.1rem; border-radius:12px;
          background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06);
          cursor:pointer; transition:all 0.2s;
        }
        .event-list-item:hover, .event-list-item.active {
          background:rgba(201,168,76,0.08); border-color:rgba(201,168,76,0.35);
          transform:translateX(4px);
        }
        .event-list-date { min-width:2.8rem; text-align:center; display:flex; flex-direction:column; align-items:center; }
        .event-list-day-num { font-size:1.45rem; font-weight:900; color:white; line-height:1; }
        .event-list-day-label { font-size:0.58rem; color:var(--gold); font-weight:700; letter-spacing:0.1em; text-transform:uppercase; }
        .event-list-divider { width:1px; height:36px; background:rgba(255,255,255,0.08); flex-shrink:0; }
        .event-list-info { flex-grow:1; min-width:0; }
        .event-list-title { font-size:0.88rem; font-weight:700; color:white; margin-bottom:0.15rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .event-list-meta { font-size:0.72rem; color:var(--silver); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .event-list-badge { font-size:0.6rem; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; padding:0.18rem 0.5rem; border-radius:999px; flex-shrink:0; border:1px solid; }
        .event-list-arrow { color:var(--silver); font-size:0.9rem; flex-shrink:0; opacity:0.45; }

        /* ── MODAL ── */
        .event-modal-overlay {
          position:fixed; inset:0; z-index:9990; background:rgba(0,0,0,0.82);
          display:flex; align-items:center; justify-content:center; padding:1.5rem;
          animation:lbFadeIn 0.2s ease;
        }
        @keyframes lbFadeIn { from{opacity:0} to{opacity:1} }
        .event-modal {
          background:rgba(10,15,35,0.97); border:1px solid rgba(201,168,76,0.25);
          border-radius:20px; width:100%; max-width:680px;
          box-shadow:0 40px 100px rgba(0,0,0,0.7), 0 0 60px rgba(201,168,76,0.07);
          overflow:hidden; animation:modalZoom 0.25s cubic-bezier(0.22,1,0.36,1);
          max-height:90vh; display:flex; flex-direction:column;
        }
        @keyframes modalZoom { from{transform:scale(0.92);opacity:0} to{transform:scale(1);opacity:1} }
        .event-modal-header {
          padding:1.75rem 2rem 1.25rem; border-bottom:1px solid rgba(255,255,255,0.06);
          display:flex; align-items:flex-start; justify-content:space-between; gap:1rem;
        }
        .event-modal-badge { display:inline-block; padding:0.25rem 0.8rem; border-radius:999px; font-size:0.7rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; margin-bottom:0.75rem; border:1px solid; }
        .event-modal-title { font-size:1.5rem; font-weight:900; color:white; line-height:1.2; }
        .modal-close-btn {
          background:rgba(255,255,255,0.06); border:none; color:rgba(255,255,255,0.6);
          font-size:1.2rem; width:34px; height:34px; border-radius:50%; cursor:pointer;
          display:flex; align-items:center; justify-content:center; transition:all 0.2s; flex-shrink:0;
        }
        .modal-close-btn:hover { background:rgba(201,168,76,0.15); color:var(--gold); }
        .event-modal-body { padding:1.5rem 2rem; overflow-y:auto; flex-grow:1; }
        .event-modal-detail { display:flex; align-items:flex-start; gap:0.75rem; margin-bottom:0.85rem; }
        .event-modal-detail-icon { color:var(--gold); font-size:1rem; flex-shrink:0; margin-top:0.1rem; }
        .event-modal-detail-label { font-size:0.68rem; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:var(--gold); margin-bottom:0.12rem; }
        .event-modal-detail-val { font-size:0.88rem; color:var(--silver); }
        .event-modal-desc { font-size:0.88rem; color:var(--silver); line-height:1.65; margin:1.25rem 0; padding:1.25rem; background:rgba(255,255,255,0.03); border-radius:10px; border:1px solid rgba(255,255,255,0.06); }
        .event-modal-map { margin-top:0.5rem; border-radius:12px; overflow:hidden; height:260px; border:1px solid rgba(255,255,255,0.08); background:#0a0f1e; }
        .event-modal-map iframe { width:100%; height:100%; border:0; display:block; }

        @media(max-width:900px){
          .cal-dashboard { grid-template-columns:1fr; }
          .cal-shell { position:static; }
        }
        @media(max-width:500px){
          .cal-grid { gap:3px; }
          .cal-day { min-height:46px; }
        }
      `}</style>

      <div className="calendar-page-bg" />
      <div className="cal-page-content">
        <div className="cal-page-header fade-in">
          <p className="section-label" style={{ justifyContent:"center" }}>Schedule</p>
          <h1 className="section-heading">Event Calendar</h1>
          <p>Tap a date or select an event below to see full details and directions.</p>
        </div>

        <div className="cal-dashboard">

          {/* LEFT: CALENDAR */}
          <div className="cal-shell fade-in">
            <div className="cal-header">
              <button className="cal-nav-btn" onClick={prevMonth} aria-label="Previous month">‹</button>
              <div className="cal-title-area">
                <div className="cal-subtitle">Key Club Events</div>
                <div className="cal-title">{MONTHS[viewMonth]} {viewYear}</div>
                <div className="cal-events-count">
                  {monthEvents.length > 0 ? `${monthEvents.length} event${monthEvents.length !== 1 ? "s" : ""} this month` : "No events scheduled"}
                </div>
              </div>
              <button className="cal-nav-btn" onClick={nextMonth} aria-label="Next month">›</button>
            </div>

            <div className="cal-grid">
              {DAYS_OF_WEEK.map(d => <div key={d} className="cal-day-header">{d}</div>)}
              {gridDays.map((day, i) => {
                const dayEvents = day.current ? (eventsByDay[day.date] ?? []) : [];
                const isSelected = selectedEvent?.day === day.date && day.current && dayEvents.some(e => e === selectedEvent);
                return (
                  <div
                    key={i}
                    className={`cal-day${!day.current ? " muted" : ""}${dayEvents.length > 0 ? " has-event" : ""}${isSelected ? " selected" : ""}${isToday(day.date) && day.current ? " is-today" : ""}`}
                    onClick={() => { if (day.current && dayEvents.length > 0) setSelectedEvent(dayEvents[0]); }}
                  >
                    <span className="cal-day-num">{day.date}</span>
                    {dayEvents.length > 0 && (
                      <div className="cal-day-dots">
                        {dayEvents.slice(0, 3).map((ev, j) => (
                          <span key={j} className="cal-dot" style={{ background: typeColors[ev.type] ?? "var(--gold)" }} />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: EVENT LIST */}
          <div className="event-list-panel fade-in" style={{ transitionDelay: "0.1s" }}>
            <div className="event-list-heading">{MONTHS[viewMonth]} {viewYear} — Upcoming Events</div>
            {monthEvents.length === 0 ? (
              <div className="event-list-empty">
                <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>📅</div>
                No events scheduled for {MONTHS[viewMonth]}.<br/>Use the arrows to browse other months.
              </div>
            ) : (
              monthEvents.map((ev, i) => {
                const color = typeColors[ev.type] ?? "var(--silver)";
                const bg    = typeBg[ev.type]    ?? "rgba(255,255,255,0.08)";
                return (
                  <div
                    key={i}
                    className={`event-list-item${selectedEvent === ev ? " active" : ""}`}
                    onClick={() => setSelectedEvent(ev)}
                  >
                    <div className="event-list-date">
                      <span className="event-list-day-num">{ev.day}</span>
                      <span className="event-list-day-label">{MONTHS[viewMonth].slice(0,3)}</span>
                    </div>
                    <div className="event-list-divider" />
                    <div className="event-list-info">
                      <div className="event-list-title">{ev.title}</div>
                      <div className="event-list-meta">⏱ {ev.time}</div>
                    </div>
                    <span className="event-list-badge" style={{ color, background: bg, borderColor: color }}>{ev.type}</span>
                    <span className="event-list-arrow">›</span>
                  </div>
                );
              })
            )}
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
                <span className="event-modal-detail-icon">📅</span>
                <div>
                  <div className="event-modal-detail-label">Date</div>
                  <div className="event-modal-detail-val">{MONTHS[viewMonth]} {selectedEvent.day}, {viewYear}</div>
                </div>
              </div>
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
              <div className="event-modal-desc">{selectedEvent.desc}</div>
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
