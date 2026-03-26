import React, { useState, useEffect } from "react";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const allEvents: Record<string, { title: string; time: string; loc: string; type: string; desc: string }[]> = {
  "2026-03-04": [{ title: "Wax Museum", time: "8:00 AM – 1:00 PM", loc: "Morgan Elementary", type: "Community", desc: "Help kids at the educational wax museum." }],
  "2026-03-07": [{ title: "Park Cleanup", time: "9:00 AM – 12:00 PM", loc: "Mary Jo Peckham Park", type: "Service", desc: "Help keep our community parks beautiful!" }],
  "2026-03-24": [{ title: "Annual International Festival", time: "10:00 AM – 2:00 PM", loc: "Lindsey Elementary", type: "Community", desc: "Volunteer at the international festival." }],
  "2026-03-27": [{ title: "Easter Family Fun Day", time: "1:00 PM – 4:00 PM", loc: "Wendt Hall", type: "Community", desc: "Help organize games and activities for families." }],
  "2026-03-28": [{ title: "Bayou City Art Festival", time: "9:00 AM – 5:00 PM", loc: "Downtown Houston", type: "Service", desc: "Volunteer at the art booths and help coordinate artists." }],
  "2026-04-10": [{ title: "Key Club General Meeting", time: "4:00 PM – 5:00 PM", loc: "Fulshear High School Library", type: "Meeting", desc: "Monthly general meeting. Required for active status." }]
};

