"use client";

import { datedEvents as allEvents, recurringEvents, eventsForDate, serviceHourLogUrl, type ClubEvent as EventData } from "@/lib/club-events";
import React, { useState, useEffect, useRef } from "react";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];


const TYPE_COLOR: Record<string, string> = {
  Leadership: "#f97316",
  Meeting: "#3b82f6",
  Volunteer: "#eab308",
  Service: "#10b981",
  Community: "#a855f7",
  Recurring: "#f43f5e"
};

const TYPE_GRADIENT: Record<string, string> = {
  Leadership: "linear-gradient(135deg, #f97316, #fdba74)",
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

  useEffect(() => {
    if (!selectedEvent) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    modalRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedEvent(null);
      if (event.key === "Tab") {
        const controls = modalRef.current?.querySelectorAll<HTMLElement>('button, a[href], iframe');
        if (!controls?.length) return;
        const first = controls[0], last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => { document.removeEventListener("keydown", closeOnEscape); document.body.style.overflow = previousOverflow; previousFocus?.focus(); };
  }, [selectedEvent]);

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

  const getEventsForDate = (day: number) => eventsForDate(year, month, day);
  const isToday = (day: number) => today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
  const sortedKeys = Object.keys(allEvents).sort();
  const monthPrefix = `${year}-${String(month + 1).padStart(2, "0")}-`;
  const monthEvents = sortedKeys
    .filter(key => key.startsWith(monthPrefix))
    .flatMap(key => allEvents[key].map(event => ({ ...event, date: key, dayNum: Number(key.slice(-2)) })));

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

        .cal-grid-layout { display: grid; grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr); gap: 2.5rem; align-items: start; }

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
        .cal-e-top { display: flex; flex-wrap:wrap; justify-content: space-between; align-items: center; gap: 8px; margin-bottom: 0.4rem; }
        .cal-e-nm { font-size: 0.95rem; font-weight: 800; color: white; line-height: 1.3; overflow-wrap:anywhere; }
        .cal-e-bdg { font-size: 0.55rem; font-weight: 900; padding: 3px 10px; border-radius: 10px; text-transform: uppercase; letter-spacing: 0.06em; white-space: nowrap; flex-shrink: 0; }
        .cal-e-det { font-size: 0.75rem; color: rgba(255,255,255,0.5); display: flex; align-items: center; gap: 5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .cal-e-det + .cal-e-det { margin-top: 2px; }

        /* Modal */
        .cal-modal-dim { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); display: grid; place-items: center; z-index: 9999; opacity: 0; animation: calFadeIn 0.3s forwards; }
        @keyframes calFadeIn { to { opacity: 1; } }
        .cal-modal-box { background: linear-gradient(180deg, rgba(18, 22, 40, 0.97), rgba(8, 12, 25, 0.99)); border: 1px solid rgba(255,255,255,0.1); border-radius: 28px; padding: 0; max-height: 92vh; overflow-y: auto; max-width: 580px; width: 94%; position: relative; box-shadow: 0 30px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08); transform: translateY(20px); animation: calSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
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

        .cal-schedule-note { color: #aab7c7; font-size: .9rem; line-height: 1.7; margin-bottom: 1.5rem; }
        .cal-schedule-note a { color: #fde047; text-decoration: underline; }
        .cal-modal-actions { display: flex; flex-wrap: wrap; gap: 0.8rem; margin-top: 1.5rem; }
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

        <p className="cal-schedule-note">All times are Central Time. General meetings: every other Tuesday at 4:00 PM in the library. Next confirmed meeting: December 8, 2026.</p>
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
                      role={evs.length ? "button" : undefined}
                      tabIndex={evs.length ? 0 : undefined}
                      aria-label={`${MONTHS[month]} ${day}, ${year}: ${evs.map(e => e.title).join(", ")}`}
                      onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.currentTarget.click(); } }}
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
                  <div key={i} className="cal-e-card" role="button" tabIndex={0} onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.currentTarget.click(); } }} onClick={() => setSelectedEvent(e)} style={{ '--card-color': TYPE_COLOR[e.type] || '#fff' } as React.CSSProperties}>
                    <style>{`.cal-e-card:hover::after { background: var(--card-color); }`}</style>
                    <div className="cal-e-date">
                      <div className="cal-e-day">{e.dayNum}{e.endDate ? `–${Number(e.endDate.slice(-2))}` : ""}</div>
                      <div className="cal-e-mon">{MONTHS[month].substring(0, 3)} {e.date.split("-")[0]}</div>
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
                    <div key={i} className="cal-list-card" role="button" tabIndex={0} onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.currentTarget.click(); } }} onClick={() => setSelectedEvent(e)}>
                      <div className="cal-list-accent" style={{ background: TYPE_COLOR[e.type] || '#fff' }} />
                      <div className="cal-list-date">
                        <div className="cal-list-day">{e.dayNum}{e.endDate ? `–${Number(e.endDate.slice(-2))}` : ""}</div>
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

        <section aria-label="Year-round opportunities" className="cal-glass" style={{ marginTop: "2.5rem" }}>
          <h2 style={{ color: "var(--gold)", marginBottom: "1rem" }}>Year-round opportunities</h2>
          <p className="cal-schedule-note">Choose an available shift using each organization’s sign-up page. These opportunities do not have fixed club dates.</p>
          {recurringEvents.map(event => (
            <article key={event.title} style={{ marginBottom: "1.5rem", color: "var(--silver)", lineHeight: 1.7 }}>
              <h3 style={{ color: "white" }}>{event.title}</h3>
              <p>{event.time}</p>
              <p>📍 {event.loc}</p>
              <p>{event.desc}</p>
              <div className="cal-modal-actions">
                <a href={event.signupUrl} target="_blank" rel="noopener noreferrer" className="cal-modal-dir-btn primary">View sign-up</a>
                <a href={event.sourceUrl} target="_blank" rel="noopener noreferrer" className="cal-modal-dir-btn secondary">Canvas details</a>
              </div>
            </article>
          ))}
          <p className="cal-schedule-note">After volunteering, submit your hours in both the <a href={serviceHourLogUrl} target="_blank" rel="noopener noreferrer">Key Club Service Hour Log</a> and <a href="/#schoolinks">SchooLinks</a>. Canvas links require a school login. Details reviewed November 7, 2026.</p>
        </section>

        {/* Event Detail Modal */}
        {selectedEvent && (
          <div className="cal-modal-dim" onClick={() => setSelectedEvent(null)}>
            <div className="cal-modal-box" role="dialog" aria-modal="true" aria-label={selectedEvent.title} ref={modalRef} onClick={e => e.stopPropagation()}>
              <button aria-label="Close event details" className="cal-modal-cls" onClick={() => setSelectedEvent(null)}>✕</button>

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
                    {(() => {
                      const format = (date: string) => new Date(date + "T12:00:00").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
                      return format(selectedEvent.startDate ?? selectedEvent.date) + (selectedEvent.endDate ? " – " + format(selectedEvent.endDate) : "");
                    })()}
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

                <div className="cal-modal-actions">
                  {selectedEvent.signupUrl && <a href={selectedEvent.signupUrl} target="_blank" rel="noopener noreferrer" className="cal-modal-dir-btn primary">View sign-up</a>}
                  {selectedEvent.sourceUrl && <a href={selectedEvent.sourceUrl} target="_blank" rel="noopener noreferrer" className="cal-modal-dir-btn secondary">Canvas details</a>}
                </div>
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
