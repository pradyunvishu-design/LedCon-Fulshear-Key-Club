"use client";

import { useEffect } from "react";
import ContactSection from "@/components/contact-section";

export default function ContactPage() {
  useEffect(() => {
    const els = document.querySelectorAll(".fade-in, .slide-in-left, .slide-in-right");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add("visible"); });
    }, { threshold: 0.12, rootMargin: "0px 0px -50px 0px" });
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return (
    <main className="flex-grow" style={{ paddingTop: "7rem", minHeight: "100vh", position: "relative" }}>
      {/* EXPANDED INFO SECTION */}
      <div className="section-wrapper fade-in" style={{ marginBottom: "-4rem", position: "relative", zIndex: 10 }}>
        <h3 style={{ fontSize: "1.8rem", color: "white", marginBottom: "2.5rem", textAlign: "center" }}>Frequently Asked Questions</h3>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: "800px", margin: "0 auto" }}>
            <div style={{ background: "rgba(10,15,30,0.8)", padding: "clamp(1.2rem, 4vw, 2rem)", borderRadius: "12px", border: "1px solid rgba(201,168,76,0.15)", backdropFilter: "blur(10px)" }}>
            <h4 style={{ color: "white", fontSize: "1.05rem", marginBottom: "0.5rem" }}>When and where are general meetings?</h4>
            <p style={{ color: "var(--silver)", fontSize: "0.9rem", lineHeight: "1.6" }}>We meet in the library on the 2nd Tuesday of every month at 4:00 PM. Check the Calendar tab for the exact dates!</p>
          </div>

           <div style={{ background: "rgba(10,15,30,0.8)", padding: "clamp(1.2rem, 4vw, 2rem)", borderRadius: "12px", border: "1px solid rgba(100,149,237,0.15)", backdropFilter: "blur(10px)" }}>
            <h4 style={{ color: "white", fontSize: "1.05rem", marginBottom: "0.5rem" }}>How do I track my volunteer hours?</h4>
            <p style={{ color: "var(--silver)", fontSize: "0.9rem", lineHeight: "1.6" }}>All hours are tracked via SchooLinks. To log your hours, sign in to ClassLink, click on SchooLinks, and follow the 'Experience Tracking' steps to add your entry. Check out the tutorial on the home page for a step-by-step guide!</p>
          </div>

          <div style={{ background: "rgba(10,15,30,0.8)", padding: "2rem", borderRadius: "12px", border: "1px solid rgba(201,168,76,0.15)", backdropFilter: "blur(10px)" }}>
            <h4 style={{ color: "white", fontSize: "1.05rem", marginBottom: "0.5rem" }}>What happens if I miss a meeting?</h4>
            <p style={{ color: "var(--silver)", fontSize: "0.9rem", lineHeight: "1.6" }}>If you miss a meeting, please read the meeting slides posted on our Canvas course and message an officer to stay updated. Missing too many meetings may impact your active membership status.</p>
          </div>

        </div>
      </div>

      <ContactSection />
    </main>
  );
}
