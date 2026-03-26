"use client";

import { useEffect } from "react";
import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/about-section";
import OfficersSection from "@/components/officers-section";
import DivisionSection from "@/components/division-section";
import LinksSection from "@/components/links-section";
import ContactSection from "@/components/contact-section";
import ImpactSection from "@/components/impact-section";
import dynamic from "next/dynamic";

const CinematicIntro = dynamic(() => import("@/components/cinematic-intro"), { ssr: false });

const schoolinksSteps = [
  { step: "1", desc: "Log in via ClassLink and click on the 'Engage' tab on the left sidebar.", img: "/schoolinks/step1.png" },
  { step: "2", desc: "Select 'Experience Tracking' from the dropdown menu.", img: "/schoolinks/step2.png" },
  { step: "3", desc: "Click the '+ Add entry' button to start logging your hours.", img: "/schoolinks/step3.png" },
  { step: "4", desc: "Fill out all the required info like the organization name, date, and hours worked. Then click Save.", img: "/schoolinks/step4.png" },
];

export default function Home() {
  useEffect(() => {
    const els = document.querySelectorAll(".fade-in, .slide-in-left, .slide-in-right");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <CinematicIntro />
      <HeroSection />
      <AboutSection />
      <DivisionSection />
      <ImpactSection />
      <OfficersSection />
      <LinksSection />
      <SchooLinksSection />
      <ContactSection />
    </>
  );
}

function SchooLinksSection() {
  return (
    <section id="schoolinks" style={{ padding: "clamp(4rem, 10vw, 8rem) 0 clamp(3rem, 8vw, 6rem)", position: "relative", overflow: "hidden" }}>
      <style>{`
        .schoolinks-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(ellipse 70% 60% at 50% 100%, rgba(26, 58, 143, 0.15) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 80% 20%, rgba(201, 168, 76, 0.07) 0%, transparent 50%);
        }
        .schoolinks-wrapper {
          position: relative;
          z-index: 1;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        .schoolinks-header {
          text-align: center;
          margin-bottom: clamp(2.5rem, 6vw, 4rem);
        }
        .schoolinks-section-label {
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 1rem;
        }
        .schoolinks-section-heading {
          font-size: clamp(2.2rem, 5.5vw, 3.8rem);
          font-weight: 900;
          letter-spacing: -0.02em;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #fff 0%, var(--gold-light) 50%, var(--gold) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .schoolinks-description {
          color: var(--silver);
          font-size: clamp(0.9rem, 2.2vw, 1.05rem);
          max-width: 700px;
          margin: 0 auto 3rem;
          line-height: 1.8;
        }
        .schoolinks-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(2.5rem, 5vw, 4rem);
          grid-template-areas:
            "step2 step1"
            "step4 step3";
        }
        .schoolinks-card {
          padding: clamp(1.5rem, 5vw, 3rem);
          border-radius: 24px;
          background: rgba(10, 15, 30, 0.75);
          border: 1px solid rgba(100, 149, 237, 0.2);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
          height: 100%;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
        }
        .schoolinks-card:nth-child(1) { grid-area: step1; }
        .schoolinks-card:nth-child(2) { grid-area: step2; }
        .schoolinks-card:nth-child(3) { grid-area: step3; }
        .schoolinks-card:nth-child(4) { grid-area: step4; }
        .schoolinks-card:hover {
          transform: translateY(-8px);
          border-color: rgba(201, 168, 76, 0.4);
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4);
        }
        .schoolinks-step-num {
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .schoolinks-step-num::before {
          content: '';
          display: inline-block;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--gold), rgba(201, 168, 76, 0.6));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.65rem;
          font-weight: 900;
          color: var(--navy);
        }
        .schoolinks-img {
          width: 100%;
          border-radius: 18px;
          margin-bottom: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.15);
          aspect-ratio: 16/10;
          object-fit: contain;
          background: rgba(0, 0, 0, 0.2);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
        }
        .schoolinks-desc {
          font-size: clamp(0.9rem, 2vw, 1rem);
          color: var(--silver);
          line-height: 1.7;
          flex-grow: 1;
        }
        @media (max-width: 900px) {
          .schoolinks-grid {
            grid-template-columns: 1fr;
            grid-template-areas:
              "step1"
              "step2"
              "step3"
              "step4";
            gap: clamp(1.5rem, 3vw, 2.5rem);
          }
          .schoolinks-wrapper {
            padding: 0 1.5rem;
          }
        }
        @media (max-width: 600px) {
          .schoolinks-wrapper {
            padding: 0 1rem;
          }
          .schoolinks-img {
            aspect-ratio: auto;
            max-height: 280px;
            margin-bottom: 1.2rem;
          }
          .schoolinks-card {
            padding: clamp(1rem, 4vw, 1.5rem);
          }
          .schoolinks-desc {
            font-size: 0.85rem;
          }
        }
      `}</style>
      <div className="schoolinks-bg" />
      <div className="schoolinks-wrapper">
        <div className="schoolinks-header fade-in">
          <p className="schoolinks-section-label">How to Track Hours</p>
          <h2 className="schoolinks-section-heading">Tracking Hours on SchooLinks</h2>
          <p className="schoolinks-description">
            Follow these steps to log your volunteer hours. Access SchooLinks by logging into your ClassLink account first.
          </p>
        </div>
        <div className="schoolinks-grid fade-in">
          {schoolinksSteps.map((item, idx) => (
            <div key={idx} className="schoolinks-card">
              <div className="schoolinks-step-num">Step {item.step}</div>
              <img src={item.img} alt={`Step ${item.step}`} className="schoolinks-img" />
              <p className="schoolinks-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
