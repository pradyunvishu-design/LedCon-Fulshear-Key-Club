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
  { step: "Step 1", desc: "Log in via ClassLink and click on the 'Engage' tab on the left sidebar.", img: "/schoolinks/step1.png" },
  { step: "Step 2", desc: "Select 'Experience Tracking' from the dropdown menu.", img: "/schoolinks/step2.png" },
  { step: "Step 3", desc: "Click the '+ Add entry' button to start logging your hours.", img: "/schoolinks/step3.png" },
  { step: "Step 4", desc: "Fill out all the required info like the organization name, date, and hours worked. Then click Save.", img: "/schoolinks/step4.png" },
];

export default function Home() {
  // makes stuff fade in when you scroll down
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
    <section style={{ padding: "8rem 0 6rem", position: "relative", overflow: "hidden" }}>
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
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        .schoolinks-header {
          text-align: center;
          margin-bottom: 3rem;
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
          font-size: clamp(2rem, 5vw, 3.5rem);
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
          font-size: 0.95rem;
          max-width: 600px;
          margin: 0 auto 2.5rem;
          line-height: 1.7;
        }
        .schoolinks-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }
        .schoolinks-card {
          padding: 2rem;
          border-radius: 16px;
          background: rgba(10, 15, 30, 0.6);
          border: 1px solid rgba(100, 149, 237, 0.12);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          transition: all 0.3s ease;
        }
        .schoolinks-card:hover {
          transform: translateY(-6px);
          border-color: rgba(201, 168, 76, 0.35);
          box-shadow: 0 12px 36px rgba(0, 0, 0, 0.35);
        }
        .schoolinks-step-num {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 0.75rem;
        }
        .schoolinks-img {
          width: 100%;
          border-radius: 12px;
          margin-bottom: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          max-height: 300px;
          object-fit: cover;
        }
        .schoolinks-desc {
          font-size: 0.9rem;
          color: var(--silver);
          line-height: 1.6;
        }
        @media (max-width: 600px) {
          .schoolinks-grid {
            grid-template-columns: 1fr;
          }
          .schoolinks-wrapper {
            padding: 0 1rem;
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
              <div className="schoolinks-step-num">{item.step}</div>
              <img src={item.img} alt={item.step} className="schoolinks-img" />
              <p className="schoolinks-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
