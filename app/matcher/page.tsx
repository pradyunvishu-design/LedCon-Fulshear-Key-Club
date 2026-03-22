"use client";

import { useState } from "react";
import Link from "next/link";

const questions = [
  {
    q: "What causes are you passionate about?",
    sub: "Select all that apply — you can choose multiple.",
    multi: true,
    opts: [
      { label: "Children & Youth",   icon: "👧" },
      { label: "Environment",        icon: "🌿" },
      { label: "Elderly Care",       icon: "❤️" },
      { label: "Education",          icon: "📚" },
      { label: "Hunger & Food",      icon: "🍱" },
      { label: "Health & Wellness",  icon: "💪" },
    ],
  },
  {
    q: "When are you available to volunteer?",
    sub: "Select all that apply.",
    multi: true,
    opts: [
      { label: "Weekday afternoons (after school)", icon: "🏫" },
      { label: "Weekday evenings",                  icon: "🌙" },
      { label: "Saturday mornings",                 icon: "☀️" },
      { label: "Saturday afternoons",               icon: "🌤️" },
      { label: "Sundays",                           icon: "🌅" },
    ],
  },
  {
    q: "What type of service do you enjoy most?",
    sub: "Select all that apply.",
    multi: true,
    opts: [
      { label: "Working with kids",        icon: "🎨" },
      { label: "Outdoor / physical work",  icon: "🌳" },
      { label: "Food service or sorting",  icon: "🍽️" },
      { label: "Teaching or tutoring",     icon: "✏️" },
      { label: "Event setup / teamwork",   icon: "📋" },
    ],
  },
  {
    q: "How long can you commit per event?",
    sub: "Pick one.",
    multi: false,
    opts: [
      { label: "1–2 hours",       icon: "⏱️" },
      { label: "2–4 hours",       icon: "⏰" },
      { label: "Half day (4–6h)", icon: "🕐" },
      { label: "Full day",        icon: "📅" },
    ],
  },
  {
    q: "How do you prefer to work?",
    sub: "Pick one.",
    multi: false,
    opts: [
      { label: "Love meeting new people!",  icon: "🤝" },
      { label: "Fine in small groups",      icon: "👥" },
      { label: "Prefer behind-the-scenes",  icon: "🔧" },
    ],
  },
];

const EVENTS = [
  {
    name: "General Monthly Meeting",
    type: "Club",
    typeColor: "#1a3a8f",
    desc: "Connect with fellow Key Clubbers, vote on upcoming events, and earn meeting attendance hours. Open to all members every 1st Tuesday.",
    time: "~1.5 hours",
    tags: ["community", "leadership", "indoor"],
  },
  {
    name: "Creek & Park Cleanup",
    type: "Environment",
    typeColor: "#2d7a3a",
    desc: "Restore local waterways and parks in Fulshear. Gloves and bags provided — just bring energy and good company!",
    time: "2–4 hours",
    tags: ["environment", "outdoor", "physical"],
  },
  {
    name: "H-E-B Food Drive",
    type: "Hunger",
    typeColor: "#b85c1e",
    desc: "Collect and sort food donations at our local H-E-B. One of our most impactful ongoing service events for hunger relief.",
    time: "2–4 hours",
    tags: ["hunger", "food", "community", "teamwork"],
  },
  {
    name: "Thanksgiving Basket Packing",
    type: "Hunger",
    typeColor: "#b85c1e",
    desc: "Pack complete holiday meals for families in need. A high-energy, team-based Thanksgiving tradition every November.",
    time: "3–5 hours",
    tags: ["hunger", "food", "community", "teamwork"],
  },
  {
    name: "Library Read-Alouds",
    type: "Education",
    typeColor: "#7a3a8f",
    desc: "Read stories to young children at our local library. Perfect for those who love kids and want a calm, meaningful experience.",
    time: "1–2 hours",
    tags: ["education", "kids", "youth", "indoor"],
  },
  {
    name: "Peer Tutoring Sessions",
    type: "Education",
    typeColor: "#7a3a8f",
    desc: "Help Fulshear students with math, science, or writing in small group or one-on-one sessions. Flexible scheduling available.",
    time: "1–2 hours",
    tags: ["education", "teaching", "indoor", "kids"],
  },
  {
    name: "Youth Sports & Mentoring Day",
    type: "Children & Youth",
    typeColor: "#c9a84c",
    desc: "Mentor and cheer on younger kids during a fun-filled sports day. Great for energetic members who love working with youth!",
    time: "4–6 hours",
    tags: ["youth", "kids", "outdoor", "physical", "teamwork"],
  },
];

