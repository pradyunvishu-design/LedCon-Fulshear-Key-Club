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
  const goToToday = () => setCurrentDate(new Date());

  const getEventsForDate = (day: number) => {
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return allEvents[dateKey] || [];
  };

  const sortedEventDates = Object.keys(allEvents).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  const monthEvents = Array.from({ length: daysInMonth }).flatMap((_, i) => {
    const dayNum = i + 1;
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    return (allEvents[dateKey] || []).map(event => ({ ...event, date: dateKey, dayNum }));
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <main className="flex-grow pt-8" style={{ background: "transparent" }}>
      <style>{`
        .calendar-shell {
          max-width: 1300px;
          margin: 0 auto;
          padding: 0 2rem 6rem;
        }
        .cal-page-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .cal-page-subtitle {
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 0.5rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 4px 12px;
          border-radius: 20px;
          display: inline-block;
          background: rgba(255, 255, 255, 0.05);
        }
        .cal-page-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 900;
          letter-spacing: -0.02em;
          color: white;
          margin-bottom: 1rem;
        }
        .cal-page-title span {
          background: linear-gradient(135deg, #a855f7 0%, #d8b4fe 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-style: italic;
        }
        .cal-page-desc {
          color: var(--silver);
          font-size: 1rem;
        }
        .view-toggle {
          display: flex;
          gap: 0;
          margin-bottom: 3rem;
          justify-content: center;
          background: rgba(10, 15, 30, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 30px;
          width: fit-content;
          margin-inline: auto;
          padding: 4px;
        }
        .view-btn {
          padding: 0.6rem 2rem;
          border-radius: 26px;
          font-size: 0.85rem;
          font-weight: 700;
          transition: all 0.3s;
          color: var(--silver);
          border: none;
          background: transparent;
        }
        .view-btn.active {
          background: #7c3aed; /* Purple brand color */
          color: white;
          box-shadow: 0 0 15px rgba(124, 58, 237, 0.5);
        }
        .cal-container {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 2rem;
        }
        .glass-panel {
          background: rgba(15, 20, 35, 0.5);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 24px;
          padding: 2.5rem;
          box-shadow: inset 0 0 20px rgba(124, 58, 237, 0.05), 0 10px 40px rgba(0, 0, 0, 0.3);
        }
        .cal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
          position: relative;
        }
        .month-title-wrapper {
          text-align: center;
        }
        .month-title {
          font-size: 1.8rem;
          font-weight: 800;
          color: white;
          font-style: italic;
          letter-spacing: -0.01em;
          margin-bottom: 0.2rem;
        }
        .month-subtitle {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.4);
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
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.3);
        }
        .today-btn {
          margin: 1rem auto 2rem;
          display: block;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 4px 16px;
          border-radius: 12px;
          transition: all 0.2s;
        }
        .today-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        .grid-header {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          text-align: center;
          margin-bottom: 1rem;
        }
        .day-label {
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.4);
          letter-spacing: 0.15em;
        }
        .days-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 12px;
        }
        .day-cell {
          aspect-ratio: 1;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 16px;
          padding: 8px;
          display: flex;
          flex-direction: column;
          position: relative;
          transition: all 0.2s;
          cursor: pointer;
        }
        .day-cell:hover {
          border-color: rgba(124, 58, 237, 0.5);
          background: rgba(124, 58, 237, 0.1);
          transform: translateY(-2px);
        }
        .day-num {
          font-size: 0.9rem;
          font-weight: 700;
          color: white;
          margin-bottom: auto;
        }
        .day-num.other-month {
          color: rgba(255, 255, 255, 0.2);
        }
        .event-dots-tray {
          display: flex;
          gap: 4px;
          justify-content: flex-start;
          flex-wrap: wrap;
        }
        .event-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          box-shadow: 0 0 8px currentColor;
        }
        .legend-tray {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          margin-top: 2.5rem;
          flex-wrap: wrap;
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.75rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.5);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        
        .events-panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        .events-panel-title {
          font-size: 0.85rem;
          font-weight: 800;
          color: white;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .events-panel-count {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.4);
        }
        .event-list-scroll {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-height: 550px;
          overflow-y: auto;
          padding-right: 0.5rem;
        }
        .event-list-scroll::-webkit-scrollbar { width: 6px; }
        .event-list-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .event-item2 {
          display: flex;
          gap: 1.5rem;
          padding: 1rem;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          cursor: pointer;
          transition: all 0.2s;
        }
        .event-item2:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.1);
        }
        .event-date-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-width: 50px;
        }
        .event-date-day {
          font-size: 1.8rem;
          font-weight: 900;
          color: white;
          line-height: 1;
        }
        .event-date-month {
          font-size: 0.7rem;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.4);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-top: 4px;
        }
        .event-details-box {
          flex-grow: 1;
        }
        .event-title-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.5rem;
        }
        .event-item-title2 {
          color: white;
          font-weight: 700;
          font-size: 1.1rem;
        }
        .event-badge {
          font-size: 0.65rem;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 12px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          border: 1px solid currentColor;
          background: rgba(0,0,0,0.2);
        }
        .event-item-loc2 {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.5);
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .event-detail-modal {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .event-detail-content {
          background: rgba(15, 20, 35, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 2.5rem;
          max-width: 500px;
          width: 90%;
          color: white;
          position: relative;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }
        .event-detail-close {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          background: rgba(255, 255, 255, 0.05);
          border: none;
          color: white;
          font-size: 1.2rem;
          cursor: pointer;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .event-detail-close:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        .event-detail-badge {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 800;
          padding: 4px 12px;
          border-radius: 12px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 1rem;
          border: 1px solid currentColor;
        }
        .event-detail-title {
          font-size: 1.8rem;
          color: white;
          margin-bottom: 0.5rem;
          font-weight: 800;
        }
        .event-detail-info {
          font-size: 0.95rem;
          margin-bottom: 0.5rem;
          color: rgba(255, 255, 255, 0.6);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .event-detail-desc {
          margin-top: 1.5rem;
          font-size: 0.95rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.8);
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
        .event-detail-map-link {
          display: inline-block;
          margin-top: 1.5rem;
          padding: 0.8rem 1.5rem;
          border-radius: 12px;
          background: #7c3aed;
          color: white;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s;
        }
        .event-detail-map-link:hover {
          background: #6d28d9;
        }

        @media (max-width: 1000px) {
          .cal-container { grid-template-columns: 1fr; }
        }
        @media (max-width: 600px) {
          .calendar-shell { padding: 0 1rem 4rem; }
          .glass-panel { padding: 1.5rem; }
          .day-cell { min-height: 60px; padding: 4px; border-radius: 8px; }
          .day-num { font-size: 0.8rem; }
          .event-dot { width: 4px; height: 4px; }
          .event-item2 { flex-direction: column; gap: 0.8rem; }
          .event-date-box { align-items: flex-start; flex-direction: row; gap: 8px; }
          .event-date-day { font-size: 1.2rem; }
          .event-date-month { margin-top: 0; font-size: 1rem; }
        }
      `}</style>

      <div className="calendar-shell fade-in">
        <div className="cal-page-header">
          <div className="cal-page-subtitle">Events</div>
          <h1 className="cal-page-title">Event <span>Calendar</span></h1>
          <p className="cal-page-desc">Browse upcoming meetings, volunteer events, and service opportunities.</p>
        </div>

        <div className="view-toggle">
          <button className={`view-btn ${view === "month" ? "active" : ""}`} onClick={() => setView("month")}>MONTH</button>
          <button className={`view-btn ${view === "list" ? "active" : ""}`} onClick={() => setView("list")}>ALL EVENTS</button>
        </div>

        {view === "month" ? (
          <div className="cal-container">
            <div className="glass-panel">
              <div className="cal-header">
                <button className="nav-btn" onClick={prevMonth}>←</button>
                <div className="month-title-wrapper">
                  <h2 className="month-title">{MONTHS[month]} {year}</h2>
                  <div className="month-subtitle">{monthEvents.length} events</div>
                </div>
                <button className="nav-btn" onClick={nextMonth}>→</button>
              </div>
              <button className="today-btn" onClick={goToToday}>TODAY</button>

              <div className="grid-header">
                {DAYS.map(d => <div key={d} className="day-label">{d}</div>)}
              </div>

              <div className="days-grid">
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="day-cell">
                    <span className="day-num other-month"></span>
                  </div>
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const events = getEventsForDate(dayNum);
                  return (
                    <div key={dayNum} className="day-cell" onClick={() => events.length > 0 && setSelectedEvent({ ...events[0], date: `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}` })}>
                      <span className="day-num">{dayNum}</span>
                      <div className="event-dots-tray">
                        {events.map((e, idx) => (
                          <div key={idx} className="event-dot" style={{ backgroundColor: TYPE_COLOR[e.type] || '#a855f7', color: TYPE_COLOR[e.type] || '#a855f7' }} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="legend-tray">
                {Object.keys(TYPE_COLOR).map(type => (
                  <div key={type} className="legend-item">
                    <div className="event-dot" style={{ backgroundColor: TYPE_COLOR[type], color: TYPE_COLOR[type] }} />
                    {type}
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel">
              <div className="events-panel-header">
                <div className="events-panel-title">{MONTHS[month].substring(0,3)} EVENTS</div>
                <div className="events-panel-count">{monthEvents.length} scheduled</div>
              </div>
              <div className="event-list-scroll">
                {monthEvents.length > 0 ? (
                  monthEvents.map((event, idx) => (
                    <div key={idx} className="event-item2" onClick={() => setSelectedEvent(event)}>
                      <div className="event-date-box">
                        <div className="event-date-day">{event.dayNum}</div>
                        <div className="event-date-month">{MONTHS[month].substring(0,3)}</div>
                      </div>
                      <div className="event-details-box">
                        <div className="event-title-row">
                          <div className="event-item-title2">🌟 {event.title}</div>
                          <div className="event-badge" style={{ color: TYPE_COLOR[event.type] || '#fff' }}>{event.type}</div>
                        </div>
                        <div className="event-item-loc2">📍 {event.loc}</div>
                        <div className="event-item-loc2" style={{ marginTop: '4px' }}>🕒 {event.time}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: 'var(--silver)', textAlign: 'center', marginTop: '2rem' }}>No events scheduled for this month.</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-panel" style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div className="events-panel-header">
              <div className="events-panel-title">ALL EVENTS</div>
              <div className="events-panel-count">{sortedEventDates.reduce((acc, key) => acc + allEvents[key].length, 0)} total</div>
            </div>
            <div className="event-list-scroll" style={{ maxHeight: '700px' }}>
              {sortedEventDates.length > 0 ? (
                sortedEventDates.map(dateKey => {
                  const [y, m, d] = dateKey.split("-");
                  const dateObj = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
                  return allEvents[dateKey].map((event, idx) => (
                    <div key={`${dateKey}-${idx}`} className="event-item2" onClick={() => setSelectedEvent({ ...event, date: dateKey })}>
                      <div className="event-date-box">
                        <div className="event-date-day">{dateObj.getDate()}</div>
                        <div className="event-date-month">{MONTHS[dateObj.getMonth()].substring(0,3)} {dateObj.getFullYear()}</div>
                      </div>
                      <div className="event-details-box">
                        <div className="event-title-row">
                          <div className="event-item-title2">🌟 {event.title}</div>
                          <div className="event-badge" style={{ color: TYPE_COLOR[event.type] || '#fff' }}>{event.type}</div>
                        </div>
                        <div className="event-item-loc2">📍 {event.loc}</div>
                        <div className="event-item-loc2" style={{ marginTop: '4px' }}>🕒 {event.time}</div>
                      </div>
                    </div>
                  ));
                })
              ) : (
                <p style={{ color: 'var(--silver)', textAlign: 'center', marginTop: '2rem' }}>No events found.</p>
              )}
            </div>
          </div>
        )}

        {selectedEvent && (
          <div className="event-detail-modal" onClick={() => setSelectedEvent(null)}>
            <div className="event-detail-content" onClick={(e) => e.stopPropagation()}>
              <button className="event-detail-close" onClick={() => setSelectedEvent(null)}>✕</button>
              
              <div className="event-detail-badge" style={{ color: TYPE_COLOR[selectedEvent.type] || '#a855f7' }}>
                {selectedEvent.type}
              </div>
              
              <h2 className="event-detail-title">{selectedEvent.title}</h2>
              <div className="event-detail-info">🕒 {selectedEvent.time}</div>
              <div className="event-detail-info">📍 {selectedEvent.loc}</div>
              
              <div className="event-detail-desc">{selectedEvent.desc}</div>
              
              {selectedEvent.mapLink && (
                <a href={selectedEvent.mapLink} target="_blank" rel="noopener noreferrer" className="event-detail-map-link">
                  Open in Google Maps ↗
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
