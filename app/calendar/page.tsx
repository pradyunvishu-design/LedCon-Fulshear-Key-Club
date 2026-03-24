"use client";

import React, { useState, useEffect } from "react";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

// Keys use 1-indexed months to match JS Date month parsing in filters below.
// General Meetings moved from "every other Wednesday" → 1st Tuesday each month at 4:00 PM.
// Divisional Council also consolidated to 1st Tuesday (stacked same day, different time).
const allEvents: Record<string, { title: string; time: string; loc: string; type: string; desc: string }[]> = {
  // Feb 3 = 1st Tuesday of February 2026
  "2026-2-3":  [
    { title: "Key Club General Meeting",   time: "4:00 PM – 5:00 PM",  loc: "Fulshear High School · LGI Room", type: "Meeting",   desc: "Monthly general meeting — 1st Tuesday of each month at 4:00 PM. Attendance required for service hour credit." },
    { title: "Divisional Council Meeting", time: "5:30 PM – 7:00 PM",  loc: "Fulshear High School",             type: "Meeting",   desc: "Monthly council meeting with division officers and chapter representatives." },
  ],
  "2026-2-8":  [{ title: "Community Food Pantry",   time: "9:00 AM – 12:00 PM", loc: "5757 Flewellen Oaks Ln #303",     type: "Volunteer",  desc: "Help sort and distribute groceries to families in need at the local food pantry." }],
  "2026-2-12": [{ title: "Park Clean-up",            time: "8:00 AM – 11:00 AM", loc: "Cross Creek Ranch",               type: "Service",    desc: "Community park beautification — bring gloves and wear closed-toe shoes." }],
  "2026-2-18": [{ title: "H-E-B Food Drive",         time: "10:00 AM – 2:00 PM", loc: "4950 FM 1463, Katy, TX",          type: "Service",    desc: "Stand outside H-E-B and collect non-perishable food donations for local families." }],
  "2026-2-23": [{ title: "Children's Book Reading",  time: "4:00 PM – 5:30 PM",  loc: "Fulshear Branch Library",         type: "Volunteer",  desc: "Read to kids ages 4–8 at the library. Great for members who love working with children." }],
  "2026-2-28": [{ title: "End of Month Social",      time: "6:00 PM – 8:00 PM",  loc: "Fulshear Town Square",            type: "Social",     desc: "Celebrate a great month with fellow members. Food, fun, and club bonding." }],

  // Mar 3 = 1st Tuesday of March 2026
  "2026-3-3":  [
    { title: "Key Club General Meeting",   time: "4:00 PM – 5:00 PM",  loc: "Fulshear High School · LGI Room", type: "Meeting",   desc: "Monthly general meeting — 1st Tuesday of each month at 4:00 PM. Attendance required for service hour credit." },
    { title: "Divisional Council Meeting", time: "5:30 PM – 7:00 PM",  loc: "Fulshear High School",             type: "Meeting",   desc: "Monthly council meeting with division officers and chapter representatives." },
  ],
  "2026-3-12": [{ title: "Park Clean-up",            time: "8:00 AM – 11:00 AM", loc: "Cross Creek Ranch",               type: "Service",    desc: "Community park beautification — bring gloves and wear closed-toe shoes." }],
  "2026-3-15": [{ title: "Bake Sale Fundraiser",     time: "7:30 AM – 3:00 PM",  loc: "Fulshear High School Lobby",      type: "Fundraiser", desc: "Annual bake sale to raise funds for district conference travel and club supplies." }],
  "2026-3-19": [{ title: "H-E-B Food Drive",         time: "10:00 AM – 2:00 PM", loc: "4950 FM 1463, Katy, TX",          type: "Service",    desc: "Stand outside H-E-B and collect non-perishable food donations for local families." }],
  "2026-3-28": [{ title: "Pediatric Hospital Visit", time: "1:00 PM – 4:00 PM",  loc: "Texas Children's Hospital Katy",  type: "Volunteer",  desc: "Bring crafts and spend time with pediatric patients. Background check required in advance." }],

  // Apr 7 = 1st Tuesday of April 2026 (Apr 1 is Wednesday, so 1st Tue is Apr 7)
  "2026-4-7":  [
    { title: "Key Club General Meeting",   time: "4:00 PM – 5:00 PM",  loc: "Fulshear High School · LGI Room", type: "Meeting",   desc: "Monthly general meeting — 1st Tuesday of each month at 4:00 PM. Attendance required for service hour credit." },
    { title: "Divisional Council Meeting", time: "5:30 PM – 7:00 PM",  loc: "Fulshear High School",             type: "Meeting",   desc: "Monthly council meeting with division officers and chapter representatives." },
  ],
  "2026-4-11": [{ title: "Earth Day Park Cleanup",   time: "8:00 AM – 12:00 PM", loc: "Exploration Park, Fulshear",      type: "Service",    desc: "Celebrate Earth Day by removing litter and planting native wildflowers at Exploration Park." }],
  "2026-4-18": [{ title: "Blood Drive Volunteer",    time: "9:00 AM – 3:00 PM",  loc: "Fulshear High School Cafeteria",  type: "Volunteer",  desc: "Volunteer at the school's annual blood drive — help with check-in, refreshments, and donor support." }],
  "2026-4-25": [{ title: "Senior Center Visit",      time: "2:00 PM – 5:00 PM",  loc: "Cinco Ranch Senior Living",       type: "Volunteer",  desc: "Spend the afternoon with residents — play games, share stories, and bring homemade cards." }],
};

