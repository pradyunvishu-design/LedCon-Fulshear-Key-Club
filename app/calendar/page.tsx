"use client";

import { useState } from "react";

// Mock Data
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const eventsMap: Record<number, any> = {
  4: { title: "Divisional Council Meeting", time: "5:00 PM - 6:30 PM", loc: "Fulshear High School", type: "Meeting", lat: 29.684, lng: -95.912 },
  8: { title: "Community Food Pantry", time: "9:00 AM - 12:00 PM", loc: "5757 Flewellen Oaks Ln #303", type: "Volunteer", lat: 29.742, lng: -95.895 },
  12: { title: "Park Clean-up", time: "8:00 AM - 11:00 AM", loc: "Cross Creek Ranch", type: "Service", lat: 29.718, lng: -95.923 },
  15: { title: "Key Club General Meeting", time: "4:15 PM - 5:00 PM", loc: "Fulshear High School", type: "Meeting", lat: 29.684, lng: -95.912 },
  18: { title: "H-E-B Food Drive", time: "10:00 AM - 2:00 PM", loc: "4950 FM 1463, Katy", type: "Service", lat: 29.736, lng: -95.834 },
  23: { title: "Children's Book Reading", time: "4:00 PM - 5:30 PM", loc: "Fulshear Branch Library", type: "Volunteer", lat: 29.689, lng: -95.899 },
  25: { title: "Marathon Water Station", time: "6:00 AM - 11:00 AM", loc: "Cinco Ranch Blvd", type: "Service", lat: 29.740, lng: -95.820 },
  31: { title: "End of Month Social", time: "6:00 PM - 8:00 PM", loc: "Fulshear Town Square", type: "Social", lat: 29.688, lng: -95.898 },
};

const calendarDays = [
  ...Array.from({length: 3}, (_, i) => ({ date: 29+i, currentMonth: false })),
  ...Array.from({length: 31}, (_, i) => ({ date: i+1, currentMonth: true })),
  ...Array.from({length: 1}, (_, i) => ({ date: i+1, currentMonth: false })),
];

const categories = ["Community Event", "Park & Trails", "Fitness", "Grocery", "Library", "Support Services", "Food Pantry", "Volunteer Opportunity", "Other"];