const TYPE_COLOR: Record<string, string> = {
  Meeting: "var(--blue, #3b82f6)",
  Volunteer: "var(--gold, #c9a84c)",
  Service: "#10b981",
  Community: "#a855f7",
  Recurring: "#f43f5e"
};

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1)); // March 2026
  const [view, setView] = useState<"month" | "list">("month");
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  useEffect(() => {
    const els = document.querySelectorAll(".fade-in");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); });
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
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return allEvents[key] || [];
  };

  const sortedKeys = Object.keys(allEvents).sort();
  const monthEvents = Array.from({ length: daysInMonth }).flatMap((_, i) => {
    const day = i + 1;
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return (allEvents[key] || []).map(e => ({ ...e, date: key, dayNum: day }));
  }).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <main className="flex-grow pt-4 pb-16">
      <style>{`
        .cal-shell { max-width: 1080px; margin: 0 auto; padding: 0 1.5rem; }
        .page-header { text-align: center; margin-bottom: 2rem; }
        .page-header h1 { font-size: clamp(2rem, 4vw, 3rem); font-weight: 900; color: white; margin-bottom: 0.5rem; }
        .page-header h1 span { color: var(--gold, #c9a84c); font-style: italic; }
        .page-header p { color: var(--silver, #aebdcc); font-size: 0.95rem; }

        .view-toggle { display: flex; margin: 0 auto 2rem; width: fit-content; background: rgba(10, 15, 30, 0.8); border: 1px solid rgba(255,255,255,0.1); border-radius: 30px; padding: 4px; }
        .v-btn { padding: 0.5rem 1.5rem; border-radius: 20px; font-size: 0.8rem; font-weight: 700; color: var(--silver); background: transparent; border: none; transition: 0.3s; cursor: pointer; }
        .v-btn.active { background: var(--blue, #1d4ed8); color: white; box-shadow: 0 0 15px rgba(29, 78, 216, 0.5); }

        .cal-grid { display: grid; grid-template-columns: 1.3fr 1fr; gap: 1.5rem; }
        .glass-box { background: rgba(15, 20, 35, 0.6); backdrop-filter: blur(12px); border: 1px solid rgba(201, 168, 76, 0.15); border-radius: 20px; padding: 1.5rem; box-shadow: 0 8px 32px rgba(0,0,0,0.3); }

        .m-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .m-title { font-size: 1.5rem; font-weight: 800; color: white; }
        .m-sub { font-size: 0.75rem; color: rgba(255,255,255,0.5); text-align: center; }
        .n-btn { width: 32px; height: 32px; border-radius: 50%; background: rgba(255,255,255,0.05); color: white; border: 1px solid rgba(255,255,255,0.1); display: grid; place-items: center; cursor: pointer; transition: 0.2s; }
        .n-btn:hover { background: rgba(201, 168, 76, 0.2); border-color: var(--gold); }
        .t-btn { display: block; margin: 0 auto 1.5rem; background: transparent; color: var(--gold); border: 1px solid var(--gold); font-size: 0.7rem; font-weight: 700; padding: 3px 12px; border-radius: 12px; cursor: pointer; }

        .d-head { display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; margin-bottom: 0.5rem; }
        .d-lbl { font-size: 0.65rem; font-weight: 800; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.1em; }
        .d-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; }
        .d-cell { aspect-ratio: 1; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.03); border-radius: 12px; padding: 6px; display: flex; flex-direction: column; cursor: pointer; transition: 0.2s; }
        .d-cell:hover { border-color: var(--gold); background: rgba(201, 168, 76, 0.1); transform: translateY(-2px); }
        .d-num { font-size: 0.85rem; font-weight: 700; color: white; margin-bottom: auto; }
        .d-num.off { color: rgba(255,255,255,0.1); }
        .d-dots { display: flex; flex-wrap: wrap; gap: 3px; }
        .d-dot { width: 5px; height: 5px; border-radius: 50%; }

        .leg { display: flex; justify-content: center; gap: 1rem; margin-top: 1.5rem; flex-wrap: wrap; }
        .leg-i { display: flex; align-items: center; gap: 6px; font-size: 0.65rem; color: rgba(255,255,255,0.5); text-transform: uppercase; font-weight: 700; }

        .e-head { display: flex; justify-content: space-between; margin-bottom: 1.5rem; }
        .e-title { font-size: 0.8rem; font-weight: 800; color: white; letter-spacing: 0.1em; }
        .e-scrl { display: flex; flex-direction: column; gap: 1rem; max-height: 450px; overflow-y: auto; padding-right: 0.5rem; }
        .e-scrl::-webkit-scrollbar { width: 4px; }
        .e-scrl::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        .e-card { display: flex; gap: 1rem; padding: 0.85rem; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; cursor: pointer; transition: 0.2s; }
        .e-card:hover { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1); }
        .e-date { text-align: center; min-width: 40px; }
        .e-day { font-size: 1.5rem; font-weight: 900; color: white; line-height: 1; }
        .e-mon { font-size: 0.65rem; font-weight: 800; color: var(--gold); text-transform: uppercase; margin-top: 4px; }
        .e-inf { flex-grow: 1; }
        .e-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.3rem; }
        .e-nm { font-size: 0.95rem; font-weight: 700; color: white; }
        .e-bdg { font-size: 0.55rem; font-weight: 800; padding: 3px 8px; border-radius: 10px; border: 1px solid currentColor; text-transform: uppercase; }
        .e-det { font-size: 0.75rem; color: rgba(255,255,255,0.5); margin-top: 2px; }

        .m-dim { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(5px); display: grid; place-items: center; z-index: 1000; }
        .m-box { background: var(--navy, #0a0f1e); border: 1px solid rgba(201, 168, 76, 0.4); border-radius: 20px; padding: 2rem; max-width: 480px; width: 90%; position: relative; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
        .m-cls { position: absolute; top: 1rem; right: 1rem; background: none; border: none; color: white; font-size: 1.2rem; cursor: pointer; width: 30px; height: 30px; border-radius: 50%; opacity: 0.5; }
        .m-cls:hover { opacity: 1; background: rgba(255,255,255,0.1); }
        .m-b { display: inline-block; font-size: 0.65rem; font-weight: 800; padding: 3px 10px; border-radius: 10px; border: 1px solid currentColor; margin-bottom: 0.8rem; text-transform: uppercase; }
        .m-t { font-size: 1.4rem; font-weight: 800; color: white; margin-bottom: 0.5rem; }
        .m-i { font-size: 0.85rem; color: rgba(255,255,255,0.7); margin-bottom: 0.3rem; }
        .m-d { margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.1); font-size: 0.85rem; color: rgba(255,255,255,0.8); line-height: 1.5; }
        .m-map { width: 100%; height: 200px; border: 0; border-radius: 12px; margin-top: 1rem; background: #111; }

        @media (max-width: 900px) { .cal-grid { grid-template-columns: 1fr; } }
      `}</style>
      <div className="cal-shell fade-in">
        <div className="page-header">
          <h1>Event <span>Calendar</span></h1>
          <p>Browse upcoming meetings, volunteer events, and service opportunities.</p>
        </div>
        <div className="view-toggle">
          <button className={`v-btn ${view==="month"?"active":""}`} onClick={()=>setView("month")}>MONTH</button>
          <button className={`v-btn ${view==="list"?"active":""}`} onClick={()=>setView("list")}>ALL EVENTS</button>
        </div>

        {view === "month" ? (
          <div className="cal-grid">
            <div className="glass-box">
              <div className="m-header">
                <button className="n-btn" onClick={prevMonth}>←</button>
                <div>
                  <div className="m-title">{MONTHS[month]} {year}</div>
                  <div className="m-sub">{monthEvents.length} events</div>
                </div>
                <button className="n-btn" onClick={nextMonth}>→</button>
              </div>
              <button className="t-btn" onClick={goToToday}>TODAY</button>
              <div className="d-head">{DAYS.map(d=><div key={d} className="d-lbl">{d}</div>)}</div>
              <div className="d-grid">
                {Array.from({length: firstDay}).map((_,i)=><div key={`e-${i}`} className="d-cell"><span className="d-num off"></span></div>)}
                {Array.from({length: daysInMonth}).map((_,i)=>{
                  const day = i+1; const evs = getEventsForDate(day);
                  return (
                    <div key={day} className="d-cell" onClick={()=>evs.length>0 && setSelectedEvent({...evs[0], date: `${year}-${month+1}-${day}`})}>
                      <span className="d-num">{day}</span>
                      <div className="d-dots">{evs.map((e,idx)=><div key={idx} className="d-dot" style={{background: TYPE_COLOR[e.type]||'#fff'}}/>)}</div>
                    </div>
                  )
                })}
              </div>
              <div className="leg">
                {Object.keys(TYPE_COLOR).map(t => (
                  <div key={t} className="leg-i"><div className="d-dot" style={{background: TYPE_COLOR[t]}}/> {t}</div>
                ))}
              </div>
            </div>

            <div className="glass-box">
              <div className="e-head">
                <div className="e-title">{MONTHS[month].substring(0,3)} EVENTS</div>
                <div className="m-sub">{monthEvents.length} scheduled</div>
              </div>
              <div className="e-scrl">
                {monthEvents.length>0 ? monthEvents.map((e,i)=>(
                  <div key={i} className="e-card" onClick={()=>setSelectedEvent(e)}>
                    <div className="e-date"><div className="e-day">{e.dayNum}</div><div className="e-mon">{MONTHS[month].substring(0,3)}</div></div>
                    <div className="e-inf">
                      <div className="e-top">
                        <div className="e-nm">{e.title}</div>
                        <div className="e-bdg" style={{color: TYPE_COLOR[e.type]||'#fff'}}>{e.type}</div>
                      </div>
                      <div className="e-det">📍 {e.loc}</div>
                      <div className="e-det">🕒 {e.time}</div>
                    </div>
                  </div>
                )) : <p style={{color:'var(--silver)', fontSize:'0.85rem', textAlign:'center', marginTop:'1rem'}}>No events.</p>}
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-box" style={{maxWidth:'700px', margin:'0 auto'}}>
             <div className="e-head">
                <div className="e-title">ALL EVENTS</div>
              </div>
              <div className="e-scrl" style={{maxHeight:'600px'}}>
                {sortedKeys.flatMap(k => allEvents[k].map(e=>{
                  const [y,m,d] = k.split("-"); const dt = new Date(+y, +m-1, +d);
                  return (
                    <div key={k+e.title} className="e-card" onClick={()=>setSelectedEvent({...e, date:k})}>
                      <div className="e-date"><div className="e-day">{dt.getDate()}</div><div className="e-mon">{MONTHS[dt.getMonth()].substring(0,3)}</div></div>
                      <div className="e-inf">
                        <div className="e-top"><div className="e-nm">{e.title}</div><div className="e-bdg" style={{color:TYPE_COLOR[e.type]||'#fff'}}>{e.type}</div></div>
                        <div className="e-det">📍 {e.loc}</div><div className="e-det">🕒 {e.time}</div>
                      </div>
                    </div>
                  )
                }))}
              </div>
          </div>
        )}

        {selectedEvent && (
          <div className="m-dim" onClick={()=>setSelectedEvent(null)}>
            <div className="m-box" onClick={e=>e.stopPropagation()}>
              <button className="m-cls" onClick={()=>setSelectedEvent(null)}>✕</button>
              <div className="m-b" style={{color:TYPE_COLOR[selectedEvent.type]||'#fff'}}>{selectedEvent.type}</div>
              <div className="m-t">{selectedEvent.title}</div>
              <div className="m-i">🕒 {selectedEvent.time}</div>
              <div className="m-i">📍 {selectedEvent.loc}</div>
              <div className="m-d">{selectedEvent.desc}</div>
              <iframe className="m-map" src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedEvent.loc)}&t=&z=13&ie=UTF8&iwloc=&output=embed`} loading="lazy" />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
