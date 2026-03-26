import React, { useState, useEffect, useRef } from "react";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface EventData {
  title: string;
  time: string;
  loc: string;
  type: string;
  desc: string;
}

const allEvents: Record<string, EventData[]> = {
  "2024-09-01": [{ title: "Lunches of Love", time: "Throughout the year", loc: "Fulshear Community Center, 8525 FM 359, Fulshear, TX 77441", type: "Recurring", desc: "Help pack and deliver lunches to families in need across the community." }],
  "2024-09-13": [{ title: "Family Movie Night", time: "6:30 PM – 9:00 PM", loc: "Morgan Elementary, 32720 FM 1093, Fulshear, TX 77441", type: "Community", desc: "Enjoy a movie night with the community. Volunteers help set up seating, serve snacks, and clean up afterwards." }],
  "2024-09-19": [{ title: "Painting and Pasta", time: "5:00 PM – 8:00 PM", loc: "21211 W Bellfort St, Richmond, TX 77406", type: "Community", desc: "A fun evening of painting and pasta for families. Help set up art stations and serve food." }],
  "2024-09-20": [{ title: "Run Houston UH 10K & 5K", time: "7:00 AM – 11:00 AM", loc: "3874 Holman St, Houston, TX 77004", type: "Service", desc: "Volunteer passing out water and cheering on runners at the University of Houston." }],
  "2024-10-01": [{ title: "Lunches of Love", time: "Throughout the year", loc: "Fulshear Community Center, 8525 FM 359, Fulshear, TX 77441", type: "Recurring", desc: "Help pack and deliver lunches to families in need across the community." }],
  "2024-10-07": [{ title: "Pumpkin Patch Unloading", time: "8:00 AM – 12:00 PM", loc: "First United Methodist Church, 502 Hwy 36 S, Rosenberg, TX 77471", type: "Service", desc: "Help unload pumpkins for the annual church pumpkin patch fundraiser." }],
  "2024-10-10": [{ title: "ARTreach Festival", time: "10:00 AM – 4:00 PM", loc: "6501 Memorial Dr, Houston, TX 77007", type: "Service", desc: "Volunteer at the ARTreach community arts festival in Houston." }],
  "2024-10-11": [{ title: "Katy Rice Harvest Festival", time: "10:00 AM – 6:00 PM", loc: "5712 2nd St, Katy, TX 77493", type: "Community", desc: "Enjoy the harvest festival and help manage booths and activities." }, { title: "Pumpkin Patch", time: "9:00 AM – 1:00 PM", loc: "First United Methodist Church, 502 Hwy 36 S, Rosenberg, TX 77471", type: "Service", desc: "Help families pick pumpkins and manage the patch." }],
  "2024-10-17": [{ title: "Movie Night", time: "6:30 PM – 9:00 PM", loc: "32720 FM 1093, Fulshear, TX 77441", type: "Community", desc: "Movie night at Morgan Elementary. Help with setup and refreshments." }],
  "2024-10-18": [{ title: "DA Bike Ride for Survivors", time: "7:00 AM – 12:00 PM", loc: "Fort Bend County Fairgrounds, 4310 Hwy 36 S, Rosenberg, TX 77471", type: "Service", desc: "Support survivors at the annual District Attorney bike ride by volunteering at rest stops." }],
  "2024-10-22": [{ title: "Bowie Fall Festival", time: "5:00 PM – 8:00 PM", loc: "2304 3rd St, Rosenberg, TX 77471", type: "Community", desc: "Help run carnival games and booths at the fall festival." }],
  "2024-10-25": [{ title: "LOBT Trunk or Treat", time: "5:00 PM – 8:00 PM", loc: "11344 Rancho Bella Pkwy, Richmond, TX 77406", type: "Community", desc: "Trunk or treat in the Lakes of Bella Terra neighborhood. Decorate trunks and pass out candy." }, { title: "Fall Festival", time: "6:00 PM – 9:00 PM", loc: "Fulshear High School, 9302 Charger Way, Fulshear, TX 77441", type: "Community", desc: "The annual fall festival with games, food, and community fun." }],
  "2024-11-01": [{ title: "Lunches of Love", time: "Throughout the year", loc: "Fulshear Community Center, 8525 FM 359, Fulshear, TX 77441", type: "Recurring", desc: "Help pack and deliver lunches to families in need across the community." }],
  "2024-11-13": [{ title: "International Fest", time: "5:00 PM – 8:00 PM", loc: "21211 W Bellfort St, Richmond, TX 77406", type: "Community", desc: "Celebrate diversity at the international festival. Help decorate and run cultural booths." }],
  "2024-11-15": [{ title: "Adopt a Highway", time: "8:00 AM – 11:00 AM", loc: "FM 1489, Simonton, TX 77476", type: "Service", desc: "Highway cleanup event. Gloves and trash bags are provided." }],
  "2024-12-01": [{ title: "Cross Country Banquet", time: "6:00 PM – 8:30 PM", loc: "Fulshear High School, 9302 Charger Way, Fulshear, TX 77441", type: "Community", desc: "Celebrate the cross country season with athletes and families." }, { title: "Lunches of Love", time: "Throughout the year", loc: "Fulshear Community Center, 8525 FM 359, Fulshear, TX 77441", type: "Recurring", desc: "Help pack and deliver lunches to families in need across the community." }],
  "2024-12-07": [{ title: "LOBT Christmas Event", time: "4:00 PM – 8:00 PM", loc: "Lakes of Bella Terra Clubhouse, 11344 Rancho Bella Pkwy, Richmond, TX 77406", type: "Community", desc: "Christmas celebration with Santa photos, hot cocoa, and holiday crafts." }],
  "2024-12-13": [{ title: "Coastal Prairie Conservancy", time: "9:00 AM – 12:00 PM", loc: "Coastal Prairie Conservancy, 3000 Katy Hockley Cut Off Rd, Katy, TX 77493", type: "Service", desc: "Help with habitat restoration and trail maintenance at the conservancy." }],
  "2024-12-16": [{ title: "Christmas Carols", time: "6:00 PM – 8:00 PM", loc: "21211 W Bellfort St, Richmond, TX 77406", type: "Community", desc: "Spread holiday cheer by singing carols at the community center." }],
  "2025-01-01": [{ title: "Lunches of Love", time: "Throughout the year", loc: "Fulshear Community Center, 8525 FM 359, Fulshear, TX 77441", type: "Recurring", desc: "Help pack and deliver lunches to families in need across the community." }],
  "2025-01-10": [{ title: "Advanced Academics UIL", time: "8:00 AM – 3:00 PM", loc: "4400 FM 359, Richmond, TX 77406", type: "Service", desc: "Volunteer at the UIL academic competition — help with registration and timing." }],
  "2025-01-16": [{ title: "Melton Elementary Movie Night", time: "6:30 PM – 9:00 PM", loc: "21211 W Bellfort St, Richmond, TX 77406", type: "Community", desc: "Movie night at Melton Elementary. Set up, serve snacks, and clean up." }],
  "2025-01-31": [{ title: "Houston Food Bank", time: "9:00 AM – 12:00 PM", loc: "535 Portwall St, Houston, TX 77029", type: "Service", desc: "Sort and package food at the Houston Food Bank distribution center." }],
  "2025-02-01": [{ title: "Lunches of Love", time: "Throughout the year", loc: "Fulshear Community Center, 8525 FM 359, Fulshear, TX 77441", type: "Recurring", desc: "Help pack and deliver lunches to families in need across the community." }],
  "2025-02-06": [{ title: "Father Daughter Dance", time: "6:00 PM – 9:00 PM", loc: "Morgan Elementary, 32720 FM 1093, Fulshear, TX 77441", type: "Community", desc: "Help set up decorations and manage photo booths at the dance." }],
  "2025-02-07": [{ title: "Exposing Black Artistry", time: "6:00 PM – 9:00 PM", loc: "1522 Texas Pkwy, Missouri City, TX 77489", type: "Service", desc: "Support local artists at this cultural event celebrating Black artistry." }],
  "2025-02-08": [{ title: "Katy Half Marathon & 5K", time: "6:00 AM – 11:00 AM", loc: "555 Katy Fort Bend Rd, Katy, TX 77494", type: "Service", desc: "Volunteer at water stations along the marathon route." }],
  "2025-02-20": [{ title: "Daddy Daughter Dance", time: "6:00 PM – 9:00 PM", loc: "Lindsey Elementary, 2431 Joan Collier Trace, Katy, TX 77494", type: "Community", desc: "Help set up and photograph the Daddy Daughter Dance at Lindsey Elementary." }, { title: "Daddy Daughter Dance", time: "6:30 PM – 9:30 PM", loc: "Bowie Elementary, 2901 C A Johnson Dr, Rosenberg, TX 77471", type: "Community", desc: "Volunteer at the Bowie Elementary Daddy Daughter Dance." }],
  "2025-02-27": [{ title: "Father Daughter Dance", time: "6:00 PM – 9:00 PM", loc: "21211 W Bellfort St, Richmond, TX 77406", type: "Community", desc: "Help coordinate the Father Daughter Dance at the community center." }],
  "2025-03-01": [{ title: "Lunches of Love", time: "Throughout the year", loc: "Fulshear Community Center, 8525 FM 359, Fulshear, TX 77441", type: "Recurring", desc: "Help pack and deliver lunches to families in need across the community." }],
  "2025-03-04": [{ title: "Wax Museum", time: "9:00 AM – 2:00 PM", loc: "Morgan Elementary, 32720 FM 1093, Fulshear, TX 77441", type: "Community", desc: "Help kids at the educational wax museum — assist with costume prep and crowd management." }],
  "2025-03-07": [{ title: "Park Cleanup", time: "8:00 AM – 11:00 AM", loc: "Mary Jo Peckham Park, 5597 Gardenia Ln, Katy, TX 77493", type: "Service", desc: "Help keep our community parks beautiful! Bring water and wear closed-toe shoes." }],
  "2025-03-24": [{ title: "Annual International Festival", time: "5:00 PM – 8:00 PM", loc: "Lindsey Elementary, 2431 Joan Collier Trace, Katy, TX 77494", type: "Community", desc: "Volunteer at the international festival — help set up cultural booths and serve food." }],
  "2025-03-27": [{ title: "Easter Family Fun Day", time: "10:00 AM – 2:00 PM", loc: "Wendt Park Community Hall, 2100 5th St, Rosenberg, TX 77471", type: "Community", desc: "Help organize Easter egg hunts, games, and activities for families." }],
  "2025-03-28": [{ title: "Bayou City Art Festival", time: "10:00 AM – 6:00 PM", loc: "Sam Houston Park, 1000 Bagby St, Houston, TX 77002", type: "Service", desc: "Volunteer at the Bayou City Art Festival — manage art booths and direct visitors." }],
  "2025-04-01": [{ title: "Lunches of Love", time: "Throughout the year", loc: "Fulshear Community Center, 8525 FM 359, Fulshear, TX 77441", type: "Recurring", desc: "Help pack and deliver lunches to families in need across the community." }],
  "2025-04-05": [{ title: "Spring Community Cleanup", time: "8:00 AM – 12:00 PM", loc: "Fulshear Heritage Park, 30530 2nd St, Fulshear, TX 77441", type: "Service", desc: "Join us for a spring cleanup of community trails and parks." }],
  "2025-04-12": [{ title: "Earth Day Tree Planting", time: "9:00 AM – 1:00 PM", loc: "Cross Creek Ranch Nature Trail, 6450 Cross Creek Bend Ln, Fulshear, TX 77441", type: "Service", desc: "Celebrate Earth Day by planting native trees and shrubs along the nature trail." }],
  "2025-04-19": [{ title: "Spring Carnival", time: "11:00 AM – 4:00 PM", loc: "Fulshear High School, 9302 Charger Way, Fulshear, TX 77441", type: "Community", desc: "Help run games, face painting, and food stands at the spring carnival." }],
  "2025-05-01": [{ title: "Lunches of Love", time: "Throughout the year", loc: "Fulshear Community Center, 8525 FM 359, Fulshear, TX 77441", type: "Recurring", desc: "Help pack and deliver lunches to families in need across the community." }],
  "2025-05-10": [{ title: "Mother's Day 5K Fun Run", time: "7:00 AM – 10:00 AM", loc: "Freedom Park, 511 Tenth St, Katy, TX 77493", type: "Service", desc: "Volunteer at the Mother's Day fun run — hand out medals and water." }],
  "2025-05-17": [{ title: "End of Year Banquet", time: "6:00 PM – 9:00 PM", loc: "Fulshear High School, 9302 Charger Way, Fulshear, TX 77441", type: "Community", desc: "Celebrate the year's achievements with the Key Club. Awards, food, and fun!" }],
  "2026-02-03": [{ title: "Key Club General Meeting", time: "4:00 PM – 5:00 PM", loc: "Fulshear High School · LGI Room", type: "Meeting", desc: "Monthly general meeting — 1st Tuesday of each month at 4:00 PM. All members required to attend." }],
  "2026-03-03": [{ title: "Key Club General Meeting", time: "4:00 PM – 5:00 PM", loc: "Fulshear High School · LGI Room", type: "Meeting", desc: "Monthly general meeting — 1st Tuesday of each month at 4:00 PM. All members required to attend." }],
  "2026-04-07": [{ title: "Key Club General Meeting", time: "4:00 PM – 5:00 PM", loc: "Fulshear High School · LGI Room", type: "Meeting", desc: "Monthly general meeting — 1st Tuesday of each month at 4:00 PM. All members required to attend." }],
  "2026-05-05": [{ title: "Key Club General Meeting", time: "4:00 PM – 5:00 PM", loc: "Fulshear High School · LGI Room", type: "Meeting", desc: "Monthly general meeting — 1st Tuesday of each month at 4:00 PM. All members required to attend." }],
};

