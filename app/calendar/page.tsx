"use client";

import React, { useState, useEffect } from "react";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

// meetings are on the 2nd Tuesday of each month in the library at 4pm
const allEvents: Record<string, { title: string; time: string; loc: string; type: string; desc: string }[]> = {
  "2026-2-10":  [
    { title: "Key Club General Meeting",   time: "4:00 PM – 5:00 PM",  loc: "Fulshear High School · Library", type: "Meeting",   desc: "Monthly general meeting — 2nd Tuesday of each month at 4:00 PM. Attendance required for service hour credit." },
  ],
  "2026-2-8":  [{ title: "Community Food Pantry",   time: "9:00 AM – 12:00 PM", loc: "5757 Flewellen Oaks Ln #303",     type: "Volunteer",  desc: "Help sort and distribute groceries to families in need at the local food pantry." }],
  "2026-2-12": [{ title: "Park Clean-up",            time: "8:00 AM – 11:00 AM", loc: "Cross Creek Ranch",               type: "Service",    desc: "Community park beautification — bring gloves and wear closed-toe shoes." }],
  "2026-2-18": [{ title: "H-E-B Food Drive",         time: "10:00 AM – 2:00 PM", loc: "4950 FM 1463, Katy, TX",          type: "Service",    desc: "Stand outside H-E-B and collect non-perishable food donations for local families." }],
  "2026-2-23": [{ title: "Children's Book Reading",  time: "4:00 PM – 5:30 PM",  loc: "Fulshear Branch Library",         type: "Volunteer",  desc: "Read to kids ages 4–8 at the library. Great for members who love working with children." }],
  "2026-2-28": [{ title: "End of Month Social",      time: "6:00 PM – 8:00 PM",  loc: "Fulshear Town Square",            type: "Social",     desc: "Celebrate a great month with fellow members. Food, fun, and club bonding." }],

  "2026-3-10":  [
    { title: "Key Club General Meeting",   time: "4:00 PM – 5:00 PM",  loc: "Fulshear High School · Library", type: "Meeting",   desc: "Monthly general meeting — 2nd Tuesday of each month at 4:00 PM. Attendance required for service hour credit." },
  ],
  "2026-3-12": [{ title: "Park Clean-up",            time: "8:00 AM – 11:00 AM", loc: "Cross Creek Ranch",               type: "Service",    desc: "Community park beautification — bring gloves and wear closed-toe shoes." }],
  "2026-3-15": [{ title: "Bake Sale Fundraiser",     time: "7:30 AM – 3:00 PM",  loc: "Fulshear High School Lobby",      type: "Fundraiser", desc: "Annual bake sale to raise funds for district conference travel and club supplies." }],
  "2026-3-19": [{ title: "H-E-B Food Drive",         time: "10:00 AM – 2:00 PM", loc: "4950 FM 1463, Katy, TX",          type: "Service",    desc: "Stand outside H-E-B and collect non-perishable food donations for local families." }],
  "2026-3-28": [{ title: "Pediatric Hospital Visit", time: "1:00 PM – 4:00 PM",  loc: "Texas Children's Hospital Katy",  type: "Volunteer",  desc: "Bring crafts and spend time with pediatric patients. Background check required in advance." }],

  "2026-4-14":  [
    { title: "Key Club General Meeting",   time: "4:00 PM – 5:00 PM",  loc: "Fulshear High School · Library", type: "Meeting",   desc: "Monthly general meeting — 2nd Tuesday of each month at 4:00 PM. Attendance required for service hour credit." },
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

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 1));
  const [view, setView] = useState<"month" | "list">("month");

  useEffect(() => {
    const els = document.querySelectorAll(".fade-in");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add("visible"); });
    }, { threshold: 0.1 });
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [view, currentDate]);

  const year  = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay    = new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const sortedEventDates = Object.keys(allEvents).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  return (
    <main className="flex-grow pt-8">
      <style>{`
        .calendar-shell {
          max-width: 1000px;
          margin: 0 auto;
          padding: 0 1.5rem 6rem;
        }
        .view-toggle {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2rem;
          justify-content: center;
        }
        .view-btn {
          padding: 0.6rem 1.2rem;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          transition: all 0.2s;
          background: rgba(255, 255, 255, 0.05);
          color: var(--silver);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .view-btn.active {
          background: var(--gold);
          color: var(--navy);
          border-color: var(--gold);
        }
        .cal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          background: rgba(10, 15, 30, 0.6);
          padding: 1rem 1.5rem;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .month-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: white;
          letter-spacing: -0.01em;
        }
        .nav-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.05);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.2s;
        }
        .nav-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: var(--gold);
        }
        .grid-header {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          text-align: center;
          margin-bottom: 0.5rem;
        }
        .day-label {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--gold);
          letter-spacing: 0.1em;
          padding: 0.5rem;
        }
        .days-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
        }
        .day-cell {
          aspect-ratio: 1;
          background: rgba(10, 15, 30, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 6px;
          display: flex;
          flex-direction: column;
          min-height: clamp(60px, 12vw, 100px);
          transition: border-color 0.2s;
        }
        .day-cell:hover {
          border-color: rgba(201, 168, 76, 0.3);
        }
        .day-num {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--silver);
          margin-bottom: 4px;
        }
        .event-dot {
          width: 100%;
          height: 4px;
          border-radius: 2px;
          margin-top: 2px;
        }
        .event-list-item {
          background: rgba(10, 15, 30, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1rem;
          transition: transform 0.2s;
        }
        .event-list-item:hover {
          transform: translateX(4px);
          border-color: var(--gold);
        }
        .event-date-badge {
          display: inline-block;
          padding: 0.3rem 0.8rem;
          background: rgba(201, 168, 76, 0.15);
          color: var(--gold);
          font-size: 0.75rem;
          font-weight: 700;
          border-radius: 20px;
          margin-bottom: 0.75rem;
        }
        @media (max-width: 600px) {
          .day-cell { min-height: 50px; padding: 4px; }
          .day-num { font-size: 0.7rem; }
          .day-label { font-size: 0.6rem; }
        }
      `}</style>

      <div className="calendar-shell fade-in">
        <div className="view-toggle">
          <button className={`view-btn ${view === "month" ? "active" : ""}`} onClick={() => setView("month")}>Month View</button>
          <button className={`view-btn ${view === "list" ? "active" : ""}`} onClick={() => setView("list")}>All Events</button>
        </div>

        {view === "month" ? (
          <div key="month-view-container">
            <div className="cal-header">
              <button className="nav-btn" onClick={prevMonth}>←</button>
              <h2 className="month-title">{MONTHS[month]} {year}</h2>
              <button className="nav-btn" onClick={nextMonth}>→</button>
            </div>
            
            <div className="grid-header">
              {DAYS.map(d => <div key={d} className="day-label">{d}</div>)}
            </div>
            
            <div className="days-grid">
              {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const dateKey = `${year}-${month + 1}-${dayNum}`;
                const events = allEvents[dateKey] || [];
                return (
                  <div key={dayNum} className="day-cell">
                    <span className="day-num">{dayNum}</span>
                    {events.map((e, idx) => (
                      <div key={idx} className="event-dot" style={{ backgroundColor: TYPE_COLOR[e.type] }} />
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div key="list-view-container" className="event-list">
            {sortedEventDates.map(dateKey => {
              const [y, m, d] = dateKey.split("-");
              const dateObj = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
              return (
                <div key={dateKey} className="date-group">
                  {allEvents[dateKey].map((event, idx) => (
                    <div key={`${dateKey}-${idx}`} className="event-list-item">
                      <span className="event-date-badge">{MONTHS[dateObj.getMonth()]} {dateObj.getDate()}, {dateObj.getFullYear()}</span>
                      <h3 style={{ color: "white", fontSize: "1.1rem", marginBottom: "0.5rem" }}>{event.title}</h3>
                      <div style={{ fontSize: "0.85rem", color: "var(--silver)", display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                        <span>🕒 {event.time}</span>
                        <span>📍 {event.loc}</span>
                        <span style={{ color: TYPE_COLOR[event.type] }}>🏷️ {event.type}</span>
                      </div>
                      <p style={{ marginTop: "0.8rem", fontSize: "0.85rem", color: "var(--silver)", lineHeight: "1.5" }}>{event.desc}</p>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
