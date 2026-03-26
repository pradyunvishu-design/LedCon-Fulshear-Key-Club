import React, { useState, useEffect } from "react";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// meetings are on the 2nd Tuesday of each month in the library at 4pm
const allEvents: Record<string, { title: string; time: string; loc: string; type: string; desc: string; mapLink?: string }[]> = {
  "2026-02-10": [
    { title: "Key Club General Meeting", time: "4:00 PM – 5:00 PM", loc: "Fulshear High School · Library", type: "Meeting", desc: "Monthly general meeting — 2nd Tuesday of each month at 4:00 PM. Attendance required for service hour credit.", mapLink: "https://maps.app.goo.gl/example1" },
  ],
  "2026-02-08": [{ title: "Community Food Pantry", time: "9:00 AM – 12:00 PM", loc: "5757 Flewellen Oaks Ln #303", type: "Volunteer", desc: "Help sort and distribute groceries to families in need at the local food pantry.", mapLink: "https://maps.app.goo.gl/example2" }],
  "2026-02-12": [{ title: "Park Clean-up", time: "8:00 AM – 11:00 AM", loc: "Cross Creek Ranch", type: "Service", desc: "Community park beautification — bring gloves and wear closed-toe shoes.", mapLink: "https://maps.app.goo.gl/example3" }],
  "2026-02-18": [{ title: "H-E-B Food Drive", time: "10:00 AM – 2:00 PM", loc: "4950 FM 1463, Katy, TX", type: "Service", desc: "Stand outside H-E-B and collect non-perishable food donations for local families.", mapLink: "https://maps.app.goo.gl/example4" }],
  "2026-02-23": [{ title: "Children's Book Reading", time: "4:00 PM – 5:30 PM", loc: "Fulshear Branch Library", type: "Volunteer", desc: "Read to kids ages 4–8 at the library. Great for members who love working with children.", mapLink: "https://maps.app.goo.gl/example5" }],
  "2026-02-28": [{ title: "End of Month Social", time: "6:00 PM – 8:00 PM", loc: "Fulshear Town Square", type: "Social", desc: "Celebrate a great month with fellow members. Food, fun, and club bonding.", mapLink: "https://maps.app.goo.gl/example6" }],

  "2026-03-10": [
    { title: "Key Club General Meeting", time: "4:00 PM – 5:00 PM", loc: "Fulshear High School · Library", type: "Meeting", desc: "Monthly general meeting — 2nd Tuesday of each month at 4:00 PM. Attendance required for service hour credit.", mapLink: "https://maps.app.goo.gl/example7" },
  ],
  "2026-03-12": [{ title: "Park Clean-up", time: "8:00 AM – 11:00 AM", loc: "Cross Creek Ranch", type: "Service", desc: "Community park beautification — bring gloves and wear closed-toe shoes.", mapLink: "https://maps.app.goo.gl/example8" }],
  "2026-03-15": [{ title: "Bake Sale Fundraiser", time: "7:30 AM – 3:00 PM", loc: "Fulshear High School Lobby", type: "Fundraiser", desc: "Annual bake sale to raise funds for district conference travel and club supplies.", mapLink: "https://maps.app.goo.gl/example9" }],
  "2026-03-19": [{ title: "H-E-B Food Drive", time: "10:00 AM – 2:00 PM", loc: "4950 FM 1463, Katy, TX", type: "Service", desc: "Stand outside H-E-B and collect non-perishable food donations for local families.", mapLink: "https://maps.app.goo.gl/example10" }],
  "2026-03-28": [{ title: "Pediatric Hospital Visit", time: "1:00 PM – 4:00 PM", loc: "Texas Children's Hospital Katy", type: "Volunteer", desc: "Bring crafts and spend time with pediatric patients. Background check required in advance.", mapLink: "https://maps.app.goo.gl/example11" }],

  "2026-04-14": [
    { title: "Key Club General Meeting", time: "4:00 PM – 5:00 PM", loc: "Fulshear High School · Library", type: "Meeting", desc: "Monthly general meeting — 2nd Tuesday of each month at 4:00 PM. Attendance required for service hour credit.", mapLink: "https://maps.app.goo.gl/example12" },
  ],
  "2026-04-11": [{ title: "Earth Day Park Cleanup", time: "8:00 AM – 12:00 PM", loc: "Exploration Park, Fulshear", type: "Service", desc: "Celebrate Earth Day by removing litter and planting native wildflowers at Exploration Park.", mapLink: "https://maps.app.goo.gl/example13" }],
  "2026-04-18": [{ title: "Blood Drive Volunteer", time: "9:00 AM – 3:00 PM", loc: "Fulshear High School Cafeteria", type: "Volunteer", desc: "Volunteer at the school's annual blood drive — help with check-in, refreshments, and donor support.", mapLink: "https://maps.app.goo.gl/example14" }],
  "2026-04-25": [{ title: "Senior Center Visit", time: "2:00 PM – 5:00 PM", loc: "Cinco Ranch Senior Living", type: "Volunteer", desc: "Spend the afternoon with residents — play games, share stories, and bring homemade cards.", mapLink: "https://maps.app.goo.gl/example15" }],
};

