import React, { useState, useEffect } from "react";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const allEvents: Record<string, { title: string; time: string; loc: string; type: string; desc: string }[]> = {
  "2024-09-01": [{ title: "Lunches of Love", time: "Throughout the year", loc: "Various", type: "Recurring", desc: "Help pack and deliver lunches." }],
  "2024-09-13": [{ title: "Family Movie Night", time: "TBA", loc: "TBA", type: "Community", desc: "Enjoy a movie night with the community." }],
  "2024-09-19": [{ title: "Painting and Pasta", time: "TBA", loc: "21211 W Bellfort St, Richmond, TX 77406", type: "Community", desc: "Enjoy painting and pasta." }],
  "2024-09-20": [{ title: "Run Houston UH 10K & 5K", time: "TBA", loc: "3874 Holman St, Houston, TX 77004", type: "Service", desc: "Volunteer passing out water." }],
  "2024-10-01": [{ title: "Lunches of Love", time: "Throughout the year", loc: "Various", type: "Recurring", desc: "Help pack and deliver lunches." }],
  "2024-10-07": [{ title: "Pumpkin Patch Unloading", time: "TBA", loc: "TBA", type: "Service", desc: "Help unload pumpkins." }],
  "2024-10-10": [{ title: "ARTreach Festival", time: "TBA", loc: "6501 Memorial Dr, Houston, TX 77007", type: "Service", desc: "Volunteer at the festival." }],
  "2024-10-11": [{ title: "Katy Rice Harvest Festival", time: "TBA", loc: "5712 2nd St, Katy, TX 77493", type: "Community", desc: "Enjoy the harvest festival." }, { title: "Pumpkin Patch", time: "TBA", loc: "TBA", type: "Service", desc: "Pumpkin Patch volunteering." }],
  "2024-10-17": [{ title: "Movie Night", time: "TBA", loc: "32720 FM 1093, Fulshear, TX 77441", type: "Community", desc: "Movie night at Morgan Elementary." }],
  "2024-10-18": [{ title: "DA Bike Ride for Survivors", time: "TBA", loc: "TBA", type: "Service", desc: "Bike ride service event." }],
  "2024-10-22": [{ title: "Bowie Fall Festival", time: "TBA", loc: "2304 3rd St, Rosenberg, TX 77471", type: "Community", desc: "Fall festival fun." }],
  "2024-10-25": [{ title: "LOBT Trunk or Treat", time: "TBA", loc: "11344 Rancho Bella Pkwy, Richmond, TX 77406", type: "Community", desc: "Trunk or treat event." }, { title: "Fall Festival", time: "TBA", loc: "TBA", type: "Community", desc: "Fall festival." }],
  "2024-11-01": [{ title: "Lunches of Love", time: "Throughout the year", loc: "Various", type: "Recurring", desc: "Help pack and deliver lunches." }],
  "2024-11-13": [{ title: "International Fest", time: "TBA", loc: "21211 W Bellfort St, Richmond, TX 77406", type: "Community", desc: "International festival." }],
  "2024-11-15": [{ title: "Adopt a Highway", time: "TBA", loc: "FM 1489, Simonton, TX 77476", type: "Service", desc: "Highway cleanup event." }],
  "2024-12-01": [{ title: "Cross Country Banquet", time: "TBA", loc: "9302 Charger Way, Fulshear, TX 77441", type: "Community", desc: "Banquet event." }, { title: "Lunches of Love", time: "Throughout the year", loc: "Various", type: "Recurring", desc: "Help pack and deliver lunches." }],
  "2024-12-07": [{ title: "LOBT Christmas Event", time: "TBA", loc: "Lakes of Bella Terra Clubhouse, Richmond, TX", type: "Community", desc: "Christmas celebration." }],
  "2024-12-13": [{ title: "Coastal Prairie Conservancy", time: "TBA", loc: "Coastal Prairie Conservancy, Katy, TX", type: "Service", desc: "Conservancy volunteering." }],
  "2024-12-16": [{ title: "Christmas Carols", time: "TBA", loc: "21211 W Bellfort St, Richmond, TX 77406", type: "Community", desc: "Singing carols." }],
  "2025-01-01": [{ title: "Lunches of Love", time: "Throughout the year", loc: "Various", type: "Recurring", desc: "Help pack and deliver lunches." }],
  "2025-01-10": [{ title: "Advanced Academics UIL", time: "TBA", loc: "4400 FM 359, Richmond, TX 77406", type: "Service", desc: "UIL academic volunteering." }],
  "2025-01-16": [{ title: "Melton Elementary Movie Night", time: "TBA", loc: "21211 W Bellfort St, Richmond, TX 77406", type: "Community", desc: "Movie night." }],
  "2025-01-31": [{ title: "Houston Food Bank", time: "TBA", loc: "535 Portwall St, Houston, TX 77029", type: "Service", desc: "Sorting food at the food bank." }],
  "2025-02-01": [{ title: "Lunches of Love", time: "Throughout the year", loc: "Various", type: "Recurring", desc: "Help pack and deliver lunches." }],
  "2025-02-06": [{ title: "Father Daughter Dance", time: "TBA", loc: "32720 FM 1093, Fulshear, TX 77441", type: "Community", desc: "Dance volunteering." }],
  "2025-02-07": [{ title: "Exposing Black Artistry", time: "TBA", loc: "1522 Texas Pkwy, Missouri City, TX 77489", type: "Service", desc: "Artistry event volunteering." }],
  "2025-02-08": [{ title: "Katy Half Marathon & 5K", time: "TBA", loc: "555 Katy Fort Bend Rd, Katy, TX 77494", type: "Service", desc: "Marathon volunteering." }],
  "2025-02-20": [{ title: "Daddy Daughter Dance", time: "TBA", loc: "2431 Joan Collier Trace, Katy, TX 77494", type: "Community", desc: "Dance volunteering." }, { title: "Daddy Daughter Dance", time: "TBA", loc: "2901 C A Johnson Dr, Rosenberg, TX 77471", type: "Community", desc: "Dance volunteering." }],
  "2025-02-27": [{ title: "Father Daughter Dance", time: "TBA", loc: "21211 W Bellfort St, Richmond, TX 77406", type: "Community", desc: "Dance volunteering." }],
  "2025-03-01": [{ title: "Lunches of Love", time: "Throughout the year", loc: "Various", type: "Recurring", desc: "Help pack and deliver lunches." }],
  "2025-03-04": [{ title: "Wax Museum", time: "TBA", loc: "32720 FM 1093, Fulshear, TX 77441", type: "Community", desc: "Help kids at the educational wax museum." }],
  "2025-03-07": [{ title: "Park Cleanup", time: "TBA", loc: "5597 Gardenia Ln, Katy, TX 77493", type: "Service", desc: "Help keep our community parks beautiful!" }],
  "2025-03-24": [{ title: "Annual International Festival", time: "TBA", loc: "2431 Joan Collier Trace, Katy, TX 77494", type: "Community", desc: "Volunteer at the international festival." }],
  "2025-03-27": [{ title: "Easter Family Fun Day", time: "TBA", loc: "Wendt Hall, Rosenberg, TX", type: "Community", desc: "Help organize games and activities for families." }],
  "2025-03-28": [{ title: "Bayou City Art Festival", time: "TBA", loc: "Downtown Houston, TX", type: "Service", desc: "Volunteer at the art booths." }],
};

