"use client";

import { useEffect } from "react";
import AboutSection from "@/components/about-section";
import DivisionSection from "@/components/division-section";

const pillars = [
  { icon: "👧", title: "Children & Youth",       desc: "Mentoring, tutoring, and running events that enrich the lives of kids in our community — from reading programs to STEM nights." },
  { icon: "🌿", title: "Environment & Parks",     desc: "Creek cleanups, park beautification, and tree planting drives that keep Fulshear green for generations to come." },
  { icon: "🍱", title: "Hunger & Food Security",  desc: "Food pantry shifts, H-E-B food drives, and Thanksgiving basket packing to ensure no neighbor goes without a meal." },
  { icon: "📚", title: "Education & Literacy",    desc: "Library read-alouds, essay competitions, and tutoring sessions that spark a love of learning in students of all ages." },
];

const steps = [
  { num: "01", title: "Attend a General Meeting",  desc: "Come to our meetings held in the library on the 2nd Tuesday of every month at 4:00 PM. No commitment needed — just show up and see if Key Club is right for you." },
  { num: "02", title: "Complete Membership Form",  desc: "Fill out the digital membership form (linked on our Canvas course) and pay the $20 annual dues. That's it — you're officially a member!" },
  { num: "03", title: "Start Earning Service Hours", desc: "Sign up for an event through our link-tree. Your hours are logged by officers after each event and tracked on SchooLinks." },
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
  { q: "How do I track my volunteer hours?",     a: "All hours are tracked via SchooLinks. To log your hours, sign in to ClassLink, click on SchooLinks, and follow the 'Experience Tracking' steps to add your entry. After each Key Club event, our secretary records attendance, but you should also log your external hours there. Check out the step-by-step tutorial on the home page for help! If you have questions about your hours balance, contact our Secretary directly." },
  { q: "When and where are general meetings?",   a: "We meet in the library on the 2nd Tuesday of every month at 4:00 PM. Check the Calendar tab for the exact dates!" },
  { q: "What happens if I miss a meeting?",      a: "If you miss a meeting, please read the meeting slides posted on our Canvas course and message an officer to stay updated. Missing too many meetings may impact your active membership status." },
  { q: "Can I join mid-year?",                   a: "Yes! We accept new members year-round. Just show up to a meeting, fill out the form, and pay dues. You'll start earning hours right away." },
  { q: "Do I need prior volunteering experience?", a: "Not at all. Key Club is open to all Fulshear High School students regardless of experience. We'll guide you through everything from your first event." },
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
