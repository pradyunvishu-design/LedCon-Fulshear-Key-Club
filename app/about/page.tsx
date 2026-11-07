"use client";

import { useEffect } from "react";
import AboutSection from "@/components/about-section";
import DivisionSection from "@/components/division-section";

const pillars = [
  { icon: "👧", title: "Children & Youth",       desc: "From tutoring sessions to school carnivals and wax museums, we show up for the kids in our community — making education a little more fun along the way." },
  { icon: "🌿", title: "Environment & Parks",     desc: "We get our hands dirty so Fulshear stays beautiful. Trail cleanups, tree plantings, and highway beautification events are all part of what we do." },
  { icon: "🍱", title: "Hunger & Food Security",  desc: "No one should go hungry. We pack food boxes, volunteer at pantries, and join drives to make sure families across Fort Bend County have what they need." },
  { icon: "📚", title: "Education & Literacy",    desc: "We believe in the power of learning — whether it's helping run a UIL competition, supporting a literacy event, or just showing up for the students around us." },
];

const steps = [
  { num: "01", title: "Come to a General Meeting",  desc: "Our meetings are in the Library every other Tuesday at 4:00 PM. No pressure — just stop by, see what we're about, and meet the officers. You don't have to commit to anything that day." },
  { num: "02", title: "Fill Out the Membership Form",  desc: "Complete the Member Interest Form on Canvas before paying the $30 annual dues. The 2026–2027 payment deadline was October 1; contact the advisor about joining after that date." },
  { num: "03", title: "Sign Up for Events & Log Hours", desc: "Browse the calendar and reserve a volunteer shift. After each event, submit your hours in both the Key Club Service Hour Log linked on Canvas and SchooLinks. Ask your event supervisor to verify your SchooLinks entry." },
];

const requirements = [
  {
    "label": "Service Hours",
    "value": "At least 5 hours per semester through Fulshear Key Club"
  },
  {
    "label": "Annual Dues",
    "value": "$30 for 2026–2027 · contact the advisor for late payments"
  },
  {
    "label": "Hour Reporting",
    "value": "Submit to both the club Service Hour Log and SchooLinks"
  },
  {
    "label": "Member Conduct",
    "value": "Respectful conduct and accurate, truthful service-hour submissions"
  },
  {
    "label": "Dress Code",
    "value": "Follow each event’s clothing and footwear requirements"
  },
  {
    "label": "Club Updates",
    "value": "Check Canvas announcements, meeting slides, and club bylaws"
  }
];

const faqs = [
  { q: "How do I track my volunteer hours?",     a: "Submit volunteer hours in both the Key Club Service Hour Log on Canvas and SchooLinks. In SchooLinks, open Engage → Experience Tracking → Volunteer Service Cord and add an entry. Your supervisor must verify it. The home page has a step-by-step walkthrough." },
  { q: "When and where are general meetings?",   a: "We meet in the Library every other Tuesday at 4:00 PM. Our next meeting is December 8, 2026. Check the Calendar page for confirmed dates." },
  { q: "What happens if I miss a meeting?",      a: "Read the meeting slides and announcements on Canvas, then contact an officer if you need help catching up. Members must complete at least five service hours per semester through Fulshear Key Club to remain active." },
  { q: "Can I join mid-year?",                   a: "Contact the advisor or an officer about joining after the October 1 dues deadline. Check Canvas for the current Member Interest Form and payment instructions." },
  { q: "Do I need prior volunteering experience?", a: "Nope! Key Club is open to every Fulshear High School student, no matter your background or experience level. We'll walk you through your first event and make sure you feel comfortable from day one." },
];