const TYPE_COLOR: Record<string, string> = {
  Meeting: "var(--blue, #3b82f6)",
  Volunteer: "var(--gold, #c9a84c)",
  Service: "#10b981",
  Community: "#a855f7",
  Recurring: "#f43f5e"
};

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 2, 1)); // March 2025
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
    <main className="flex-grow pb-16" style={{ marginTop: '8rem' }}>
      <style>{`
        .cal-shell { max-width: 1200px; margin: 0 auto; padding: 0 5%; font-family: 'Inter', sans-serif; }
        .page-header { text-align: center; margin-bottom: 3rem; }
        .page-header h1 { font-size: clamp(2.2rem, 4vw, 3.5rem); font-weight: 900; color: white; margin-bottom: 0.5rem; letter-spacing: -0.02em; }
        .page-header h1 span { background: linear-gradient(135deg, #fff 0%, var(--gold-light, #fde047) 50%, var(--gold, #c9a84c) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-style: normal; }
        .page-header p { color: var(--silver, #aebdcc); font-size: 1rem; max-width: 600px; margin: 0 auto; line-height: 1.6; }

        .view-toggle { display: flex; margin: 0 auto 2.5rem; width: fit-content; background: rgba(15, 20, 35, 0.6); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 40px; padding: 6px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2); }
        .v-btn { padding: 0.6rem 2rem; border-radius: 30px; font-size: 0.8rem; font-weight: 800; letter-spacing: 0.05em; color: var(--silver); background: transparent; border: none; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); cursor: pointer; text-transform: uppercase; }
        .v-btn.active { background: linear-gradient(135deg, var(--blue, #1d4ed8), #3b82f6); color: white; box-shadow: 0 4px 20px rgba(59, 130, 246, 0.4); transform: scale(1.02); border: 1px solid rgba(255,255,255,0.1); }

        .cal-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 2rem; }
        .glass-box { background: linear-gradient(145deg, rgba(20, 25, 45, 0.85), rgba(10, 15, 30, 0.95)); backdrop-filter: blur(30px); -webkit-backdrop-filter: blur(30px); border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 28px; padding: 2rem; box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.05), 0 20px 40px rgba(0, 0, 0, 0.4); transition: transform 0.4s ease, border-color 0.4s ease; }
        .glass-box:hover { border-color: rgba(255, 255, 255, 0.2); }

        .m-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .m-title { font-size: 1.6rem; font-weight: 900; color: white; letter-spacing: -0.01em; }
        .m-sub { font-size: 0.8rem; color: rgba(255,255,255,0.6); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 4px; }
        .n-btn { width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.05); color: white; border: 1px solid rgba(255,255,255,0.1); display: grid; place-items: center; cursor: pointer; transition: all 0.3s ease; font-size: 1.1rem; }
        .n-btn:hover { background: rgba(255,255,255,0.15); border-color: rgba(255,255,255,0.3); transform: scale(1.1); box-shadow: 0 0 15px rgba(255,255,255,0.1); }
        .t-btn { display: block; margin: 0 auto 2rem; background: rgba(201, 168, 76, 0.1); color: var(--gold, #c9a84c); border: 1px solid rgba(201, 168, 76, 0.4); font-size: 0.75rem; font-weight: 800; letter-spacing: 0.1em; padding: 6px 20px; border-radius: 16px; cursor: pointer; transition: all 0.3s ease; text-transform: uppercase; }
        .t-btn:hover { background: rgba(201, 168, 76, 0.2); transform: translateY(-2px); box-shadow: 0 4px 15px rgba(201, 168, 76, 0.2); }

        .d-head { display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; margin-bottom: 1rem; }
        .d-lbl { font-size: 0.75rem; font-weight: 800; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.15em; }
        .d-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; }
        .d-cell { aspect-ratio: 1; min-height: 80px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 10px; display: flex; flex-direction: column; justify-content: space-between; cursor: pointer; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); position: relative; overflow: hidden; }
        .d-cell:hover { border-color: rgba(255,255,255,0.2); background: rgba(255,255,255,0.08); transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.2); }
        .d-cell::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at top left, rgba(255,255,255,0.1), transparent 70%); opacity: 0; transition: 0.3s; }
        .d-cell:hover::before { opacity: 1; }
        .d-num { font-size: 1rem; font-weight: 800; color: white; margin-bottom: auto; z-index: 1; }
        .d-num.off { color: rgba(255,255,255,0.15); }
        .d-dots { display: flex; flex-wrap: wrap; gap: 4px; z-index: 1; }
        .d-dot { width: 6px; height: 6px; border-radius: 50%; box-shadow: 0 0 8px currentColor; }

        .leg { display: flex; justify-content: center; gap: 1.5rem; margin-top: 2rem; flex-wrap: wrap; padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.08); }
        .leg-i { display: flex; align-items: center; gap: 8px; font-size: 0.75rem; color: rgba(255,255,255,0.7); text-transform: uppercase; font-weight: 800; letter-spacing: 0.05em; }

        .e-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(255,255,255,0.08); }
        .e-title { font-size: 1.2rem; font-weight: 900; color: white; letter-spacing: 0.05em; }
        .e-scrl { display: flex; flex-direction: column; gap: 1rem; max-height: 500px; overflow-y: auto; padding-right: 0.5rem; }
        .e-scrl::-webkit-scrollbar { width: 6px; }
        .e-scrl::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 4px; }
        .e-scrl::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }
        .e-scrl::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.3); }
        
        .e-card { display: flex; gap: 1.2rem; padding: 1.2rem; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; cursor: pointer; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); position: relative; overflow: hidden; }
        .e-card::before { content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: var(--gold, #c9a84c); opacity: 0; transition: 0.3s; border-radius: 4px 0 0 4px; }
        .e-card:hover { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.2); transform: translateX(4px); box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
        .e-card:hover::before { opacity: 1; }
        .e-date { text-align: center; min-width: 50px; display: flex; flex-direction: column; justify-content: center; align-items: center; border-right: 1px solid rgba(255,255,255,0.1); padding-right: 1.2rem; }
        .e-day { font-size: 1.8rem; font-weight: 900; color: white; line-height: 1; }
        .e-mon { font-size: 0.7rem; font-weight: 800; color: var(--gold); text-transform: uppercase; margin-top: 6px; letter-spacing: 0.1em; }
        .e-inf { flex-grow: 1; display: flex; flex-direction: column; justify-content: center; }
        .e-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
        .e-nm { font-size: 1.05rem; font-weight: 800; color: white; line-height: 1.3; }
        .e-bdg { font-size: 0.6rem; font-weight: 900; padding: 4px 10px; border-radius: 12px; background: rgba(255,255,255,0.08); border: 1px solid currentColor; text-transform: uppercase; letter-spacing: 0.05em; }
        .e-det { font-size: 0.8rem; color: rgba(255,255,255,0.6); margin-top: 4px; display: flex; align-items: center; gap: 6px; }

        .m-dim { position: fixed; inset: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); display: grid; place-items: center; z-index: 9999; opacity: 0; animation: fadeIn 0.3s forwards; }
        @keyframes fadeIn { to { opacity: 1; } }
        .m-box { background: linear-gradient(180deg, rgba(20, 25, 45, 0.95), rgba(10, 15, 30, 0.98)); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 30px; padding: 3rem; max-width: 550px; width: 92%; position: relative; box-shadow: 0 25px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1); transform: translateY(20px); animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes slideUp { to { transform: translateY(0); } }
        .m-cls { position: absolute; top: 1.5rem; right: 1.5rem; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1); color: white; font-size: 1.2rem; cursor: pointer; width: 36px; height: 36px; border-radius: 50%; opacity: 0.8; display: grid; place-items: center; transition: all 0.3s ease; }
        .m-cls:hover { opacity: 1; background: rgba(255,255,255,0.2); transform: rotate(90deg); }
        .m-b { display: inline-block; font-size: 0.7rem; font-weight: 900; padding: 6px 14px; border-radius: 20px; background: rgba(255,255,255,0.05); border: 1px solid currentColor; margin-bottom: 1.2rem; text-transform: uppercase; letter-spacing: 0.1em; box-shadow: 0 4px 15px rgba(0,0,0,0.2); }
        .m-t { font-size: 1.8rem; font-weight: 900; color: white; margin-bottom: 0.8rem; line-height: 1.2; letter-spacing: -0.02em; }
        .m-i { font-size: 0.9rem; color: rgba(255,255,255,0.7); margin-bottom: 0.5rem; display: flex; align-items: center; gap: 8px; }
        .m-d { margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.1); font-size: 1rem; color: rgba(255,255,255,0.8); line-height: 1.6; }
        .m-map { width: 100%; height: 250px; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; margin-top: 1.5rem; background: #111; box-shadow: 0 10px 30px rgba(0,0,0,0.3); transition: transform 0.3s ease; }
        .m-map:hover { transform: scale(1.02); border-color: rgba(255,255,255,0.2); }

        @media (max-width: 1024px) { .cal-grid { grid-template-columns: 1fr; gap: 3rem; } }
        @media (max-width: 768px) {
          .cal-shell { padding: 0 1.5rem; }
          .page-header h1 { font-size: 2.2rem; }
          .d-cell { min-height: 60px; padding: 6px; border-radius: 12px; }
          .e-card { padding: 1rem; }
          .m-box { padding: 2rem; }
          .m-t { font-size: 1.4rem; }
        }
        @media (max-width: 480px) {
          .d-lbl { font-size: 0.6rem; }
          .d-num { font-size: 0.85rem; }
          .e-nm { font-size: 0.95rem; }
          .e-day { font-size: 1.4rem; }
          .e-date { padding-right: 0.8rem; min-width: 40px; }
          .m-box { padding: 1.5rem; border-radius: 24px; }
        }
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
          <div className="glass-box" style={{maxWidth:'750px', margin:'0 auto'}}>
             <div className="e-head">
                <div className="e-title">ALL EVENTS</div>
              </div>
              <div className="e-scrl" style={{maxHeight:'650px'}}>
                {sortedKeys.flatMap(k => allEvents[k].map(e=>{
                  const [y,m,d] = k.split("-"); const dt = new Date(+y, +m-1, +d);
                  return (
                    <div key={k+e.title} className="e-card" onClick={()=>setSelectedEvent({...e, date:k})}>
                      <div className="e-date"><div className="e-day">{dt.getDate()}</div><div className="e-mon">{MONTHS[dt.getMonth()].substring(0,3)} {y}</div></div>
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
              {selectedEvent.loc !== "Various" && selectedEvent.loc !== "TBA" && (
                <iframe className="m-map" src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedEvent.loc)}&t=&z=13&ie=UTF8&iwloc=&output=embed`} loading="lazy" />
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