export default function CalendarPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  const handleDayClick = (day: any) => {
    if (day.currentMonth && eventsMap[day.date]) {
      setSelectedEvent(eventsMap[day.date]);
    } else {
      setSelectedEvent(null);
    }
  };

  const defaultLoc = "Fulshear, TX";

  return (
    <main className="flex-grow pt-32 pb-8" style={{ minHeight: "100vh", position: "relative", display: "flex", flexDirection: "column" }}>
      <style>{`
        .calendar-page-bg {
          position:absolute; inset:0; pointer-events:none; z-index:0;
          background:
            radial-gradient(circle at 10% 20%, rgba(26,58,143,0.1) 0%, transparent 60%),
            radial-gradient(circle at 90% 80%, rgba(201,168,76,0.06) 0%, transparent 50%);
        }
        .page-content { 
          position:relative; z-index:2; 
          max-width: 1600px; width: 100%; margin: 0 auto; padding: 0 1.5rem; 
          flex-grow: 1; display: flex; flex-direction: column; 
        }

        /* MULTI-SECTION LAYOUT */
        .dashboard-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2.5rem;
          flex-grow: 1;
          align-items: stretch;
          animation: heroReveal 1s ease both;
          min-height: 70vh;
        }

        /* CALENDAR SECTION */
        .cal-shell {
          background: rgba(10, 15, 30, 0.7);
          border-radius: 20px;
          border: 1px solid rgba(100, 149, 237, 0.15);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          padding: 2.5rem;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
          display: flex; flex-direction: column;
        }
        .cal-header {
          display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-shrink: 0;
        }
        .cal-title-area { text-align: center; flex-grow: 1; }
        .cal-subtitle { font-size: 0.75rem; color: var(--gold); letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 0.2rem; font-weight: 700; }
        .cal-title { font-size: 2rem; font-weight: 800; color: white; margin-bottom: 0.2rem; }
        .cal-events-count { font-size: 0.85rem; color: var(--silver); }
        .cal-nav-btn {
          background: transparent; border: none; color: var(--gold); font-size: 1.8rem; cursor: pointer; padding: 0.5rem; transition: transform 0.2s;
        }
        .cal-nav-btn:hover { transform: scale(1.1); color: var(--gold-light); }

        .cal-grid {
          display: grid; 
          grid-template-columns: repeat(7, 1fr); 
          grid-template-rows: auto auto;
          grid-auto-rows: 1fr;
          gap: 12px;
          flex-grow: 1;
        }
        .cal-day-header {
          text-align: center; font-size: 0.9rem; color: var(--silver); padding-bottom: 1rem; font-weight: 600;
        }
        .cal-day {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 14px;
          padding: 1rem 0.5rem;
          text-align: center;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          border: 1px solid rgba(255,255,255,0.05);
          transition: all 0.2s; 
          height: 100%;
          min-height: 80px;
        }
        .cal-day.interactive {
          cursor: pointer;
          background: rgba(26, 58, 143, 0.15);
          border-color: rgba(100, 149, 237, 0.3);
        }
        .cal-day.interactive:hover, .cal-day.interactive.selected {
          background: rgba(201, 168, 76, 0.15); border-color: rgba(201, 168, 76, 0.5); transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(201, 168, 76, 0.1);
        }
        .cal-day.muted { opacity: 0.3; pointer-events: none; border-color: transparent; }
        .cal-day-num { font-size: 1.3rem; font-weight: 700; color: white; margin-bottom: 0.5rem; }
        .cal-day-dot { width: 8px; height: 8px; background: var(--gold); border-radius: 50%; box-shadow: 0 0 10px var(--gold); }

        /* MAP SIDE PANEL */
        .map-panel {
          background: rgba(10, 15, 30, 0.7);
          border-radius: 20px;
          border: 1px solid rgba(100, 149, 237, 0.15);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          padding: 1.5rem;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
          display: flex; flex-direction: column;
          overflow: hidden;
        }
        .map-container {
          flex-grow: 1;
          border-radius: 12px;
          overflow: hidden;
          background: #111;
          border: 1px solid rgba(255,255,255,0.1);
          min-height: 350px;
          position: relative;
        }
        .event-details-card {
          padding: 1.5rem;
          background: rgba(255,255,255,0.03);
          border-radius: 12px;
          margin-top: 1.5rem;
          border: 1px solid rgba(255,255,255,0.05);
          animation: slideUp 0.3s ease;
        }
        .modal-badge {
          display: inline-block; background: rgba(100,149,237,0.15); color: rgba(100,149,237,1);
          padding: 6px 14px; border-radius: 99px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;
          margin-bottom: 1rem; border: 1px solid rgba(100,149,237,0.3);
        }
        .modal-title { font-size: 1.6rem; font-weight: 800; color: white; margin-bottom: 1rem; line-height: 1.2; }
        .modal-detail { font-size: 0.95rem; color: var(--silver); margin-bottom: 0.5rem; display: flex; align-items: flex-start; gap: 8px; }
        .modal-detail span { color: var(--gold); font-weight: 700; width: 75px; flex-shrink: 0; }
        .no-event-selected {
          text-align: center;
          color: var(--silver);
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          border: 1px dashed rgba(255,255,255,0.1);
          border-radius: 12px;
          margin-top: 1.5rem;
        }

        @keyframes heroReveal {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media(max-width: 1000px) {
          .dashboard-layout { display: flex; flex-direction: column; }
          .cal-day { min-height: 80px; }
          .page-content { height: auto; display: block; }
          .map-panel { min-height: 600px; }
        }
        @media(max-width: 600px) {
          .cal-grid { gap: 6px; }
          .cal-day { min-height: 60px; padding: 0.5rem 0.2rem; }
        }
      `}</style>
      
      <div className="calendar-page-bg"/>

      <div className="page-content">
        <div className="dashboard-layout">
          
          {/* LEFT COLUMN: CALENDAR */}
          <div className="cal-shell">
            <div className="cal-header">
              <button className="cal-nav-btn">&lt;</button>
              <div className="cal-title-area">
                <div className="cal-subtitle">Key Club Events</div>
                <div className="cal-title">January 2026</div>
                <div className="cal-events-count">{Object.keys(eventsMap).length} upcoming events</div>
              </div>
              <button className="cal-nav-btn">&gt;</button>
            </div>
            
            <div className="cal-grid">
              {daysOfWeek.map(d => <div key={d} className="cal-day-header">{d}</div>)}
              {calendarDays.map((day, i) => {
                const hasEvent = day.currentMonth && eventsMap[day.date];
                const isSelected = selectedEvent && selectedEvent === eventsMap[day.date];
                return (
                  <div 
                    key={i} 
                    className={`cal-day ${!day.currentMonth ? 'muted' : ''} ${hasEvent ? 'interactive' : ''} ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleDayClick(day)}
                  >
                    <span className="cal-day-num">{day.date}</span>
                    {hasEvent && <span className="cal-day-dot"></span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: MAP & DETAILS */}
          <aside className="map-panel">
             <div className="map-container">
               <iframe 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                loading="lazy" 
                allowFullScreen={false}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedEvent ? selectedEvent.loc : defaultLoc)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
              />
             </div>
             
             {selectedEvent ? (
               <div className="event-details-card">
                 <span className="modal-badge">{selectedEvent.type}</span>
                 <h2 className="modal-title">{selectedEvent.title}</h2>
                 <div className="modal-detail">
                   <span>Time:</span> <div>{selectedEvent.time}</div>
                 </div>
                 <div className="modal-detail">
                   <span>Location:</span> <div>{selectedEvent.loc}</div>
                 </div>
               </div>
             ) : (
               <div className="no-event-selected">
                 <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "1rem", opacity: 0.5 }}>
                   <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                   <line x1="16" y1="2" x2="16" y2="6"></line>
                   <line x1="8" y1="2" x2="8" y2="6"></line>
                   <line x1="3" y1="10" x2="21" y2="10"></line>
                 </svg>
                 <p>Select a date on the calendar to view event details and location.</p>
               </div>
             )}
          </aside>

        </div>
      </div>
    </main>
  );
}