const CAUSE_TAGS: Record<string, string[]> = {
  "Children & Youth":  ["youth", "kids"],
  "Environment":       ["environment", "outdoor", "physical"],
  "Elderly Care":      ["community", "indoor"],
  "Education":         ["education", "teaching", "kids"],
  "Hunger & Food":     ["hunger", "food"],
  "Health & Wellness": ["community", "outdoor"],
};

const SERVICE_TAGS: Record<string, string[]> = {
  "Working with kids":       ["kids", "youth"],
  "Outdoor / physical work": ["outdoor", "physical"],
  "Food service or sorting": ["food", "hunger"],
  "Teaching or tutoring":    ["teaching", "education"],
  "Event setup / teamwork":  ["teamwork", "community"],
};

const RANK_COLORS = ["#c9a84c", "#9aabcc", "#c97a4c"];
const RANK_LABELS = ["Best Match", "Great Fit", "Worth Trying"];

export default function MatcherPage() {
  const [step, setStep]       = useState(0);
  const [answers, setAnswers] = useState<string[][]>(Array.from({ length: 5 }, () => []));

  const current  = step < 5 ? step : 4;
  const q        = questions[current];
  const selected = answers[current];

  const toggle = (label: string) => {
    setAnswers(prev => {
      const next = prev.map(a => [...a]);
      if (!q.multi) {
        next[current] = [label];
        return next;
      }
      const idx = next[current].indexOf(label);
      if (idx === -1) next[current].push(label);
      else next[current].splice(idx, 1);
      return next;
    });
  };

  const canAdvance = selected.length > 0;
  const advance = () => {
    if (step < 4) setStep(s => s + 1);
    else setStep(5);
  };
  const back    = () => { if (step > 0) setStep(s => s - 1); };
  const restart = () => { setStep(0); setAnswers(Array.from({ length: 5 }, () => [])); };

  const getResults = () => {
    const userTags = new Set<string>();
    (answers[0] || []).forEach(a => (CAUSE_TAGS[a] || []).forEach(t => userTags.add(t)));
    (answers[2] || []).forEach(a => (SERVICE_TAGS[a] || []).forEach(t => userTags.add(t)));
    if (userTags.size === 0) { userTags.add("community"); userTags.add("teamwork"); }
    return EVENTS
      .map(e => ({ ...e, score: e.tags.filter(t => userTags.has(t)).length }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  };

  const progress = step < 5 ? ((step + 1) / 5) * 100 : 100;

  return (
    <main className="flex-grow pb-16" style={{ paddingTop: "7rem", minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      <style>{`
        .matcher-hero { text-align: center; margin-bottom: 3rem; position: relative; z-index: 2; }
        .matcher-title { font-size: clamp(2.2rem, 5vw, 4rem); font-weight: 900; letter-spacing: -0.03em; margin-bottom: 1rem; }
        .matcher-title .highlight {
          background: linear-gradient(135deg, var(--gold-light) 0%, var(--gold) 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .quiz-shell {
          max-width: 700px; margin: 0 auto;
          background: rgba(10,15,30,0.6);
          border-radius: 24px; border: 1px solid rgba(100,149,237,0.2);
          box-shadow: 0 32px 80px rgba(0,0,0,0.5);
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          overflow: hidden; position: relative; z-index: 2;
        }
        .quiz-top { padding: 2rem 2.5rem 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .quiz-progress-bar { height: 5px; background: rgba(255,255,255,0.08); border-radius: 99px; overflow: hidden; }
        .quiz-progress-fill { height: 100%; background: linear-gradient(90deg, var(--gold), #e8c870); border-radius: 99px; transition: width 0.4s cubic-bezier(0.16,1,0.3,1); }
        .quiz-step { padding: 2.5rem; }
        .quiz-q { font-size: 1.45rem; font-weight: 800; color: white; margin-bottom: 0.5rem; line-height: 1.3; }
        .quiz-q-sub { font-size: 0.88rem; color: var(--silver); opacity: 0.8; margin-bottom: 2rem; }
        .quiz-options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 2rem; }
        .quiz-option {
          background: rgba(255,255,255,0.03); border: 1.5px solid rgba(255,255,255,0.09);
          padding: 0.9rem 1rem; border-radius: 12px; color: var(--silver);
          font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: all 0.18s;
          text-align: left; display: flex; align-items: center; gap: 10px; user-select: none;
        }
        .quiz-option:hover { background: rgba(201,168,76,0.08); border-color: rgba(201,168,76,0.35); color: white; }
        .quiz-option.selected { background: rgba(201,168,76,0.14); border-color: rgba(201,168,76,0.7); color: white; }
        .quiz-opt-icon { font-size: 1.2rem; flex-shrink: 0; }
        .quiz-check {
          width: 18px; height: 18px; border-radius: 4px; border: 1.5px solid rgba(255,255,255,0.25);
          flex-shrink: 0; margin-left: auto; display: flex; align-items: center; justify-content: center;
          font-size: 0.7rem; transition: all 0.15s;
        }
        .quiz-option.selected .quiz-check { background: var(--gold); border-color: var(--gold); color: #050d1a; font-weight: 900; }
        .quiz-radio {
          width: 18px; height: 18px; border-radius: 50%; border: 1.5px solid rgba(255,255,255,0.25);
          flex-shrink: 0; margin-left: auto; transition: all 0.15s; position: relative;
        }
        .quiz-option.selected .quiz-radio { border-color: var(--gold); background: var(--gold); }
        .quiz-actions { display: flex; gap: 0.75rem; }
        .btn-matcher {
          flex: 1; display: inline-flex; align-items: center; justify-content: center;
          padding: 1.1rem; background: linear-gradient(135deg, var(--gold), #d4b04a);
          color: #050d1a; font-weight: 800; font-size: 0.95rem; letter-spacing: 0.05em;
          border-radius: 12px; border: none; cursor: pointer;
          transition: transform 0.25s, box-shadow 0.25s, opacity 0.2s; text-transform: uppercase;
        }
        .btn-matcher:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(201,168,76,0.4); }
        .btn-matcher:disabled { opacity: 0.35; cursor: not-allowed; }
        .btn-back {
          display: inline-flex; align-items: center; justify-content: center;
          padding: 1.1rem 1.4rem; background: transparent;
          border: 1.5px solid rgba(255,255,255,0.12); color: var(--silver);
          font-weight: 700; font-size: 0.95rem; border-radius: 12px;
          cursor: pointer; transition: all 0.2s; white-space: nowrap; flex-shrink: 0;
        }
        .btn-back:hover { border-color: rgba(255,255,255,0.35); color: white; }

        /* Results */
        .results-header { text-align: center; padding: 2.5rem 2.5rem 0; }
        .results-trophy { font-size: 3rem; margin-bottom: 0.75rem; display: block; }
        .results-title { font-size: 1.6rem; font-weight: 900; color: white; margin-bottom: 0.4rem; }
        .results-sub { font-size: 0.9rem; color: var(--silver); margin-bottom: 0; opacity: 0.8; }
        .results-list { padding: 1.5rem 2.5rem 2.5rem; display: flex; flex-direction: column; gap: 1rem; }
        .result-card {
          padding: 1.25rem 1.4rem; border-radius: 14px;
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
          display: flex; gap: 1rem; align-items: flex-start;
          transition: border-color 0.2s, transform 0.2s;
        }
        .result-card:hover { border-color: rgba(201,168,76,0.25); transform: translateX(4px); }
        .result-rank-num { font-size: 1.7rem; font-weight: 900; opacity: 0.35; flex-shrink: 0; width: 2rem; text-align: center; line-height: 1; padding-top: 0.1rem; }
        .result-body { flex: 1; }
        .result-type-badge { display: inline-block; font-size: 0.58rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; padding: 3px 8px; border-radius: 99px; margin-bottom: 0.45rem; }
        .result-name { font-size: 1rem; font-weight: 800; color: white; margin-bottom: 0.35rem; }
        .result-desc { font-size: 0.82rem; color: var(--silver); line-height: 1.65; }
        .result-meta { font-size: 0.74rem; color: rgba(100,149,237,0.8); margin-top: 0.4rem; font-weight: 600; }
        .results-footer { padding: 0 2.5rem 2.5rem; display: flex; gap: 0.75rem; }
        .btn-restart { flex: 1; display: inline-flex; align-items: center; justify-content: center; padding: 1rem; background: transparent; border: 1.5px solid rgba(255,255,255,0.12); color: var(--silver); font-weight: 700; font-size: 0.88rem; border-radius: 12px; cursor: pointer; transition: all 0.2s; text-transform: uppercase; letter-spacing: 0.05em; }
        .btn-restart:hover { border-color: rgba(255,255,255,0.3); color: white; }
        .btn-calendar { flex: 1; display: inline-flex; align-items: center; justify-content: center; padding: 1rem; background: linear-gradient(135deg, #1a3a8f, #1e4fc4); color: white; font-weight: 700; font-size: 0.88rem; border-radius: 12px; border: none; cursor: pointer; transition: all 0.2s; text-transform: uppercase; letter-spacing: 0.05em; text-decoration: none; }
        .btn-calendar:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(26,58,143,0.5); }

        @media(max-width: 600px) {
          .quiz-options-grid { grid-template-columns: 1fr; }
          .quiz-step, .results-list, .results-footer { padding-left: 1.5rem; padding-right: 1.5rem; }
          .results-header { padding-left: 1.5rem; padding-right: 1.5rem; }
        }
      `}</style>

      <div style={{ position: "absolute", top: "20%", left: "-10%", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(26,58,143,0.15) 0%, transparent 70%)", filter: "blur(60px)", zIndex: 0 }} />
      <div style={{ position: "absolute", bottom: "-10%", right: "-10%", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 70%)", filter: "blur(60px)", zIndex: 0 }} />

      <div className="section-wrapper" style={{ position: "relative", zIndex: 2 }}>
        <div className="matcher-hero">
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)", color: "var(--gold)", fontWeight: 700, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.15em", padding: "6px 14px", borderRadius: "99px", marginBottom: "1.5rem" }}>
            Volunteer Matcher
          </div>
          <h1 className="matcher-title">Find Your Perfect <br /><span className="highlight">Service Match.</span></h1>
          <p style={{ color: "var(--silver)", maxWidth: "520px", margin: "0 auto", lineHeight: "1.7", fontSize: "1.05rem", opacity: 0.8 }}>
            5 quick questions. We score every event against your answers and surface your best-fit opportunities.
          </p>
        </div>

        <div className="quiz-shell">
          {step < 5 ? (
            <>
              {/* Progress bar */}
              <div className="quiz-top">
                <div className="quiz-progress-bar">
                  <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--silver)" }}>
                  <span>Question {step + 1} of 5</span>
                  <span style={{ color: "var(--gold)" }}>{Math.round(progress)}%</span>
                </div>
              </div>

              {/* Question */}
              <div className="quiz-step">
                <h2 className="quiz-q">{q.q}</h2>
                <p className="quiz-q-sub">{q.sub}</p>
                <div className="quiz-options-grid">
                  {q.opts.map(opt => {
                    const isSelected = selected.includes(opt.label);
                    return (
                      <div
                        key={opt.label}
                        className={`quiz-option${isSelected ? " selected" : ""}`}
                        onClick={() => toggle(opt.label)}
                      >
                        <span className="quiz-opt-icon">{opt.icon}</span>
                        <span style={{ flex: 1 }}>{opt.label}</span>
                        {q.multi
                          ? <div className="quiz-check">{isSelected ? "✓" : ""}</div>
                          : <div className="quiz-radio" />
                        }
                      </div>
                    );
                  })}
                </div>
                <div className="quiz-actions">
                  {step > 0 && (
                    <button className="btn-back" onClick={back}>← Back</button>
                  )}
                  <button
                    className="btn-matcher"
                    onClick={advance}
                    disabled={!canAdvance}
                  >
                    {step === 4 ? "See My Matches →" : "Continue →"}
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Results */
            (() => {
              const results = getResults();
              return (
                <>
                  <div className="results-header">
                    <span className="results-trophy">🎯</span>
                    <div className="results-title">Your Top Matches</div>
                    <p className="results-sub" style={{ marginBottom: "1.5rem" }}>Based on your answers, here are the events we think you&apos;ll love most.</p>
                  </div>
                  <div className="results-list">
                    {results.map((event, i) => (
                      <div key={event.name} className="result-card">
                        <div className="result-rank-num" style={{ color: RANK_COLORS[i] }}>
                          {i + 1}
                        </div>
                        <div className="result-body">
                          <div className="result-type-badge" style={{ background: `${event.typeColor}22`, color: event.typeColor, border: `1px solid ${event.typeColor}55` }}>
                            {event.type}
                          </div>
                          <div className="result-name">{event.name}</div>
                          <div className="result-desc">{event.desc}</div>
                          <div className="result-meta">⏱ {event.time} &nbsp;·&nbsp; {RANK_LABELS[i]}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="results-footer">
                    <button className="btn-restart" onClick={restart}>↺ Retake Quiz</button>
                    <Link href="/calendar" className="btn-calendar">View Calendar →</Link>
                  </div>
                </>
              );
            })()
          )}
        </div>
      </div>
    </main>
  );
}