export default function AboutPage() {
  useEffect(() => {
    const els = document.querySelectorAll(".fade-in, .slide-in-left, .slide-in-right");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add("visible"); });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="flex-grow pt-8">
      <style>{`
        /* what we do section */
        .pillars-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:1.5rem; }
        .pillar-card {
          padding:2rem 1.5rem; border-radius:16px;
          background:rgba(10,15,30,0.6);
          border:1px solid rgba(100,149,237,0.12);
          backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px);
          box-shadow:0 12px 36px rgba(0,0,0,0.35);
          transition:transform 0.3s, box-shadow 0.3s, border-color 0.3s;
          text-align:center;
        }
        .pillar-card:hover { transform:translateY(-6px); box-shadow:0 20px 50px rgba(0,0,0,0.5); border-color:rgba(201,168,76,0.35); }
        .pillar-icon { font-size:2.4rem; margin-bottom:1rem; display:block; }
        .pillar-title { font-size:1rem; font-weight:800; color:white; margin-bottom:0.6rem; }
        .pillar-desc { font-size:0.82rem; color:var(--silver); line-height:1.7; }

        /* how to join section */
        .steps-list { display:flex; flex-direction:column; gap:1.5rem; }
        .step-card {
          display:flex; gap:1.75rem; align-items:flex-start;
          padding:1.75rem 2rem; border-radius:16px;
          background:rgba(10,15,30,0.6);
          border:1px solid rgba(100,149,237,0.12);
          backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px);
          box-shadow:0 8px 28px rgba(0,0,0,0.3);
          transition:border-color 0.3s, transform 0.3s;
        }
        .step-card:hover { border-color:rgba(201,168,76,0.35); transform:translateX(6px); }
        .step-num {
          font-size:2.2rem; font-weight:900; color:var(--gold);
          opacity:0.25; flex-shrink:0; line-height:1; font-family:monospace; letter-spacing:-0.04em;
        }
        .step-title { font-size:1.05rem; font-weight:800; color:white; margin-bottom:0.4rem; }
        .step-desc { font-size:0.85rem; color:var(--silver); line-height:1.75; }

        /* membership requirements section */
        .req-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1rem; }
        .req-card {
          padding:1.4rem 1.5rem; border-radius:14px;
          background:rgba(10,15,30,0.6);
          border:1px solid rgba(100,149,237,0.1);
          backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px);
        }
        .req-label { font-size:0.65rem; font-weight:700; letter-spacing:0.18em; text-transform:uppercase; color:var(--gold); margin-bottom:0.4rem; }
        .req-value { font-size:0.9rem; font-weight:600; color:white; line-height:1.4; }

        /* questions and answers section */
        .faq-list { display:flex; flex-direction:column; gap:0.75rem; }
        .faq-item {
          border-radius:14px; overflow:hidden;
          background:rgba(10,15,30,0.6);
          border:1px solid rgba(100,149,237,0.1);
          backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px);
        }
        .faq-q {
          padding:1.2rem 1.5rem; font-size:0.95rem; font-weight:700; color:white;
          cursor:pointer; display:flex; justify-content:space-between; align-items:center; gap:1rem;
          user-select:none;
        }
        .faq-q:hover { color:var(--gold); }
        .faq-a { padding:0 1.5rem 1.2rem; font-size:0.85rem; color:var(--silver); line-height:1.75; }

        /* section styling and layout */
        .about-extra-section { padding:5rem 0; position:relative; }
        .about-section-inner { max-width:1200px; margin:0 auto; padding:0 2rem; }
        .about-section-header { text-align:center; margin-bottom:3rem; }

        @media(max-width:1000px){ .pillars-grid{ grid-template-columns:repeat(2,1fr); } }
        @media(max-width:900px){ .req-grid{ grid-template-columns:repeat(2,1fr); } }
        @media(max-width:600px){
          .pillars-grid{ grid-template-columns:1fr; }
          .req-grid{ grid-template-columns:1fr; }
          .step-card{ flex-direction:column; gap:0.75rem; }
        }
      `}</style>

      <AboutSection />
      <DivisionSection />

      {/* WHAT WE DO */}
      <section className="about-extra-section">
        <div className="about-section-inner">
          <div className="about-section-header fade-in">
            <p className="section-label">Our Mission</p>
            <h2 className="section-heading">What We Do</h2>
          </div>
          <div className="pillars-grid">
            {pillars.map((p, i) => (
              <div key={i} className="pillar-card fade-in" style={{ transitionDelay: `${i * 0.08}s` }}>
                <span className="pillar-icon">{p.icon}</span>
                <div className="pillar-title">{p.title}</div>
                <div className="pillar-desc">{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW TO JOIN */}
      <section className="about-extra-section" style={{ background: "rgba(10,15,30,0.3)" }}>
        <div className="about-section-inner">
          <div className="about-section-header fade-in">
            <p className="section-label">Get Involved</p>
            <h2 className="section-heading">How to Join</h2>
          </div>
          <div className="steps-list" style={{ maxWidth: "760px", margin: "0 auto" }}>
            {steps.map((s, i) => (
              <div key={i} className="step-card slide-in-left" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="step-num">{s.num}</div>
                <div>
                  <div className="step-title">{s.title}</div>
                  <div className="step-desc">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REQUIREMENTS */}
      <section className="about-extra-section">
        <div className="about-section-inner">
          <div className="about-section-header fade-in">
            <p className="section-label">Membership</p>
            <h2 className="section-heading">Requirements</h2>
          </div>
          <div className="req-grid">
            {requirements.map((r, i) => (
              <div key={i} className="req-card fade-in" style={{ transitionDelay: `${i * 0.07}s` }}>
                <div className="req-label">{r.label}</div>
                <div className="req-value">{r.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="about-extra-section" style={{ background: "rgba(10,15,30,0.3)" }}>
        <div className="about-section-inner">
          <div className="about-section-header fade-in">
            <p className="section-label">Got Questions?</p>
            <h2 className="section-heading">Frequently Asked</h2>
          </div>
          <div className="faq-list" style={{ maxWidth: "800px", margin: "0 auto" }}>
            {faqs.map((f, i) => (
              <div key={i} className="faq-item fade-in" style={{ transitionDelay: `${i * 0.06}s` }}>
                <div className="faq-q">{f.q}</div>
                <div className="faq-a">{f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
