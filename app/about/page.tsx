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
  { num: "01", title: "Come to a General Meeting",  desc: "Our meetings are in the LGI Room on the 1st Tuesday of every month at 4:00 PM. No pressure — just stop by, see what we're about, and meet the officers. You don't have to commit to anything that day." },
  { num: "02", title: "Fill Out the Membership Form",  desc: "Once you're ready, complete the digital form linked on our Canvas course and pay the $20 annual dues. After that, you're officially in and can start earning hours right away." },
  { num: "03", title: "Sign Up for Events & Log Hours", desc: "Browse upcoming service events on our sign-up page and grab a spot. After each event, officers record attendance — just make sure to also log any outside hours yourself on SchooLinks." },
];

const requirements = [
  { label: "Meeting Attendance", value: "≥ 50% of general meetings per semester" },
  { label: "Service Hours",      value: "25+ hours per school year" },
  { label: "GPA Requirement",    value: "2.5 cumulative GPA" },
  { label: "Annual Dues",        value: "$20 (one-time at sign-up)" },
  { label: "Active Status",      value: "Maintained by meeting attendance + hours" },
  { label: "Dress Code",         value: "Key Club shirt required at official events" },
];

const faqs = [
  { q: "How do I track my volunteer hours?",     a: "Hours are logged through SchooLinks. Sign into ClassLink, open SchooLinks, and use the 'Experience Tracking' section to add your entry. After Key Club events, our Secretary records attendance on the back end — but if you volunteer somewhere on your own, make sure to log those yourself too. There's a step-by-step tutorial on the home page if you need a walkthrough. Questions about your hours? Reach out to our Secretary directly." },
  { q: "When and where are general meetings?",   a: "We meet in the LGI Room on the 1st Tuesday of every month at 4:00 PM. Head over to the Calendar page for the full list of dates this year." },
  { q: "What happens if I miss a meeting?",      a: "Life happens — just make sure to check the meeting slides on Canvas and message an officer to catch up on anything important. That said, consistent attendance is required to stay in good standing, so try not to make missing meetings a habit." },
  { q: "Can I join mid-year?",                   a: "Absolutely. We welcome new members throughout the entire school year. Come to any meeting, fill out the form, pay your dues, and you're in — you can start signing up for events the same week." },
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
