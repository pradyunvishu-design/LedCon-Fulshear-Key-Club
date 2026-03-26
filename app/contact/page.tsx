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
        <h3 style={{ fontSize: "1.8rem", color: "white", marginBottom: "2.5rem", textAlign: "center" }}>Quick Answers</h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ background: "rgba(10,15,30,0.8)", padding: "1.75rem 2rem", borderRadius: "12px", border: "1px solid rgba(201,168,76,0.15)", backdropFilter: "blur(10px)" }}>
            <h4 style={{ color: "white", fontSize: "1.05rem", marginBottom: "0.5rem" }}>When and where are general meetings?</h4>
            <p style={{ color: "var(--silver)", fontSize: "0.9rem", lineHeight: "1.6" }}>We meet in the LGI Room on the 1st Tuesday of every month at 4:00 PM. Head to the Calendar page to see all upcoming dates for the rest of the year.</p>
          </div>

          <div style={{ background: "rgba(10,15,30,0.8)", padding: "1.75rem 2rem", borderRadius: "12px", border: "1px solid rgba(100,149,237,0.15)", backdropFilter: "blur(10px)" }}>
            <h4 style={{ color: "white", fontSize: "1.05rem", marginBottom: "0.5rem" }}>How do I log my volunteer hours?</h4>
            <p style={{ color: "var(--silver)", fontSize: "0.9rem", lineHeight: "1.6" }}>All hours go through SchooLinks. Log in via ClassLink, open SchooLinks, and use the Experience Tracking section. After Key Club events, our Secretary logs attendance — but make sure to add any hours from personal volunteering on your own. There&apos;s a full tutorial on the home page if you need help.</p>
          </div>

          <div style={{ background: "rgba(10,15,30,0.8)", padding: "1.75rem 2rem", borderRadius: "12px", border: "1px solid rgba(201,168,76,0.15)", backdropFilter: "blur(10px)" }}>
            <h4 style={{ color: "white", fontSize: "1.05rem", marginBottom: "0.5rem" }}>How do I join?</h4>
            <p style={{ color: "var(--silver)", fontSize: "0.9rem", lineHeight: "1.6" }}>Just show up to any general meeting! Once you decide you&apos;re in, fill out the membership form on Canvas and pay the $20 annual dues. You&apos;ll be able to sign up for events right away. No prior experience required — we&apos;ll walk you through everything.</p>
          </div>
        </div>
      </div>

      <ContactSection />
    </main>
  );
}