const TYPE_COLOR: Record<string, string> = {
  Meeting: "#3b82f6",
  Volunteer: "#eab308",
  Service: "#10b981",
  Community: "#a855f7",
  Recurring: "#f43f5e"
};

const TYPE_GRADIENT: Record<string, string> = {
  Meeting: "linear-gradient(135deg, #3b82f6, #60a5fa)",
  Volunteer: "linear-gradient(135deg, #eab308, #facc15)",
  Service: "linear-gradient(135deg, #10b981, #34d399)",
  Community: "linear-gradient(135deg, #a855f7, #c084fc)",
  Recurring: "linear-gradient(135deg, #f43f5e, #fb7185)"
};

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"month" | "list">("month");
  const [selectedEvent, setSelectedEvent] = useState<(EventData & { date: string; dayNum?: number }) | null>(null);
  const [animating, setAnimating] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = document.querySelectorAll(".cal-fade-in");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("cal-visible"); });
    }, { threshold: 0.1 });
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [view, currentDate]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const today = new Date();

  const prevMonth = () => {
    setAnimating(true);
    setTimeout(() => { setCurrentDate(new Date(year, month - 1, 1)); setAnimating(false); }, 200);
  };
  const nextMonth = () => {
    setAnimating(true);
    setTimeout(() => { setCurrentDate(new Date(year, month + 1, 1)); setAnimating(false); }, 200);
  };
  const goToToday = () => setCurrentDate(new Date());

  const getEventsForDate = (day: number) => {
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return allEvents[key] || [];
  };

  const isToday = (day: number) => today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;

  const sortedKeys = Object.keys(allEvents).sort();
  const monthEvents = Array.from({ length: daysInMonth }).flatMap((_, i) => {
    const day = i + 1;
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return (allEvents[key] || []).map(e => ({ ...e, date: key, dayNum: day }));
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const getMapUrl = (loc: string) => {
    return `https://maps.google.com/maps?q=${encodeURIComponent(loc)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  };

  const getDirectionsUrl = (loc: string) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(loc)}`;
  };

  return (
    <main className="flex-grow pb-16" style={{ marginTop: '8rem' }}>
      <style>{`
        .cal-fade-in { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .cal-visible { opacity: 1; transform: translateY(0); }

        .cal-shell { max-width: 1280px; margin: 0 auto; padding: 0 5%; font-family: 'Inter', sans-serif; }

        .cal-page-header { text-align: center; margin-bottom: 3.5rem; }
        .cal-page-header h1 { font-size: clamp(2.4rem, 4.5vw, 3.8rem); font-weight: 900; color: white; margin-bottom: 0.6rem; letter-spacing: -0.03em; }
        .cal-page-header h1 span { background: linear-gradient(135deg, #fff 0%, #fde047 40%, #c9a84c 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .cal-page-header p { color: #8899aa; font-size: 1.05rem; max-width: 550px; margin: 0 auto; line-height: 1.7; }

        .cal-view-toggle { display: flex; margin: 0 auto 3rem; width: fit-content; background: rgba(12, 16, 30, 0.7); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.08); border-radius: 50px; padding: 5px; box-shadow: 0 8px 32px rgba(0,0,0,0.3); }
        .cal-v-btn { padding: 0.65rem 2.2rem; border-radius: 40px; font-size: 0.75rem; font-weight: 800; letter-spacing: 0.08em; color: #8899aa; background: transparent; border: none; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); cursor: pointer; text-transform: uppercase; }
        .cal-v-btn.active { background: linear-gradient(135deg, #1d4ed8, #3b82f6); color: white; box-shadow: 0 4px 20px rgba(59, 130, 246, 0.4); }

        .cal-grid-layout { display: grid; grid-template-columns: 1.6fr 1fr; gap: 2.5rem; align-items: start; }

        .cal-glass { background: linear-gradient(160deg, rgba(18, 22, 42, 0.9), rgba(8, 12, 28, 0.97)); backdrop-filter: blur(30px); -webkit-backdrop-filter: blur(30px); border: 1px solid rgba(255,255,255,0.08); border-radius: 28px; padding: 2rem; box-shadow: 0 20px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05); transition: border-color 0.4s ease; position: relative; overflow: hidden; }
        .cal-glass::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent); }
        .cal-glass:hover { border-color: rgba(255,255,255,0.15); }

        .cal-m-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .cal-m-info { text-align: center; }
        .cal-m-title { font-size: 1.7rem; font-weight: 900; color: white; letter-spacing: -0.02em; transition: opacity 0.2s; }
        .cal-m-title.animating { opacity: 0.3; }
        .cal-m-sub { font-size: 0.75rem; color: rgba(255,255,255,0.45); font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 5px; }

        .cal-n-btn { width: 42px; height: 42px; border-radius: 50%; background: rgba(255,255,255,0.04); color: white; border: 1px solid rgba(255,255,255,0.08); display: grid; place-items: center; cursor: pointer; transition: all 0.3s ease; font-size: 1rem; }
        .cal-n-btn:hover { background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.25); transform: scale(1.1); box-shadow: 0 0 20px rgba(255,255,255,0.08); }

        .cal-t-btn { display: block; margin: 0 auto 1.8rem; background: rgba(201,168,76,0.08); color: #c9a84c; border: 1px solid rgba(201,168,76,0.3); font-size: 0.7rem; font-weight: 800; letter-spacing: 0.12em; padding: 6px 22px; border-radius: 20px; cursor: pointer; transition: all 0.3s ease; text-transform: uppercase; }
        .cal-t-btn:hover { background: rgba(201,168,76,0.15); transform: translateY(-2px); box-shadow: 0 6px 20px rgba(201,168,76,0.15); }

        .cal-d-head { display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; margin-bottom: 0.8rem; }
        .cal-d-lbl { font-size: 0.7rem; font-weight: 800; color: rgba(255,255,255,0.35); text-transform: uppercase; letter-spacing: 0.15em; padding: 8px 0; }

        .cal-d-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; }

        .cal-d-cell { aspect-ratio: 1; min-height: 72px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.04); border-radius: 14px; padding: 8px; display: flex; flex-direction: column; justify-content: space-between; cursor: pointer; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); position: relative; overflow: hidden; }
        .cal-d-cell:hover { border-color: rgba(255,255,255,0.18); background: rgba(255,255,255,0.06); transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0,0,0,0.2); }
        .cal-d-cell.has-events { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.08); }
        .cal-d-cell.today { border-color: rgba(59,130,246,0.5); background: rgba(59,130,246,0.08); box-shadow: 0 0 20px rgba(59,130,246,0.1); }
        .cal-d-cell.today .cal-d-num { color: #60a5fa; }

        .cal-d-num { font-size: 0.95rem; font-weight: 800; color: rgba(255,255,255,0.85); z-index: 1; }
        .cal-d-num.off { color: rgba(255,255,255,0.1); }

        .cal-d-dots { display: flex; flex-wrap: wrap; gap: 3px; z-index: 1; margin-top: auto; }
        .cal-d-dot { width: 6px; height: 6px; border-radius: 50%; box-shadow: 0 0 6px currentColor; transition: transform 0.2s; }
        .cal-d-cell:hover .cal-d-dot { transform: scale(1.3); }

        .cal-legend { display: flex; justify-content: center; gap: 1.2rem; margin-top: 1.8rem; flex-wrap: wrap; padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.06); }
        .cal-leg-i { display: flex; align-items: center; gap: 6px; font-size: 0.7rem; color: rgba(255,255,255,0.55); text-transform: uppercase; font-weight: 800; letter-spacing: 0.06em; }

        .cal-e-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .cal-e-title { font-size: 1.1rem; font-weight: 900; color: white; letter-spacing: 0.05em; text-transform: uppercase; }
        .cal-e-count { font-size: 0.75rem; color: rgba(255,255,255,0.4); font-weight: 700; }

        .cal-e-scrl { display: flex; flex-direction: column; gap: 0.8rem; max-height: 520px; overflow-y: auto; padding-right: 0.5rem; }
        .cal-e-scrl::-webkit-scrollbar { width: 4px; }
        .cal-e-scrl::-webkit-scrollbar-track { background: transparent; }
        .cal-e-scrl::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 4px; }
        .cal-e-scrl::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.25); }

        .cal-e-card { display: flex; gap: 1.1rem; padding: 1.1rem; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 18px; cursor: pointer; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); position: relative; overflow: hidden; }
        .cal-e-card::after { content: ''; position: absolute; top: 0; left: 0; width: 3px; height: 100%; opacity: 0; transition: 0.3s; border-radius: 3px 0 0 3px; }
        .cal-e-card:hover { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.15); transform: translateX(4px); box-shadow: 0 8px 24px rgba(0,0,0,0.25); }
        .cal-e-card:hover::after { opacity: 1; }

        .cal-e-date { text-align: center; min-width: 52px; display: flex; flex-direction: column; justify-content: center; align-items: center; border-right: 1px solid rgba(255,255,255,0.08); padding-right: 1.1rem; flex-shrink: 0; }
        .cal-e-day { font-size: 1.7rem; font-weight: 900; color: white; line-height: 1; }
        .cal-e-mon { font-size: 0.65rem; font-weight: 800; color: #c9a84c; text-transform: uppercase; margin-top: 5px; letter-spacing: 0.12em; }

        .cal-e-inf { flex-grow: 1; display: flex; flex-direction: column; justify-content: center; min-width: 0; }
        .cal-e-top { display: flex; justify-content: space-between; align-items: center; gap: 8px; margin-bottom: 0.4rem; }
        .cal-e-nm { font-size: 0.95rem; font-weight: 800; color: white; line-height: 1.3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .cal-e-bdg { font-size: 0.55rem; font-weight: 900; padding: 3px 10px; border-radius: 10px; text-transform: uppercase; letter-spacing: 0.06em; white-space: nowrap; flex-shrink: 0; }
        .cal-e-det { font-size: 0.75rem; color: rgba(255,255,255,0.5); display: flex; align-items: center; gap: 5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .cal-e-det + .cal-e-det { margin-top: 2px; }

        /* Modal */
        .cal-modal-dim { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); display: grid; place-items: center; z-index: 9999; opacity: 0; animation: calFadeIn 0.3s forwards; }
        @keyframes calFadeIn { to { opacity: 1; } }
        .cal-modal-box { background: linear-gradient(180deg, rgba(18, 22, 40, 0.97), rgba(8, 12, 25, 0.99)); border: 1px solid rgba(255,255,255,0.1); border-radius: 28px; padding: 0; max-width: 580px; width: 94%; position: relative; box-shadow: 0 30px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08); transform: translateY(20px); animation: calSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; overflow: hidden; }
        @keyframes calSlideUp { to { transform: translateY(0); } }

        .cal-modal-map-area { width: 100%; height: 220px; position: relative; background: rgba(0,0,0,0.3); }
        .cal-modal-map-area iframe { width: 100%; height: 100%; border: none; }
        .cal-modal-map-placeholder { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: linear-gradient(135deg, rgba(30,35,55,0.9), rgba(15,18,35,0.9)); }
        .cal-modal-map-placeholder span { font-size: 2.5rem; margin-bottom: 0.5rem; }
        .cal-modal-map-placeholder p { font-size: 0.8rem; color: rgba(255,255,255,0.5); }

        .cal-modal-content { padding: 2rem 2.2rem 2.2rem; }
        .cal-modal-cls { position: absolute; top: 1rem; right: 1rem; background: rgba(0,0,0,0.5); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.15); color: white; font-size: 1rem; cursor: pointer; width: 34px; height: 34px; border-radius: 50%; display: grid; place-items: center; transition: all 0.3s ease; z-index: 10; }
        .cal-modal-cls:hover { background: rgba(255,255,255,0.2); transform: rotate(90deg); }

        .cal-modal-badge { display: inline-block; font-size: 0.65rem; font-weight: 900; padding: 5px 14px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1rem; }
        .cal-modal-title { font-size: 1.6rem; font-weight: 900; color: white; margin-bottom: 1.2rem; line-height: 1.2; letter-spacing: -0.02em; }

        .cal-modal-info-row { display: flex; align-items: flex-start; gap: 10px; padding: 0.6rem 0; font-size: 0.88rem; color: rgba(255,255,255,0.7); border-bottom: 1px solid rgba(255,255,255,0.05); }
        .cal-modal-info-row:last-of-type { border-bottom: none; }
        .cal-modal-info-icon { font-size: 1rem; flex-shrink: 0; width: 20px; text-align: center; }
        .cal-modal-info-text { line-height: 1.5; }

        .cal-modal-desc { margin-top: 1.2rem; padding-top: 1.2rem; border-top: 1px solid rgba(255,255,255,0.08); font-size: 0.95rem; color: rgba(255,255,255,0.75); line-height: 1.7; }

        .cal-modal-actions { display: flex; gap: 0.8rem; margin-top: 1.5rem; }
        .cal-modal-dir-btn { display: inline-flex; align-items: center; gap: 8px; padding: 0.7rem 1.5rem; border-radius: 14px; font-size: 0.8rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; text-decoration: none; transition: all 0.3s ease; border: none; cursor: pointer; }
        .cal-modal-dir-btn.primary { background: linear-gradient(135deg, #1d4ed8, #3b82f6); color: white; box-shadow: 0 4px 15px rgba(59,130,246,0.3); }
        .cal-modal-dir-btn.primary:hover { transform: translateY(-2px); box-shadow: 0 6px 25px rgba(59,130,246,0.4); }
        .cal-modal-dir-btn.secondary { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.7); border: 1px solid rgba(255,255,255,0.1); }
        .cal-modal-dir-btn.secondary:hover { background: rgba(255,255,255,0.1); color: white; }

        .cal-no-events { color: rgba(255,255,255,0.4); font-size: 0.85rem; text-align: center; margin-top: 2rem; padding: 2rem 1rem; border: 1px dashed rgba(255,255,255,0.1); border-radius: 16px; }

        /* ── All Events redesigned ── */
        .cal-list-shell { width: 100%; }
        .cal-list-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.07); }
        .cal-list-header h2 { font-size: 1.6rem; font-weight: 900; color: white; letter-spacing: -0.02em; }
        .cal-list-total { font-size: 0.75rem; font-weight: 800; color: #c9a84c; background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.25); padding: 6px 16px; border-radius: 20px; letter-spacing: 0.08em; text-transform: uppercase; white-space: nowrap; }

        .cal-list-group { margin-bottom: 2.8rem; }
        .cal-list-month-hdr { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.2rem; }
        .cal-list-month-hdr span { font-size: 0.72rem; font-weight: 900; color: #c9a84c; text-transform: uppercase; letter-spacing: 0.2em; white-space: nowrap; }
        .cal-list-month-line { flex: 1; height: 1px; background: linear-gradient(90deg, rgba(201,168,76,0.35), transparent); }

        .cal-list-card { display: flex; align-items: stretch; gap: 0; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; cursor: pointer; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); overflow: hidden; margin-bottom: 0.85rem; }
        .cal-list-card:hover { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.15); transform: translateY(-3px); box-shadow: 0 10px 35px rgba(0,0,0,0.3); }

        .cal-list-accent { width: 4px; flex-shrink: 0; }
        .cal-list-date { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 1.2rem 1.4rem; min-width: 72px; border-right: 1px solid rgba(255,255,255,0.06); text-align: center; flex-shrink: 0; }
        .cal-list-day { font-size: 2rem; font-weight: 900; color: white; line-height: 1; }
        .cal-list-mon { font-size: 0.6rem; font-weight: 800; color: #c9a84c; text-transform: uppercase; letter-spacing: 0.15em; margin-top: 4px; }

        .cal-list-body { flex: 1; padding: 1.2rem 1.5rem; display: flex; flex-direction: column; justify-content: center; min-width: 0; }
        .cal-list-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; margin-bottom: 0.5rem; flex-wrap: wrap; }
        .cal-list-title { font-size: 1rem; font-weight: 800; color: white; line-height: 1.4; }
        .cal-list-badge { font-size: 0.55rem; font-weight: 900; padding: 4px 12px; border-radius: 10px; text-transform: uppercase; letter-spacing: 0.07em; white-space: nowrap; flex-shrink: 0; align-self: flex-start; margin-top: 2px; }
        .cal-list-meta { display: flex; flex-wrap: wrap; gap: 0.6rem 1.4rem; }
        .cal-list-meta-item { font-size: 0.78rem; color: rgba(255,255,255,0.5); display: flex; align-items: center; gap: 5px; min-width: 0; }
        .cal-list-meta-item span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 300px; }

        @media (max-width: 1024px) { .cal-grid-layout { grid-template-columns: 1fr; gap: 2rem; } }
        @media (max-width: 768px) {
          .cal-shell { padding: 0 1rem; overflow-x: hidden; }
          .cal-page-header h1 { font-size: 2rem; }
          .cal-d-cell { min-height: 55px; padding: 5px; border-radius: 10px; }
          .cal-d-num { font-size: 0.8rem; }
          .cal-d-dot { width: 4px; height: 4px; }
          .cal-e-card { padding: 0.9rem; }
          .cal-e-nm { white-space: normal; word-break: break-word; }
          .cal-modal-box { width: 96%; max-height: 92vh; overflow-y: auto; }
          .cal-modal-content { padding: 1.5rem; }
          .cal-modal-title { font-size: 1.3rem; }
          .cal-modal-map-area { height: 180px; }
          .cal-list-meta-item span { max-width: 200px; }
          .cal-list-header h2 { font-size: 1.3rem; }
          .cal-list-day { font-size: 1.6rem; }
          .cal-list-date { min-width: 58px; padding: 1rem; }
          .cal-list-body { padding: 1rem 1.1rem; }
        }
        @media (max-width: 480px) {
          .cal-shell { padding: 0 0.8rem; }
          .cal-d-lbl { font-size: 0.55rem; letter-spacing: 0.05em; }
          .cal-d-cell { min-height: 45px; padding: 4px; border-radius: 8px; gap: 2px; }
          .cal-d-num { font-size: 0.7rem; }
          .cal-e-nm { font-size: 0.85rem; white-space: normal; }
          .cal-e-day { font-size: 1.3rem; }
          .cal-e-date { padding-right: 0.6rem; min-width: 38px; }
          .cal-e-top { flex-wrap: wrap; }
          .cal-e-bdg { align-self: flex-start; }
          .cal-modal-content { padding: 1rem; }
          .cal-modal-actions { flex-direction: column; }
          .cal-list-header { flex-direction: column; align-items: flex-start; gap: 0.8rem; }
          .cal-list-meta-item span { max-width: 160px; }
          .cal-list-top { gap: 0.5rem; }
          .cal-list-body { padding: 0.9rem 1rem; }
          .cal-list-date { min-width: 52px; padding: 0.8rem 0.8rem; }
          .cal-list-day { font-size: 1.4rem; }
          .cal-view-toggle { width: 90%; }
          .cal-v-btn { padding: 0.6rem 1.4rem; font-size: 0.7rem; }
        }
      `}</style>

      <div className="cal-shell cal-fade-in">
        <div className="cal-page-header">
          <h1>Event <span>Calendar</span></h1>
          <p>Browse upcoming meetings, volunteer events, and service opportunities in the Fulshear & Katy community.</p>
        </div>

        <div className="cal-view-toggle">
          <button className={`cal-v-btn ${view === "month" ? "active" : ""}`} onClick={() => setView("month")}>Month</button>
          <button className={`cal-v-btn ${view === "list" ? "active" : ""}`} onClick={() => setView("list")}>All Events</button>
        </div>

        {view === "month" ? (
          <div className="cal-grid-layout">
            {/* Calendar Grid */}
            <div className="cal-glass">
              <div className="cal-m-header">
                <button className="cal-n-btn" onClick={prevMonth} aria-label="Previous month">‹</button>
                <div className="cal-m-info">
                  <div className={`cal-m-title ${animating ? 'animating' : ''}`}>{MONTHS[month]} {year}</div>
                  <div className="cal-m-sub">{monthEvents.length} event{monthEvents.length !== 1 ? 's' : ''}</div>
                </div>
                <button className="cal-n-btn" onClick={nextMonth} aria-label="Next month">›</button>
              </div>

              <button className="cal-t-btn" onClick={goToToday}>Today</button>

              <div className="cal-d-head">
                {DAYS.map(d => <div key={d} className="cal-d-lbl">{d}</div>)}
              </div>

              <div className="cal-d-grid">
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="cal-d-cell" style={{ cursor: 'default' }}>
                    <span className="cal-d-num off"></span>
                  </div>
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const evs = getEventsForDate(day);
                  const todayClass = isToday(day) ? ' today' : '';
                  const hasEventsClass = evs.length > 0 ? ' has-events' : '';
                  return (
                    <div
                      key={day}
                      className={`cal-d-cell${todayClass}${hasEventsClass}`}
                      onClick={() => evs.length > 0 && setSelectedEvent({ ...evs[0], date: `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`, dayNum: day })}
                      title={evs.length > 0 ? evs.map(e => e.title).join(', ') : undefined}
                    >
                      <span className="cal-d-num">{day}</span>
                      <div className="cal-d-dots">
                        {evs.map((e, idx) => (
                          <div key={idx} className="cal-d-dot" style={{ background: TYPE_COLOR[e.type] || '#fff', color: TYPE_COLOR[e.type] || '#fff' }} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="cal-legend">
                {Object.keys(TYPE_COLOR).map(t => (
                  <div key={t} className="cal-leg-i">
                    <div className="cal-d-dot" style={{ background: TYPE_COLOR[t], color: TYPE_COLOR[t] }} />
                    {t}
                  </div>
                ))}
              </div>
            </div>

            {/* Event Sidebar */}
            <div className="cal-glass">
              <div className="cal-e-header">
                <div className="cal-e-title">{MONTHS[month].substring(0, 3)} Events</div>
                <div className="cal-e-count">{monthEvents.length} scheduled</div>
              </div>
              <div className="cal-e-scrl">
                {monthEvents.length > 0 ? monthEvents.map((e, i) => (
                  <div key={i} className="cal-e-card" onClick={() => setSelectedEvent(e)} style={{ '--card-color': TYPE_COLOR[e.type] || '#fff' } as React.CSSProperties}>
                    <style>{`.cal-e-card:hover::after { background: var(--card-color); }`}</style>
                    <div className="cal-e-date">
                      <div className="cal-e-day">{e.dayNum}</div>
                      <div className="cal-e-mon">{MONTHS[month].substring(0, 3)}</div>
                    </div>
                    <div className="cal-e-inf">
                      <div className="cal-e-top">
                        <div className="cal-e-nm">{e.title}</div>
                        <div className="cal-e-bdg" style={{ color: TYPE_COLOR[e.type] || '#fff', background: `${TYPE_COLOR[e.type]}15`, border: `1px solid ${TYPE_COLOR[e.type]}40` }}>{e.type}</div>
                      </div>
                      <div className="cal-e-det">📍 {e.loc.length > 45 ? e.loc.substring(0, 45) + '…' : e.loc}</div>
                      <div className="cal-e-det">🕒 {e.time}</div>
                    </div>
                  </div>
                )) : (
                  <div className="cal-no-events">
                    <div style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>📅</div>
                    No events scheduled for {MONTHS[month]}.
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* All Events List View — grouped by month */
          <div className="cal-list-shell">
            <div className="cal-list-header">
              <h2>All Events</h2>
              <div className="cal-list-total">{sortedKeys.reduce((acc, k) => acc + allEvents[k].length, 0)} events</div>
            </div>
            {(() => {
              const groups: { label: string; events: Array<EventData & { date: string; dayNum: number }> }[] = [];
              const seen: Record<string, number> = {};
              sortedKeys.forEach(k => {
                const [y, m, d] = k.split("-");
                const dt = new Date(+y, +m - 1, +d);
                const label = `${MONTHS[dt.getMonth()]} ${y}`;
                if (seen[label] === undefined) { seen[label] = groups.length; groups.push({ label, events: [] }); }
                allEvents[k].forEach(e => groups[seen[label]].events.push({ ...e, date: k, dayNum: dt.getDate() }));
              });
              return groups.map(({ label, events }) => (
                <div key={label} className="cal-list-group">
                  <div className="cal-list-month-hdr">
                    <span>{label}</span>
                    <div className="cal-list-month-line" />
                  </div>
                  {events.map((e, i) => (
                    <div key={i} className="cal-list-card" onClick={() => setSelectedEvent(e)}>
                      <div className="cal-list-accent" style={{ background: TYPE_COLOR[e.type] || '#fff' }} />
                      <div className="cal-list-date">
                        <div className="cal-list-day">{e.dayNum}</div>
                        <div className="cal-list-mon">{label.split(" ")[0].substring(0, 3)}</div>
                      </div>
                      <div className="cal-list-body">
                        <div className="cal-list-top">
                          <div className="cal-list-title">{e.title}</div>
                          <div className="cal-list-badge" style={{ color: TYPE_COLOR[e.type] || '#fff', background: `${TYPE_COLOR[e.type]}18`, border: `1px solid ${TYPE_COLOR[e.type]}45` }}>{e.type}</div>
                        </div>
                        <div className="cal-list-meta">
                          <div className="cal-list-meta-item">🕒 <span>{e.time}</span></div>
                          <div className="cal-list-meta-item">📍 <span>{e.loc}</span></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ));
            })()}
          </div>
        )}

        {/* Event Detail Modal */}
        {selectedEvent && (
          <div className="cal-modal-dim" onClick={() => setSelectedEvent(null)}>
            <div className="cal-modal-box" ref={modalRef} onClick={e => e.stopPropagation()}>
              <button className="cal-modal-cls" onClick={() => setSelectedEvent(null)} aria-label="Close">✕</button>

              {/* Map Area at Top */}
              <div className="cal-modal-map-area">
                {selectedEvent.loc && !selectedEvent.loc.includes("Various") ? (
                  <iframe
                    src={getMapUrl(selectedEvent.loc)}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Map of ${selectedEvent.loc}`}
                  />
                ) : (
                  <div className="cal-modal-map-placeholder">
                    <span>📍</span>
                    <p>Multiple locations</p>
                  </div>
                )}
              </div>

              {/* Modal Content */}
              <div className="cal-modal-content">
                <div className="cal-modal-badge" style={{
                  color: TYPE_COLOR[selectedEvent.type] || '#fff',
                  background: `${TYPE_COLOR[selectedEvent.type] || '#fff'}15`,
                  border: `1px solid ${TYPE_COLOR[selectedEvent.type] || '#fff'}40`
                }}>
                  {selectedEvent.type}
                </div>

                <div className="cal-modal-title">{selectedEvent.title}</div>

                <div className="cal-modal-info-row">
                  <span className="cal-modal-info-icon">📅</span>
                  <span className="cal-modal-info-text">
                    {selectedEvent.date ? (() => {
                      const [y, m, d] = selectedEvent.date.split("-");
                      const dt = new Date(+y, +m - 1, +d);
                      return dt.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                    })() : 'Date TBD'}
                  </span>
                </div>

                <div className="cal-modal-info-row">
                  <span className="cal-modal-info-icon">🕒</span>
                  <span className="cal-modal-info-text">{selectedEvent.time}</span>
                </div>

                <div className="cal-modal-info-row">
                  <span className="cal-modal-info-icon">📍</span>
                  <span className="cal-modal-info-text">{selectedEvent.loc}</span>
                </div>

                <div className="cal-modal-desc">{selectedEvent.desc}</div>

                {selectedEvent.loc && !selectedEvent.loc.includes("Various") && (
                  <div className="cal-modal-actions">
                    <a
                      href={getDirectionsUrl(selectedEvent.loc)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cal-modal-dir-btn primary"
                    >
                      🧭 Get Directions
                    </a>
                    <button className="cal-modal-dir-btn secondary" onClick={() => setSelectedEvent(null)}>
                      Close
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