const TYPE_COLOR: Record<string, string> = {
  Meeting: "#6495ed",
  Volunteer: "#c9a84c",
  Service: "#50c878",
  Social: "#c864c8",
  Fundraiser: "#ff8c3c",
};

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 1)); // Start at Feb 2026
  const [view, setView] = useState<"month" | "list">("month");
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  useEffect(() => {
    const els = document.querySelectorAll(".fade-in");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add("visible"); });
    }, { threshold: 0.1 });
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [view, currentDate]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getEventsForDate = (day: number) => {
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return allEvents[dateKey] || [];
  };

  const sortedEventDates = Object.keys(allEvents).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  const monthEvents = Array.from({ length: daysInMonth }).flatMap((_, i) => {
    const dayNum = i + 1;
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    return (allEvents[dateKey] || []).map(event => ({ ...event, date: dateKey }));
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <main className="flex-grow pt-8">
      <style>{`
        .calendar-shell {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem 6rem;
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
        .cal-container {
          display: grid;
          grid-template-columns: 2fr 1fr; /* Calendar on left, events on right */
          gap: 2rem;
          background: rgba(10, 15, 30, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 2rem;
        }
        .cal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          padding: 0.5rem 0;
        }
        .month-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: white;
          letter-spacing: -0.01em;
        }
        .nav-btn {
          width: 40px;
          height: 40px;
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
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--gold);
          letter-spacing: 0.1em;
          padding: 0.5rem;
        }
        .days-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 8px;
        }
        .day-cell {
          aspect-ratio: 1;
          background: rgba(10, 15, 30, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          padding: 8px;
          display: flex;
          flex-direction: column;
          min-height: clamp(80px, 10vw, 120px);
          transition: border-color 0.2s, background 0.2s;
          cursor: pointer;
        }
        .day-cell:hover {
          border-color: rgba(201, 168, 76, 0.3);
          background: rgba(10, 15, 30, 0.6);
        }
        .day-num {
          font-size: 1rem;
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
        .event-list-panel {
          background: rgba(10, 15, 30, 0.8);
          border-radius: 12px;
          padding: 1.5rem;
          overflow-y: auto;
          max-height: 700px; /* Adjust as needed */
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .event-list-panel h3 {
          color: white;
          font-size: 1.2rem;
          margin-bottom: 1.5rem;
          text-align: center;
        }
        .event-item {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 0.8rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        .event-item:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        .event-item-title {
          color: var(--gold);
          font-weight: 700;
          margin-bottom: 0.3rem;
        }
        .event-item-time-loc {
          font-size: 0.85rem;
          color: var(--silver);
        }
        .event-detail-modal {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .event-detail-content {
          background: rgba(10, 15, 30, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 16px;
          padding: 2rem;
          max-width: 600px;
          width: 90%;
          color: white;
          position: relative;
        }
        .event-detail-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
        }
        .event-detail-title {
          font-size: 1.8rem;
          color: var(--gold);
          margin-bottom: 1rem;
        }
        .event-detail-info {
          font-size: 1rem;
          margin-bottom: 1rem;
          color: var(--silver);
        }
        .event-detail-desc {
          font-size: 0.9rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }
        .event-detail-map {
          width: 100%;
          height: 300px;
          border: 0;
          border-radius: 8px;
        }

        @media (max-width: 900px) {
          .cal-container {
            grid-template-columns: 1fr;
          }
          .event-list-panel {
            max-height: 400px;
          }
        }
        @media (max-width: 600px) {
          .calendar-shell {
            padding: 0 1rem 4rem;
          }
          .cal-container {
            padding: 1rem;
          }
          .month-title {
            font-size: 1.2rem;
          }
          .day-cell { min-height: 60px; padding: 4px; }
          .day-num { font-size: 0.8rem; }
          .day-label { font-size: 0.7rem; }
        }
      `}</style>

      <div className="calendar-shell fade-in">
        <div className="view-toggle">
          <button className={`view-btn ${view === "month" ? "active" : ""}`} onClick={() => setView("month")}>Month View</button>
          <button className={`view-btn ${view === "list" ? "active" : ""}`} onClick={() => setView("list")}>All Events</button>
        </div>

        {view === "month" ? (
          <div className="cal-container">
            <div> {/* Calendar Grid */}
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
                  const events = getEventsForDate(dayNum);
                  return (
                    <div key={dayNum} className="day-cell" onClick={() => setSelectedEvent(events.length > 0 ? { ...events[0], date: `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}` } : null)}>
                      <span className="day-num">{dayNum}</span>
                      {events.map((e, idx) => (
                        <div key={idx} className="event-dot" style={{ backgroundColor: TYPE_COLOR[e.type] }} />
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="event-list-panel"> {/* Events for selected month */}
              <h3>Events in {MONTHS[month]} {year}</h3>
              {monthEvents.length > 0 ? (
                monthEvents.map((event, idx) => (
                  <div key={idx} className="event-item" onClick={() => setSelectedEvent(event)}>
                    <div className="event-item-title">{event.title}</div>
                    <div className="event-item-time-loc">{event.time} · {event.loc}</div>
                  </div>
                ))
              ) : (
                <p style={{ color: 'var(--silver)', textAlign: 'center', marginTop: '2rem' }}>No events scheduled for this month.</p>
              )}
            </div>
          </div>
        ) : (
          <div key="list-view-container" className="event-list-panel" style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h3>All Upcoming Events</h3>
            {sortedEventDates.length > 0 ? (
              sortedEventDates.map(dateKey => {
                const [y, m, d] = dateKey.split("-");
                const dateObj = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
                return (
                  <div key={dateKey} className="date-group">
                    {allEvents[dateKey].map((event, idx) => (
                      <div key={`${dateKey}-${idx}`} className="event-item" onClick={() => setSelectedEvent({ ...event, date: dateKey })}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--gold)', marginBottom: '0.5rem', display: 'block' }}>{MONTHS[dateObj.getMonth()]} {dateObj.getDate()}, {dateObj.getFullYear()}</span>
                        <div className="event-item-title">{event.title}</div>
                        <div className="event-item-time-loc">{event.time} · {event.loc}</div>
                      </div>
                    ))}
                  </div>
                );
              })
            ) : (
              <p style={{ color: 'var(--silver)', textAlign: 'center', marginTop: '2rem' }}>No upcoming events.</p>
            )}
          </div>
        )}

        {selectedEvent && (
          <div className="event-detail-modal" onClick={() => setSelectedEvent(null)}>
            <div className="event-detail-content" onClick={(e) => e.stopPropagation()}>
              <button className="event-detail-close" onClick={() => setSelectedEvent(null)}>×</button>
              <h2 className="event-detail-title">{selectedEvent.title}</h2>
              <p className="event-detail-info">🕒 {selectedEvent.time}</p>
              <p className="event-detail-info">📍 {selectedEvent.loc}</p>
              <p className="event-detail-info" style={{ color: TYPE_COLOR[selectedEvent.type] }}>🏷️ {selectedEvent.type}</p>
              <p className="event-detail-desc">{selectedEvent.desc}</p>
              {selectedEvent.mapLink && (
                <iframe
                  className="event-detail-map"
                  src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d20000!2d${selectedEvent.mapLink.split('!2d')[1].split('!2m')[0]}!3d${selectedEvent.mapLink.split('!3d')[1].split('!1m')[0]}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z${encodeURIComponent(selectedEvent.loc)}!5e0!3m2!1sen!2sus!4v1678886400000!5m2!1sen!2sus`}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