const TYPE_COLOR: Record<string, string> = {
  Meeting:    "#6495ed",
  Volunteer:  "#c9a84c",
  Service:    "#50c878",
  Social:     "#c864c8",
  Fundraiser: "#ff8c3c",
};
const TYPE_BG: Record<string, string> = {
  Meeting:    "rgba(100,149,237,0.14)",
  Volunteer:  "rgba(201,168,76,0.13)",
  Service:    "rgba(80,200,120,0.13)",
  Social:     "rgba(200,100,200,0.13)",
  Fundraiser: "rgba(255,140,60,0.13)",
};

type EventItem = { title: string; time: string; loc: string; type: string; desc: string; day: number };

export default function CalendarPage() {
  const today = new Date();
  const [viewYear,  setViewYear]  = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selected,  setSelected]  = useState<EventItem | null>(null);
  const [view,      setView]      = useState<"month" | "list">("month");

  useEffect(() => {
    const els = document.querySelectorAll(".fade-in");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } }),
      { threshold: 0.04 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const prevMonth = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear((y: number) => y - 1); } else setViewMonth((m: number) => m - 1); };
  const nextMonth = () => { if (viewMonth === 11) { setViewMonth(0);  setViewYear((y: number) => y + 1); } else setViewMonth((m: number) => m + 1); };
  const jumpToday = () => { setViewYear(today.getFullYear()); setViewMonth(today.getMonth()); };

  const firstWD    = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMo   = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrev = new Date(viewYear, viewMonth, 0).getDate();
  const gridDays: { date: number; current: boolean }[] = [];
  for (let i = firstWD - 1; i >= 0; i--) gridDays.push({ date: daysInPrev - i, current: false });
  for (let d = 1; d <= daysInMo; d++)   gridDays.push({ date: d, current: true });
  const trail = (7 - (gridDays.length % 7)) % 7;
  for (let d = 1; d <= trail; d++) gridDays.push({ date: d, current: false });

  // Keys use 1-indexed months; viewMonth is 0-indexed (JS Date) — add 1 to match
  const monthEvents: EventItem[] = Object.entries(allEvents)
    .filter(([k]) => { const [y,m] = k.split("-").map(Number); return y === viewYear && m === viewMonth + 1; })
    .flatMap(([k, evs]) => { const day = Number(k.split("-")[2]); return evs.map(ev => ({ ...ev, day })); })
    .sort((a, b) => a.day - b.day);

  const byDay: Record<number, EventItem[]> = {};
  monthEvents.forEach(ev => { (byDay[ev.day] ??= []).push(ev); });

  const isToday = (d: number) => d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

  return (
    <main style={{ minHeight: "100vh", paddingTop: "7rem", paddingBottom: "5rem", position: "relative" }}>
      <style>{`
        .cal-bg {
          position:fixed; inset:0; pointer-events:none; z-index:0;
          background:
            radial-gradient(ellipse 60% 50% at 15% 25%, rgba(26,58,143,0.09) 0%, transparent 65%),
            radial-gradient(ellipse 50% 40% at 85% 75%, rgba(100,40,200,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 40% 35% at 75% 15%, rgba(201,168,76,0.04) 0%, transparent 55%);
        }
        .cal-wrap { position:relative; z-index:2; max-width:1380px; margin:0 auto; padding:0 1.5rem; }

        /* ── HEADER ── */
        .cal-head { text-align:center; margin-bottom:3.5rem; }
        .cal-head p { color:var(--silver); font-size:0.95rem; max-width:500px; margin:0.75rem auto 0; line-height:1.7; }

        /* ── VIEW TOGGLE ── */
        .cal-toggle {
          display:inline-flex; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08);
          border-radius:10px; overflow:hidden; margin:0 auto 2.5rem; display:flex; width:fit-content;
        }
        .cal-toggle-btn {
          padding:0.5rem 1.4rem; font-size:0.75rem; font-weight:700; letter-spacing:0.1em;
          text-transform:uppercase; border:none; cursor:pointer; transition:all 0.22s; background:transparent; color:var(--silver);
        }
        .cal-toggle-btn.active { background:rgba(201,168,76,0.15); color:var(--gold); }

        /* ── MAIN GRID ── */
        .cal-grid-layout { display:grid; grid-template-columns:1.15fr 1fr; gap:2rem; align-items:start; }

        /* ── CALENDAR SHELL ── */
        .cal-shell {
          background:linear-gradient(145deg,rgba(12,18,40,0.92) 0%,rgba(8,12,28,0.96) 100%);
          border:1px solid rgba(100,149,237,0.14); border-radius:22px;
          backdrop-filter:blur(28px); -webkit-backdrop-filter:blur(28px);
          padding:2.2rem; box-shadow:0 24px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.03);
          position:sticky; top:6rem;
        }
        .cal-nav-row { display:flex; align-items:center; justify-content:space-between; margin-bottom:1.75rem; }
        .cal-nav-btn {
          width:36px; height:36px; display:flex; align-items:center; justify-content:center;
          background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.09);
          color:var(--gold); font-size:1.2rem; border-radius:9px; cursor:pointer; transition:all 0.2s;
        }
        .cal-nav-btn:hover { background:rgba(201,168,76,0.14); border-color:rgba(201,168,76,0.4); transform:scale(1.07); }
        .cal-today-btn {
          font-size:0.65rem; font-weight:700; letter-spacing:0.12em; text-transform:uppercase;
          color:var(--silver); background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.09);
          border-radius:7px; padding:0.3rem 0.75rem; cursor:pointer; transition:all 0.2s;
        }
        .cal-today-btn:hover { color:var(--gold); border-color:rgba(201,168,76,0.4); }
        .cal-month-label { text-align:center; }
        .cal-month-name  { font-size:1.55rem; font-weight:900; color:white; letter-spacing:-0.02em; line-height:1; }
        .cal-month-count { font-size:0.7rem; color:var(--silver); margin-top:0.25rem; letter-spacing:0.06em; }

        .cal-dow-row { display:grid; grid-template-columns:repeat(7,1fr); gap:4px; margin-bottom:6px; }
        .cal-dow { text-align:center; font-size:0.65rem; font-weight:700; color:rgba(154,171,204,0.55); letter-spacing:0.06em; padding-bottom:0.5rem; text-transform:uppercase; }

        .cal-days { display:grid; grid-template-columns:repeat(7,1fr); gap:4px; }
        .cal-cell {
          aspect-ratio:1; border-radius:9px; display:flex; flex-direction:column;
          align-items:center; justify-content:flex-start; padding:0.35rem 0.15rem 0.2rem;
          border:1px solid transparent; transition:all 0.18s; position:relative;
          background:rgba(255,255,255,0.018);
        }
        .cal-cell.muted { opacity:0.15; pointer-events:none; background:transparent; }
        .cal-cell.has-event {
          cursor:pointer; background:rgba(26,58,143,0.12);
          border-color:rgba(100,149,237,0.18);
        }
        .cal-cell.has-event:hover { background:rgba(201,168,76,0.1); border-color:rgba(201,168,76,0.4); transform:scale(1.04); box-shadow:0 4px 14px rgba(0,0,0,0.35); }
        .cal-cell.active { background:rgba(201,168,76,0.13) !important; border-color:rgba(201,168,76,0.55) !important; }
        .cal-cell-num { font-size:0.82rem; font-weight:700; color:rgba(255,255,255,0.85); line-height:1; margin-bottom:3px; }
        .cal-cell.today .cal-cell-num {
          background:var(--gold); color:#000; border-radius:50%;
          width:22px; height:22px; display:flex; align-items:center; justify-content:center; font-size:0.75rem;
        }
        .cal-dots { display:flex; gap:2px; justify-content:center; }
        .cal-dot  { width:4px; height:4px; border-radius:50%; flex-shrink:0; }

        /* ── LEGEND ── */
        .cal-legend { display:flex; flex-wrap:wrap; gap:0.6rem; margin-top:1.5rem; justify-content:center; }
        .cal-legend-item { display:flex; align-items:center; gap:0.35rem; font-size:0.62rem; color:var(--silver); letter-spacing:0.06em; text-transform:uppercase; font-weight:600; }
        .cal-legend-dot  { width:7px; height:7px; border-radius:50%; flex-shrink:0; }

        /* ── EVENT PANEL ── */
        .event-panel {
          display:flex; flex-direction:column; gap:0;
          background:linear-gradient(145deg,rgba(12,18,40,0.92) 0%,rgba(8,12,28,0.96) 100%);
          border:1px solid rgba(100,149,237,0.14); border-radius:22px;
          backdrop-filter:blur(28px); -webkit-backdrop-filter:blur(28px);
          overflow:hidden; box-shadow:0 24px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.03);
        }
        .event-panel-head {
          padding:1.6rem 1.8rem 1.2rem;
          border-bottom:1px solid rgba(255,255,255,0.05);
          display:flex; align-items:center; justify-content:space-between;
        }
        .event-panel-title { font-size:0.68rem; font-weight:700; letter-spacing:0.18em; text-transform:uppercase; color:var(--gold); }
        .event-panel-count { font-size:0.68rem; color:var(--silver); }
        .event-panel-body  { padding:1rem; display:flex; flex-direction:column; gap:0.55rem; max-height:520px; overflow-y:auto; }
        .event-panel-empty { text-align:center; color:var(--silver); opacity:0.45; padding:3.5rem 1.5rem; }
        .event-panel-empty span { font-size:2rem; display:block; margin-bottom:0.75rem; }

        .event-card {
          display:grid; grid-template-columns:48px 1px 1fr auto;
          gap:0 0.9rem; align-items:center;
          padding:0.95rem 1rem; border-radius:12px;
          background:rgba(255,255,255,0.025); border:1px solid rgba(255,255,255,0.055);
          cursor:pointer; transition:all 0.22s;
        }
        .event-card:hover, .event-card.active {
          background:rgba(201,168,76,0.07); border-color:rgba(201,168,76,0.3);
          transform:translateX(3px);
          box-shadow:0 4px 18px rgba(0,0,0,0.3);
        }
        .event-card-date { text-align:center; }
        .event-card-day  { font-size:1.5rem; font-weight:900; color:white; line-height:1; display:block; }
        .event-card-mon  { font-size:0.58rem; font-weight:700; color:var(--gold); letter-spacing:0.1em; text-transform:uppercase; }
        .event-card-bar  { width:1px; height:38px; background:rgba(255,255,255,0.07); }
        .event-card-info { min-width:0; }
        .event-card-name { font-size:0.86rem; font-weight:700; color:white; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-bottom:0.2rem; }
        .event-card-time { font-size:0.7rem; color:var(--silver); }
        .event-badge { font-size:0.58rem; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; padding:0.2rem 0.55rem; border-radius:999px; border:1px solid; white-space:nowrap; }

        /* ── LIST VIEW ── */
        .list-view { display:flex; flex-direction:column; gap:0.6rem; }
        .list-month-group { margin-bottom:1.5rem; }
        .list-month-head  { font-size:0.7rem; font-weight:700; letter-spacing:0.18em; text-transform:uppercase; color:var(--gold); padding:0.5rem 0 0.75rem; border-bottom:1px solid rgba(201,168,76,0.14); margin-bottom:0.75rem; }

        /* ── MODAL ── */
        .modal-overlay {
          position:fixed; inset:0; z-index:9990; background:rgba(0,0,0,0.85);
          backdrop-filter:blur(6px); display:flex; align-items:center; justify-content:center; padding:1.5rem;
          animation:fadein 0.18s ease;
        }
        @keyframes fadein { from{opacity:0} to{opacity:1} }
        .modal-box {
          background:linear-gradient(145deg,rgba(10,15,35,0.99),rgba(6,9,22,0.99));
          border:1px solid rgba(201,168,76,0.22); border-radius:22px;
          width:100%; max-width:660px; max-height:88vh;
          box-shadow:0 40px 120px rgba(0,0,0,0.75), 0 0 60px rgba(201,168,76,0.06);
          overflow:hidden; display:flex; flex-direction:column;
          animation:zoom 0.24s cubic-bezier(0.22,1,0.36,1);
        }
        @keyframes zoom { from{transform:scale(0.9) translateY(12px);opacity:0} to{transform:scale(1) translateY(0);opacity:1} }
        .modal-head {
          padding:1.75rem 2rem 1.4rem;
          border-bottom:1px solid rgba(255,255,255,0.06);
          display:flex; align-items:flex-start; justify-content:space-between; gap:1rem;
        }
        .modal-title { font-size:1.45rem; font-weight:900; color:white; line-height:1.2; margin-top:0.6rem; }
        .modal-close {
          width:32px; height:32px; border-radius:50%; border:none; flex-shrink:0;
          background:rgba(255,255,255,0.07); color:rgba(255,255,255,0.55); font-size:1rem;
          display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all 0.2s;
        }
        .modal-close:hover { background:rgba(201,168,76,0.18); color:var(--gold); }
        .modal-body { padding:1.5rem 2rem 2rem; overflow-y:auto; flex-grow:1; }
        .modal-row  { display:flex; align-items:flex-start; gap:0.75rem; margin-bottom:0.9rem; }
        .modal-icon { font-size:1rem; color:var(--gold); flex-shrink:0; margin-top:0.15rem; }
        .modal-lbl  { font-size:0.65rem; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; color:var(--gold); margin-bottom:0.1rem; }
        .modal-val  { font-size:0.88rem; color:var(--silver); }
        .modal-desc { font-size:0.88rem; color:var(--silver); line-height:1.7; margin:1.25rem 0; padding:1.2rem; background:rgba(255,255,255,0.028); border-radius:12px; border:1px solid rgba(255,255,255,0.06); }
        .modal-map  { border-radius:14px; overflow:hidden; height:240px; border:1px solid rgba(255,255,255,0.08); margin-top:0.5rem; }
        .modal-map iframe { width:100%; height:100%; border:0; display:block; }

        @media(max-width:960px){
          .cal-grid-layout { grid-template-columns:1fr; }
          .cal-shell { position:static; }
          .event-panel-body { max-height:400px; }
        }
        @media(max-width:560px){
          .cal-days { gap:2px; }
          .cal-cell { padding:0.25rem 0.1rem 0.15rem; border-radius:6px; }
          .cal-cell-num { font-size:0.72rem; }
          .event-card { grid-template-columns:40px 1px 1fr auto; gap:0 0.7rem; }
          .modal-head { padding:1.25rem 1.25rem 1rem; }
          .modal-body { padding:1rem 1.25rem 1.5rem; }
          .modal-title { font-size:1.2rem; }
        }
      `}</style>

      <div className="cal-bg" />
      <div className="cal-wrap">

        {/* Header */}
        <div className="cal-head fade-in">
          <p className="section-label" style={{ justifyContent:"center" }}>Schedule</p>
          <h1 className="section-heading">Event Calendar</h1>
          <p>Browse upcoming meetings, volunteer events, and service opportunities.</p>
        </div>

        {/* View toggle */}
        <div style={{ display:"flex", justifyContent:"center" }}>
          <div className="cal-toggle">
            <button className={`cal-toggle-btn${view==="month" ? " active" : ""}`} onClick={() => setView("month")}>Month</button>
            <button className={`cal-toggle-btn${view==="list"  ? " active" : ""}`} onClick={() => setView("list")}>All Events</button>
          </div>
        </div>

        {view === "month" ? (
          <div className="cal-grid-layout fade-in">

            {/* Calendar */}
            <div className="cal-shell">
              <div className="cal-nav-row">
                <button className="cal-nav-btn" onClick={prevMonth} aria-label="Previous">‹</button>
                <div className="cal-month-label">
                  <div className="cal-month-name">{MONTHS[viewMonth]} {viewYear}</div>
                  <div className="cal-month-count">
                    {monthEvents.length > 0 ? `${monthEvents.length} event${monthEvents.length !== 1 ? "s" : ""}` : "No events"}
                  </div>
                </div>
                <button className="cal-nav-btn" onClick={nextMonth} aria-label="Next">›</button>
              </div>
              <div style={{ display:"flex", justifyContent:"center", marginBottom:"1.2rem" }}>
                <button className="cal-today-btn" onClick={jumpToday}>Today</button>
              </div>

              <div className="cal-dow-row">
                {DAYS.map(d => <div key={d} className="cal-dow">{d}</div>)}
              </div>
              <div className="cal-days">
                {gridDays.map((day, i) => {
                  const evs = day.current ? (byDay[day.date] ?? []) : [];
                  return (
                    <div
                      key={i}
                      className={`cal-cell${!day.current ? " muted":""}${evs.length > 0 ? " has-event":""}${selected?.day === day.date && evs.some(e=>e===selected) ? " active":""}${isToday(day.date) && day.current ? " today":""}`}
                      onClick={() => evs.length > 0 && setSelected(evs[0])}
                    >
                      <span className="cal-cell-num">{day.date}</span>
                      {evs.length > 0 && (
                        <div className="cal-dots">
                          {evs.slice(0,3).map((ev,j) => <span key={j} className="cal-dot" style={{ background: TYPE_COLOR[ev.type] ?? "var(--gold)" }} />)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="cal-legend">
                {Object.entries(TYPE_COLOR).map(([type, color]) => (
                  <span key={type} className="cal-legend-item">
                    <span className="cal-legend-dot" style={{ background: color }} />
                    {type}
                  </span>
                ))}
              </div>
            </div>

            {/* Event list */}
            <div className="event-panel fade-in" style={{ transitionDelay:"0.08s" }}>
              <div className="event-panel-head">
                <span className="event-panel-title">{MONTHS[viewMonth]} Events</span>
                <span className="event-panel-count">{monthEvents.length} scheduled</span>
              </div>
              <div className="event-panel-body">
                {monthEvents.length === 0 ? (
                  <div className="event-panel-empty">
                    <span>📅</span>
                    No events for {MONTHS[viewMonth]}.<br/>Use the arrows to browse.
                  </div>
                ) : (
                  monthEvents.map((ev, i) => (
                    <div
                      key={i}
                      className={`event-card${selected === ev ? " active":""}`}
                      onClick={() => setSelected(ev)}
                    >
                      <div className="event-card-date">
                        <span className="event-card-day">{ev.day}</span>
                        <span className="event-card-mon">{MONTHS[viewMonth].slice(0,3)}</span>
                      </div>
                      <div className="event-card-bar" />
                      <div className="event-card-info">
                        <div className="event-card-name">{ev.title}</div>
                        <div className="event-card-time">⏱ {ev.time}</div>
                      </div>
                      <span className="event-badge" style={{ color: TYPE_COLOR[ev.type], background: TYPE_BG[ev.type], borderColor: TYPE_COLOR[ev.type] }}>{ev.type}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : (
          /* ALL EVENTS LIST VIEW */
          <div className="list-view" style={{ maxWidth:780, margin:"0 auto" }}>
            {Object.entries(
              Object.entries(allEvents)
                .flatMap(([k, evs]) => { const [y,m,d] = k.split("-").map(Number); return evs.map(ev => ({ ...ev, day:d, month:m, year:y })); })
                // month is 1-indexed in keys; JS Date months are 0-indexed → subtract 1
                .sort((a,b) => new Date(a.year, a.month - 1, a.day).getTime() - new Date(b.year, b.month - 1, b.day).getTime())
                .reduce((acc, ev) => {
                  const key = `${MONTHS[ev.month - 1]} ${ev.year}`;
                  (acc[key] ??= []).push(ev);
                  return acc;
                }, {} as Record<string, (EventItem & { month:number; year:number })[]>)
            ).map(([label, evs]) => (
              <div key={label} className="list-month-group">
                <div className="list-month-head">{label}</div>
                {evs.map((ev, i) => (
                  <div key={i} className={`event-card${selected === ev ? " active":""}`} style={{ marginBottom:"0.55rem" }} onClick={() => setSelected(ev)}>
                    <div className="event-card-date">
                      <span className="event-card-day">{ev.day}</span>
                      <span className="event-card-mon">{MONTHS[ev.month].slice(0,3)}</span>
                    </div>
                    <div className="event-card-bar" />
                    <div className="event-card-info">
                      <div className="event-card-name">{ev.title}</div>
                      <div className="event-card-time">⏱ {ev.time} · 📍 {ev.loc}</div>
                    </div>
                    <span className="event-badge" style={{ color: TYPE_COLOR[ev.type], background: TYPE_BG[ev.type], borderColor: TYPE_COLOR[ev.type] }}>{ev.type}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-box" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <span className="event-badge" style={{ color: TYPE_COLOR[selected.type], background: TYPE_BG[selected.type], borderColor: TYPE_COLOR[selected.type] }}>{selected.type}</span>
                <h2 className="modal-title">{selected.title}</h2>
              </div>
              <button className="modal-close" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="modal-row">
                <span className="modal-icon">📅</span>
                <div><div className="modal-lbl">Date</div><div className="modal-val">{MONTHS[viewMonth]} {selected.day}, {viewYear}</div></div>
              </div>
              <div className="modal-row">
                <span className="modal-icon">⏱</span>
                <div><div className="modal-lbl">Time</div><div className="modal-val">{selected.time}</div></div>
              </div>
              <div className="modal-row">
                <span className="modal-icon">📍</span>
                <div><div className="modal-lbl">Location</div><div className="modal-val">{selected.loc}</div></div>
              </div>
              <div className="modal-desc">{selected.desc}</div>
              <div className="modal-map">
                <iframe loading="lazy" src={`https://maps.google.com/maps?q=${encodeURIComponent(selected.loc)}&t=&z=14&ie=UTF8&iwloc=&output=embed`} />
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
